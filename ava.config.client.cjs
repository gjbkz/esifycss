const path = require('path');
module.exports = {
    ...require('./ava.config.cjs'),
    files: [path.join('test-client', 'run.ts')],
};
