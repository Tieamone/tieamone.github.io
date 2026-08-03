/**
 * 站点全局配置 —— 个人信息唯一来源（Single Source of Truth）
 *
 * ⚠️ 部署前必须替换的占位字段：
 *    - url           → 真实域名（同时修改 astro.config.mjs 的 site）
 *    - email / phone / phoneDisplay → 真实联系方式
 *    - github        → 真实 GitHub 地址
 *    - avatar        → 真实头像路径（当前为空，页面不引用，避免虚假头像）
 *
 * 组件不硬编码任何联系方式，全部从此文件读取，
 * 以修复旧版 index.html 中 mailto:/tel: 与展示文本不一致的问题。
 */

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  /** 页面主标题用名（带空格排版） */
  name: string;
  /** 默认 <title> 与 og:site_name */
  title: string;
  /** 默认 meta description */
  description: string;
  /** 站点基础 URL，须与 astro.config.mjs 的 site 保持一致 */
  url: string;
  /** 导航栏 logo 文本（显示为 ~/logo） */
  logo: string;
  /** 页脚署名 */
  author: string;
  /** 英文名（预留） */
  nameEn: string;
  // ---- 联系方式（占位，部署前替换） ----
  email: string;
  /** tel: 链接值 */
  phone: string;
  /** 页面展示用电话 */
  phoneDisplay: string;
  /** 是否在页面公开展示电话（false 时不渲染 tel 链接与号码） */
  phonePublic: boolean;
  location: string;
  /** GitHub 地址（占位，部署前替换） */
  github: string;
  /** 博客入口路径 */
  blog: string;
  /** 头像路径（留空 = 未设置，页面不渲染头像） */
  avatar: string;
  /** 简历页路径 */
  resume: string;
  /** Hero 状态标签 */
  availability: string;
  /** 求职期望城市 */
  seekingCities: string[];
  /** Hero 打字动画词组 */
  typingPhrases: string[];
  /** 社交链接列表（占位，部署前替换） */
  socialLinks: SocialLink[];
}

export const site: SiteConfig = {
  name: '龚 曦',
  title: '龚曦 · Full-Stack Developer',
  description:
    '龚曦的个人网站——全栈开发者，专注 Android 原生与 Spring Boot 后端。项目经历、技术博客与简历。',
  url: 'https://tieamone.github.io',
  logo: 'gongxi',
  author: '龚曦',
  nameEn: 'Gong Xi',
  email: '13895308608@163.com',
  phone: '+8613895308608',
  phoneDisplay: '138 9530 8608',
  // phonePublic=false：网站页面不渲染手机号与 tel 链接
  phonePublic: false,
  location: '中国 · 武汉',
  github: 'https://github.com/Tieamone',
  blog: '/blog',
  avatar: '',
  resume: '/resume',
  availability: 'Available · 26届应届生 · 随时到岗',
  seekingCities: ['深圳', '武汉', '广州'],
  typingPhrases: [
    'Java Backend Developer',
    'Android Native Developer',
    'Full-Stack Engineer',
    'Spring Boot · Vue 3 · Android',
  ],
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/Tieamone' },
  ],
};

export const navLinks = [
  { href: '/#about', label: '关于' },
  { href: '/#skills', label: '技能' },
  { href: '/#projects', label: '项目' },
  { href: '/#experience', label: '经历' },
  { href: '/blog', label: '博客' },
  { href: '/resume', label: '简历' },
  { href: '/#contact', label: '联系' },
];
