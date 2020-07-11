const fg = require('fast-glob');
const files = fg.sync('lib/**/*.test.js');
console.log(files);
module.exports = {
    files,
    extensions: ['js'],
};
