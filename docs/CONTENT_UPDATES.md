# 內容更新指南

## 文章、最新短片、最新MV

編輯 `lib/data/articles.ts` 的 `ARTICLES`。
分類順序由 `components/ArticleList.tsx` 管理：
全部文章、最新語錄、最新短片、最新MV、工具小幫手、服務資訊。
進入頁面預設顯示最新語錄。

每篇資料需包含：

- `id`：唯一英文代號，避免與現有文章重複。
- `title`：作品名稱；MV 不加「MV｜」「動畫 MV｜」前綴。
- `date`：完整 `YYYY-MM-DD`，依日期由新到舊排序。
- `tag`：分類名稱，須完全一致。
- `excerpt`：卡片摘要。
- `body`：內文段落陣列，保留作者文字及標籤。
- `link`：原貼文、影片或相關服務連結。

影片另加 `youtubeId`，只填影片 ID，勿填完整網址。
卡片自動顯示 YouTube 縮圖，點開後顯示直式播放器。
貼文縮圖使用 `image`；文章內主圖使用 `heroImage`；多圖使用 `galleryImages` 並註明版型。

### 日期規則

作者提供完整年份時依作者指定。只有月日時，先核對 YouTube 原片發布年份，無法查證時明確標記待確認，**不得自行套用當年**。
10/26、10/27 的兩支 MV 已依作者更正為 2025；語錄文章的 2026/10/26 是另一篇，不要一起改。

## 圖片

放在 `public/images/articles/`，用易識別的英文檔名，建議 WebP。
資料引用從 `/images/...` 開始，不要自行加 `/aifeiler-official`；元件透過 `asset()` 處理部署路徑。
人物設定圖等長圖可用 `galleryImages` 的 `portrait` 版型，保留完整內容。

## 共用連結與商家資訊

社群、LINE、Google 商家與評價入口集中在 `lib/data/site.ts` 的 `LINKS`。
Google 商家 ID、嵌入網址與評價網址也由同處管理；修改聯絡頁時引用共用設定，避免再次出現不同網址。

## 其他內容位置

| 內容 | 檔案 |
| --- | --- |
| 作品集閱讀器 | `components/CanvaPortfolioReader.tsx` |
| 作品集來源 | `lib/data/portfolio.ts` |
| 電子書頁碼與排除頁 | `lib/data/book.ts` |
| 聯絡頁 | `app/contact/page.tsx`、`contact.module.css` |
| 聯絡表單與 LINE 訊息 | `components/ContactInquiryForm.tsx` |
| 首頁封面 | `components/EntryGate.tsx` |
| 浮動社群列 | `components/FloatingSocialLinks.tsx` |
| 關於頁短劇輪播 | `components/ShortsCarousel.tsx` |
| 品牌時間軸 | `lib/data/site.ts` |

## 更新完成前

檢查分類、完整日期、圖片與影片 ID；手機確認欄位寬度、輪播與播放入口。
完成 production build；程式變更另執行 lint。
合併回預設分支，確認 GitHub Actions 與 Pages 發布成功，再提供正式網站連結。

## 電子書與品牌故事（2026-11-11）

兩本電子書共用 `components/FlipBookReader.tsx`：書頁與操作區分開，支援左右點按、觸控滑動、鍵盤左右鍵與放大閱讀。小說以單頁呈現145頁；作品集為使用者提供之公開 Canva 設計79頁的網站靜態閱讀版本，書頁位於 `public/images/portfolio-current/`，保留「另開原版」連結觀看原始影音。日後 Canva 更新需要重新匯入書頁，靜態版本不會自動同步。

品牌故事統一在 `/story/` 播放，六章文字依序淡入淡出，閱讀器進入畫面才開始，離開或切換分頁暫停；支援暫停、重播。偏好減少動態的使用者顯示完整六章置中內文。
