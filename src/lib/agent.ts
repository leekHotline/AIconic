import OpenAI from 'openai';
import * as tools from './tools';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL,
});

// 工具定义
const toolDefinitions: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'generate_svg_icon',
      description: '生成高质量现代化 SVG 图标。当用户想要创建、生成、设计一个图标时调用此函数。',
      parameters: {
        type: 'object',
        properties: {
          description: { type: 'string', description: '图标的描述' },
          style: { 
            type: 'string', 
            enum: ['modern', 'gradient', 'glassmorphism', 'neon', 'minimal'], 
            description: '图标风格' 
          },
          primaryColor: { type: 'string', description: '主色' },
          secondaryColor: { type: 'string', description: '副色' },
        },
        required: ['description', 'style'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'save_icon',
      description: '保存图标到数据库',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          svgContent: { type: 'string' },
          prompt: { type: 'string' },
          style: { type: 'string' },
        },
        required: ['name', 'svgContent', 'prompt', 'style'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'change_icon_color',
      description: '修改图标颜色',
      parameters: {
        type: 'object',
        properties: {
          svgContent: { type: 'string' },
          newColor: { type: 'string' },
        },
        required: ['svgContent', 'newColor'],
      },
    },
  },
];

// 工具函数映射
const toolFunctions: Record<string, Function> = {
  generate_svg_icon: tools.generateSvgIcon,
  save_icon: tools.saveIcon,
  change_icon_color: tools.changeIconColor,
};

type Message = OpenAI.ChatCompletionMessageParam;

// 流式事件类型
export type StreamEvent = 
  | { type: 'tool_start'; name: string; args: Record<string, any> }
  | { type: 'tool_result'; name: string; svg?: string }
  | { type: 'text'; content: string }
  | { type: 'done' }
  | { type: 'error'; error: string };

// 流式 Agent
export async function runAgentStream(
  userMessage: string, 
  history: Message[] = [], 
  generateMultiple: boolean = false,
  onEvent: (event: StreamEvent) => void
) {
  const systemPrompt = generateMultiple 
    ? `你是一位 UI 设计师。当用户请求生成图标时，必须立即调用 generate_svg_icon 工具 4 次生成图标，不要先回复文字。

每次调用使用不同风格：
1. modern 风格，primaryColor: #6366f1, secondaryColor: #8b5cf6
2. gradient 风格，primaryColor: #06b6d4, secondaryColor: #0891b2  
3. minimal 风格，primaryColor: #374151, secondaryColor: #6b7280
4. neon 风格，primaryColor: #ec4899, secondaryColor: #8b5cf6

重要：直接调用工具，不要先说"我将为你生成"之类的话。`
    : `你是一位 UI 设计师，专门设计现代化应用图标。
用中文回复，不要在回复中包含 SVG 代码。`;

  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const response = await client.chat.completions.create({
    model: 'gpt-4.1',
    messages,
    tools: toolDefinitions,
    tool_choice: generateMultiple ? 'required' : 'auto',  // 强制调用工具
  });

  const assistantMessage = response.choices[0].message;
  const toolCalls = assistantMessage.tool_calls;

  if (toolCalls && toolCalls.length > 0) {
    const toolResults: any[] = [];
    
    // 逐个执行工具并发送事件
    for (const toolCall of toolCalls) {
      if (toolCall.type !== 'function') continue;
      
      const functionName = (toolCall as any).function.name;
      const functionArgs = JSON.parse((toolCall as any).function.arguments);
      
      // 发送工具开始事件
      onEvent({ type: 'tool_start', name: functionName, args: functionArgs });
      
      const toolFunction = toolFunctions[functionName];
      if (toolFunction) {
        const result = await toolFunction(functionArgs);
        toolResults.push({
          toolCallId: toolCall.id,
          functionName,
          result,
        });
        
        // 发送工具结果事件（如果是图标生成，包含 SVG）
        onEvent({ 
          type: 'tool_result', 
          name: functionName,
          svg: result?.svg 
        });
      }
    }

    // 获取最终回复
    const followUpMessages: Message[] = [
      ...messages,
      assistantMessage,
      ...toolResults.map(tr => ({
        role: 'tool' as const,
        tool_call_id: tr.toolCallId,
        content: JSON.stringify({ success: true, generated: true }),
      })),
    ];

    const finalResponse = await client.chat.completions.create({
      model: 'gpt-4.1',
      messages: followUpMessages,
    });

    const reply = finalResponse.choices[0].message.content || '';
    onEvent({ type: 'text', content: reply });
  } else {
    onEvent({ type: 'text', content: assistantMessage.content || '' });
  }

  onEvent({ type: 'done' });
}

// 保留非流式版本用于其他场景
export async function runAgent(userMessage: string, history: Message[] = [], generateMultiple: boolean = false) {
  const events: StreamEvent[] = [];
  await runAgentStream(userMessage, history, generateMultiple, (e) => events.push(e));
  
  const toolCalls = events
    .filter(e => e.type === 'tool_result' && e.svg)
    .map(e => ({ functionName: (e as any).name, result: { svg: (e as any).svg } }));
  
  const textEvent = events.find(e => e.type === 'text') as { content: string } | undefined;
  
  return { reply: textEvent?.content || '', toolCalls };
}
