const string = (name, label, extra = {}) => ({ name, label, widget: 'string', ...extra });
const text = (name, label, extra = {}) => ({ name, label, widget: 'text', ...extra });
const list = (name, label, widget = 'string', extra = {}) => ({
  name, label, widget: 'list', field: { name: 'value', label: '内容', widget }, ...extra,
});
const object = (name, label, fields, extra = {}) => ({ name, label, widget: 'object', fields, ...extra });
const records = (name, label, fields, extra = {}) => ({ name, label, widget: 'list', fields, ...extra });
const select = (name, label, options, extra = {}) => ({ name, label, widget: 'select', options, ...extra });
const bool = (name, label, extra = {}) => ({ name, label, widget: 'boolean', ...extra });
const httpsPattern = ['^https://', '请填写 HTTPS 地址'];
const palette = ['primary', 'secondary', 'tertiary'];

export function createConfig(baseUrl, demo = false) {
  return {
    load_config_file: false,
    backend: demo ? { name: 'test-repo' } : {
      name: 'github', repo: 'Tieamone/tieamone.github.io', branch: 'main',
      base_url: baseUrl, auth_endpoint: 'auth', site_domain: 'tieamone.github.io',
    },
    locale: 'zh_Hans',
    site_url: 'https://tieamone.github.io',
    display_url: 'https://tieamone.github.io',
    media_folder: 'public/uploads',
    public_folder: '/uploads',
    slug: { encoding: 'ascii', clean_accents: true, sanitize_replacement: '-' },
    collections: [
      {
        name: 'blog', label: '博客与论文', label_singular: '文章', folder: 'src/content/blog',
        create: true, extension: 'md', format: 'frontmatter',
        slug: '{{fields.slug}}', identifier_field: 'title', preview_path: 'blog/{{slug}}',
        summary: '{{title}} · {{publishedAt}}',
        sortable_fields: ['title', 'publishedAt'],
        fields: [
          string('title', '标题'),
          string('slug', '文章地址', { required: false, hint: '新文章必填，如 mysql-data-cleaning；发布后保持不变。旧文章可留空。',
            pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', '使用小写字母、数字和连字符'] }),
          text('description', '摘要'),
          { name: 'publishedAt', label: '发布日期', widget: 'datetime', format: 'YYYY-MM-DD', date_format: 'YYYY-MM-DD', time_format: false },
          { name: 'updatedAt', label: '更新日期', widget: 'datetime', format: 'YYYY-MM-DD', date_format: 'YYYY-MM-DD', time_format: false, required: false },
          list('tags', '标签', 'string', { required: false, default: [] }),
          bool('draft', '暂不在网站展示', { default: true, hint: '关闭后才会出现在网站。公开仓库内的草稿源文件仍可被查看。' }),
          { name: 'cover', label: '封面图', widget: 'image', required: false },
          { name: 'paper', label: '论文 PDF', widget: 'file', required: false,
            hint: '上传不超过 10 MB 的 PDF。发布后提供阅读和下载入口。',
            choose_url: false,
            media_library: { config: { max_file_size: 10485760 } } },
          { name: 'body', label: '正文', widget: 'richtext', required: false,
            hint: '可直接撰写或粘贴正文，也可以只填写摘要并上传论文 PDF。', sanitize_preview: true },
        ],
      },
      {
        name: 'settings', label: '网站资料', editor: { preview: false },
        files: [
          {
            name: 'site', label: '个人信息与首页', file: 'src/data/content/site.json',
            fields: [
              string('name', '首页姓名'), string('author', '署名'), string('nameEn', '英文名'),
              string('title', '网站标题'), text('description', '网站简介'),
              string('logo', '导航标识'), string('availability', '当前状态'),
              text('heroDescription', '首页介绍'), text('contactDescription', '联系区域介绍'),
              string('email', '邮箱'), string('location', '所在地'),
              string('phone', '电话链接值', { required: false }), string('phoneDisplay', '电话显示文本', { required: false }),
              bool('phonePublic', '在页面显示电话', { default: false, hint: '只控制页面展示，公开仓库不适合存放私密联系方式。' }),
              string('github', 'GitHub 地址', { pattern: httpsPattern }),
              list('seekingCities', '期望城市'), list('typingPhrases', '首页轮播职业', 'string', { min: 1 }),
              list('coreStack', '首页技术标签', 'string', { min: 1 }),
              records('socialLinks', '社交链接', [string('label', '名称'), string('href', '地址', { pattern: httpsPattern })]),
              { name: 'avatar', label: '头像路径（预留）', widget: 'hidden', default: '' },
              { name: 'url', widget: 'hidden', default: 'https://tieamone.github.io' },
              { name: 'blog', widget: 'hidden', default: '/blog' },
              { name: 'resume', widget: 'hidden', default: '/resume' },
            ],
          },
          {
            name: 'resume', label: '简历与个人介绍', file: 'src/data/content/resume.json',
            fields: [
              list('aboutParagraphs', '个人介绍段落', 'text', { min: 1 }),
              list('advantages', '核心优势', 'text', { min: 1 }),
              records('experience', '工作经历（最新的放前面）', [
                string('period', '任职时间'), string('company', '公司'), string('role', '岗位'),
                string('badge', '标签'), list('points', '职责与成果', 'text', { min: 1 }),
              ], { summary: '{{fields.company}} · {{fields.role}}' }),
              object('education', '教育经历', [
                string('school', '学校'), string('degree', '专业与学历'), string('year', '就读时间'),
                string('cohort', '毕业届别'), string('rank', '排名', { required: false }),
                text('note', '补充说明', { required: false }), list('courses', '课程'),
              ]),
            ],
          },
          {
            name: 'projects', label: '项目经历', file: 'src/data/content/projects.json',
            fields: [records('projects', '项目', [
              string('id', '项目标识', { pattern: ['^[a-z0-9]+(?:-[a-z0-9]+)*$', '使用小写字母、数字和连字符，且不能重复'] }),
              string('title', '项目名称'), string('type', '项目类型'), string('period', '项目时间'),
              text('description', '项目简介'), list('highlights', '技术成果', 'text', { required: false, default: [] }),
              list('stack', '技术栈', 'string', { min: 1 }),
              string('github', '项目链接', { required: false, pattern: httpsPattern }),
              bool('featured', '首页优先展示', { default: false, required: false }),
              records('stats', '成果数字', [
                string('value', '数值'), string('label', '说明'),
                select('variant', '颜色', ['accent', 'accent2', 'accent3'], { default: 'accent' }),
              ], { required: false }),
            ], { summary: '{{fields.title}}' })],
          },
          {
            name: 'skills', label: '技能标签', file: 'src/data/content/skills.json',
            fields: [records('skillGroups', '技能分组', [
              string('label', '分组名称'),
              records('tags', '标签', [
                string('name', '技能名称'),
                select('variant', '颜色', palette, { default: 'primary' }),
              ], { min: 1 }),
            ], { min: 1 })],
          },
        ],
      },
    ],
  };
}
