import styles from "./Games.module.css";

const guides = {
  memory: {
    intro: "找出相同的小艾卡片，完成所有配對。",
    steps: [
      ["選擇難度", "輕鬆模式有 4 對卡片；挑戰模式有 6 對。按「開始翻牌」後開始計時。"],
      ["翻牌配對", "每次點開兩張卡片。相同的卡片會保留，不同的會自動蓋回；每翻兩張算一次翻牌。"],
      ["完成與獎勵", "全部配對就能過關。4 對獲得 8 點星光，6 對獲得 12 點星光；遊戲沒有時間限制。"],
      ["再玩一次", "可隨時重新洗牌，但未完成的回合不會獲得星光。六對模式會記錄最少翻牌次數。"],
    ],
  },
  stars: {
    intro: "在 30 秒內，陪小艾接住更多星星。",
    steps: [
      ["移動小艾", "手機在遊戲框內左右拖曳；電腦可移動滑鼠或使用鍵盤左右方向鍵。"],
      ["星星與烏雲", "接到一顆星星加 1 分；碰到烏雲扣一顆愛心。開始時有 3 顆愛心，漏接星星不會扣分。"],
      ["暫停與結束", "30 秒結束或愛心用完時結算。可按「暫停」休息；切換分頁或離開視窗也會自動暫停。按「結束這次挑戰」可提前結算。"],
      ["星光獎勵", "每接到 2 顆星星可獲得 1 點星光，不足 2 顆的部分不計。結算後保存最高分；重新開始會重設當局分數、時間與愛心。"],
    ],
  },
  garden: {
    intro: "每天留一點時間，把心情種成一朵花。",
    steps: [
      ["選擇心情", "從開心、平靜、疲憊、低落、期待中，選擇今天最接近自己的心情。"],
      ["挑選花種", "雛菊免費；鬱金香消耗 5 點星光；向日葵消耗 8 點星光。星光不足時，可以先種雛菊，或到另外兩款遊戲收集。"],
      ["種下與獎勵", "按「種下今天的心情」，每次成功種花另獲得 3 點星光。每天只能種一朵，以這台裝置的當地日期計算；重新整理不會重置當天次數。"],
      ["裝飾與回憶", "累積種花 3 次解鎖緞帶，7 次解鎖蝴蝶；解鎖後可自由切換。點花朵能查看當時的心情。"],
      ["花園紀錄", "保存最近 24 次心情，花圃展示最近 12 朵花。三款遊戲的星光共用，不需要登入。"],
    ],
  },
} as const;

export default function GameInstructions({ game }: { game: keyof typeof guides }) {
  const guide = guides[game];
  return <details open className={styles.instructions}>
    <summary>遊戲說明 <span>操作・規則・星光獎勵</span></summary>
    <div className={styles.instructionsBody}>
      <p className={styles.instructionsIntro}>{guide.intro}</p>
      <ol>{guide.steps.map(([title, text], index) => <li key={title}>
        <span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <div><h2>{title}</h2><p>{text}</p></div>
      </li>)}</ol>
      <p className={styles.instructionsSave}>星光與紀錄只保存在目前裝置的瀏覽器。清除瀏覽資料或換裝置不會保留；若無法儲存，頁面會顯示提示。可點上方「遊戲說明」收合內容。</p>
    </div>
  </details>;
}
