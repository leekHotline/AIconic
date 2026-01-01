'use client';

interface IconPreviewProps {
  svgContent: string;
  size: number;
}

export default function IconPreview({ svgContent, size }: IconPreviewProps) {
  return (
    <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg border-2 border-dashed">
      <div
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        className="text-gray-800"
      />
    </div>
  );
}