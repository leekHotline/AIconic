'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: { name: string; status: 'running' | 'done'; args?: Record<string, any> }[];
}

interface GeneratedIcon {
  id: string;
  svg: string;
}

interface Platform {
  name: string;
  formats: string[];
  sizes: number[];
}

const platforms: Platform[] = [
  { name: 'Web', formats: ['svg', 'png'], sizes: [16, 32, 64, 128, 256] },
  { name: 'Windows', formats: ['ico', 'png'], sizes: [16, 24, 32, 48, 256] },
  { name: 'macOS', formats: ['icns', 'png'], sizes: [16, 32, 128, 256, 512] },
  { name: 'Android', formats: ['png'], sizes: [48, 72, 96, 144, 192] },
  { name: 'iOS', formats: ['png'], sizes: [60, 76, 120, 152, 180] },
];

const toolDisplayNames: Record<string, string> = {
  'generate_svg_icon': '生成图标',
  'save_icon': '保存图标',
  'change_icon_color': '修改颜色',
};

export default function AIconic() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<GeneratedIcon | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(platforms[0]);
  const [selectedFormat, setSelectedFormat] = useState('svg');
  const [selectedSize, setSelectedSize] = useState(256);
  const [currentToolCalls, setCurrentToolCalls] = useState<Message['toolCalls']>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentToolCalls]);

  // 新图标出现时的动画
  useEffect(() => {
    if (generatedIcons.length > 0) {
      const lastIcon = document.querySelector('.icon-item:last-child');
      if (lastIcon) {
        gsap.from(lastIcon, { scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' });
      }
    }
  }, [generatedIcons.length]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setGeneratedIcons([]);
    setSelectedIcon(null);
    setCurrentToolCalls([]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${userMessage}`,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          generateMultiple: true,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let buffer = '';
      let assistantContent = '';
      const toolCallsForMessage: Message['toolCalls'] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const event = JSON.parse(data);
              
              if (event.type === 'tool_start') {
                const newTool = { name: event.name, status: 'running' as const, args: event.args };
                setCurrentToolCalls(prev => [...prev, newTool]);
                toolCallsForMessage.push(newTool);
              }
              
              if (event.type === 'tool_result') {
                setCurrentToolCalls(prev => 
                  prev.map(t => t.name === event.name && t.status === 'running' 
                    ? { ...t, status: 'done' as const } 
                    : t
                  )
                );
                // 更新 toolCallsForMessage 中的状态
                const idx = toolCallsForMessage.findIndex(t => t.name === event.name && t.status === 'running');
                if (idx !== -1) toolCallsForMessage[idx].status = 'done';
                
                if (event.svg) {
                  const newIcon = { id: `icon-${Date.now()}-${Math.random()}`, svg: event.svg };
                  setGeneratedIcons(prev => {
                    const updated = [...prev, newIcon];
                    if (updated.length === 1) setSelectedIcon(newIcon);
                    return updated;
                  });
                }
              }
              
              if (event.type === 'text') {
                assistantContent = event.content;
              }
            } catch {}
          }
        }
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantContent || '已完成',
        toolCalls: toolCallsForMessage
      }]);
      setCurrentToolCalls([]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '生成失败，请重试。' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedIcon) return;
    if (selectedFormat === 'svg') {
      const blob = new Blob([selectedIcon.svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `icon-${selectedSize}.svg`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ svgContent: selectedIcon.svg, format: selectedFormat, size: selectedSize }),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `icon-${selectedSize}.${selectedFormat}`; a.click();
      URL.revokeObjectURL(url);
    }
  };

  // 渲染工具调用标签
  const renderToolCalls = (toolCalls: Message['toolCalls'], isCurrentlyRunning = false) => {
    if (!toolCalls || toolCalls.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
        {toolCalls.map((tool, idx) => (
          <div
            key={idx}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: tool.status === 'running' ? '#fef3c7' : '#ecfdf5',
              border: `1px solid ${tool.status === 'running' ? '#fcd34d' : '#6ee7b7'}`,
              borderRadius: '6px',
              fontSize: '12px',
              color: tool.status === 'running' ? '#92400e' : '#047857',
            }}
          >
            {tool.status === 'running' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: '12px', height: '12px' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.div>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>{toolDisplayNames[tool.name] || tool.name}</span>
            {tool.args?.style && <span style={{ opacity: 0.7 }}>({tool.args.style})</span>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
      {/* 左侧聊天面板 */}
      <div style={{ width: '360px', display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #e5e7eb' }}>
        {/* 头部 */}
        <div style={{ height: '56px', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px' }}>A</div>
            <span style={{ fontWeight: 600, color: '#1f2937' }}>AIconic</span>
          </div>
          <button onClick={() => { setMessages([]); setGeneratedIcons([]); setSelectedIcon(null); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', color: '#9ca3af' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>

        {/* 消息列表 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {messages.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <p style={{ fontSize: '14px' }}>描述你想要的图标</p>
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '90%' }}>
                  {/* 工具调用显示在气泡上方 */}
                  {msg.role === 'assistant' && msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      {renderToolCalls(msg.toolCalls)}
                    </div>
                  )}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    ...(msg.role === 'user' 
                      ? { background: '#6366f1', color: '#fff', borderBottomRightRadius: '4px' }
                      : { background: '#f3f4f6', color: '#374151', borderBottomLeftRadius: '4px' }
                    )
                  }}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* 当前正在执行的工具调用 */}
            {loading && (currentToolCalls.length > 0 || true) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ maxWidth: '90%' }}>
                  {/* 工具调用显示在上方 */}
                  {currentToolCalls.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                      {renderToolCalls(currentToolCalls, true)}
                    </div>
                  )}
                  <div style={{ background: '#f3f4f6', padding: '10px 14px', borderRadius: '16px', borderBottomLeftRadius: '4px', color: '#6b7280', fontSize: '14px' }}>
                    {currentToolCalls.length > 0 ? '正在生成图标...' : '思考中...'}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div style={{ padding: '12px', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f9fafb', borderRadius: '12px', padding: '8px 12px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="描述图标..."
              disabled={loading}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#1f2937' }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{ width: '32px', height: '32px', borderRadius: '8px', background: loading || !input.trim() ? '#e5e7eb' : '#6366f1', border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* 右侧工作区 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 工具栏 */}
        <div style={{ height: '56px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>工作区</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {platforms.map(p => (
                <button key={p.name} onClick={() => { setSelectedPlatform(p); setSelectedFormat(p.formats[0]); setSelectedSize(p.sizes[2] || p.sizes[0]); }}
                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: selectedPlatform.name === p.name ? '#eef2ff' : 'transparent', color: selectedPlatform.name === p.name ? '#6366f1' : '#6b7280' }}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            {generatedIcons.length > 0 && `${generatedIcons.length} 个图标`}
          </div>
        </div>

        {/* 工作区内容 */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {generatedIcons.length === 0 && !loading ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              <div style={{ width: '64px', height: '64px', marginBottom: '16px', borderRadius: '16px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p style={{ fontSize: '14px' }}>在左侧输入描述生成图标</p>
            </div>
          ) : (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* 图标网格 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {generatedIcons.map((icon, idx) => (
                  <motion.div
                    key={icon.id}
                    className="icon-item"
                    onClick={() => setSelectedIcon(icon)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{ position: 'relative', background: '#fff', borderRadius: '12px', padding: '16px', cursor: 'pointer', border: selectedIcon?.id === icon.id ? '2px solid #6366f1' : '2px solid #f3f4f6', boxShadow: selectedIcon?.id === icon.id ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none' }}
                  >
                    <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: icon.svg.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }} />
                    {selectedIcon?.id === icon.id && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                    <span style={{ position: 'absolute', bottom: '8px', left: '8px', fontSize: '10px', color: '#9ca3af' }}>#{idx + 1}</span>
                  </motion.div>
                ))}
                {/* 加载中的占位卡片 */}
                {loading && generatedIcons.length < 4 && Array.from({ length: 4 - generatedIcons.length }).map((_, idx) => (
                  <div key={`placeholder-${idx}`} style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', border: '2px dashed #e5e7eb', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} style={{ width: '24px', height: '24px', color: '#d1d5db' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* 导出面板 */}
              {selectedIcon && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '80px', height: '80px', background: '#f9fafb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
                      <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: selectedIcon.svg.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>格式</label>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {selectedPlatform.formats.map(f => (
                            <button key={f} onClick={() => setSelectedFormat(f)} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: selectedFormat === f ? '#6366f1' : '#f3f4f6', color: selectedFormat === f ? '#fff' : '#4b5563' }}>
                              {f.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>尺寸</label>
                        <select value={selectedSize} onChange={(e) => setSelectedSize(Number(e.target.value))} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff', color: '#4b5563', cursor: 'pointer' }}>
                          {selectedPlatform.sizes.map(s => (<option key={s} value={s}>{s}×{s}</option>))}
                        </select>
                      </div>
                    </div>
                    <button onClick={handleDownload} style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', fontSize: '14px', fontWeight: 500, borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      下载
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
