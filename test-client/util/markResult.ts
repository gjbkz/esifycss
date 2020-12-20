import './fetch';
import fetch from 'node-fetch';
import * as selenium from 'selenium-webdriver';
import {browserStack} from './constants';

export const markResult = async (
    session: selenium.Session,
    passed: boolean,
): Promise<void> => {
    if (browserStack) {
        const sessionId = session.getId();
        const res = await fetch(`https://${browserStack.userName}:${browserStack.accessKey}@api.browserstack.com/automate/sessions/${sessionId}.json`, {
            method: 'PUT',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({status: passed ? 'passed' : 'failed'}),
        });
        console.log(`${res.status} ${res.statusText}`);
        console.log(await res.text());
    } else {
        console.log('markResult:Skipped');
    }
};
