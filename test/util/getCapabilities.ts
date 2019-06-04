const projectName = 'esifycss';
const buildName = `${projectName}#${process.env.CIRCLE_BUILD_NUM || new Date().toISOString()}`;
const userName = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

interface IBrowsetStackOptions {
    os?: 'Windows' | 'OS X',
    osVersion?: string,
    deviceName?: string,
    realMobile?: 'true' | 'false',
    projectName?: string,
    buildName?: string,
    sessionName: string,
    local?: 'true' | 'false',
    localIdentifier: string,
    seleniumVersion?: string,
    userName?: string,
    accessKey?: string,
}

interface ICapability {
    'browserName'?: string,
    'browserVersion'?: string,
}

export const mergeCapability = (
    browserStackOptions: IBrowsetStackOptions,
    capability: ICapability = {},
) => ({
    ...capability,
    'bstack:options': browserStackOptions,
});

export const getBrowserStackCapabilities = (
    names: Array<string>,
): Array<ReturnType<typeof mergeCapability>> => {
    const capabilities = [];
    for (const name of names) {
        const commonBStackOptions: IBrowsetStackOptions = {
            projectName,
            buildName,
            sessionName: name,
            local: 'true',
            localIdentifier: `${name}-${capabilities.length}-${Date.now()}`,
            seleniumVersion: '3.5.2',
            userName,
            accessKey,
        };
        capabilities.push(mergeCapability(
            {
                ...commonBStackOptions,
                os: 'Windows',
                osVersion: '10',
            },
            {
                'browserName': 'Chrome',
                'browserVersion': '74.0',
            },
        ));
    }
    return capabilities;
};

export const getLocalCapabilities = (
    names: Array<string>,
): Array<ReturnType<typeof mergeCapability>> => {
    const capabilities = [];
    for (const name of names) {
        const commonBStackOptions: IBrowsetStackOptions = {
            sessionName: name,
            localIdentifier: `${name}-${capabilities.length}-${Date.now()}`,
        };
        capabilities.push(mergeCapability(
            commonBStackOptions,
            {browserName: 'chrome'},
        ));
    }
    return capabilities;
};

export const getCapabilities = (userName && accessKey ? getBrowserStackCapabilities : getLocalCapabilities);
