import data from './content/projects.json';
import { projectsSchema } from './content-schema.js';

const content = projectsSchema.parse(data);

/**
 * 项目数据由后台维护 content/projects.json。
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

export const projects: Project[] = content.projects;
