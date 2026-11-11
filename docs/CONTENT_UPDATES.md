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

## 作品集電子書（2026-11-11）

作品集統一位於 `/story/#story-portfolio`，使用 `components/CanvaPortfolioReader.tsx` 顯示使用者提供的 Canva 完整公開作品集（更新時為79頁）。獨立「數位作品集」分頁及選單入口已移除，舊 `/portfolio/` 網址僅保留相容轉址。

- `lib/data/portfolio.ts` 的 `PORTFOLIO_VIEW_URL` 是公開閱讀連結，`PORTFOLIO_EMBED_URL` 供網站內翻閱。
- 同一份 Canva 設計更新內容時，網站閱讀器會同步呈現；如果日後換成另一份設計，只需更新這個來源。
- 頁數及翻頁由 Canva 閱讀器提供，不再固定41頁；支援閱讀器內的全螢幕與外部放大閱讀。
- 歷史作品集圖片與PPT保留備份，目前閱讀器不再使用；另一冊《遺落在風中的信》維持原本內容。
- 作品集提供「橫向閱讀」：手機直向時會展開為橫向版面，手機已橫放時則直接填滿閱讀區域。使用同一個閱讀器切換，關閉及旋轉裝置後保留目前頁面。
