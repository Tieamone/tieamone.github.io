# 网站后台实施与启用计划

此方案保留现有 Astro + GitHub Pages 网站，通过 Decap CMS 编辑仓库内容。Cloudflare Worker 只负责 GitHub 登录交换，不需要购买云服务器、数据库或域名。后台地址：https://tieamone.github.io/admin/ 。认证服务尚未配置时，后台只显示启用说明，不开放登录。

## 1. 功能与流程

| 功能 | 实现 | 验收方式 |
| --- | --- | --- |
| 修改个人信息 | 表单编辑 JSON：姓名、简介、联系方式、求职状态等 | 保存后首页和联系区域同步更新 |
| 修改简历、项目与技能 | 表单编辑工作经历、教育、项目列表和技术标签 | 构建成功后对应页面更新 |
| 撰写博客 | 富文本正文、摘要、标签、日期、封面 | 新文章可浏览，旧文章可编辑 |
| 上传论文 | 上传 PDF，在文章中展示阅读和下载入口 | 链接打开正确文件 |
| 上传图片 | 存入 public/uploads，正文插入图片 | 文章中正常显示 |
| 认证 | GitHub OAuth + Cloudflare Worker | 只允许 Tieamone 且具有目标仓库写权限 |
| 自动发布 | 保存到 main，触发既有 GitHub Actions | 测试和构建通过后 GitHub Pages 更新 |

访问后台 → GitHub 登录 → Worker 检查账号与仓库权限 → 进入编辑器 → 保存文件到 GitHub → 自动测试和构建 → 网站更新。

后台修改的是内容，不是任意拖拽页面布局。论文可写为网页正文，也可上传 PDF；复杂公式、排版建议保留在 PDF 中。此版本不提供 Word 自动转换、在线多人协作或访客注册。

## 2. 分阶段实施

