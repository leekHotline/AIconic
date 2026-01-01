'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: any[];
}

export default function ChatAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSvg, setCurrentSvg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // 检查是否生成了 SVG
        const svgResult = data.toolCalls?.find(
          (tc: any) => tc.functionName === 'generate_svg_icon' || tc.functionName === 'change_icon_color'
        );
        if (svgResult?.result?.svg) {
          setCurrentSvg(svgResult.result.svg);
        }

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply || '完成',
          toolCalls: data.toolCalls,
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，出现了错误，请重试。',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AIconic Agent - AI 图标助手</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* 聊天区域 */}
        <div className="flex flex-col h-[600px] border rounded-lg">
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center mt-10">
                <p className="mb-4">👋 你好！我是图标设计助手</p>
                <p className="text-sm">试试说：</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>"设计一个科技感的同心圆图标，青色到紫色渐变"</li>
                  <li>"生成一个 AI 芯片图标，霓虹风格"</li>
                  <li>"创建一个云计算图标，玻璃态效果"</li>
                  <li>"设计极简风格的数据分析图标"</li>
                  <li>"保存这个图标叫做 my-logo"</li>
                  <li>"显示最近的图标"</li>
                </ul>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* 显示工具调用信息 */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-300 text-xs text-gray-600">
                      <p>🔧 调用了工具:</p>
                      {msg.toolCalls.map((tc, i) => (
                        <p key={i} className="ml-2">• {tc.functionName}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="animate-pulse">思考中...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="告诉我你想要什么图标..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                发送
              </button>
            </div>
          </div>
        </div>

        {/* 预览区域 */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">图标预览</h2>
          
          {currentSvg ? (
            <div className="space-y-4">
              <div 
                className="w-48 h-48 mx-auto border rounded-lg flex items-center justify-center bg-white"
                dangerouslySetInnerHTML={{ __html: currentSvg }}
              />
              
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    const blob = new Blob([currentSvg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'icon.svg';
                    a.click();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  下载 SVG
                </button>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600">查看 SVG 代码</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                  {currentSvg}
                </pre>
              </details>
            </div>
          ) : (
            <div className="w-48 h-48 mx-auto border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400">
              图标将显示在这里
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
