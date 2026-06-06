# Share Everything

轻量社交分享小工具合集，首个应用为 **好运签（Fortune Draw）**——一键抽签、生成分享文案与运势卡片图，方便转发到海外社交平台。

**在线预览**：[https://share-everything-omega.vercel.app/#fortune](https://share-everything-omega.vercel.app/#fortune)

## 特性

- **多应用架构**：左上角图标切换 mini-app；好运签已上线，每日一句、幸运数字待开发
- **中英文**：界面与签文双语，语言偏好自动保存
- **社交分享**：X、Telegram、Reddit、WhatsApp、Instagram、Facebook；移动端支持系统原生分享
- **运势分享图**：中吉 / 大吉签文自动生成 PNG 卡片（运势 emoji、等级、文案），底部含圆形二维码扫码进入站点
- **链接规范**：分享与扫码入口统一为 `?app=fortune` 形式，便于跨平台传播

## 技术栈

Vite 6 · React 19 · TypeScript

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

## 构建

生产环境需设置站点根 URL（用于 OG meta、分享链接与二维码）：

```bash
# PowerShell
$env:VITE_SITE_URL = "https://share-everything-omega.vercel.app"
npm run build
npm run preview
```

```bash
# Bash
VITE_SITE_URL=https://share-everything-omega.vercel.app npm run build
```

也可复制 [.env.example](.env.example) 为 `.env.production` 并修改 `VITE_SITE_URL`。Vercel 部署已内置 [`.env.production`](.env.production)。

## 部署

| 场景 | 说明 |
|------|------|
| 海外预览 | [Vercel](https://vercel.com) 关联本仓库，推送 `master` 自动部署 |
| 国内访问 | 见 [docs/DEPLOY_CHINA.md](docs/DEPLOY_CHINA.md)（腾讯云 COS、阿里云 OSS 等静态托管） |

构建时 `VITE_SITE_URL` 会注入 `index.html` 的 OG 标签（`og:image`、`og:url` 等）。

## 项目结构

```
src/
├── apps/
│   ├── FortuneApp.tsx      # 好运签（抽签 + 分享）
│   ├── PlaceholderApp.tsx  # 待上线应用占位
│   ├── registry.ts         # 应用注册表
│   └── types.ts
├── components/
│   ├── AppSwitcher.tsx     # 左上角应用切换
│   ├── SurpriseDraw.tsx    # 一键抽签
│   ├── SharePanel.tsx      # 分享面板
│   └── LanguageSwitcher.tsx
├── hooks/
│   └── useActiveApp.ts     # 应用路由（?app= / #hash）
├── i18n/
│   ├── locales/            # zh / en 文案
│   ├── fortunes.ts         # 双语签文（大吉 / 中吉 / 平签）
│   └── I18nProvider.tsx
└── utils/
    ├── shareContent.ts     # 分享文案组装
    ├── socialShare.ts      # 各平台分享逻辑
    ├── fortuneCardImage.ts # 运势卡片 PNG 生成
    ├── circularQrCode.ts   # 圆形二维码（预留）
    └── siteUrl.ts          # 规范站点 URL
```

## 扩展新应用

1. 在 `src/apps/types.ts` 增加 `AppId`
2. 在 `src/apps/registry.ts` 注册应用并设置 `available: true`
3. 实现对应 App 组件，在 `App.tsx` 中挂载
4. 在 `src/i18n/locales/` 补充 `nav.apps` 文案

## 分享图二维码（可选）

运势卡片底部二维码由 `src/utils/fortuneCardImage.ts` 中的 `SHOW_SHARE_QR` 控制，当前已启用。需要临时关闭时改为 `false` 并重新构建部署。

## License

Private — 见仓库设置。
