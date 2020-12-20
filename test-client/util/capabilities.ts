import {
    projectName,
    buildName,
    browserStack,
} from './constants';

interface BrowsetStackOptions {
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

interface Capability {
    browserName: string,
    browserVersion?: string,
    'bstack:options': BrowsetStackOptions,
}

const timeStamp = Date.now().toString(36);
const sessionName = 'ClientTest';
const generateLocalIdentifier = () => `${sessionName}-${timeStamp}-${capabilities.length}`;
export const capabilities: Array<Capability> = [];
if (browserStack) {
    const baseOptions = {
        projectName,
        buildName,
        sessionName,
        local: 'true' as const,
        userName: browserStack.userName,
        accessKey: browserStack.accessKey,
    };
    const generateOptions = (
        options: Partial<BrowsetStackOptions>,
    ): BrowsetStackOptions => ({
        ...baseOptions,
        ...options,
        localIdentifier: generateLocalIdentifier(),
    });
    for (const browserName of ['Chrome', 'Firefox', 'Edge', 'IE']) {
        capabilities.push({
            browserName,
            'bstack:options': generateOptions({os: 'Windows', osVersion: '10'}),
        });
    }
    for (const browserName of ['Chrome', 'Firefox', 'Safari']) {
        capabilities.push({
            browserName,
            'bstack:options': generateOptions({os: 'OS X', osVersion: 'Big Sur'}),
        });
    }
    capabilities.push({
        'browserName': 'Safari',
        'bstack:options': generateOptions({osVersion: '14', deviceName: 'iPhone 12', realMobile: 'true'}),
    });
    capabilities.push({
        'browserName': 'Chrome',
        'bstack:options': generateOptions({osVersion: '11.0', deviceName: 'Google Pixel 4', realMobile: 'true'}),
    });
} else {
    capabilities.push({
        'browserName': 'chrome',
        'bstack:options': {
            sessionName,
            localIdentifier: generateLocalIdentifier(),
        },
    });
}
