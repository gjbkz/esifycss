import * as selenium from 'selenium-webdriver';
import {browserStack, projectName, buildId} from './constants';

interface IParameters {
    capability: selenium.Capabilities,
    name: string,
    localIdentifier: string,
}

export const fillCapability = (
    parameters: IParameters,
): selenium.Capabilities => {
    const capability = new selenium.Capabilities(parameters.capability);
    capability.set('project', projectName);
    capability.set('build', buildId);
    capability.set('name', parameters.name);
    if (browserStack) {
        capability.set('browserstack.local', 'true');
        capability.set('browserstack.localIdentifier', parameters.localIdentifier);
        capability.set('browserstack.user', browserStack.user);
        capability.set('browserstack.key', browserStack.key);
    }
    return capability;
};
