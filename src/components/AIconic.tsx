'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import IconPreview, { IconThumbnail } from './IconPreview';
import ToolCallLog from './ToolCallLog';
import StyleSelector, { DEFAULT_STYLES } from './StyleSelector';

interface ToolLog {
  name: string;
  status: 'running' | 'done';
  logs: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolLogs?: ToolLog[];
}

interface GeneratedIcon {
  id: string;
  svg: string;
  style?: string;
}

interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface Platform {
  name: string;
  formats: string[];
  sizes: number[];
}

interface AIconicProps {
  initialPrompt?: string | null;
}

const platforms: Platform[] = [
  { name: 'Web', formats: ['svg', 'png'], sizes: [16, 32, 64, 128, 256] },
  { name: 'Windows', formats: ['ico', 'png'], sizes: [16, 24, 32, 48, 256] },
  { name: 'macOS', formats: ['icns', 'png'], sizes: [16, 32, 128, 256, 512] },
  { name: 'Android', formats: ['png'], sizes: [48, 72, 96, 144, 192] },
  { name: 'iOS', formats: ['png'], sizes: [60, 76, 120, 152, 180] },
];



const promptSuggestions = [
  { icon: '🚀', text: '火箭发射', desc: '科技启动图标' },
  { icon: '💬', text: '智能聊天助手', desc: 'AI对话应用' },
  { icon: '📊', text: '数据分析仪表盘', desc: '商业智能' },
  { icon: '🎨', text: '创意设计工具', desc: '设计类应用' },
];

