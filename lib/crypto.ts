import { createHash } from 'crypto';

export async function hashPassword(password: string): Promise<string> {
    return createHash('sha256').update(password).digest('hex');
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
    const hashedAttempt = await hashPassword(password);
    return hashedAttempt === hashed;
}
