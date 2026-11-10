# 專案整理紀錄

## 本次整理

- PR #1 已合併：預設分支現在包含最新官網。
- Pages 僅接受預設分支的 push；舊官網開發分支不再自動覆蓋正式網站。
- 新增 README 與內容更新指南。
- Google 商家、評價與嵌入網址集中於 `lib/data/site.ts`。
- 保留歷史分支與電子書原始素材，以免破壞追溯或既有引用。

## 電子書重複圖片

以下檔案 blob 相同：
`book-003.webp`、`book-007.webp`、`book-008.webp`、`book-009.webp`、`book-150.webp`。

`lib/data/book.ts` 已排除原始第 3–9 頁，讀者仍會讀取第 150 頁。
這是原始素材與閱讀頁碼的對照，不可只因圖檔相同就刪掉仍被閱讀器使用的第 150 頁。
本次不刪圖、不改書籍頁碼；後續若要移除原始備份素材，需一併檢查動態引用與製作流程。

## 還原則

`gh-pages` 是產物，不是原始碼。不要在該分支手動維護內容。
Worker 獨立部署，不能以 Pages 發布成功推論 Worker 已同步更新。
既有分支保留原名；如日後重新命名預設分支，必須同步修改 workflow 的分支限制與這些文件。

## 2026-11-10 圖片與資料夾整理

- `assets/source-images/`：可重新輸出的 PNG/JPG 原始圖，依原分類保存，不部署到網站。
- `public/images/`：瀏覽器實際使用的 WebP 圖，按 `home`、`brand`、`contact`、`horoscope`、`services`、`articles`、`games`、`learning`、`quotes` 等功能分組。
- `public/images/articles/thumbnails/`：文章列表的 640px 預覽；文章詳情保留完整尺寸。
- `public/images/nav/`：128px 導覽圖示，適合目前 32–48px 的顯示尺寸。
- `docs/image-optimization-manifest.json`：來源圖、轉換大小與舊新路徑對照。
- `scripts/optimize-images.py`：重新產生 WebP 與文章預覽（Python + Pillow）。

引用路徑已同步更新；書籍頁碼、下載檔案及動態產生的電子書／作品集路徑保留。
GitHub Pages 是靜態匯出，`next/image` 的 `sizes` 不會自行產生縮圖；請先輸出適合尺寸的圖片再引用。
