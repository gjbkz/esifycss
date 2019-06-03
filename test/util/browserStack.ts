const user = process.env.BROWSERSTACK_USERNAME;
const key = process.env.BROWSERSTACK_ACCESS_KEY;
export const browserStack = user && key ? {
    user,
    key,
    server: 'http://hub-cloud.browserstack.com/wd/hub',
} : null;
