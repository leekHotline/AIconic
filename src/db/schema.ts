import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

export const icons = pgTable('icons', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  prompt: text('prompt').notNull(),
  svgContent: text('svg_content').notNull(),
  style: text('style').default('outline'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const iconFormats = pgTable('icon_formats', {
  id: uuid('id').defaultRandom().primaryKey(),
  iconId: uuid('icon_id').references(() => icons.id),
  format: text('format').notNull(), // svg, png, jpeg, webp
  size: integer('size').notNull(),  // 32, 64, 128, 256, 512
  filePath: text('file_path').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});