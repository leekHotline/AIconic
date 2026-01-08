# AIconic - 创新人工智能应用平台

<div align="center">
  <img src="public/logo.svg" alt="AIconic Logo" width="120">
</div>

## 📋 目录

- [项目简介](#项目简介)
- [功能特点](#功能特点)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [环境配置](#环境配置)
- [开发指南](#开发指南)
- [部署指南](#部署指南)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 🌟 项目简介

AIconic 是一个创新的人工智能应用平台，致力于为用户提供便捷、高效的AI服务体验。本项目采用现代化的技术栈，结合 Next.js 框架的强大功能，打造了一个响应式、高性能的Web应用程序。

## ✨ 功能特点

- 🔍 **智能交互**: 提供直观的AI服务交互界面
- 📊 **数据可视化**: 支持多种数据展示方式
- 🔐 **安全可靠**: 完善的用户认证和权限管理
- 🚀 **高性能**: 优化的前端性能和后端处理
- 📱 **响应式设计**: 适配多种设备和屏幕尺寸
- 🌐 **国际化支持**: 多语言界面支持

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/leekHotline/AIconic.git
cd AIconic
```

2. 安装依赖
```bash
npm install
```

3. 环境配置
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，配置必要的环境变量
```

4. 数据库设置
```bash
npm run db:migrate
npm run db:seed
```

5. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看项目。

## 📁 项目结构

```
AIconic/
├── .env.example          # 环境变量示例文件
├── .env.local           # 本地环境变量配置
├── .gitignore           # Git忽略文件配置
├── .next/               # Next.js构建输出目录
├── .vscode/             # VS Code工作区配置
├── drizzle/             # 数据库迁移文件
├── drizzle.config.ts    # Drizzle ORM配置文件
├── next-env.d.ts        # Next.js类型声明文件
├── package.json         # 项目依赖和脚本配置
├── package-lock.json    # 锁定依赖版本
├── postcss.config.mjs   # PostCSS配置
├── public/              # 静态资源目录
├── readme.md            # 项目说明文档
├── setup.sh             # 项目设置脚本
└── src/                 # 源代码目录
    ├── app/             # Next.js应用目录
    ├── components/      # 可复用组件
    ├── db/              # 数据库模型和操作
    ├── lib/             # 工具函数和库
    ├── resource/        # 项目资源文件
    └── types/           # TypeScript类型定义
```

## 💻 技术栈

### 前端
- **Next.js**: React框架，支持SSR和静态生成
- **TypeScript**: 类型安全的JavaScript
- **Tailwind CSS**: 实用优先的CSS框架
- **Framer Motion**: 动画库

### 后端
- **Next.js API**: 服务端API路由
- **Drizzle ORM**: 类型安全的数据库操作
- **PostgreSQL**: 主数据库

### 开发工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Husky**: Git钩子
- **Jest**: 单元测试框架

## ⚙️ 环境配置

### 必需的环境变量

创建 `.env.local` 文件并配置以下变量：

```env
DATABASE_URL=your_database_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
API_KEY=your_api_key
```

### 开发环境设置

1. 安装VS Code扩展（推荐）：
   - ES7+ React/Redux/React-Native snippets
   - TypeScript Importer
   - Prettier - Code formatter
   - ESLint

2. 配置pre-commit钩子：
```bash
npm run prepare
```

## 🛠️ 开发指南

### 代码规范

遵循以下代码规范：
- 使用TypeScript进行开发
- 使用ESLint和Prettier保持代码风格一致
- 组件命名使用PascalCase
- 文件命名使用kebab-case

### 提交规范

使用[Conventional Commits](https://conventionalcommits.org/)规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

类型包括：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式化
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 🚀 部署指南

### 生产环境部署

1. 构建项目
```bash
npm run build
```

2. 启动生产服务器
```bash
npm start
```

### Docker部署

1. 构建Docker镜像
```bash
docker build -t aiconic .
```

2. 运行容器
```bash
docker run -p 3000:3000 aiconic
```

## 🤝 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- 团队名称: 奇点
- 项目链接: https://github.com/leekHotline/AIconic

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Drizzle ORM](https://orm.drizzle.team/) - 数据库ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- 所有贡献者