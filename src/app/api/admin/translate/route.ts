import { NextRequest, NextResponse } from 'next/server';

async function translateWithGoogleFree(text: string, targetLang: 'ru' | 'en'): Promise<string> {
  if (!text || !text.trim()) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((item: any) => item[0]).join('').trim();
    }
    return text;
  } catch (error) {
    console.error(`Google translate error for ${targetLang}:`, error);
    return text;
  }
}

async function translateWithGemini(
  nameUz: string,
  descUz: string,
  apiKey: string
): Promise<{ nameRu: string; nameEn: string; descRu: string; descEn: string } | null> {
  // Ultra-lightweight models with minimal token consumption & highest speed
  const models = ['gemini-flash-latest', 'gemini-3.5-flash'];

  // Ultra-short prompt to save input tokens (< 40 tokens total)
  const prompt = `Translate e-commerce product from Uzbek to Russian & English.
Name: "${nameUz}"
${descUz ? `Desc: "${descUz}"` : ''}
Return ONLY compact JSON: {"nameRu":"","nameEn":"","descRu":"","descEn":""}`;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 150, // Token tejamkorligi: ortiqcha token sarflanishini oldini oladi
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        continue;
      }

      const json = await response.json();
      const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const cleaned = rawText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      if (parsed && (parsed.nameRu || parsed.nameEn)) {
        return {
          nameRu: parsed.nameRu || nameUz,
          nameEn: parsed.nameEn || nameUz,
          descRu: parsed.descRu || descUz,
          descEn: parsed.descEn || descUz,
        };
      }
    } catch (e) {
      console.warn(`Gemini error on ${model}:`, e);
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nameUz = '', descUz = '', apiKey = '' } = body;

    if (!nameUz && !descUz) {
      return NextResponse.json(
        { error: "Mahsulot nomi yoki tavsifi o'zbek tilida kiritilishi kerak" },
        { status: 400 }
      );
    }

    const cleanEnvKey = (process.env.GEMINI_API_KEY || '').trim().replace(/["']/g, '');
    const geminiKey = apiKey || cleanEnvKey;

    // 1. Attempt lightweight Gemini Flash
    if (geminiKey) {
      const geminiResult = await translateWithGemini(nameUz, descUz, geminiKey);
      if (geminiResult) {
        return NextResponse.json({
          success: true,
          provider: 'Gemini Flash (Lightweight)',
          nameRu: geminiResult.nameRu,
          nameEn: geminiResult.nameEn,
          descRu: geminiResult.descRu,
          descEn: geminiResult.descEn,
        });
      }
    }

    // 2. 100% Free Fallback (0 tokens from Gemini API)
    const [nameRu, nameEn, descRu, descEn] = await Promise.all([
      translateWithGoogleFree(nameUz, 'ru'),
      translateWithGoogleFree(nameUz, 'en'),
      translateWithGoogleFree(descUz, 'ru'),
      translateWithGoogleFree(descUz, 'en'),
    ]);

    return NextResponse.json({
      success: true,
      provider: 'Google Translate (Free Fallback)',
      nameRu,
      nameEn,
      descRu,
      descEn,
    });
  } catch (error: any) {
    console.error('Translation route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Tarjima jarayonida xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
