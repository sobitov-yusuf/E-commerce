// Universal Telegram Mini App (TMA) E-Commerce — Admin Image Upload API Endpoint
// Saves uploaded product images into /public/uploads/ directory with safe filenames

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { sanitizeInput } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate safe unique filename
    const ext = path.extname(file.name) || '.jpg';
    const cleanFileName = `img_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}${ext.toLowerCase()}`;
    const filePath = path.join(uploadsDir, cleanFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${cleanFileName}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename: cleanFileName,
      },
    });
  } catch (error: any) {
    console.error('Image Upload API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Fayl yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
