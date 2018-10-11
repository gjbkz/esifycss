const path = require('path');
const t = require('tap');
const esifycss = require('../../lib');

t.test('base', async (t) => {
    const config = await esifycss.getConfig({});
    t.equal(config.ext, '.css.js');
    t.equal(config.patterns.length, 1);
    t.equal(config.patterns[0], '**/*.css');
});

t.test('empty patterns', async (t) => {
    const config = await esifycss.getConfig({
        patterns: [],
        config: path.join(__dirname, 'foo.js'),
    });
    t.equal(config.ext, '.esified.js');
    t.equal(config.patterns.length, 1);
    t.equal(config.patterns[0], 'foo.css');
});

t.test('not empty patterns', async (t) => {
    const config = await esifycss.getConfig({
        patterns: ['bar.css'],
        config: path.join(__dirname, 'foo.js'),
    });
    t.equal(config.ext, '.esified.js');
    t.equal(config.patterns.length, 1);
    t.equal(config.patterns[0], 'bar.css');
});
