import * as https from 'https';
import * as selenium from 'selenium-webdriver';
import {browserStack} from './constants';

export const markResult = async (
    session: selenium.Session,
    status: boolean,
): Promise<void> => {
    if (browserStack) {
        const sessionId = session.getId();
        const auth = `${browserStack.user}:${browserStack.key}`;
        await new Promise((resolve, reject) => {
            https.request({
                method: 'PUT',
                host: 'www.browserstack.com',
                path: `/automate/sessions/${sessionId}.json`,
                headers: {'Content-Type': 'application/json'},
                auth,
            })
            .once('error', reject)
            .once('response', resolve)
            .end(JSON.stringify({status}));
        });
    }
};
