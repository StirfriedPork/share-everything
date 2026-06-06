# Share Everything · 微信分享闭环最小 Demo

轻量网页小工具「今日惊喜签」+ 分享能力验证。优先测试微信内置浏览器中的 `navigator.share` 可用性，不可用时降级为「复制链接 + 右上角转发引导」。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

## 构建

```bash
npm run build
npm run preview
```

## 部署到 Vercel

1. 将仓库推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目（Framework Preset: Vite）
3. 首次部署完成后，复制实际域名（如 `https://your-app.vercel.app`）
4. 更新 [`index.html`](index.html) 中以下 meta 的绝对 URL：
   - `og:image` → `https://your-app.vercel.app/og-image.png`
   - `og:url` → `https://your-app.vercel.app/`
5. 重新部署使 OG 元数据生效

> 微信分享卡片读取的是 **静态 HTML 中的 OG meta**，不是 React 运行时渲染结果。

## 功能说明

| 模块 | 作用 |
|------|------|
| `SurpriseDraw` | 一键抽签，生成惊喜结果 |
| `ShareButton` | 优先 `navigator.share`，失败则复制链接并展示微信引导 |
| `CapabilityProbe` | 折叠面板，展示 UA / share API / HTTPS 等探测结果 |
| `useShare` | 分享逻辑封装，预留后续 JS-SDK 扩展 |

## 微信真机实测清单

在真机微信中打开部署后的 HTTPS 链接，逐项记录：

- [ ] 页面能否正常打开（HTTPS）
- [ ] 右上角 `···` 菜单是否出现「发送给朋友」「分享到朋友圈」
- [ ] 分享卡片：标题、描述、缩略图是否正确（OG 生效）
- [ ] 点击页面「分享」按钮：`navigator.share` 是否存在
- [ ] 若不存在：复制链接降级是否成功、引导是否易懂
- [ ] 朋友 B 点开二次链接：工具是否可用、是否愿意再分享（主观）

### 实测记录模板

```
日期：
设备 / 微信版本：
部署 URL：

[ ] 页面打开
[ ] 右上角分享菜单
[ ] OG 标题正确：
[ ] OG 描述正确：
[ ] OG 缩略图正确：
[ ] navigator.share 存在：是 / 否
[ ] 降级复制链接：成功 / 失败
[ ] 引导易懂：是 / 否

备注：
```

## 预期结论（待实测验证）

- 微信内置浏览器（X5）大概率 **不支持** `navigator.share`
- 用户需通过右上角 `···` 菜单转发
- 链接卡片内容由 `index.html` 的 OG meta 决定
- Phase 2 可考虑微信 JS-SDK 定制分享文案（需公众号 + 签名后端）

## 项目结构

```
src/
├── components/
│   ├── SurpriseDraw.tsx
│   ├── ShareButton.tsx
│   └── CapabilityProbe.tsx
├── hooks/
│   └── useShare.ts
└── utils/
    └── env.ts
```
