import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
const domains = [
  ['quotes', /(?:components|lib)\/quotes\/|app\/daily-quote\//, '每日一句', '/shop/'],
  ['learning', /(?:components|lib)\/learning\/|app\/learn\//, '語言學習館', '/learn/'],
  ['games', /(?:components|lib)\/games\/|app\/games\//, '星光遊樂園', '/games/'],
  ['accounting', /(?:components|lib)\/accounting\/|app\/accounting\//, '會計小幫手', '/accounting/'],
  ['tarot', /(?:components|lib)\/tarot\/|app\/tarot\//, '塔羅占卜', '/tarot/'],
  ['horoscope', /(?:components|lib)\/horoscope\/|app\/horoscope\//, '星座運勢', '/horoscope/'],
  ['pricing', /app\/pricing\/|components\/.*(?:Pricing|QuoteCalculator)/, '服務報價與試算', '/pricing/'],
  ['readers', /app\/(?:portfolio|videos)\/|components\/.*(?:Reader|Portfolio)/, '作品集與閱讀功能', '/portfolio/'],
  ['contact', /app\/(?:contact|line-guide)\/|components\/.*(?:Contact|LineGuide)/, '聯絡與 LINE 使用功能', '/contact/'],
  ['story', /app\/(?:story|about)\/|components\/(?:About|HomePageContent)/, '品牌故事與創作介紹', '/story/'],
  ['shop', /app\/(?:shop|phone-cases)\/|components\/phonecases\//, '周邊商店與商品瀏覽', '/shop/'],
  ['articles', /app\/works\/|components\/ArticleList/, '最新文章瀏覽', '/works/'],
  ['images', /public\/images\/(?!articles\/)|scripts\/optimize-images/, '圖片載入與顯示', '/works/'],
  ['navigation', /components\/(?:Navbar|BottomNav|EntryGate|FloatingSocialLinks)|lib\/data\/site\.ts/, '首頁與網站導覽', '/'],
  ['platform', /cloudflare-worker\/|\.github\/workflows\/|next\.config|package(?:-lock)?\.json/, '網站系統與發布流程', '/works/'],
];

export function taipeiDate(value) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value));
}
export function oneYearBefore(today) {
  const [year, month, day] = today.split('-').map(Number);
  const lastDay = new Date(Date.UTC(year - 1, month, 0)).getUTCDate();
  return `${year - 1}-${String(month).padStart(2, '0')}-${String(Math.min(day, lastDay)).padStart(2, '0')}`;
}
export function parseHistory(log) {
  return log.split('\x1e').filter(Boolean).map(record => {
    const [header, ...files] = record.trim().split('\n');
    const [sha, timestamp, subject] = header.split('\x1f');
    return { sha, date: taipeiDate(timestamp), subject, files: files.map(x => x.trim()).filter(Boolean) };
  });
}
function relevant(event) {
  // Content-only posts and historical demo work do not become maintenance notices.
  if (/^Add eSIM plans marketplace demo/i.test(event.subject)) return false;
  return event.files.some(p => /^(app\/|components\/|lib\/|cloudflare-worker\/|\.github\/workflows\/|next\.config|package(?:-lock)?\.json|scripts\/optimize-images)/.test(p)
    && !/^(lib\/data\/(?:articles|imageThumbnails|systemMaintenance)\.|lib\/data\/maintenanceNotes\.json|app\/icon\.png)/.test(p));
}
function summarize(events) {
  const summaries = [];
  for (const [, match, label] of domains) {
    const affected = events.filter(e => e.files.some(p => match.test(p)));
    if (!affected.length) continue;
    const subjects = affected.map(e => e.subject).join('\n');
    const action = /optimi[sz]|compress|speed|load|cache|performance/i.test(subjects) ? '優化載入、顯示與使用體驗' : /fix|repair|restore|correct|regression/i.test(subjects) ? '修正操作或顯示問題，調整使用體驗' : '更新功能與操作介面';
    summaries.push(`${label}：${action}。`);
  }
  if (!summaries.length && events.length) summaries.push('網站功能：更新頁面與操作功能，改善使用體驗。');
  return summaries;
}
export function buildArticles(events, notes, today) {
  const cutoff = oneYearBefore(today);
  const days = new Map();
  for (const event of events) {
    if (event.date < cutoff || event.date > today || !relevant(event)) continue;
    if (!days.has(event.date)) days.set(event.date, new Map());
    days.get(event.date).set(event.sha, event);
  }
  return [...days].sort(([a], [b]) => b.localeCompare(a)).map(([date, unique]) => {
    const entries = [...unique.values()];
    const note = notes[date];
    const covered = new Set(note?.coveredCommits || []);
    const additional = entries.filter(e => !covered.has(e.sha));
    const sections = [...(note?.body || []), ...summarize(additional)];
    return {
      id: `system-maintenance-${date}`, date, tag: '系統維護',
      title: note?.title || `${date}｜網站功能更新與系統維護`,
      excerpt: sections.slice(0, 2).join(' '),
      body: [`${date} 更新紀錄（依台灣時間整理）`, ...new Set(sections)],
      link: { href: note?.href || '/works/', label: note?.label || '查看網站最新內容 →' },
    };
  });
}
export function generate() {
  if (git('rev-parse', '--is-shallow-repository').trim() === 'true') throw new Error('Maintenance articles require full Git history. Run git fetch --unshallow or configure checkout fetch-depth: 0.');
  const today = process.env.MAINTENANCE_TODAY || taipeiDate(new Date());
  const history = parseHistory(git('log', '--no-merges', '--no-renames', '--format=%x1e%H%x1f%aI%x1f%s', '--name-only', 'HEAD'));
  const notes = JSON.parse(fs.readFileSync(path.join(root, 'lib/data/maintenanceNotes.json'), 'utf8'));
  const articles = buildArticles(history, notes, today);
  fs.writeFileSync(path.join(root, 'lib/data/systemMaintenance.json'), JSON.stringify(articles, null, 2) + '\n');
  console.log(`System maintenance: ${articles.length} daily articles (${oneYearBefore(today)} – ${today}, Asia/Taipei)`);
  return articles;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generate();
