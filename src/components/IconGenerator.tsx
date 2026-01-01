'use client';

import { useState } from 'react';
import IconPreview from './IconPreview';
import FormatSelector from './FormatSelector';
import SizeSelector from './SizeSelector';

type IconStyle = 'outline' | 'filled' | 'duotone';

export default function IconGenerator() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<IconStyle>('outline');
  const [loading, setLoading] = useState(false);
  const [generatedIcon, setGeneratedIcon] = useState<{ id: string; svgContent: string } | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'svg' | 'png' | 'jpeg' | 'webp'>('svg');
  const [selectedSize, setSelectedSize] = useState<32 | 64 | 128 | 256 | 512>(256);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });
      
      const data = await response.json();
      if (data.success) {
        setGeneratedIcon(data.icon);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedIcon) return;

    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        svgContent: generatedIcon.svgContent,
        format: selectedFormat,
        size: selectedSize,
      }),
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `icon-${selectedSize}.${selectedFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">AIconic - AI图标生成器</h1>
        
        <div className="flex gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要的图标，如：购物车、设置齿轮、用户头像..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as IconStyle)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="outline">线框风格</option>
            <option value="filled">填充风格</option>
            <option value="duotone">双色风格</option>
          </select>
          
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '生成中...' : '生成图标'}
          </button>
        </div>
      </div>

      {generatedIcon && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">预览</h2>
            <IconPreview svgContent={generatedIcon.svgContent} size={selectedSize} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">下载选项</h2>
            <FormatSelector selected={selectedFormat} onSelect={setSelectedFormat} />
            <SizeSelector selected={selectedSize} onSelect={setSelectedSize} />
            <button
              onClick={handleDownload}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              下载 {selectedSize}x{selectedSize} {selectedFormat.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}