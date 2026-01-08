# Welcome to AIconic!
<img width="1860" height="915" alt="图片" src="https://github.com/user-attachments/assets/643a1b3e-3973-4cd4-aaa6-b41ecd130547" />

## 如何运行

```
git clone https://github.com/leekHotline/AIconic.git
npm install -g pnpm
pnpm install 
cp .env.example .env.local
pnpm dev
```

## 项目概述

这是一个 **AI Agent 驱动的图标生成器**，用户用自然语言描述需求，AI 自动调用工具生成 SVG 图标。

## 核心架构

```
用户输入 → API Route → Agent (LLM + Tools) → 流式返回 → 前端渲染
```

## 三个核心文件

### 1. `src/lib/agent.ts` - Agent 核心（最重要）

这是整个项目的大脑，实现了 **Function Calling** 模式：

```typescript
// 1️⃣ 定义工具 Schema - 告诉 AI 有哪些工具可用
const toolDefinitions: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'generate_svg_icon',  // 工具名称
      description: '生成 SVG 图标',  // AI 根据这个决定何时调用
      parameters: {  // 工具需要的参数
        type: 'object',
        properties: {
          description: { type: 'string' },
          style: { type: 'string', enum: ['modern', 'gradient', ...] },
        },
        required: ['description', 'style'],
      },
    },
  },
];

// 2️⃣ 工具函数映射 - 工具名 → 实际执行的函数
const toolFunctions = {
  generate_svg_icon: tools.generateSvgIcon,
};

// 3️⃣ Agent 主流程
export async function runAgentStream(userMessage, history, onEvent) {
  // 调用 LLM，传入工具定义
  const response = await client.chat.completions.create({
    model: 'gpt-5.1',
    messages,
    tools: toolDefinitions,      // 告诉 AI 可用工具
    tool_choice: 'required',     // 强制调用工具
  });

  // AI 返回要调用的工具
  const toolCalls = response.choices[0].message.tool_calls;

  // 逐个执行工具
  for (const toolCall of toolCalls) {
    const functionName = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);
    
    onEvent({ type: 'tool_start', name: functionName, args });  // 通知前端的后端调用日志
    
    const result = await toolFunctions[functionName](args);     // 执行工具函数
    
    onEvent({ type: 'tool_result', svg: result.svg });          // 返回结果
  }
}
```

**核心概念：Function Calling**
- AI 不直接生成图标，而是决定"调用哪个工具、传什么参数"
- 你定义工具的 Schema，AI 根据用户意图自动选择和调用

### 2. `src/lib/tools.ts` - 工具实现

实际执行图标生成的代码：

```typescript
export async function generateSvgIcon({ description, style, primaryColor, secondaryColor }) {
  // 可以是：
  // 1. 调用另一个 AI 生成 SVG
  // 2. 使用模板拼接
  // 3. 调用第三方 API
  
  const svg = await generateWithAI(description, style, colors);
  return { svg };
}
```

### 3. `src/app/api/chat/route.ts` - 流式 API

使用 Server-Sent Events (SSE) 实现流式响应：

```typescript
export async function POST(request) {
  const stream = new ReadableStream({
    async start(controller) {
      await runAgentStream(message, history, (event) => {
        // 每次工具执行完，立即推送给前端
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
```

### 4. 前端消费流式数据

```typescript
const response = await fetch('/api/chat', { method: 'POST', body: ... });
const reader = response.body.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  // 解析 SSE 数据
  const event = JSON.parse(data);
  
  if (event.type === 'tool_start') {
    // 显示"正在生成..."
  }
  if (event.type === 'tool_result' && event.svg) {
    // 立即显示图标，不用等全部完成
    setGeneratedIcons(prev => [...prev, { svg: event.svg }]);
  }
}
```

## 如何独立写出来

