import {browserStack} from './browserStack';
import * as selenium from 'selenium-webdriver';
import {ICapability} from './types';

export const capabilities: Array<selenium.Capabilities | ICapability> = [];

if (browserStack) {
    capabilities.push({
        os: 'OS X',
        os_version: 'High Sierra',
        browserName: 'Chrome',
    });
} else {
    capabilities.push(
        selenium.Capabilities
        .chrome()
        .set('chromeOptions', {args: ['--headless']}),
    );
}
