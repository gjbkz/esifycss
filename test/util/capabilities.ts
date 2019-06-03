import {browserStack} from './constants';
import * as selenium from 'selenium-webdriver';
import {ICapability} from './types';

export const capabilities: Array<selenium.Capabilities | ICapability> = [];

if (browserStack) {
    capabilities.push({os: 'OS X', os_version: 'Mojave', browserName: 'Chrome'});
    capabilities.push({os: 'OS X', os_version: 'Mojave', browserName: 'Firefox'});
    capabilities.push({os: 'OS X', os_version: 'Mojave', browserName: 'Safari'});
    capabilities.push({os: 'Windows', os_version: '10', browserName: 'IE'});
    capabilities.push({os: 'Windows', os_version: '10', browserName: 'Edge'});
    capabilities.push({os: 'Windows', os_version: '10', browserName: 'Chrome'});
    capabilities.push({os: 'Windows', os_version: '10', browserName: 'Firefox'});
    // capabilities.push({os: 'ios', os_version: '12'});
    // capabilities.push({os: 'android', os_version: '9.0'});
} else {
    capabilities.push(selenium.Capabilities.chrome().set('chromeOptions', {args: ['--headless']}));
}