1. **发布现有网站**：提交已确认的简历和页面内容，访问线上首页与简历核对。
2. **分离内容和页面**：把已有资料移至 src/data/content/*.json，保持既有页面布局；在构建时验证字段与链接。
3. **接入编辑器**：固定 Decap 版本，配置博客、PDF、图片和四类资料表单；本地演示只允许 localhost，不写远程仓库。
4. **认证服务**：准备 auth/worker.js。使用短时登录状态、PKCE、HttpOnly Cookie、严格来源校验；密钥只存 Cloudflare。
5. **你的一次性配置**：注册 Cloudflare，创建 Worker 和 GitHub OAuth App，设置下表中的变量和密钥，填写公开 Worker 地址。
6. **真实联调验收**：使用你自己的账号登录，修改一处资料，发布一篇临时文章并上传 PDF/图片，确认线上更新，再清理临时内容。此阶段必须在第 5 步完成后进行，不能用模拟测试代替。

## 3. 从零注册 Cloudflare

1. 打开 https://dash.cloudflare.com/sign-up ，用自己的邮箱注册并完成邮件验证。
2. 进入控制台，选择 Workers & Pages（可能位于 Compute & AI 分类），不需要添加网站或购买域名。
3. 保持 Workers Free 计划。若看到付费升级，先不要开通；本方案不依赖付费产品。
4. 选择 Create application → Create Worker / Start with Hello World，名称可填 tieamone-cms-auth。按提示设置 workers.dev 子域并部署。
5. 进入 Worker 的 Edit code，把项目 auth/worker.js 的完整内容粘贴替换默认代码，再 Deploy。使用模块 Worker，不要改成旧式 addEventListener 语法。
6. 在 Settings / Domains & Routes 中记下正式地址，例如 https://tieamone-cms-auth.你的子域.workers.dev 。使用正式 workers.dev 地址，不是预览地址。此时 /health 返回未配置提示是预期情况。

你可以把这个公开地址发给我继续配置；密码和 Client Secret 不需要发给我。

## 4. 创建 GitHub OAuth App

用拥有该仓库的 Tieamone 账号打开 https://github.com/settings/applications/new ：

| 字段 | 填写 |
| --- | --- |
| Application name | Tieamone Blog Admin |
| Homepage URL | https://tieamone.github.io |
| Authorization callback URL | 你的正式 Worker 地址 + /callback |
| Enable Device Flow | 不勾选 |

注册后记下 Client ID，生成 Client Secret。回调地址必须与实际 Worker 地址完全对应。Client Secret 直接填写到 Cloudflare，不能写进仓库、前端或聊天。

## 5. 配置 Worker 变量

在 Worker → Settings → Variables and Secrets 添加以下配置，保存并部署：

| 名称 | 类型 | 值 |
| --- | --- | --- |
| SITE_ORIGIN | Text | https://tieamone.github.io |
| ALLOWED_GITHUB_USER | Text | Tieamone |
| GITHUB_REPO | Text | Tieamone/tieamone.github.io |
| GITHUB_CLIENT_ID | Text 或 Secret | OAuth App 的 Client ID |
| GITHUB_CLIENT_SECRET | Secret | OAuth App 的 Client Secret |

SITE_ORIGIN 不要带末尾斜线。代码不需要 KV、D1、R2 等存储。不要给认证 Worker 添加会阻断回调的 Access 登录层。无需设置 CORS 通配符：登录使用弹窗和限制来源的 postMessage。

访问 Worker 地址 + /health，应显示 ok。这只说明配置项齐全，不代表 Client Secret 已验证；真实登录才会检验它。

在 GitHub 网页编辑 public/admin/auth.json，将 base_url 从空字符串改为正式 Worker 的 HTTPS 根地址，不加 /auth 或 /callback，然后提交 main。这个地址是公开配置，不是密钥。也可以把公开地址发给我完成这一处修改。

## 6. 登录与日常使用

1. 打开 https://tieamone.github.io/admin/ ，点击打开编辑器并登录 GitHub，允许登录弹窗。
2. 使用 Tieamone 授权；其他账号会被 Worker 拒绝。
3. 网站资料中选择要改的页面内容，保存发布。不要同时在两个浏览器窗口编辑同一个文件。
4. 新建文章时填写标题、摘要、日期和唯一英文文章地址，例如 mysql-data-cleaning；发布后保持地址不变。既有文章未填写该字段时仍保持原文件地址。
5. 正文支持富文本编辑和内容预览，预览不完全等同于网站最终主题。可选择封面、插入图片或选择论文 PDF；PDF 单文件限制 10 MB。图片也建议压缩后上传。
6. 默认“暂不在网站展示”为开启。准备好后关闭此开关，再保存发布，文章才会进入正式网站、列表和 RSS。
7. 查看 https://github.com/Tieamone/tieamone.github.io/actions ，等待最新部署成功，再刷新网站。保存成功仅代表仓库已写入，构建期间仍会看到旧版。

**公开范围**：这是公开仓库。草稿开关只控制网站是否展示，草稿源文件和上传文件仍然公开可读。不要上传公司内部日志、合同、未公开论文或带密钥的数据。删除文件也不会自动清除 Git 历史。

**授权范围**：GitHub OAuth 的 public_repo 权限覆盖授权账号可访问的公开仓库，不是单仓库细粒度权限。本站编辑器配置只操作这个仓库，Worker 也校验目标仓库权限；这不能缩小令牌本身的 OAuth 权限。仅在可信设备使用后台，用完退出。可在 GitHub Settings → Applications → Authorized OAuth Apps 撤销授权。

## 7. 验收与故障处理

- 自动检查：npm test 验证认证拒绝路径、PKCE、令牌返回来源和内容字段；npm run build 验证站点可生成。GitHub 发布前也运行这些检查。
- 实际浏览器：已验证未配置时不可登录、本地演示编辑器加载、资料保存、富文本保存、新文章地址必填，以及 PDF 上传、选择和保存。模拟后端不会写入 GitHub。
- 构建集成检查：已验证论文链接生成、草稿不进入文章路由/列表/RSS/站点地图；检查后已删除临时内容并重新构建。
- 真实服务验收（账号配置后）：所有者登录成功、非所有者无法登录；资料修改成功；新文章与 PDF/图片上线；草稿不进入网站；退出可重新登录。
- 登录失败：检查正式 Worker 地址、回调 URL、变量名、Client Secret 和账号；重新打开后台，避免使用过期弹窗。
- 编辑器一直加载：检查当前网络能否访问 unpkg.com、GitHub 和 workers.dev。国内不同网络的可达性需要实际验证，免费托管不等于任意网络均可访问。
- 保存成功但网页不变：检查 Actions 最新运行。构建失败时上一版网站仍在；修正内容后再次保存。不要通过重置整个仓库解决单条内容错误。
- 误改内容：在 GitHub 查看对应文件历史并还原内容，再提交触发构建。
- 误泄露 Client Secret：立即在 GitHub 撤销/重建 Secret，同步更新 Cloudflare；不能仅删除仓库中的文件。

## 8. 成本与可行性依据

保留 GitHub Pages 静态托管，编辑器为开源 Decap，Worker 只承担低频登录。Cloudflare Workers Free 当前为每日 100,000 请求、每次 10 ms CPU（以官方最新说明为准）；个人登录用量通常远低于请求额度。未购买服务器，不代表无限资源：文件、构建频率、免费额度及网络可达性仍受平台限制。注册时无需为了本方案主动升级付费计划。

已核对的官方资料：

- [Decap GitHub 后端](https://decapcms.org/docs/github-backend/)
- [Decap OAuth Proxy 架构](https://decapcms.org/docs/backends-overview/)
- [富文本组件](https://decapcms.org/docs/widgets/richtext/)
- [文件上传组件](https://decapcms.org/docs/widgets/file/)
- [GitHub OAuth 与 PKCE](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Cloudflare 控制台创建 Worker](https://developers.cloudflare.com/workers/get-started/dashboard/)
- [Cloudflare Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare Workers 定价与免费额度](https://developers.cloudflare.com/workers/platform/pricing/)

上线前必须完成真实账号联调。本说明与代码提供可执行路径，不将尚未完成的云端授权标记为已验收。
