import type * as childProcess from 'child_process';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import {URL} from 'url';
import * as selenium from 'selenium-webdriver';
import type * as BrowserStack from 'browserstack-local';
import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {capabilities} from './util/capabilities';
import {browserStack} from './util/constants';
import {createBrowserStackLocal} from './util/createBrowserStackLocal';
import {createRequestHandler} from './util/createRequestHandler';
import {markResult} from './util/markResult';
import {spawn} from './util/spawn';

const {writeFile} = fs.promises;

interface BrowserTestContext {
    session?: selenium.Session,
    builder?: selenium.Builder,
    driver?: selenium.ThenableWebDriver,
    bsLocal?: BrowserStack.Local,
    server: http.Server,
    port: number,
    baseURL: URL,
    passed: boolean,
}

/**
 * https://www.browserstack.com/question/664
 * Question: What ports can I use to test development environments or private
 * servers using BrowserStack?
 * → We support all ports for all browsers other than Safari.
 */
let port = 9200;
const createContext = async (): Promise<BrowserTestContext> => {
    const server = await new Promise<http.Server>((resolve, reject) => {
        const server = http.createServer()
        .once('error', reject)
        .once('listening', () => {
            server.removeListener('error', reject);
            resolve(server);
        });
        server.listen(port++);
    });
    const address = server.address();
    if (address && typeof address === 'object') {
        return {
            server,
            port: address.port,
            baseURL: new URL(`http://localhost:${address.port}`),
            passed: false,
        };
    } else {
        throw new Error(`Invalid address: ${address}`);
    }
};

const closeContext = async (context: BrowserTestContext) => {
    if (context.session) {
        await markResult(context.session, context.passed);
    }
    if (context.driver) {
        await context.driver.quit();
    }
    await new Promise<void>((resolve, reject) => {
        context.server.close((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
    const bsLocal = context.bsLocal;
    if (bsLocal) {
        await new Promise<void>((resolve) => {
            bsLocal.stop(resolve);
        });
    }
};

const builtProjects = new Set<string>();
const build = async (
    testDirectory: string,
) => {
    if (!builtProjects.has(testDirectory)) {
        const spawnOptions: childProcess.SpawnOptionsWithoutStdio = {
            cwd: testDirectory,
            shell: true,
        };
        await spawn({command: 'npm install', options: spawnOptions});
        await spawn({command: 'npm run build', options: spawnOptions});
        builtProjects.add(testDirectory);
    }
};

const testNameList = fs.readdirSync(__dirname).filter((name) => {
    try {
        return fs.statSync(path.join(__dirname, name, 'package.json')).isFile();
    } catch {
        return false;
    }
});

for (const testName of testNameList) {
    for (const $capability of capabilities) {
        const {'bstack:options': options} = $capability;
        const capability = {
            ...$capability,
            'bstack:options': {
                ...options,
                sessionName: testName,
            },
        };
        const testDirectory = path.join(__dirname, testName);
        const outputDirectory = path.join(testDirectory, 'output');
        test(`${testName} ${options.os || options.deviceName || '-'} ${capability.browserName}`, async (t) => {
            const context = await createContext();
            t.after(() => closeContext(context));
            await build(testDirectory);
            context.server.on('request', createRequestHandler(
                outputDirectory,
                (message) => t.diagnostic(message),
            ));
            const builder = new selenium.Builder().withCapabilities(capability);
            context.builder = builder;
            if (browserStack) {
                builder.usingServer(browserStack.server);
                context.bsLocal = await createBrowserStackLocal({
                    accessKey: browserStack.accessKey,
                    port: context.port,
                    localIdentifier: capability['bstack:options'].localIdentifier,
                });
            }
            const driver = builder.build();
            context.driver = driver;
            const baseURL = (/safari/i).test(capability.browserName) ? new URL(`http://bs-local.com:${context.port}`) : context.baseURL;
            context.session = await driver.getSession();
            await driver.get(`${new URL('/index.html', baseURL)}`);
            await driver.wait(selenium.until.titleMatches(/(?:passed|failed)$/), 10000);
            const base64 = await driver.takeScreenshot();
            const screenShot = Buffer.from(base64, 'base64');
            await writeFile(path.join(outputDirectory, `${Date.now()}.png`), screenShot);
            const title = await driver.getTitle();
            const passed = title === `${path.basename(testDirectory)} → passed`;
            assert.strictEqual(passed, true);
            context.passed = passed;
        });
    }
}
