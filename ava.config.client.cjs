const path = require('path');
module.exports = {
    files: [path.join('test-client', 'run.ts')],
    extensions: ['ts'],
    require: ['ts-node/register'],
    timeout: '2m',
};
