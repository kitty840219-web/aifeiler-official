# 艾飛樂官方網站

艾飛樂語錄｜艾飛樂數位文創個人工作室。使用 Next.js、React、TypeScript 與 Tailwind CSS，靜態網站部署至 GitHub Pages。

- [正式網站](https://kitty840219-web.github.io/aifeiler-official/)
- [最新文章、短片與 MV](https://kitty840219-web.github.io/aifeiler-official/works/)
- [內容更新指南](docs/CONTENT_UPDATES.md)
- [專案結構與整理紀錄](docs/REPOSITORY.md)

## 使用哪個分支？

**正式來源是 GitHub 預設分支：`claude/esim-phone-network-idg4ui`。**
名稱是專案早期留下的，但 PR #1 合併後，內容已是最新艾飛樂官網，不是 eSIM 展示網站。

- 後續修改請從預設分支建立工作分支，透過 PR 合併回預設分支。
- `claude/illustration-portfolio-website-uvlcuq`：本次整理前的官網開發歷史，已合併；後續不再從此分支部署。
- `claude/tarot-divination-page-fh5j4k`：歷史功能分支，未確認前不要直接覆蓋正式版本。
- `gh-pages`：自動產生的網站成品，請勿手動編輯。

## 資料夾

| 路徑 | 用途 |
| --- | --- |
| `app/` | 網頁路由、版型與頁面樣式 |
| `components/` | 表單、閱讀器、輪播及導覽元件 |
| `lib/data/` | 文章、品牌資訊、報價、作品資料 |
| `lib/tarot/`、`lib/horoscope/`、`lib/accounting/` | 各工具的資料、計算與 API 呼叫 |
| `public/images/` | 網頁圖片與電子書原始頁面 |
| `public/downloads/` | 可下載的作品集 |
| `cloudflare-worker/` | Gemini 代理 API，需另外部署 |
| `scripts/` | 作品集等素材製作腳本 |
| `docs/` | 維護與內容更新說明 |
| `.github/workflows/` | GitHub Pages 建置與發布 |

## 本機開發

使用 Node.js 20（與目前 CI 相同）。

```sh
npm ci
npm run dev
```

正式 Pages 建置：

```sh
GITHUB_PAGES=true npm run build
npm run lint
```

網站靜態匯出至 `out/`。部署路徑與資源前綴由 `next.config.js`、`lib/basePath.ts` 管理。
開發 Next.js 前請閱讀 `AGENTS.md` 指定的已安裝版本文件。

## 發布

合併至預設分支後，`Deploy to GitHub Pages` 自動建置並更新 `gh-pages`。
接著 GitHub Pages 的 `pages build and deployment` 發布正式網站。
兩個流程都成功才算上線；Pages 快取可能需要重新整理。

Cloudflare Worker 不會隨靜態網站自動發布。其 API 金鑰應放在 Worker secrets，不可提交至 GitHub。
