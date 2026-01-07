import { pgTable, text, timestamp, integer, uuid, jsonb } from 'drizzle-orm/pg-core';

// 用户表
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  provider: text('provider').default('google'),
  providerId: text('provider_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 会话表
export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').default('新会话'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 消息表
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  toolCalls: jsonb('tool_calls'), // 工具调用记录
  createdAt: timestamp('created_at').defaultNow(),
});

// 生成的图标表（关联会话）
export const icons = pgTable('icons', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'cascade' }),
  messageId: uuid('message_id').references(() => messages.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  prompt: text('prompt').notNull(),
  svgContent: text('svg_content').notNull(),
  style: text('style').default('outline'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const iconFormats = pgTable('icon_formats', {
  id: uuid('id').defaultRandom().primaryKey(),
  iconId: uuid('icon_id').references(() => icons.id, { onDelete: 'cascade' }),
  format: text('format').notNull(),
  size: integer('size').notNull(),
  filePath: text('file_path').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});