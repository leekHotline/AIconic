'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'zh' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

// 翻译文本
const translations: Record<Locale, Record<string, string>> = {
  zh: {
    // 导航栏
    'nav.about': '关于',
    'nav.showcase': '插件市场',
    'nav.features': '功能',
    'nav.start': '开始创作',
    'nav.login': '登录',
    
    // Hero 区域
    'hero.badge': 'AI 驱动 · 专业级图标生成',
    'hero.title1': '再小的产品，',
    'hero.title2': '也值得被世界认出。',
    'hero.subtitle1': 'AIconic 深度理解您的产品内核，为每个创意注入视觉灵魂。',
    'hero.subtitle2': '10 秒生成专业商用图标，开启您的品牌第一步。',
    'hero.placeholder': '描述你想要的图标，如：一个现代化的金融理财 App 图标...',
    'hero.scroll': 'SCROLL',
    
    // 快捷标签
    'tag.rocket': '火箭发射',
    'tag.security': '安全防护',
    'tag.finance': '金融理财',
    'tag.cloud': '云存储',
    'tag.music': '音乐播放',
    'tag.camera': '相机拍照',
    
    // 关于区域
    'about.title': '为什么选择 AIconic？',
    'about.subtitle': '我们重新定义了图标设计的方式',
    'about.feature1.title': 'AI 深度理解',
    'about.feature1.desc': '不只是生成图标，而是理解您的产品内核，创造有灵魂的视觉符号',
    'about.feature2.title': '专业级输出',
    'about.feature2.desc': '支持 SVG、PNG、ICO 等多种格式，适配 iOS、Android、Web 全平台',
    'about.feature3.title': '极速生成',
    'about.feature3.desc': '10 秒内生成多种风格方案，让您的创意快速落地',
    
    // 展示区域
    'showcase.title': '风格插件市场',
    'showcase.subtitle': '每一种图标风格都是社区用户的艺术创作',
    'showcase.hover': '悬停查看更多',
    'showcase.item1': '创意设计',
    'showcase.item2': '奢华品质',
    'showcase.item3': '极速体验',
    'showcase.item4': '自然生态',
    'showcase.item5': '热门趋势',
    'showcase.item6': '梦幻星光',
    
    // 功能区域
    'features.title': '多种设计风格',
    'features.subtitle': '严格遵循各平台设计规范',
    'features.style1.name': 'App Store',
    'features.style1.style': '数字静物',
    'features.style1.desc': '柔光环境 · 浅色背景 · 微妙投影',
    'features.style1.f1': '居中主体',
    'features.style1.f2': '60-70% 占比',
    'features.style1.f3': '静物摄影感',
    'features.style2.name': 'Google Play',
    'features.style2.style': 'Material',
    'features.style2.desc': '几何造型 · 动态渐变 · 层次阴影',
    'features.style2.f1': '适应性裁剪',
    'features.style2.f2': '安全边距',
    'features.style2.f3': '品牌色彩',
    'features.style3.name': 'Vibrant',
    'features.style3.style': '活力渐变',
    'features.style3.desc': '大胆色彩 · 流畅渐变 · 现代感',
    'features.style3.f1': '多色渐变',
    'features.style3.f2': '视觉冲击',
    'features.style3.f3': '活力设计',
    'features.style4.name': 'Elegant',
    'features.style4.style': '优雅精致',
    'features.style4.desc': '柔和配色 · 精致细节 · 高级感',
    'features.style4.f1': '精致渐变',
    'features.style4.f2': '优雅设计',
    'features.style4.f3': '品质感',
    'features.style5.name': 'Creative',
    'features.style5.style': '霓虹',
    'features.style5.desc': '发光效果 · 深色背景 · 高对比度',
    'features.style5.f1': '边缘发光',
    'features.style5.f2': '色彩渐变',
    'features.style5.f3': '科技感',
    
    // CTA 区域
    'cta.title1': '准备好创造',
    'cta.title2': ' 惊艳图标 ',
    'cta.title3': '了吗？',
    'cta.subtitle': '立即开始，让 AI 为你的应用打造独一无二的专业图标，提升品牌形象',
    'cta.button': '免费开始创作',
    'cta.viewCases': '查看案例',
    'cta.secure': '安全可靠',
    'cta.fast': '秒级生成',
    'cta.free': '免费使用',
    
    // Footer
    'footer.desc': 'AI 驱动的专业图标生成平台',
    'footer.product': '产品',
    'footer.features': '功能介绍',
    'footer.pricing': '价格方案',
    'footer.changelog': '更新日志',
    'footer.support': '支持',
    'footer.docs': '使用文档',
    'footer.faq': '常见问题',
    'footer.contact': '联系我们',
    'footer.legal': '法律',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.copyright': '© 2024 AIconic. 保留所有权利。',
    
    // 工作区
    'workspace.title': '工作区',
    'workspace.icons': '个图标',
    'workspace.describe': '描述你想要的图标',
    'workspace.placeholder': '描述图标...',
    'workspace.generating': '正在生成图标...',
    'workspace.thinking': '思考中...',
    'workspace.empty': '在左侧输入描述生成图标',
    'workspace.format': '格式',
    'workspace.size': '尺寸',
    'workspace.download': '下载',
    'workspace.newChat': '新会话',
    'workspace.back': '返回首页',
    'workspace.complete': '已完成',
    'workspace.failed': '生成失败，请重试。',
    
    // 提示建议
    'suggestion.rocket': '火箭发射',
    'suggestion.rocket.desc': '科技启动图标',
    'suggestion.chat': '智能聊天助手',
    'suggestion.chat.desc': 'AI对话应用',
    'suggestion.dashboard': '数据分析仪表盘',
    'suggestion.dashboard.desc': '商业智能',
    'suggestion.design': '创意设计工具',
    'suggestion.design.desc': '设计类应用',
  },
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.showcase': 'Showcase',
    'nav.features': 'Features',
    'nav.start': 'Get Started',
    'nav.login': 'Login',
    
    // Hero Section
    'hero.badge': 'AI-Powered · Professional Icon Generation',
    'hero.title1': 'Every product,',
    'hero.title2': 'deserves to be recognized.',
    'hero.subtitle1': 'AIconic deeply understands your product, infusing visual soul into every idea.',
    'hero.subtitle2': 'Generate professional icons in 10 seconds, start your brand journey.',
    'hero.placeholder': 'Describe the icon you want, e.g., a modern fintech app icon...',
    'hero.scroll': 'SCROLL',
    
    // Quick Tags
    'tag.rocket': 'Rocket Launch',
    'tag.security': 'Security',
    'tag.finance': 'Finance',
    'tag.cloud': 'Cloud Storage',
    'tag.music': 'Music Player',
    'tag.camera': 'Camera',
    
    // About Section
    'about.title': 'Why Choose AIconic?',
    'about.subtitle': 'We redefined the way icons are designed',
    'about.feature1.title': 'AI Deep Understanding',
    'about.feature1.desc': 'Not just generating icons, but understanding your product to create meaningful visual symbols',
    'about.feature2.title': 'Professional Output',
    'about.feature2.desc': 'Support SVG, PNG, ICO and more formats, compatible with iOS, Android, Web platforms',
    'about.feature3.title': 'Lightning Fast',
    'about.feature3.desc': 'Generate multiple style options in 10 seconds, bring your ideas to life quickly',
    
    // Showcase Section
    'showcase.title': 'Style Marketplace',
    'showcase.subtitle': 'Every icon style is a community artwork',
    'showcase.hover': 'Hover to see more',
    'showcase.item1': 'Creative Design',
    'showcase.item2': 'Luxury Quality',
    'showcase.item3': 'Fast Experience',
    'showcase.item4': 'Natural Eco',
    'showcase.item5': 'Trending',
    'showcase.item6': 'Dreamy Starlight',
    
    // Features Section
    'features.title': 'Multiple Design Styles',
    'features.subtitle': 'Strictly follow platform design guidelines',
    'features.style1.name': 'App Store',
    'features.style1.style': 'Digital Still Life',
    'features.style1.desc': 'Soft lighting · Light background · Subtle shadows',
    'features.style1.f1': 'Centered subject',
    'features.style1.f2': '60-70% ratio',
    'features.style1.f3': 'Still life feel',
    'features.style2.name': 'Google Play',
    'features.style2.style': 'Material',
    'features.style2.desc': 'Geometric shapes · Dynamic gradients · Layered shadows',
    'features.style2.f1': 'Adaptive cropping',
    'features.style2.f2': 'Safe margins',
    'features.style2.f3': 'Brand colors',
    'features.style3.name': 'Vibrant',
    'features.style3.style': 'Vibrant Gradient',
    'features.style3.desc': 'Bold colors · Smooth gradients · Modern feel',
    'features.style3.f1': 'Multi-color gradient',
    'features.style3.f2': 'Visual impact',
    'features.style3.f3': 'Energetic design',
    'features.style4.name': 'Elegant',
    'features.style4.style': 'Elegant Refined',
    'features.style4.desc': 'Soft colors · Fine details · Premium feel',
    'features.style4.f1': 'Refined gradient',
    'features.style4.f2': 'Elegant design',
    'features.style4.f3': 'Quality feel',
    'features.style5.name': 'Creative',
    'features.style5.style': 'Neon',
    'features.style5.desc': 'Glow effects · Dark background · High contrast',
    'features.style5.f1': 'Edge glow',
    'features.style5.f2': 'Color gradient',
    'features.style5.f3': 'Tech feel',
    
    // CTA Section
    'cta.title1': 'Ready to create',
    'cta.title2': ' stunning icons',
    'cta.title3': '?',
    'cta.subtitle': 'Start now, let AI craft unique professional icons for your app and elevate your brand',
    'cta.button': 'Start Creating Free',
    'cta.viewCases': 'View Cases',
    'cta.secure': 'Secure',
    'cta.fast': 'Fast Generation',
    'cta.free': 'Free to Use',
    
    // Footer
    'footer.desc': 'AI-powered professional icon generation platform',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.changelog': 'Changelog',
    'footer.support': 'Support',
    'footer.docs': 'Documentation',
    'footer.faq': 'FAQ',
    'footer.contact': 'Contact Us',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright': '© 2024 AIconic. All rights reserved.',
    
    // Workspace
    'workspace.title': 'Workspace',
    'workspace.icons': 'icons',
    'workspace.describe': 'Describe the icon you want',
    'workspace.placeholder': 'Describe icon...',
    'workspace.generating': 'Generating icons...',
    'workspace.thinking': 'Thinking...',
    'workspace.empty': 'Enter description on the left to generate icons',
    'workspace.format': 'Format',
    'workspace.size': 'Size',
    'workspace.download': 'Download',
    'workspace.newChat': 'New Chat',
    'workspace.back': 'Back to Home',
    'workspace.complete': 'Done',
    'workspace.failed': 'Generation failed, please retry.',
    
    // Suggestions
    'suggestion.rocket': 'Rocket Launch',
    'suggestion.rocket.desc': 'Tech startup icon',
    'suggestion.chat': 'AI Chat Assistant',
    'suggestion.chat.desc': 'AI conversation app',
    'suggestion.dashboard': 'Analytics Dashboard',
    'suggestion.dashboard.desc': 'Business intelligence',
    'suggestion.design': 'Creative Design Tool',
    'suggestion.design.desc': 'Design application',
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string) => translations[locale][key] || key;

  // 防止 hydration 不匹配
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  // 如果 context 不存在，返回默认值（用于 SSR 或 Provider 外部）
  if (!context) {
    return {
      locale: 'zh' as Locale,
      setLocale: () => {},
      t: (key: string) => translations['zh'][key] || key,
    };
  }
  return context;
}
