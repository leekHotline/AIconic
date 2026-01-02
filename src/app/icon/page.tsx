'use client';

import { useEffect, useState } from 'react';
import AIconic from '@/components/AIconic';

export default function IconWorkspace() {
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 从 sessionStorage 获取初始提示词
    const prompt = sessionStorage.getItem('iconPrompt');
    if (prompt) {
      setInitialPrompt(prompt);
      sessionStorage.removeItem('iconPrompt');
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <AIconic initialPrompt={initialPrompt} />;
}
