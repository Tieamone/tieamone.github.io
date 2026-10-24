import data from './content/resume.json';
import { resumeSchema } from './content-schema.js';

const content = resumeSchema.parse(data);

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

export const experience: ExperienceItem[] = content.experience;

export interface EducationItem {
  school: string;
  degree: string;
  rank: string;
  note: string;
  courses: string[];
  year: string;
  cohort: string;
}

export const education: EducationItem = content.education;

export const advantages: string[] = content.advantages;

export const aboutParagraphs: string[] = content.aboutParagraphs;
