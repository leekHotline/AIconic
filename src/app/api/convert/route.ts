import { NextRequest, NextResponse } from 'next/server';
import { convertSVG, getMimeType, IconFormat, IconSize } from '@/lib/converter';

export async function POST(request: NextRequest) {
  try {
    const { svgContent, format, size } = await request.json() as {
      svgContent: string;
      format: IconFormat;
      size: IconSize;
    };

    if (!svgContent || !format || !size) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const buffer = await convertSVG(svgContent, format, size);
    const mimeType = getMimeType(format);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="icon-${size}.${format}"`,
      },
    });
  } catch (error) {
    console.error('Convert error:', error);
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
  }
}