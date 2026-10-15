import {createHash} from 'node:crypto';
import {Session} from 'esifycss';
import type {SessionOptions} from 'esifycss';
import type {ParcelAsset, ParcelOptions} from './types';

const {Asset} = require('parcel-bundler') as {
    Asset: new (name: string, options: ParcelOptions) => ParcelAsset,
};

class CSSAsset extends Asset {
    public async generate() {
        const config = await this.getConfig<SessionOptions>(
            ['.esifycssrc', 'esifycss.config.js'], {packageKey: 'esifycss'},
        ) || {};
        if (config.css) throw new Error('parcel-plugin-esifycss embeds CSS; the css output option is not supported.');
        const plugin = config.esifycssPluginParameter || {};
        const session = new Session({
            ...config,
            include: [],
            watch: false,
            ext: '.js',
            // Raw rule objects are understood by the core helper, including across split bundles.
            helper: require.resolve('esifycss/lib/helper/default.js'),
            esifycssPluginParameter: {
                ...plugin,
                // Parcel processes assets in separate workers; counters cannot be shared between them.
                mangler: plugin.mangler || (plugin.identifier ? undefined : (file, type, name) => {
                    const hash = createHash('sha256').update(JSON.stringify([file, type, name])).digest('hex').slice(0, 16);
                    return `${plugin.mangle === false ? name : ''}_${hash}`;
                }),
            },
        });
        const {code} = await session.processCSS(this.name);
        return [{type: 'js', value: code}];
    }
}

export = CSSAsset;
