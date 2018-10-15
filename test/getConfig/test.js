const path = require('path');
const t = require('tap');
const esifycss = require('../../lib');

t.test('base', async (t) => {
    const config = await esifycss.getConfig({});
    t.equal(config.ext, '.css.js');
    t.equal(config.include.length, 1);
    t.equal(config.include[0], '**/*.css');
});

t.test('empty include', async (t) => {
    const config = await esifycss.getConfig({
        include: [],
        config: path.join(__dirname, 'foo.js'),
    });
    t.equal(config.ext, '.esified.js');
    t.equal(config.include.length, 1);
    t.equal(config.include[0], 'foo.css');
});

t.test('not empty include', async (t) => {
    const config = await esifycss.getConfig({
        include: ['bar.css'],
        config: path.join(__dirname, 'foo.js'),
    });
    t.equal(config.ext, '.esified.js');
    t.equal(config.include.length, 1);
    t.equal(config.include[0], 'bar.css');
});
