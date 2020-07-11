const path = require('path');
module.exports = {
    files: [path.join('test', 'run.ts')],
    extensions: ['ts', 'js'],
    require: ['ts-node/register'],
    verbose: true,
    timeout: '2m',
};
