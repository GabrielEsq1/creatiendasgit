import crypto from 'crypto';

/**
 * Security utilities for encrypting sensitive data
 */

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Get encryption key from environment variable
 * Falls back to a derived key if not set (NOT RECOMMENDED FOR PRODUCTION)
 */
function getEncryptionKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;

    if (!key) {
        console.warn('⚠️  ENCRYPTION_KEY not set! Using derived key. SET THIS IN PRODUCTION!');
        // Derive from NEXTAUTH_SECRET as fallback
        const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me';
        return crypto.scryptSync(secret, 'salt', 32);
    }

    // If key is provided, ensure it's 32 bytes
    if (key.length === 64) {
        // Assume it's a hex string
        return Buffer.from(key, 'hex');
    }

    // Derive 32-byte key from provided string
    return crypto.scryptSync(key, 'salt', 32);
}

/**
 * Encrypt sensitive data
 * @param text - Plain text to encrypt
 * @returns Encrypted string (base64)
 */
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = getEncryptionKey();

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    // Combine: salt + iv + tag + encrypted
    const result = Buffer.concat([salt, iv, tag, encrypted]);
    return result.toString('base64');
}

/**
 * Decrypt sensitive data
 * @param encryptedData - Encrypted string (base64)
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');

    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, TAG_POSITION);
    const tag = buffer.subarray(TAG_POSITION, ENCRYPTED_POSITION);
    const encrypted = buffer.subarray(ENCRYPTED_POSITION);

    const key = getEncryptionKey();

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
}

/**
 * Hash sensitive data (one-way)
 * @param data - Data to hash
 * @returns SHA-256 hash
 */
export function hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate a secure random token
 * @param length - Length in bytes (default 32)
 * @returns Random token (hex)
 */
export function generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a secure encryption key
 * @returns 32-byte key (hex string)
 */
export function generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Sanitize user input to prevent XSS
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns true if valid
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
        return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'La contraseña debe contener al menos una mayúscula' };
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'La contraseña debe contener al menos una minúscula' };
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'La contraseña debe contener al menos un número' };
    }

    return { valid: true, message: 'Contraseña válida' };
}

import { kv } from '@vercel/kv';

/**
 * Rate limiting store (in-memory fallback)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for an identifier (IP, user ID, etc.)
 * Uses @vercel/kv (Redis) if available, otherwise falls back to in-memory
 * 
 * @param identifier - Unique identifier
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if rate limit exceeded
 */
export async function isRateLimited(
    identifier: string,
    maxRequests: number = 5,
    windowMs: number = 60000 // 1 minute
): Promise<boolean> {
    // Try using Vercel KV (Redis)
    if (process.env.KV_REST_API_URL) {
        try {
            const key = `ratelimit:${identifier}`;
            const currentCount = await kv.incr(key);
            
            if (currentCount === 1) {
                await kv.expire(key, Math.ceil(windowMs / 1000));
            }
            
            return currentCount > maxRequests;
        } catch (error) {
            console.warn('⚠️ Vercel KV error, falling back to in-memory rate limit:', error);
        }
    }

    // Fallback to in-memory store
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + windowMs
        });
        return false;
    }

    if (record.count >= maxRequests) {
        return true;
    }

    record.count++;
    return false;
}

/**
 * Clean up expired rate limit records (for in-memory store)
 */
export function cleanupRateLimits(): void {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
        if (now > record.resetTime) {
            rateLimitStore.delete(key);
        }
    });
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
