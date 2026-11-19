const { test } = require('node:test');
const assert = require('node:assert/strict');
const { sourceVersion, needsSync } = require('./import-portfolio-pages.cjs');
const source = 'https://www.canva.com/design/DAGuYcOTao0/sZzE6Zw97IOtctZjyR4n0w/view';
test('reads the design revision rather than the Canva app release', () => {
  assert.equal(sourceVersion('"version":"app-hash","G":{"height":335,"width":596,"version":597,"images":[]}'), '597');
  assert.equal(sourceVersion('login required'), null);
});
test('unchanged design does not regenerate video frames or publish', () => {
  assert.equal(needsSync({ source, sourceVersion: '597', pages: ['one', 'two'] }, '597', 2), false);
});
test('content revisions, page count changes, missing state and unknown versions trigger sync', () => {
  const previous = { source, sourceVersion: '597', pages: ['one', 'two'] };
  assert.equal(needsSync(previous, '598', 2), true);
  assert.equal(needsSync(previous, '597', 3), true);
  assert.equal(needsSync(previous, null, 2), true);
  assert.equal(needsSync(null, '597', 2), true);
});
