/**
 * ============================================
 * Agent 核心 - 工具调用编排
 * ============================================
 * 
 * Agent 的工作流程:
 * 1. 接收用户输入
 * 2. AI 分析意图，决定调用哪些工具
 * 3. 执行工具函数
 * 4. 返回结果给用户
 * 
 * 图标生成的理想流程:
 * 用户: "我要一个安全相关的图标"
 *   ↓
 * Step 1: 调用 analyze_icon_main_body 分析主体
 *   → 返回: ["盾牌", "锁", "钥匙", "城墙"]
 *   ↓
 * Step 2: 调用 generate_icon_set 生成 4 种配色
 *   → 返回: 4 个 SVG 图标
 *   ↓
 * 用户看到 4 个不同配色的盾牌图标
 */

import OpenAI from 'openai';
import * as tools from './tools';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL,
});

// ============================================
// 工具定义 (Tool Definitions)
// ============================================
// 这里告诉 AI 有哪些工具可用，以及如何调用它们
// AI 会根据用户输入，自动选择合适的工具

const toolDefinitions: OpenAI.ChatCompletionTool[] = [
  // 工具 1: 分析图标主体
  {
    type: 'function',
    function: {
      name: 'analyze_icon_main_body',
      description: '分析用户的抽象描述，提取出具体的视觉主体元素。这是生成图标的第一步，必须先分析主体再生成图标。',
      parameters: {
        type: 'object',
        properties: {
          userPrompt: { 
            type: 'string', 
            description: '用户关于图标的描述，如"安全防护"、"云存储"、"金融理财"' 
          },
        },
        required: ['userPrompt'],
      },
    },
  },
  
  // 工具 2: 根据主体生成单个图标
  {
    type: 'function',
    function: {
      name: 'generate_icon_by_main_body',
      description: '根据主体元素生成一个图标。需要先调用 analyze_icon_main_body 获取主体元素。',
      parameters: {
        type: 'object',
        properties: {
          mainBody: { 
            type: 'string', 
            description: '主体元素，如"盾牌"、"云朵"、"硬币"' 
          },
          style: { 
            type: 'string', 
            enum: ['appstore', 'material', 'fluent', 'neon'],
            description: '风格: appstore(数字静物)、material(Material设计)、fluent(Fluent插画)、neon(霓虹发光)' 
          },
        },
        required: ['mainBody', 'style'],
      },
    },
  },
  
  // 工具 3: 批量生成 4 种配色图标
  {
    type: 'function',
    function: {
      name: 'generate_icon_set',
      description: '根据主体元素列表，一次性生成多种不同风格的图标。每个风格可以使用不同的主体元素。',
      parameters: {
        type: 'object',
        properties: {
          mainBodies: { 
            type: 'array',
            items: { type: 'string' },
            description: '主体元素列表，如["灯泡", "铅笔", "调色板", "拼接方块"]，每个风格使用一个主体' 
          },
        },
        required: ['mainBodies'],
      },
    },
  },
  
  // 工具 4: 保存图标
  {
    type: 'function',
    function: {
      name: 'save_icon',
      description: '保存图标到数据库',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: '图标名称' },
          svgContent: { type: 'string', description: 'SVG 代码' },
          prompt: { type: 'string', description: '生成时的提示词' },
          style: { type: 'string', description: '图标风格' },
        },
        required: ['name', 'svgContent', 'prompt', 'style'],
      },
    },
  },
];

// ============================================
// 工具函数映射 (Tool Functions)
// ============================================
// 将工具名称映射到实际的函数实现

const toolFunctions: Record<string, Function> = {
  analyze_icon_main_body: tools.analyzeIconMainBody,
  generate_icon_by_main_body: tools.generateIconByMainBody,
  generate_icon_set: tools.generateIconSet,
  save_icon: tools.saveIcon,
};

type Message = OpenAI.ChatCompletionMessageParam;

