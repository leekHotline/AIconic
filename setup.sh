#!/bin/bash

echo "🚀 创建 AIconic 项目..."

# 初始化 Next.js 项目
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes

# 安装依赖
echo "📦 安装依赖..."
npm install ai @ai-sdk/anthropic
npm install drizzle-orm @neondatabase/serverless
npm install sharp
npm install -D drizzle-kit

# 创建目录结构
echo "📁 创建目录结构..."
mkdir -p src/app/generate
mkdir -p src/app/api/generate
mkdir -p src/app/api/convert
mkdir -p src/app/api/icons
mkdir -p src/components
mkdir -p src/lib
mkdir -p src/db
mkdir -p public/icons

echo "✅ 目录创建完成!"