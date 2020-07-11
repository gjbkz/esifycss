const fs = require('fs');
const path = require('path');
/**
 * @param directory {string}
 * @returns {Array<string>}
 */
const findTestFile = (directory) => {
    const result = [];
    for (const name of fs.readdirSync(directory)) {
        const filePath = path.join(directory, name);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            result.push(...findTestFile(filePath));
        } else if (name.endsWith('.test.js')) {
            result.push(filePath);
        }
    }
    return result;
};

/**
 * @param context {{projectDir: string}}
 */
module.exports = ({projectDir}) => {
    console.log({projectDir});
    const files = findTestFile(path.join(projectDir, 'lib'));
    console.log(files);
    return {
        files: files.map((filePath) => path.relative(projectDir, filePath)),
        extensions: ['js'],
    };
};
