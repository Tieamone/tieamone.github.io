/**
 * 项目数据 —— 从 legacy-index.html 提取，事实内容未做任何改动。
 * 页面与组件只引用此文件，不再硬编码项目内容。
 */

export interface ProjectStat {
  value: string;
  label: string;
  /** 对应 CSS 中的强调色变体 */
  variant: 'accent' | 'accent2' | 'accent3';
}

export interface Project {
  id: string;
  title: string;
  type: string;
  period: string;
  description: string;
  highlights: string[];
  stack: string[];
  github?: string;
  featured?: boolean;
  stats?: ProjectStat[];
}

export const projects: Project[] = [
  {
    id: 'renovation-app',
    title: '智能装修全流程管理平台',
    type: '全栈 · 个人项目',
    period: 'Renovation App · 2024.01 — 至今',
    description:
      '针对传统装修行业流程链条长、协作混乱、资金透明度低的痛点，独立设计并开发了覆盖 3 种角色、4 大业务模块的全流程管理平台，实现从材料审核到施工节点的完整闭环。',
    highlights: [
      '基于 WebSocket 实现实时消息推送，替代 HTTP 轮询，消息触达率 100%',
      '引入数据库乐观锁保障高并发场景下的数据一致性，并发审核零冲突',
      '构建基于注解与过滤器的 RBAC 权限模型，实现接口级细粒度权限控制',
      '文档驱动开发，预留 Stable Diffusion AI 设计引擎接口，具备可扩展性',
    ],
    stack: [
      'Java 17',
      'Spring Boot 3',
      'Spring Data JPA',
      'MySQL',
      'Vue 3',
      'TypeScript',
      'Element Plus',
      'Pinia',
      'Android',
      'Retrofit2',
      'WebSocket',
    ],
    github: 'https://github.com/Tieamone/Renovation-App',
    featured: true,
    stats: [
      { value: '100%', label: '消息触达率', variant: 'accent' },
      { value: '3', label: '端 (Web/Android/后台)', variant: 'accent2' },
      { value: '0', label: '并发数据冲突', variant: 'accent3' },
    ],
  },
  {
    id: 'novel-ai',
    title: 'Novel AI',
    type: 'AI · 个人项目',
    period: 'AI 集成项目',
    description:
      '集成 AI 能力的项目，探索大语言模型与应用场景的结合，对接在线 AI 接口，提升智能化交互体验。',
    highlights: [],
    stack: ['AI API', 'Java', 'Android'],
    github: 'https://github.com/Tieamone/novel-ai',
  },
  {
    id: 'gomoku',
    title: '安卓五子棋',
    type: 'Android · 独立开发',
    period: '2025.04',
    description:
      '独立开发的 Android 五子棋游戏，集成画图工具模块与小窗口视频功能，并对接 DeepSeek AI 接口实现 AI 对战，打包为可测试 Demo。',
    highlights: [
      'AI 对接 DeepSeek 在线接口，实现智能 AI 博弈',
      '创新集成画图工具与小窗口视频功能',
      '从需求分析到打包全程独立完成',
    ],
    stack: ['Android', 'Java', 'DeepSeek API', 'Material Design'],
  },
];