export default function AIconic({ initialPrompt }: AIconicProps) {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<GeneratedIcon | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(platforms[0]);
  const [selectedFormat, setSelectedFormat] = useState('svg');
  const [selectedSize, setSelectedSize] = useState(256);
  const [currentToolLogs, setCurrentToolLogs] = useState<ToolLog[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>(DEFAULT_STYLES);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialPromptProcessed = useRef(false);

  // 加载会话列表
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/sessions');
        const data = await res.json();
        const sessionList = data.sessions || [];
        setSessions(sessionList);
        
        // 如果有 initialPrompt，不加载历史会话，直接开始新会话
        if (!initialPrompt && sessionList.length > 0) {
          const lastSession = sessionList[0];
          await loadSession(lastSession.id);
        }
      } catch (e) {
        console.error('Failed to load sessions:', e);
      } finally {
        setIsInitialized(true);
      }
    };
    init();
  }, [initialPrompt]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentToolLogs]);

  // 图标动画
  useEffect(() => {
    if (generatedIcons.length > 0) {
      const lastIcon = document.querySelector('.icon-item:last-child');
      if (lastIcon) {
        gsap.from(lastIcon, { scale: 0.8, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' });
      }
    }
  }, [generatedIcons.length]);

  // 处理 initialPrompt - 自动触发生成
  useEffect(() => {
    if (isInitialized && initialPrompt && !initialPromptProcessed.current && !loading) {
      initialPromptProcessed.current = true;
      // 延迟一点确保组件完全就绪
      setTimeout(() => {
        handleSend(initialPrompt);
      }, 100);
    }
  }, [isInitialized, initialPrompt, loading]);

  const loadSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (e) {
      console.error('Failed to load sessions:', e);
    }
  };

  const loadSession = async (sessionId: string) => {
    // 乐观更新：立即切换会话 ID 和清空状态
    setCurrentSessionId(sessionId);
    setShowSidebar(false);
    
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();
      setMessages(data.messages.map((m: any) => ({
        role: m.role,
        content: m.content,
        toolCalls: m.toolCalls,
      })));
      setGeneratedIcons(data.icons.map((i: any) => ({
        id: i.id,
        svg: i.svgContent,
        style: i.style,
      })));
      if (data.icons.length > 0) {
        setSelectedIcon({ id: data.icons[0].id, svg: data.icons[0].svgContent });
      } else {
        setSelectedIcon(null);
      }
    } catch (e) {
      console.error('Failed to load session:', e);
    }
  };

  const createNewSession = async () => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '新会话' }),
      });
      const data = await res.json();
      const newSession = data.session;
      
      // 乐观更新：立即添加到会话列表
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      // 注意：不在这里清空 messages，让调用方决定
      
      return newSession.id;
    } catch (e) {
      console.error('Failed to create session:', e);
      return null;
    }
  };

  const saveMessage = async (sessionId: string, message: Message, icons?: GeneratedIcon[]) => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          generatedIcons: icons?.map(i => ({ svg: i.svg, style: i.style })),
        }),
      });
      const data = await res.json();
      
      // 如果返回了新标题，更新会话列表
      if (data.newTitle) {
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, title: data.newTitle } : s
        ));
      }
    } catch (e) {
      console.error('Failed to save message:', e);
    }
  };

  const deleteSession = async (sessionId: string) => {
    // 乐观更新：立即从列表移除
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
      setGeneratedIcons([]);
      setSelectedIcon(null);
    }
    
    try {
      await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete session:', e);
      // 失败时重新加载
      await loadSessions();
    }
  };

  const handleSend = async (directMessage?: string) => {
    const messageToSend = directMessage || input.trim();
    if (!messageToSend || loading) return;
    
    const userMessage: Message = { role: 'user', content: messageToSend };
    
    // 【关键】使用 flushSync 强制同步更新 UI，确保用户消息立即显示
    flushSync(() => {
      setInput('');
      setLoading(true);
      setCurrentToolLogs([]);
      setMessages(prev => [...prev, userMessage]);
      setGeneratedIcons([]);
      setSelectedIcon(null);
    });

    // 后台处理会话创建和消息保存
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = await createNewSession();
      if (!sessionId) {
        setLoading(false);
        return;
      }
    }

    // 异步保存用户消息（不阻塞后续流程）
    saveMessage(sessionId, userMessage);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          generateMultiple: true,
          styles: selectedStyleIds,
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let buffer = '';
      let assistantContent = '';
      const toolLogsForMessage: ToolLog[] = [];
      const newIcons: GeneratedIcon[] = [];

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
              
              // 工具开始
              if (event.type === 'tool_start') {
                const newTool: ToolLog = { name: event.name, status: 'running', logs: [] };
                setCurrentToolLogs(prev => [...prev, newTool]);
                toolLogsForMessage.push(newTool);
              }
              
              // 工具日志
              if (event.type === 'tool_log') {
                setCurrentToolLogs(prev => 
                  prev.map(t => t.name === event.name && t.status === 'running'
                    ? { ...t, logs: [...t.logs, event.message] }
                    : t
                  )
                );
                const tool = toolLogsForMessage.find(t => t.name === event.name && t.status === 'running');
                if (tool) tool.logs.push(event.message);
              }
              
              // 工具结果
              if (event.type === 'tool_result') {
                setCurrentToolLogs(prev => 
                  prev.map(t => t.name === event.name && t.status === 'running' 
                    ? { ...t, status: 'done' as const } 
                    : t
                  )
                );
                const tool = toolLogsForMessage.find(t => t.name === event.name && t.status === 'running');
                if (tool) tool.status = 'done';
                
                if (event.svg) {
                  const newIcon = { 
                    id: `icon-${Date.now()}-${Math.random()}`, 
                    svg: event.svg,
                    style: event.style 
                  };
                  newIcons.push(newIcon);
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

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: assistantContent || '已完成',
        toolLogs: toolLogsForMessage
      };
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentToolLogs([]);

      // 保存助手消息和图标
      await saveMessage(sessionId, assistantMessage, newIcons);
    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: '生成失败，请重试。' };
      setMessages(prev => [...prev, errorMessage]);
      await saveMessage(sessionId, errorMessage);
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

  const handleNewChat = async () => {
    setCurrentSessionId(null);
    setMessages([]);
    setGeneratedIcons([]);
    setSelectedIcon(null);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
      {/* 会话侧边栏 */}
      {showSidebar && (
        <div style={{ width: '260px', background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <button
              onClick={handleNewChat}
              style={{ width: '100%', padding: '10px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
            >
              + 新会话
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => loadSession(session.id)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  background: currentSessionId === session.id ? '#eef2ff' : 'transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '14px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session.title}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 左侧聊天面板 */}
      <div style={{ width: '360px', display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #e5e7eb' }}>
        {/* 头部 */}
        <div style={{ height: '56px', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => router.push('/')}
              style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', color: '#6b7280' }}
              title="返回首页"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', color: '#6b7280' }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px' }}>A</div>
            <span style={{ fontWeight: 600, color: '#1f2937' }}>AIconic</span>
          </div>
          <button onClick={handleNewChat} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px', color: '#9ca3af' }}>
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
              <p style={{ fontSize: '14px', marginBottom: '20px' }}>描述你想要的图标</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '0 8px' }}>
                {promptSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.text)}
                    style={{ padding: '12px 8px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.borderColor = '#d1d5db'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                  >
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>{item.icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '2px' }}>{item.text}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af' }}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '90%' }}>
                  {msg.role === 'assistant' && msg.toolLogs && msg.toolLogs.length > 0 && (
                    <ToolCallLog tools={msg.toolLogs} />
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
            
            {loading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ maxWidth: '90%' }}>
                  {currentToolLogs.length > 0 && <ToolCallLog tools={currentToolLogs} />}
                  <div style={{ background: '#f3f4f6', padding: '10px 14px', borderRadius: '16px', borderBottomLeftRadius: '4px', color: '#6b7280', fontSize: '14px' }}>
                    {currentToolLogs.length > 0 ? '正在生成图标...' : '思考中...'}
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
              onClick={() => handleSend()}
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
            <StyleSelector 
              selectedStyles={selectedStyleIds} 
              onStylesChange={setSelectedStyleIds}
              maxSelection={4}
            />
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <IconThumbnail
                      svg={icon.svg}
                      selected={selectedIcon?.id === icon.id}
                      onClick={() => setSelectedIcon(icon)}
                      label={icon.style || ['modern', 'gradient', 'minimal', 'neon'][idx]}
                    />
                  </motion.div>
                ))}
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
                    <IconPreview 
                      svg={selectedIcon.svg} 
                      size={80} 
                      showBackground 
                      style={{ borderRadius: 8, flexShrink: 0 }}
                    />
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
