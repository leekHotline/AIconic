'use client';

type Size = 32 | 64 | 128 | 256 | 512;

interface SizeSelectorProps {
  selected: Size;
  onSelect: (size: Size) => void;
}

const sizes: Size[] = [32, 64, 128, 256, 512];

export default function SizeSelector({ selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">尺寸</label>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`px-4 py-2 rounded-lg border ${
              selected === size
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {size}×{size}
          </button>
        ))}
      </div>
    </div>
  );
}