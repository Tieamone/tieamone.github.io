/**
 * 技能数据 —— 从 legacy-index.html 提取，事实内容未做任何改动。
 */

export type SkillVariant = 'primary' | 'secondary' | 'tertiary';

export interface SkillGroup {
  label: string;
  tags: { name: string; variant: SkillVariant }[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: '// 后端 · Backend',
    tags: [
      { name: 'Java', variant: 'primary' },
      { name: 'Spring Boot', variant: 'primary' },
      { name: 'Spring Data JPA', variant: 'primary' },
      { name: 'PHP', variant: 'primary' },
      { name: 'MySQL', variant: 'primary' },
      { name: 'H2', variant: 'primary' },
      { name: 'WebSocket', variant: 'primary' },
      { name: 'RESTful API', variant: 'primary' },
      { name: 'RBAC', variant: 'primary' },
    ],
  },
  {
    label: '// 移动端 · Android',
    tags: [
      { name: 'Android Native', variant: 'secondary' },
      { name: 'Kotlin', variant: 'secondary' },
      { name: 'Android Studio', variant: 'secondary' },
      { name: 'Retrofit2', variant: 'secondary' },
      { name: 'Material Design 3', variant: 'secondary' },
      { name: 'Glide', variant: 'secondary' },
    ],
  },
  {
    label: '// 前端 · Frontend',
    tags: [
      { name: 'Vue 3', variant: 'tertiary' },
      { name: 'TypeScript', variant: 'tertiary' },
      { name: 'Element Plus', variant: 'tertiary' },
      { name: 'Pinia', variant: 'tertiary' },
      { name: 'Vite', variant: 'tertiary' },
      { name: 'HTML/CSS', variant: 'tertiary' },
      { name: 'JavaScript', variant: 'tertiary' },
      { name: '微信小程序', variant: 'tertiary' },
    ],
  },
  {
    label: '// 工具链 · Tooling',
    tags: [
      { name: 'Git / GitLab', variant: 'primary' },
      { name: 'Gradle', variant: 'primary' },
      { name: 'Python', variant: 'secondary' },
      { name: '爬虫 / 大数据分析', variant: 'secondary' },
      { name: 'Docker (基础)', variant: 'tertiary' },
    ],
  },
];
