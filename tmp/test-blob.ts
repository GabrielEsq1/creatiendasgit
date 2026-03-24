import { put } from "@vercel/blob";
import * as dotenv from 'dotenv';
dotenv.config();

async function testBlob() {
    console.log('🧪 Testing Vercel Blob...');
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('❌ BLOB_READ_WRITE_TOKEN is missing');
        return;
    }

    try {
        const { url } = await put('test.txt', 'Hello World', { access: 'public' });
        console.log('✅ Blob upload successful:', url);
    } catch (err) {
        console.error('❌ Blob upload failed:', err.message);
    }
}

testBlob();
