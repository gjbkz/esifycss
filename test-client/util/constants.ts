import {name as projectName} from '../../package.json';
export {projectName};
export const buildName = `${projectName}#${process.env.GITHUB_RUN_ID || new Date().toISOString()}`;

const userName = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
export const browserStack = userName && accessKey ? {
    userName,
    accessKey,
    server: 'http://hub-cloud.browserstack.com/wd/hub',
} : null;
