import data from '../data/content/site.json';
import { siteSchema } from '../data/content-schema.js';

const content = siteSchema.parse(data);

/**
 * 后台维护 content/site.json；此处验证后提供给页面和组件。
 * 修改站点域名时还需要同步 Astro、后台和认证服务配置。
 */

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  heroDescription: string;
  contactDescription: string;
  coreStack: string[];
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
  // ---- 联系方式 ----
  email: string;
  /** tel: 链接值 */
  phone: string;
  /** 页面展示用电话 */
  phoneDisplay: string;
  /** 是否在页面公开展示电话（false 时不渲染 tel 链接与号码） */
  phonePublic: boolean;
  location: string;
  /** GitHub 地址 */
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
  /** 社交链接列表 */
  socialLinks: SocialLink[];
}

export const site: SiteConfig = content;

export const navLinks = [
  { href: '/#about', label: '关于' },
  { href: '/#skills', label: '技能' },
  { href: '/#projects', label: '项目' },
  { href: '/#experience', label: '经历' },
  { href: '/blog', label: '博客' },
  { href: '/resume', label: '简历' },
  { href: '/#contact', label: '联系' },
];
