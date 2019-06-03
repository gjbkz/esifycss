import anyTest, {TestInterface} from 'ava';
import {URL} from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as childProcess from 'child_process';
import * as stream from 'stream';
import * as selenium from 'selenium-webdriver';
const afs = fs.promises;

const test = anyTest as TestInterface<{
    server: http.Server,
    baseURL: URL,
}>;

const createRequestHandler = (
    directory: string,
    callback: (message: string) => void,
): http.RequestListener & {contentTypes: Map<string, string>} => {
    const contentTypes = new Map<string, string>();
    contentTypes.set('.html', 'text/html');
    contentTypes.set('.css', 'text/css');
    contentTypes.set('.js', 'text/javascript');
    const listener: http.RequestListener = (req, res) => {
        const url = new URL(req.url || '/', 'https://example.com');
        url.pathname = url.pathname.replace(/\/$/, '/index.html');
        callback(`${req.method} ${url.pathname}`);
        const filePath = path.join(directory, url.pathname);
        Promise.resolve()
        .then(async () => {
            const stats = await afs.stat(filePath);
            res.writeHead(200, {
                'content-type': contentTypes.get(path.extname(filePath)) || 'text/plain',
                'content-length': stats.size,
            });
            fs.createReadStream(filePath).pipe(res);
        })
        .catch((error) => {
            if (error.code === 'ENOENT') {
                res.statusCode = 404;
            } else {
                res.statusCode = 500;
            }
            res.end(`${error}`);
        });
    };
    return Object.assign(listener, {contentTypes});
};

let port = 3000;
test.beforeEach(async (t) => {
    t.context.server = await new Promise((resolve, reject) => {
        const server = http.createServer()
        .once('error', reject)
        .once('listening', () => {
            server.removeListener('error', reject);
            resolve(server);
        });
        server.listen(port++);
    });
    const address = t.context.server.address();
    if (address && typeof address === 'object') {
        t.context.baseURL = new URL(`http://127.0.0.1:${address.port}`);
    } else {
        throw new Error(`Invalid address: ${address}`);
    }
});

test.afterEach(async (t) => {
    await new Promise((resolve, reject) => {
        t.context.server.close((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
});

export interface ISpawnParameters {
    command: string,
    args?: Array<string>,
    options?: childProcess.SpawnOptionsWithoutStdio,
    stdout?: stream.Writable,
    stderr?: stream.Writable,
}

const spawn = (
    parameters: ISpawnParameters,
): Promise<void> => new Promise((resolve, reject) => {
    const subProcess = childProcess.spawn(
        parameters.command,
        parameters.args || [],
        parameters.options || {},
    )
    .once('error', reject)
    .once('exit', (code) => {
        if (code === 0) {
            resolve();
        } else {
            reject(new Error(`The command "${parameters.command}" exited with code ${code}.`));
        }
    });
    if (subProcess.stdout) {
        subProcess.stdout.pipe(parameters.stdout || process.stdout);
    }
    if (subProcess.stderr) {
        subProcess.stderr.pipe(parameters.stderr || process.stderr);
    }
});

const testDirectories = fs.readdirSync(__dirname)
.map((name) => path.join(__dirname, name))
.filter((testDirectory) => {
    try {
        return fs.statSync(path.join(testDirectory, 'package.json')).isFile();
    } catch (error) {
        return false;
    }
});

for (const testDirectory of testDirectories) {
    test(path.basename(testDirectory), async (t) => {
        const options: childProcess.SpawnOptionsWithoutStdio = {
            cwd: testDirectory,
            shell: true,
        };
        t.log('npm install');
        await spawn({command: 'npm install', options});
        t.log('npm run build');
        await spawn({command: 'npm run build', options});
        t.is(typeof options, 'object');
        const outputDirectory = path.join(testDirectory, 'output');
        t.true(fs.statSync(outputDirectory).isDirectory());
        t.log('start browser');
        const driver = new selenium.Builder()
        .withCapabilities(
            selenium.Capabilities
            .chrome()
            .set('chromeOptions', {args: ['--headless']}),
        )
        .build();
        t.context.server.on('request', createRequestHandler(
            outputDirectory,
            (message) => t.log(message),
        ));
        await driver.get(`${new URL('/index.html', t.context.baseURL)}`);
        await driver.wait(selenium.until.titleMatches(/(?:passed|failed)$/), 10000);
        const base64 = await driver.takeScreenshot();
        const screenShot = Buffer.from(base64, 'base64');
        await afs.writeFile(path.join(outputDirectory, `${Date.now()}.png`), screenShot);
        const output = await driver.findElement(selenium.By.css('#output'));
        t.log(`Text:\n${await output.getText()}`);
        const title = await driver.getTitle();
        t.is(title, `${path.basename(testDirectory)} → passed`);
    });
}
