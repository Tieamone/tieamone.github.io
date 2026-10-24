import data from './content/skills.json';
import { skillsSchema } from './content-schema.js';

const content = skillsSchema.parse(data);

/**
 * 技能数据 —— 首页、关于页与简历页共用。
 */

export type SkillVariant = 'primary' | 'secondary' | 'tertiary';

export interface SkillGroup {
  label: string;
  tags: { name: string; variant: SkillVariant }[];
}

export const skillGroups: SkillGroup[] = content.skillGroups;
