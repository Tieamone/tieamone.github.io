import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { siteSchema, resumeSchema, projectsSchema, skillsSchema } from '../src/data/content-schema.js';
import { createConfig } from '../public/admin/config.js';

const files = { site: siteSchema, resume: resumeSchema, projects: projectsSchema, skills: skillsSchema };
for (const [name, schema] of Object.entries(files)) {
  test(name + ': content validates and all stored keys have CMS fields', async () => {
    const data = JSON.parse(await fs.readFile(new URL('../src/data/content/' + name + '.json', import.meta.url), 'utf8'));
    schema.parse(data);
    const fields = createConfig('https://auth.example').collections.find(item => item.name === 'settings').files.find(item => item.name === name).fields;
    function check(value, fields, path = '') {
      for (const [key, child] of Object.entries(value)) {
        const field = fields.find(item => item.name === key);
        assert.ok(field, 'missing field: ' + path + key);
        if (field.widget === 'object') check(child, field.fields, path + key + '.');
        if (field.widget === 'list' && field.fields) child.forEach(item => check(item, field.fields, path + key + '[].'));
      }
    }
    check(data, fields);
  });
}
test('project links reject executable URLs and project IDs cannot collide', () => {
  const project = { id: 'demo', title: 'Demo', type: 'Project', period: '2026', description: 'Demo', highlights: [], stack: ['Java'] };
  assert.equal(projectsSchema.safeParse({ projects: [{ ...project, github: 'javascript:alert(1)' }] }).success, false);
  assert.equal(projectsSchema.safeParse({ projects: [project, project] }).success, false);
});
test('production config uses GitHub; test backend is only explicitly selected', () => {
  assert.equal(createConfig('https://auth.example').backend.name, 'github');
  assert.equal(createConfig('', true).backend.name, 'test-repo');
  const fields = createConfig('https://auth.example').collections[0].fields;
  assert.equal(fields.find(field => field.name === 'draft').default, true);
  assert.equal(fields.find(field => field.name === 'body').sanitize_preview, true);
});