// 流式事件类型
export type StreamEvent = 
  | { type: 'tool_start'; name: string; args: Record<string, any> }
  | { type: 'tool_result'; name: string; svg?: string; style?: string; mainBodies?: string[]; logs?: string[] }
  | { type: 'tool_log'; name: string; message: string }  // 新增：工具执行日志
  | { type: 'text'; content: string }
  | { type: 'done' }
  | { type: 'error'; error: string };

// ============================================
// Agent 主函数 (流式)
// ============================================
export async function runAgentStream(
  userMessage: string, 
  history: Message[] = [], 
  generateMultiple: boolean = false,
  customStyles: string[] | undefined,
  onEvent: (event: StreamEvent) => void
) {
  // 获取可用风格列表
  const availableStyles = customStyles && customStyles.length > 0 
    ? customStyles 
    : ['appstore', 'material', 'fluent', 'neon'];
  
  const styleEnumStr = availableStyles.join(', ');
  
  // 动态更新工具定义中的风格枚举
  const dynamicToolDefinitions: OpenAI.ChatCompletionTool[] = toolDefinitions.map(tool => {
    if (tool.type === 'function' && tool.function.name === 'generate_icon_by_main_body') {
      return {
        type: 'function' as const,
        function: {
          ...tool.function,
          parameters: {
            type: 'object',
            properties: {
              mainBody: { 
                type: 'string', 
                description: '主体元素，如"盾牌"、"云朵"、"硬币"' 
              },
              style: { 
                type: 'string', 
                enum: availableStyles,
                description: `风格选项: ${styleEnumStr}` 
              },
            },
            required: ['mainBody', 'style'],
          },
        },
      };
    }
    return tool;
  });

  // 系统提示词 - 指导 AI 如何使用工具
  const systemPrompt = generateMultiple 
    ? `你是专业的图标设计师。生成图标时必须遵循以下流程：

**重要：必须按顺序执行两个步骤！**

步骤 1: 先调用 analyze_icon_main_body 分析用户描述，获取 4 个主体元素
步骤 2: 将分析得到的所有主体元素传给 generate_icon_set，每个风格使用不同的主体

当前可用风格: ${styleEnumStr}

示例流程:
用户: "创意设计工具"
→ 调用 analyze_icon_main_body(userPrompt: "创意设计工具")
→ 得到 mainBodies: ["灯泡", "铅笔", "调色板", "拼接方块"]
→ 调用 generate_icon_set(mainBodies: ["灯泡", "铅笔", "调色板", "拼接方块"])
→ 生成 4 个图标，每个风格用不同的主体

现在开始，直接调用工具，不要先回复文字。`
    : `你是专业的图标设计师。
当用户想要生成图标时，先用 analyze_icon_main_body 分析主体，再用 generate_icon_set 生成图标。
当前可用风格: ${styleEnumStr}
用中文回复。`;

  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  try {
    // 第一轮: AI 决定调用哪些工具
    const response = await client.chat.completions.create({
      model: 'gpt-5.1',
      messages,
      tools: dynamicToolDefinitions,
      tool_choice: generateMultiple ? 'required' : 'auto',
    });

    const assistantMessage = response.choices[0].message;
    let toolCalls = assistantMessage.tool_calls;
    let allToolResults: any[] = [];
    let currentMessages = [...messages, assistantMessage];

    // 循环执行工具调用，直到没有更多工具调用
    while (toolCalls && toolCalls.length > 0) {
      const toolResults: any[] = [];
      
      for (const toolCall of toolCalls) {
        if (toolCall.type !== 'function') continue;
        
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        // 发送工具开始事件
        onEvent({ type: 'tool_start', name: functionName, args: functionArgs });
        
        // 发送工具日志
        if (functionName === 'analyze_icon_main_body') {
          onEvent({ type: 'tool_log', name: functionName, message: `分析: "${functionArgs.userPrompt}"` });
        } else if (functionName === 'generate_icon_set') {
          // ['苹果', '香蕉', '橙子'] -> '苹果, 香蕉, 橙子' 把列表数组转成字符串  
          const bodies = functionArgs.mainBodies.join(',') || functionArgs?.mainBody || '未知';
          onEvent({ type: 'tool_log', name: functionName, message: `批量生成: ${bodies}` });
        } else if (functionName === 'generate_icon_by_main_body') {
          onEvent({ type: 'tool_log', name: functionName, message: `生成: ${functionArgs.mainBody} (${functionArgs.style})` });
        }
        
        const toolFunction = toolFunctions[functionName];
        if (toolFunction) {
          // 传递自定义风格给 generate_icon_set
          const result = functionName === 'generate_icon_set' 
            ? await toolFunction({ ...functionArgs, styles: availableStyles })
            : await toolFunction(functionArgs);
          
          toolResults.push({
            toolCallId: toolCall.id,
            functionName,
            result,
          });
          
          // 发送工具结果事件
          if (functionName === 'generate_icon_set' && result.icons) {
            // 发送生成日志
            for (const icon of result.icons) {
              onEvent({ type: 'tool_log', name: functionName, message: `✓ ${icon.platform} - ${icon.styleName} (${icon.mainBody})` });
            }
            // 批量生成的情况，逐个发送图标
            for (const icon of result.icons) {
              onEvent({ 
                type: 'tool_result', 
                name: functionName,
                svg: icon.svg,
                style: icon.style,
              });
            }
          } else if (functionName === 'generate_icon_by_main_body' && result.svg) {
            onEvent({ 
              type: 'tool_result', 
              name: functionName,
              svg: result.svg,
              style: result.style,
            });
          } else if (functionName === 'analyze_icon_main_body' && result.mainBodies) {
            onEvent({ type: 'tool_log', name: functionName, message: `结果: ${result.mainBodies.join(', ')}` });
            onEvent({
              type: 'tool_result',
              name: functionName,
              mainBodies: result.mainBodies,
            });
          }
        }
      }

      allToolResults.push(...toolResults);

      // 将工具结果添加到消息中
      currentMessages = [
        ...currentMessages,
        ...toolResults.map(tr => ({
          role: 'tool' as const,
          tool_call_id: tr.toolCallId,
          content: JSON.stringify(tr.result),
        })),
      ];

      // 继续对话，看是否需要更多工具调用
      const nextResponse = await client.chat.completions.create({
        model: 'gpt-5.1',
        messages: currentMessages,
        tools: dynamicToolDefinitions,
        tool_choice: 'auto',
      });

      const nextMessage = nextResponse.choices[0].message;
      toolCalls = nextMessage.tool_calls;
      
      if (toolCalls && toolCalls.length > 0) {
        currentMessages.push(nextMessage);
      } else {
        // 没有更多工具调用，输出最终回复
        const reply = nextMessage.content || '';
        onEvent({ type: 'text', content: reply });
      }
    }

    // 如果第一轮就没有工具调用
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      onEvent({ type: 'text', content: assistantMessage.content || '' });
    }

  } catch (error) {
    console.error('[Agent] 错误:', error);
    onEvent({ type: 'error', error: '处理失败，请重试' });
  }

  onEvent({ type: 'done' });
}

// 非流式版本
export async function runAgent(userMessage: string, history: Message[] = [], generateMultiple: boolean = false, customStyles?: string[]) {
  const events: StreamEvent[] = [];
  await runAgentStream(userMessage, history, generateMultiple, customStyles, (e) => events.push(e));
  
  const toolCalls = events
    .filter(e => e.type === 'tool_result' && e.svg)
    .map(e => ({ functionName: (e as any).name, result: { svg: (e as any).svg } }));
  
  const textEvent = events.find(e => e.type === 'text') as { content: string } | undefined;
  
  return { reply: textEvent?.content || '', toolCalls };
}
