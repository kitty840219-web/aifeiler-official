import test from 'node:test';
import assert from 'node:assert/strict';
import { taipeiDate, oneYearBefore, parseHistory, buildArticles } from './generate-maintenance-articles.mjs';

const event = (sha, date, files = ['app/accounting/page.tsx'], subject = 'Update accounting helper') => ({ sha, date, files, subject });
test('Taiwan dates cross midnight and leap-year cutoff stays valid', () => {
  assert.equal(taipeiDate('2026-11-09T18:00:00Z'), '2026-11-10');
  assert.equal(oneYearBefore('2028-02-29'), '2027-02-28');
});
test('history parser retains original date and paths', () => {
  const rows = parseHistory('\x1eabc\x1f2026-11-09T18:00:00Z\x1fFix tool\n\napp/accounting/page.tsx\n');
  assert.deepEqual(rows, [event('abc', '2026-11-10', ['app/accounting/page.tsx'], 'Fix tool')]);
});
test('one daily article, newest first, only past year, exclude content-only and demos', () => {
  const events = [event('a', '2026-11-10'), event('a', '2026-11-10'), event('b', '2026-11-10'), event('c', '2026-11-09'), event('d', '2025-11-09'), event('e', '2026-11-11'), event('f', '2026-11-08', ['lib/data/articles.ts']), event('g', '2026-11-07', ['app/page.tsx'], 'Add eSIM plans marketplace demo (Next.js)')];
  const articles = buildArticles(events, {}, '2026-11-10');
  assert.deepEqual(articles.map(x => x.date), ['2026-11-10', '2026-11-09']);
  assert.equal(articles[0].tag, '系統維護');
  assert.equal(articles[0].body.filter(x => x.includes('會計小幫手')).length, 1);
});
test('new work appends to a curated day without deleting its verified description', () => {
  const notes = { '2026-11-10': { title: '已核實標題', body: ['已完成的功能。'], coveredCommits: ['old'] } };
  const articles = buildArticles([event('old', '2026-11-10'), event('new', '2026-11-10', ['components/quotes/DailyQuote.tsx'], 'Fix quote drawing')], notes, '2026-11-10');
  assert.equal(articles[0].title, '已核實標題');
  assert.ok(articles[0].body.includes('已完成的功能。'));
  assert.ok(articles[0].body.some(x => x.startsWith('每日一句：修正')));
});
test('unknown new tools are included and irrelevant documentation is excluded', () => {
  const articles = buildArticles([event('tool', '2026-11-10', ['app/new-tool/page.tsx'], 'Add new tool'), event('docs', '2026-11-09', ['docs/CONTENT_UPDATES.md'], 'Update docs')], {}, '2026-11-10');
  assert.equal(articles.length, 1);
  assert.ok(articles[0].body.some(x => x.startsWith('網站功能：')));
});
