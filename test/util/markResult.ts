import * as https from 'https';
import * as selenium from 'selenium-webdriver';
import {browserStack} from './browserStack';

export const markResult = async (
    session: selenium.Session,
    status: boolean,
): Promise<void> => {
    if (!browserStack) {
        return;
    }
    const sessionId = session.getId();
    await new Promise((resolve, reject) => {
        https.request({
            method: 'PUT',
            host: 'www.browserstack.com',
            path: `/automate/sessions/${sessionId}.json`,
            auth: `${browserStack.user}:${browserStack.key}`,
            headers: {'Content-Type': 'application/json'},
        })
        .once('error', reject)
        .once('response', resolve)
        .end(JSON.stringify({status}));
    });
};
