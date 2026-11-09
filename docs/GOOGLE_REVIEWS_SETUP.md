# Google 官方評論元件設定

已完成聯絡頁的 Places UI Kit 串接。沒有設定 key 或 Place ID 時，不會載入 API、不會顯示空白評論框；原有「查看 Google 評價」連結仍可使用。

## 1. Google Cloud 設定（商家擁有人操作）

1. 在自己的 [Google Cloud Console](https://console.cloud.google.com/) 建立或選擇專案，連結計費帳戶。
2. 依 [Google 官方開始指南](https://developers.google.com/maps/documentation/javascript/places-ui-kit/get-started) 啟用 Places UI Kit 及 Maps JavaScript API，建立瀏覽器用 API key。
3. 對 key 設定「網站／HTTP referrer」限制：
   - `https://kitty840219-web.github.io/*`
4. 對 key 加上 API 限制，只允許本功能需要的 Maps JavaScript API 與 Places UI Kit。依官方控制台顯示的服務設定。
5. 在 Cloud 設定預算通知及可用的 API 配額，確認用量與計費；預算通知不等於自動停用。
6. 用 [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) 找出「艾飛樂數位文創個人工作室」的 Place ID。請核對商家名稱，不要將 Maps 短網址、數字 CID 或 FTID 當成 Place ID。

現有商家網址：https://maps.app.goo.gl/tKGDRbtRxcvTBvpU9?g_st=ic

## 2. GitHub 設定

開啟 repository → Settings → Secrets and variables → Actions。

- 在 **Secrets** 建立 `GOOGLE_MAPS_BROWSER_KEY`：填入已限制來源與 API 的瀏覽器 key。
- 在 **Variables** 建立 `GOOGLE_MAPS_PLACE_ID`：填入商家的 Place ID。

不需要把 key 貼在聊天或原始碼中。瀏覽器 key 會在建置時公開到前端，因此來源與 API 限制是必要設定；GitHub Secret 只避免 key 直接寫進 repository。

## 3. 發布與驗證

在 Actions 選擇「Deploy to GitHub Pages」→ Run workflow，選預設分支 `claude/esim-phone-network-idg4ui`。
等 lint、build、Pages 發布都成功。

進入聯絡頁並捲動至地圖下方，應出現「Google 顧客評論」區塊：
- 支援在區塊內捲動。
- 評分、評論與 Google 歸屬標示由官方元件呈現。
- 顯示的評論與筆數由 Google 提供，不保證等同 Google Maps App 所有評論。
- 點「在 Google 查看所有評論」可前往完整商家評論。
- 若載入失敗，保留 Google 連結供訪客閱讀。

## 實作位置

- `components/GoogleReviews.tsx`
- `components/GoogleReviews.module.css`
- `app/contact/page.tsx`
- `.github/workflows/deploy-pages.yml`

API 只在訪客捲動到評論區附近時載入。切換頁面會清理元件；不抓取、不快取或複製評論內容。
官方服務與計費未設定前，不能驗證真實評論載入。
