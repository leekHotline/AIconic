'use client';

type Format = 'svg' | 'png' | 'jpeg' | 'webp';

interface FormatSelectorProps {
  selected: Format;
  onSelect: (format: Format) => void;
}

const formats: { value: Format; label: string }[] = [
  { value: 'svg', label: 'SVG (矢量)' },
  { value: 'png', label: 'PNG (透明)' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
];

export default function FormatSelector({ selected, onSelect }: FormatSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">格式</label>
      <div className="flex gap-2">
        {formats.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`px-4 py-2 rounded-lg border ${
              selected === value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}