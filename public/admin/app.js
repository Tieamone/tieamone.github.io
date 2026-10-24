import { createConfig } from './config.js';

const status = document.querySelector('#status');
const login = document.querySelector('#login');
const hint = document.querySelector('#hint');
const demo = ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).get('demo') === '1';
let baseUrl = '';

try {
  const response = await fetch('./auth.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('无法读取登录配置，请刷新重试。');
  const settings = await response.json();
  if (settings.base_url) {
    const url = new URL(settings.base_url);
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      throw new Error('登录服务地址配置无效，请检查首次启用说明。');
    }
    baseUrl = url.origin;
  }
  if (demo || baseUrl) {
    status.textContent = demo ? '本地演示模式：用于体验编辑界面，修改不会发布到网站。' : '使用仓库所有者的 GitHub 账号进入内容后台。';
    login.textContent = demo ? '打开演示编辑器' : '打开编辑器并登录 GitHub';
    login.hidden = false;
    hint.textContent = '保存并发布后，网站会自动构建更新。图片和 PDF 会上传到公开仓库。';
  } else {
    status.textContent = '内容后台已安装，登录服务尚未启用。';
    hint.textContent = '站点所有者完成一次账号授权配置后，即可在这里编辑和发布内容。';
    document.querySelector('#guide').hidden = false;
  }
} catch (error) {
  status.textContent = error.message;
}

login.addEventListener('click', async () => {
  login.disabled = true;
  status.textContent = '正在加载编辑器…';
  try {
    window.CMS_MANUAL_INIT = true;
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/decap-cms@3.17.1/dist/decap-cms.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('编辑器加载失败，请检查网络后刷新重试。'));
      document.head.append(script);
    });
    window.CMS.init({ config: createConfig(baseUrl, demo) });
    window.CMS.registerEventListener({
      name: 'preSave',
      handler: ({ entry }) => {
        const paper = entry.getIn(['data', 'paper']);
        if (paper && !/^\/uploads\/[^?#]+\.pdf$/i.test(paper)) {
          throw new Error('论文附件请选择上传到本站的 PDF 文件。');
        }
        if (entry.get('collection') === 'blog' && entry.get('newRecord') && !entry.getIn(['data', 'slug'])) {
          throw new Error('请填写文章地址，例如 mysql-data-cleaning。');
        }
        return entry.get('data');
      },
    });
    document.querySelector('#welcome').hidden = true;
    document.body.classList.add('cms-open');
    document.querySelector('#notice').hidden = false;
    if (demo) document.querySelector('#notice-text').textContent = '本地演示：修改只用于界面体验，不会提交到 GitHub，刷新后可能丢失。';
  } catch (error) {
    status.textContent = error.message;
    login.disabled = false;
  }
});
