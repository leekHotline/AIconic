import sharp from 'sharp';

export type IconSize = 32 | 64 | 128 | 256 | 512;
export type IconFormat = 'svg' | 'png' | 'jpeg' | 'webp';

export async function convertSVG(
  svgContent: string,
  format: IconFormat,
  size: IconSize
): Promise<Buffer> {
  if (format === 'svg') {
    return Buffer.from(svgContent);
  }

  const svgBuffer = Buffer.from(svgContent);
  
  let sharpInstance = sharp(svgBuffer)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });

  switch (format) {
    case 'png':
      return sharpInstance.png().toBuffer();
    case 'jpeg':
      return sharpInstance.jpeg({ quality: 90 }).flatten({ background: '#ffffff' }).toBuffer();
    case 'webp':
      return sharpInstance.webp({ quality: 90 }).toBuffer();
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

export function getMimeType(format: IconFormat): string {
  const mimeTypes: Record<IconFormat, string> = {
    svg: 'image/svg+xml',
    png: 'image/png',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
  };
  return mimeTypes[format];
}