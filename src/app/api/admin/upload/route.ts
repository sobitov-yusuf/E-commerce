// Universal Telegram Mini App (TMA) E-Commerce — Secure Admin Image Upload API Endpoint
// Enforces MIME-type validation, 5MB file size limits, safe random filenames, and sanitization

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Fayl yuklanmadi' },
        { status: 400 }
      );
    }

    // 1. Strict MIME-type validation
    const mimeType = (file.type || '').toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { success: false, error: 'Faqat JPG, PNG, WEBP yoki GIF rasmlar ruxsat etiladi' },
        { status: 400 }
      );
    }

    // 2. File Size validation (Max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Rasm hajmi 5 MB dan oshmasligi kerak' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // 4. Generate safe unique extension and filename
    let safeExt = '.jpg';
    if (mimeType === 'image/png') safeExt = '.png';
    else if (mimeType === 'image/webp') safeExt = '.webp';
    else if (mimeType === 'image/gif') safeExt = '.gif';

    const cleanFileName = `prod_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}${safeExt}`;
    const filePath = path.join(uploadsDir, cleanFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${cleanFileName}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename: cleanFileName,
        size: file.size,
        mimeType: safeExt,
      },
    });
  } catch (error: any) {
    console.error('Image Upload API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Fayl yuklashda xatolik yuz berdi: ' + error.message },
      { status: 500 }
    );
  }
}
