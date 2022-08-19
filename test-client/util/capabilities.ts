import {
    projectName,
    buildName,
    browserStack,
} from './constants';

interface BrowsetStackOptions {
    os?: 'OS X' | 'Windows',
    osVersion?: string,
    deviceName?: string,
    realMobile?: 'false' | 'true',
    projectName?: string,
    buildName?: string,
    sessionName: string,
    local?: 'false' | 'true',
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
    for (const browserName of ['Chrome', 'Firefox', 'Edge']) {
        capabilities.push({
            browserName,
            'bstack:options': generateOptions({os: 'Windows', osVersion: '10'}),
        });
    }
    for (const browserName of ['Chrome', 'Firefox', 'Safari']) {
        capabilities.push({
            browserName,
            'bstack:options': generateOptions({os: 'OS X', osVersion: 'Monterey'}),
        });
    }
    capabilities.push({
        'browserName': 'Safari',
        'bstack:options': generateOptions({osVersion: '15', deviceName: 'iPhone 12', realMobile: 'true'}),
    });
} else {
    capabilities.push({
        'browserName': 'Chrome',
        'bstack:options': {
            sessionName,
            localIdentifier: generateLocalIdentifier(),
        },
    });
}
