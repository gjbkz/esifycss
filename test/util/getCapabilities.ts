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
    networkLogs?: 'true',
    consoleLogs?: 'disable' | 'errors' | 'warnings' | 'info' | 'verbose',
}

interface ICapability {
    browserName: string,
    browserVersion?: string,
}

export const mergeCapability = (
    browserStackOptions: IBrowsetStackOptions,
    capability: ICapability = {browserName: 'chrome'},
) => ({
    ...capability,
    'bstack:options': browserStackOptions,
});

export const getBrowserStackCapabilities = (
    names: Array<string>,
): Array<ReturnType<typeof mergeCapability>> => {
    const capabilities = [];
    for (const name of names) {
        const commonOptions: IBrowsetStackOptions = {
            projectName,
            buildName,
            sessionName: name,
            local: 'true',
            localIdentifier: `${name}-${capabilities.length}-${Date.now()}`,
            userName,
            accessKey,
            networkLogs: 'true',
            consoleLogs: 'verbose',
        };
        capabilities.push(mergeCapability({...commonOptions, os: 'Windows', osVersion: '10'}, {browserName: 'Chrome'}));
        capabilities.push(mergeCapability({...commonOptions, os: 'Windows', osVersion: '10'}, {browserName: 'Firefox'}));
        capabilities.push(mergeCapability({...commonOptions, os: 'Windows', osVersion: '10'}, {browserName: 'Edge'}));
        capabilities.push(mergeCapability({...commonOptions, os: 'Windows', osVersion: '10'}, {browserName: 'IE'}));
        capabilities.push(mergeCapability({...commonOptions, os: 'OS X', osVersion: 'Mojave'}, {browserName: 'Chrome'}));
        capabilities.push(mergeCapability({...commonOptions, os: 'OS X', osVersion: 'Mojave'}, {browserName: 'Firefox'}));
        capabilities.push(mergeCapability({...commonOptions, os: 'OS X', osVersion: 'Mojave'}, {browserName: 'Safari'}));
        capabilities.push(mergeCapability({...commonOptions, osVersion: '12', deviceName: 'iPhone 8', realMobile: 'true'}, {browserName: 'Safari'}));
        capabilities.push(mergeCapability({...commonOptions, osVersion: '9.0', deviceName: 'Google Pixel 3', realMobile: 'true'}, {browserName: 'Chrome'}));
    }
    return capabilities;
};

export const getLocalCapabilities = (
    names: Array<string>,
): Array<ReturnType<typeof mergeCapability>> => {
    const capabilities = [];
    for (const name of names) {
        const commonOptions: IBrowsetStackOptions = {
            sessionName: name,
            localIdentifier: `${name}-${capabilities.length}-${Date.now()}`,
        };
        capabilities.push(mergeCapability(
            commonOptions,
            {browserName: 'chrome'},
        ));
    }
    return capabilities;
};

export const getCapabilities = (userName && accessKey ? getBrowserStackCapabilities : getLocalCapabilities);
