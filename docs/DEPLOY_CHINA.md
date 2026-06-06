# 国内部署指南

## 为什么 Vercel 国内打不开？

| 原因 | 说明 |
|------|------|
| 域名被干扰 | `*.vercel.app` 在国内网络环境下经常无法访问或极慢，需 VPN |
| 节点在海外 | Vercel CDN 无中国大陆节点，微信内打开链接体验差 |
| 自定义域名无效 | 即使绑定自己的域名，流量仍走 Vercel 海外节点，**不能**解决国内访问问题 |

本项目的目标用户在微信内打开链接，**必须使用国内可访问的 HTTPS 托管**。

## 推荐方案（按上手难度）

### 方案 A：腾讯云 COS 静态网站 + CDN（推荐）

适合：已有/愿意注册腾讯云账号，需要稳定国内访问。

1. 创建 COS 存储桶，开启「静态网站」
2. 存储桶配置 → 静态网站 → 索引文档 `index.html`，错误文档 `index.html`（SPA 回退）
3. 开启 CDN 加速，绑定已备案的自定义域名（微信分享建议用备案域名）
4. 本地构建并上传：

```bash
# 设置你的线上域名（用于 OG 分享卡片）
# PowerShell:
$env:VITE_SITE_URL = "https://your-domain.com"

npm run build
```

5. 将 `dist/` 目录下所有文件上传到 COS 根目录
6. 通过 CDN 域名访问，在微信内实测

> COS 控制台支持拖拽上传；也可用 [coscmd](https://cloud.tencent.com/document/product/436/10976) 自动化。

### 方案 B：阿里云 OSS 静态网站

步骤与 COS 类似：创建 Bucket → 静态页面托管 → 开启 CDN → 上传 `dist/`。

```bash
$env:VITE_SITE_URL = "https://your-domain.com"
npm run build
ossutil cp -r dist/ oss://your-bucket/ --update
```

### 方案 C：腾讯云 CloudBase 云开发静态托管

适合：想要类似 Vercel 的「连 Git 自动部署」，且面向国内用户。

1. 打开 [云开发控制台](https://console.cloud.tencent.com/tcb)
2. 创建环境 → 静态网站托管 → 开通
3. 安装 CLI：`npm i -g @cloudbase/cli`
4. 登录并部署：

```bash
$env:VITE_SITE_URL = "https://your-env.tcloudbaseapp.com"
npm run build
tcb hosting deploy dist -e your-env-id
```

### 方案 D：自有服务器 / 轻量应用服务器

```bash
$env:VITE_SITE_URL = "https://your-domain.com"
npm run build
# 将 dist/ 内容放到 Nginx 站点目录
```

Nginx SPA 回退配置：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 构建时配置站点 URL

OG 分享卡片（标题/缩略图）依赖构建时注入的绝对 URL：

```bash
# 部署前设置（PowerShell）
$env:VITE_SITE_URL = "https://你的域名.com"
npm run build
```

或在项目根目录创建 `.env.production`：

```
VITE_SITE_URL=https://你的域名.com
```

构建后检查 `dist/index.html` 中 `og:image` 和 `og:url` 是否为你的域名。

## 微信实测注意

- 链接必须是 **HTTPS**
- 自定义域名建议 **ICP 备案**（未备案域名在微信内可能被拦截或提示风险）
- 部署完成后更新 [WECHAT_TEST.md](../WECHAT_TEST.md) 中的实测记录
- 国内部署后无需 VPN 即可在微信内打开

## 双轨部署（可选）

| 用途 | 平台 |
|------|------|
| 海外 / 开发预览 | Vercel |
| 国内 / 微信传播 | COS / OSS / CloudBase |

两套环境分别设置 `VITE_SITE_URL` 后构建部署。
