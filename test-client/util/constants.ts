export const projectName = 'middleware-static-livereload';
export const buildName = `${projectName}#${process.env.CIRCLE_BUILD_NUM || new Date().toISOString()}`;

const userName = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
export const browserStack = userName && accessKey ? {
    userName,
    accessKey,
    server: 'http://hub-cloud.browserstack.com/wd/hub',
} : null;
