import type * as http from 'http';
import * as https from 'https';
import type * as selenium from 'selenium-webdriver';
import {browserStack} from './constants';

export const markResult = async (
    session: selenium.Session,
    passed: boolean,
): Promise<void> => {
    if (browserStack) {
        const sessionId = session.getId();
        const endpoint = `https://${browserStack.userName}:${browserStack.accessKey}@api.browserstack.com/automate/sessions/${sessionId}.json`;
        const res = await new Promise<http.IncomingMessage>((resolve, reject) => {
            const req = https.request(endpoint, {
                method: 'PUT',
                headers: {'content-type': 'application/json'},
            });
            req.once('error', reject);
            req.once('response', resolve);
            req.end(JSON.stringify({status: passed ? 'passed' : 'failed'}));
        });
        console.info(`${res.statusCode} ${res.statusMessage}`);
        for await (const data of res) {
            console.info(`${data}`);
        }
    } else {
        console.info('markResult:Skipped');
    }
};
