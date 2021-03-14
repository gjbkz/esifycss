import {URL} from 'url';
import * as path from 'path';
import * as fs from 'fs';
import type * as http from 'http';
const afs = fs.promises;

export const createRequestHandler = (
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
        const filePath = path.join(directory, url.pathname);
        Promise.resolve()
        .then(async () => {
            const stats = await afs.stat(filePath);
            res.writeHead(200, {
                'content-type': contentTypes.get(path.extname(filePath)) || 'text/plain',
                'content-length': stats.size,
            });
            if (req.method === 'HEAD') {
                res.end();
            } else {
                fs.createReadStream(filePath).pipe(res);
            }
        })
        .catch((error) => {
            if ((error as {code?: string}).code === 'ENOENT') {
                res.statusCode = 404;
            } else {
                res.statusCode = 500;
            }
            res.end(`${error}`);
        })
        .finally(() => {
            callback(`${req.method} ${url.pathname} → ${res.statusCode}`);
        });
    };
    return Object.assign(listener, {contentTypes});
};
