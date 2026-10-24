import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const strings = z.array(text);
const variant = z.enum(['primary', 'secondary', 'tertiary']);
const httpsUrl = z.string().url().refine(value => value.startsWith('https://'), '必须使用 HTTPS 地址');
const optionalUrl = httpsUrl.or(z.literal('')).optional();
const imagePath = z.string().refine(value => value === '' || /^\/(?!\/)/.test(value) || value.startsWith('https://'), '图片必须使用站内路径或 HTTPS 地址');

export const siteSchema = z.object({
  name: text, title: text, description: text, logo: text, author: text, nameEn: text,
  url: z.literal('https://tieamone.github.io'),
  email: z.string().email(), phone: z.string().default(''), phoneDisplay: z.string().default(''), phonePublic: z.boolean(),
  location: text, github: httpsUrl, blog: z.literal('/blog'), resume: z.literal('/resume'),
  avatar: imagePath, availability: text, seekingCities: strings,
  typingPhrases: strings.min(1), coreStack: strings.min(1),
  socialLinks: z.array(z.object({ label: text, href: httpsUrl })),
  heroDescription: text, contactDescription: text,
});

export const resumeSchema = z.object({
  experience: z.array(z.object({
    period: text, company: text, role: text, badge: text, points: strings.min(1),
  })),
  education: z.object({
    school: text, degree: text, rank: z.string().default(''), note: z.string().default(''),
    courses: strings, year: text, cohort: text,
  }),
  advantages: strings.min(1),
  aboutParagraphs: strings.min(1),
});

export const projectsSchema = z.object({
  projects: z.array(z.object({
    id: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, '项目标识使用小写字母、数字和连字符'),
    title: text, type: text, period: text, description: text,
    highlights: strings.default([]), stack: strings.min(1), github: optionalUrl,
    featured: z.boolean().optional(),
    stats: z.array(z.object({
      value: text, label: text, variant: z.enum(['accent', 'accent2', 'accent3']),
    })).optional(),
  })).refine(items => new Set(items.map(item => item.id)).size === items.length, '项目标识不能重复'),
});

export const skillsSchema = z.object({
  skillGroups: z.array(z.object({
    label: text, tags: z.array(z.object({ name: text, variant })).min(1),
  })).min(1),
});
