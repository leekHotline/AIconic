import { NextRequest } from 'next/server';
import { runAgentStream } from '@/lib/agent';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], generateMultiple = false, styles } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 创建 AbortController 用于取消请求
    const abortController = new AbortController();
    
    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let isClosed = false;
        const safeEnqueue = (data: string) => {
          if (!isClosed) {
            try {
              controller.enqueue(encoder.encode(data));
            } catch (e) {
              // Controller 可能已关闭，忽略错误
            }
          }
        };
        const safeClose = () => {
          if (!isClosed) {
            try {
              controller.close();
              isClosed = true;
            } catch (e) {
              // Controller 可能已关闭，忽略错误
            }
          }
        };

        try {
          await runAgentStream(message, history, generateMultiple, styles, (event) => {
            safeEnqueue(`data: ${JSON.stringify(event)}\n\n`);
          }, abortController.signal);
          safeEnqueue('data: [DONE]\n\n');
          safeClose();
        } catch (error) {
          console.error('Stream error:', error);
          safeEnqueue(`data: ${JSON.stringify({ type: 'error', error: 'Internal error' })}\n\n`);
          safeClose();
        }
      },
      cancel() {
        // 当客户端断开连接时取消操作
        abortController.abort();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Agent error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