**Step 1: 理解 Function Calling**
```typescript
// 最小示例
const response = await openai.chat.completions.create({
  model: 'gpt-5.1',
  messages: [{ role: 'user', content: '生成一个太阳图标' }],
  tools: [{
    type: 'function',
    function: {
      name: 'generate_icon',
      description: '生成图标',
      parameters: { type: 'object', properties: { name: { type: 'string' } } }
    }
  }],
});

// AI 会返回: tool_calls: [{ function: { name: 'generate_icon', arguments: '{"name":"sun"}' } }]
```

**Step 2: 实现工具函数**
```typescript
function generateIcon({ name }) {
  // 你的图标生成逻辑
  return { svg: '<svg>...</svg>' };
}
```

**Step 3: 串联起来**
```typescript
if (response.tool_calls) {
  for (const call of response.tool_calls) {
    const result = generateIcon(JSON.parse(call.function.arguments));
    // 返回给用户
  }
}
```

## 总结

| 概念 | 作用 |
|------|------|
| Function Calling | AI 决定调用什么工具、传什么参数 |
| Tool Schema | 告诉 AI 工具的名称、描述、参数格式 |
| SSE 流式响应 | 生成一个显示一个，不用等全部完成 |
| tool_choice: 'required' | 强制 AI 调用工具，不要只回复文字 |

核心就是 **让 AI 当"调度员"，你写"工人"（工具函数）**。

#### Agent 调用工具的流程：

#### 1. agent.ts 定义工具 (toolDefinitions) → 告诉 AI 有哪些工具
#### 2. agent.ts 映射函数 (toolFunctions) → 工具名 → 实际函数
#### 3. tools.ts 实现函数 → 执行具体逻辑
#### 4. AI 根据用户意图选择调用哪个工具


### 技术栈：

#### Next.js 15 + React 19 + TypeScript
#### Tailwind CSS 4
#### Drizzle ORM + Neon (PostgreSQL)
#### AI SDK (OpenAI / Anthropic)
#### NextAuth 认证
#### GSAP + Framer Motion 动画


#### core sop : git status --short 看看看看未提交的commit，告诉我你做了什么，向我解释 这是我的理解:{your_understand} 解释并对齐

## Logs 2026更新日志

#### 01-06  流式事件响应: 文本 日志 svg代码
#### onEvent如何实现的，工具是如何发出事件的，agent.ts是如何捕获事件的,sse对象如何发给前端的，是会话中一直监听吗? onEvent 就是一个"喊话器"，agent.ts 拿着它，每当有事发生就喊一声，API route 听到后写入流，前端读取流更新界面。
#### onEvent是工具函数runAgentStream的一个回调函数，写在参数里面  如何使用?通过创建一个写入流，每当onEvent被调用，就把数据写入流writer.write(event.json()) 并返回sse响应  前端通过reader.read()持续读取数据流 sse是服务器单向推送数据流给客户端的协议



#### 01-07 中英语言 谷歌认证 用户会话
#### i18n翻译所有上下文，文本中英翻译映射  添加图标 所有页面组件使用t()函数来获取翻译文本
#### 对接谷歌登录认证 next-auth 新增认证模块接口 provider配置谷歌认证服务提供者 用户表和会话表相关联 登录按钮组件提供会话 提供认证对象包装 获取id，用户名和邮箱，用户头像 将本来的登录注册认证从浏览器本地切换到谷歌的signIn,signOut 会话接口获取当前用户
#### db下的schemas新增用户表 会话表的用户id换成users.id

#### 字段类型不匹配，用as any确保任何类型都可以通过 drizzle类型缓存未更新 pnpm db:generate重新生成类型更好  外圆，竖轴椭圆，横轴椭圆

#### 用户意图识别 创建平面简约风格插件和插件平面简约风格图标如何意图分界的?
#### 通过关键词优先级来识别用户 风格 插件 新建-> 插件风格  生成 图标 做 -> 图标
#### Agent需要用户填写所有必填参数（id, name, colors, svgTemplate）才能调用工具
#### 没有的参数可以让ai自动生成
#### 社区风格是动态加载的 不在静态的 COLOR_SCHEMES 中 使用 getStylePlugin 并先加载社区风格
