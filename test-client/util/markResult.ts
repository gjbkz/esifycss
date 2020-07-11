import * as http from 'http';
import * as https from 'https';
import * as selenium from 'selenium-webdriver';
import {browserStack} from './constants';
import {readStream} from './readStream';

export const markResult = async (
    session: selenium.Session,
    passed: boolean,
): Promise<void> => {
    if (browserStack) {
        const sessionId = session.getId();
        const auth = `${browserStack.user}:${browserStack.key}`;
        const res = await new Promise<http.IncomingMessage>((resolve, reject) => {
            https.request({
                method: 'PUT',
                host: 'api.browserstack.com',
                path: `/automate/sessions/${sessionId}.json`,
                headers: {'Content-Type': 'application/json'},
                auth,
            })
            .once('error', reject)
            .once('response', resolve)
            .end(JSON.stringify({status: passed ? 'passed' : 'failed'}));
        });
        console.log(`${res.statusCode} ${res.statusMessage}`);
        console.log(`${await readStream(res)}`);
    } else {
        console.log('markResult:Skipped');
    }
};
