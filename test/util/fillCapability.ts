import * as selenium from 'selenium-webdriver';
import {browserStack, projectName, buildId} from './constants';
import {ICapability, IFilledCapability} from './types';

interface IParameters {
    capability: ICapability | selenium.Capabilities,
    name: string,
    localIdentifier: string,
}

export const fillCapability = (
    parameters: IParameters,
): ICapability | IFilledCapability | selenium.Capabilities => {
    if ('browserName' in parameters.capability && browserStack) {
        return {
            ...parameters.capability,
            'project': projectName,
            'build': buildId,
            'name': parameters.name,
            'browserstack.local': true,
            'browserstack.localIdentifier': parameters.localIdentifier,
            'browserstack.user': browserStack.user,
            'browserstack.key': browserStack.key,
        };
    }
    return parameters.capability;
};
