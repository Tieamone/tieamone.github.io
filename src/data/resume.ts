/**
 * 简历事实数据（工作经历 / 教育背景 / 个人优势）
 * 首页、关于页与简历页共用；工作内容按实际完成情况区分已交付与进行中。
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
    period: '2026.09 — 至今',
    company: '深圳市立德信科技贸易有限公司',
    role: '线上技术开发 · 远程技术支持',
    badge: '返聘',
    points: [
      '因前期工作表现突出获公司返聘，承担企业级业务系统的二次开发、服务器环境部署及远程技术支持',
      '完成项目整套服务器运行环境部署，配置 Nginx、Redis、MySQL 等组件，支持开发与联调，持续开展问题定位和技术支持',
      '基于 Spring Boot、讯曼框架、uni-app 及 Android 原生技术推进系统二次开发（进行中），当前开展小程序缺陷修复和界面调整；后续范围涵盖设备接口适配、历史数据迁移、用户身份关联及灰度切换验证',
    ],
  },
  {
    period: '2026.06 — 2026.08',
    company: '深圳市立德信科技贸易有限公司',
    role: '全栈开发工程师',
    badge: '全职',
    points: [
      '服务器部署与运维：完成整套运行环境部署，配置 Nginx、Redis、MySQL 及对象存储、短信服务，开展应用部署、网络访问配置、上线联调和阶段性运维',
      '多端开发与交付：基于 uni-app 定制智能回收系统的用户端、清运端和大仓端，结合 Spring Boot、讯曼框架开发与修复后端接口，完成多端业务联调并支持客户项目上线',
      'TCP 设备通信适配：按新主板协议开发后端接口，处理 TCP 粘包及异常 JSON 报文，补充设备注册和异常处理逻辑，开展新设备接入与部署联调',
      'MySQL 数据治理：使用 SQL 筛选并清理 5,327 条历史异常袋子记录，对部分历史及重复业务数据执行逻辑删除，处理提现和业务数据不一致问题，开展索引建设与 SQL 调优',
      'Android 原生应用维护：修复柜机应用的摄像头调用、内存泄漏及屏幕适配问题，完善设备控制异常兜底逻辑，处理设备运营状态与管理端控制不一致的问题',
    ],
  },
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
  'Spring Boot 后端与 uni-app 多端开发，具备业务接口开发、跨端联调和项目交付经验',
  'Android 原生设备端开发，处理摄像头调用、内存泄漏与屏幕适配问题',
  'TCP 设备通信适配，处理粘包、异常 JSON 报文及设备注册流程',
  'MySQL 数据清理、索引建设与 SQL 调优，维护业务数据一致性',
  '整套服务器环境部署与阶段性运维，配置 Nginx、Redis、MySQL 并开展远程技术支持',
];

export const aboutParagraphs: string[] = [
  '我是龚曦，一名全栈开发工程师，主要使用 Spring Boot、uni-app 和 Android 原生技术，工作涵盖业务开发、设备通信、MySQL 数据维护及服务器部署。',
  '在深圳市立德信科技贸易有限公司任职期间，参与智能回收系统的多端定制与交付，完成整套服务器环境部署并承担阶段性运维，处理 TCP 协议适配和设备端稳定性问题。',
  '因前期工作表现突出获公司返聘，目前远程承担企业级项目二次开发与技术支持。此前在武汉晶音科技实习期间，主导完成小程序后端从 PHP/FastAdmin 到 Java/Spring Boot 的重构。',
];
