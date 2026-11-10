import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const load = async (file) => {
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputText).toString('base64'));
};
const { calendarPool, randomDailyDraw, dailyQuote } = await load('../lib/quotes/daily.ts');
const { QUOTES } = await load('../lib/quotes/samples.ts');
const calendar = [];
for (let month = 1; month <= 12; month++) for (let day = 1; day <= new Date(2028, month, 0).getDate(); day++) calendar.push({ id: `${month}-${day}`, month, day, category: day % 2 ? 'work' : 'love' });

test('a complete library stays in the current month, including manual draws', () => {
  for (let month = 1; month <= 12; month++) {
    const date = `2026-${String(month).padStart(2, '0')}-10`;
    for (const manual of [false, true]) assert.ok(calendarPool(date, calendar, manual).allowed.every(q => q.month === month));
  }
});
test('holidays match their actual date and leap-day cards stay on valid leap days', () => {
  assert.equal(dailyQuote('2028-02-29', calendar).id, '2-29');
  assert.equal(dailyQuote('2026-12-25', calendar).id, '12-25');
  assert.throws(() => dailyQuote('2027-02-29', calendar));
  assert.throws(() => dailyQuote('2026-04-31', calendar));
  assert.ok(calendarPool('2026-12-10', calendar, true).allowed.every(q => !['12-24', '12-25', '12-31'].includes(q.id)));
  assert.ok(calendarPool('2026-02-28', calendar, true).allowed.every(q => q.id !== '2-29'));
});
test('daily cards do not repeat over January and survive same-day reloads', () => {
  let saved = null; const selected = [];
  for (let day = 1; day <= 31; day++) {
    const date = `2026-01-${String(day).padStart(2, '0')}`;
    saved = randomDailyDraw(date, calendar, saved, () => .1); selected.push(saved.id);
    assert.equal(randomDailyDraw(date, calendar, saved, () => .9).id, saved.id);
  }
  assert.equal(new Set(selected).size, 31);
});
test('manual draws change cards, retain current-month scenes and persist', () => {
  const initial = randomDailyDraw('2026-11-10', calendar, null, () => .1);
  const manual = randomDailyDraw('2026-11-10', calendar, { ...initial, date: '' }, () => .8, true);
  assert.notEqual(manual.id, initial.id); assert.ok(manual.id.startsWith('11-'));
  assert.equal(randomDailyDraw('2026-11-10', calendar, manual).id, manual.id);
});
test('migrates old out-of-season cards and handles incomplete seasonal libraries', () => {
  const draw = randomDailyDraw('2026-11-10', QUOTES, { date: '2026-11-10', id: QUOTES.find(q => q.month === 6).id, scope: 'preview-138', remaining: [] }, () => .3);
  assert.equal(QUOTES.find(q => q.id === draw.id).month, 11);
  const partial = [QUOTES.find(q => q.month === 6), QUOTES.find(q => q.month === 8)];
  const summer = calendarPool('2026-07-10', partial);
  assert.ok(summer.allowed.every(q => [6, 8].includes(q.month)));
  const first = randomDailyDraw('2026-06-10', partial, null, () => .1);
  const manual = randomDailyDraw('2026-06-10', partial, { ...first, date: '' }, () => .8, true);
  assert.notEqual(manual.id, first.id);
  assert.equal(randomDailyDraw('2026-06-10', partial, manual).id, manual.id);
});

test('the real leap-day bonus appears only on February 29', () => {
  const leap = QUOTES.find(q => q.month === 2 && q.day === 29);
  assert.ok(leap);
  assert.equal(dailyQuote('2028-02-29', QUOTES).id, leap.id);
  assert.equal(dailyQuote('2024-02-29', QUOTES).id, leap.id);
  for (const date of ['2026-02-28', '2028-02-28', '2028-03-01']) assert.ok(calendarPool(date, QUOTES, true).allowed.every(q => q.id !== leap.id));
});

test('the finished library covers 365 dates plus one leap day with balanced categories', () => {
  const regular = QUOTES.filter(q => !(q.month === 2 && q.day === 29));
  assert.equal(regular.length, 365); assert.equal(QUOTES.length, 366);
  assert.equal(regular.filter(q => q.category === 'work').length, 183);
  assert.equal(regular.filter(q => q.category === 'love').length, 182);
  for (const field of ['id', 'number', 'zh', 'en']) assert.equal(new Set(QUOTES.map(q => q[field])).size, 366, `duplicate ${field}`);
  for (let month = 1; month <= 12; month++) {
    const expected = new Date(2026, month, 0).getDate();
    assert.equal(regular.filter(q => q.month === month).length, expected);
    for (let day = 1; day <= expected; day++) assert.equal(regular.filter(q => q.month === month && q.day === day).length, 1);
  }
});
test('real cards cover ordinary and leap years without repeating daily draws', () => {
  for (const year of [2026, 2028]) {
    let saved = null; const seen = new Set();
    for (let month = 1; month <= 12; month++) for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      saved = randomDailyDraw(date, QUOTES, saved, () => .37);
      const quote = QUOTES.find(q => q.id === saved.id);
      assert.equal(quote.month, month); assert.ok(!seen.has(quote.id), `${date} repeated ${quote.id}`); seen.add(quote.id);
    }
    assert.equal(seen.size, year === 2028 ? 366 : 365);
  }
});

test('all illustrated card backgrounds exist and their crop frames stay inside the image', () => {
  for (const q of QUOTES) {
    const src = q.background?.src || (q.art < 0 ? '/images/quotes/november-garden.webp' : '/images/quotes/monthly-atlas.webp');
    assert.ok(fs.existsSync(new URL('../public' + src, import.meta.url)), `${q.id}: missing ${src}`);
    if (q.background) {
      const [x, y, width, height] = q.background.frame;
      assert.ok(x >= 0 && y >= 0 && width > 0 && height > 0 && x + width <= 1 && y + height <= 1, `${q.id}: invalid crop`);
    }
  }
});
