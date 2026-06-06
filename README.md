# Share Everything · Fortune Draw

轻量网页小工具「今日惊喜签」，支持 **中英文切换**，一键分享到 **X / Telegram / Reddit**。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

## 构建

```bash
$env:VITE_SITE_URL = "https://你的域名.com"
npm run build
npm run preview
```

## 部署

详见 [docs/DEPLOY_CHINA.md](docs/DEPLOY_CHINA.md)（国内）或 Vercel / GitHub Pages（海外预览）。

构建时通过 `VITE_SITE_URL` 注入 OG 分享链接，见 [.env.example](.env.example)。

## 功能

| 模块 | 作用 |
|------|------|
| `I18nProvider` | 中英文切换，偏好存入 localStorage |
| `SurpriseDraw` | 一键抽签，签文双语 |
| `SharePanel` | 分享到 X、Telegram、Reddit；移动端可用时显示系统分享 |
| `socialShare.ts` | 各平台 intent URL 构建 |

## 项目结构

```
src/
├── i18n/
│   ├── locales/       # zh / en 文案
│   ├── fortunes.ts    # 双语签文数据
│   └── I18nProvider.tsx
├── components/
│   ├── SurpriseDraw.tsx
│   ├── SharePanel.tsx
│   └── LanguageSwitcher.tsx
└── utils/
    └── socialShare.ts
```
