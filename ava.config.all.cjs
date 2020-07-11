const path = require('path');
module.exports = {
    files: [path.join('lib', '**', '*.test.js')],
    extensions: ['js'],
    timeout: '2m',
};
