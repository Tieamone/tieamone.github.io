/**
 * 简历事实数据（工作经历 / 教育背景 / 个人优势）
 * —— 从 legacy-index.html 提取，事实内容未做任何改动。
 */

export interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  badge: string;
  points: string[];
}

export const experience: ExperienceItem[] = [
  {
    period: '2025.09 — 2026.01',
    company: '武汉晶音科技有限公司',
    role: 'Java 后端开发',
    badge: '实习',
    points: [
      '主导小程序后端从 PHP/FastAdmin 到 Java/Spring Boot 的完整重构，实现接口统一与服务模块化',
      '规范 GitLab 开发流程，推动代码评审机制，完成 v1.0.0、v1.0.82、v1.0.83 等核心版本上线',
      '负责后台管理系统权限管理、数据配置、业务流程引擎等核心功能模块开发',
      '建立前后端联调协作机制，指导团队新人掌握开发流程与编码标准',
      '针对乙方代码合并冲突提出解决方案，持续优化接口响应性能与系统稳定性',
    ],
  },
];

export interface EducationItem {
  school: string;
  degree: string;
  rank: string;
  note: string;
  courses: string[];
  year: string;
  cohort: string;
}

export const education: EducationItem = {
  school: '武汉生物工程学院',
  degree: '计算机应用技术 · 大专',
  rank: '⭐ 专业排名前 5%',
  note: '在校担任班长 · 多个个人项目已在 GitHub 开源',
  courses: ['Web 前端技术', 'Java 程序设计', 'Android 开发', '数据库设计', '计算机基础'],
  year: '2023 — 2026',
  cohort: '26届 · 应届',
};

export const advantages: string[] = [
  '全栈独立开发能力，覆盖 UI 设计、后端逻辑与前后端交互',
  '精通 Android 原生开发，熟练使用 Android Studio 与 Material Design',
  'Git 版本控制规范化实践，推动团队代码评审机制落地',
  '具备快速学习与技术探索能力，持续优化开发效率',
  '初步项目管理经验，完成计划制定、进度跟踪与汇报',
];

export const aboutParagraphs: string[] = [
  '我是龚曦，一名即将毕业的大专全栈开发者，主攻 Android 原生开发与 Java 后端。从零构建过完整的商业级应用，涵盖后端架构设计、Android 客户端开发、前端 Vue 实现与数据库优化。',
  '在武汉晶音科技实习期间，主导完成了小程序后端从 PHP/FastAdmin 到 Java/Spring Boot 的完整重构，并建立了 GitLab 代码规范与版本管理流程。',
  '我相信工程师不只是写代码——而是解决问题、构建可持续运行的系统。',
];
