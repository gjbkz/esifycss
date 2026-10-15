import * as fs from 'fs';
import * as path from 'path';
import type * as webpack from 'webpack';

type CallbackParameter<T> = T extends (O: any, C: (arg: infer Arg) => any) => any ? Arg : never;
type NormalModuleFactory = CallbackParameter<webpack.Compiler['hooks']['normalModuleFactory']['tap']>;
type ResolveData = CallbackParameter<NormalModuleFactory['hooks']['resolve']['tapPromise']>;
interface ObjectWithHooks {
    hooks: Record<string, unknown>,
}

const pluginName = 'EsifyCSSWebpackPlugin';

const fileExistsAt = async (filePath: string): Promise<boolean> => {
    const stat = await fs.promises.stat(filePath).catch(() => null);
    return Boolean(stat && stat.isFile());
};

const isCompilerLike = (
    input: ObjectWithHooks,
): input is Pick<webpack.Compiler, 'hooks'> => 'normalModuleFactory' in input.hooks;

const isNormalModuleFactoryLike = (
    input: ObjectWithHooks,
): input is Pick<NormalModuleFactory, 'hooks'> => 'resolve' in input.hooks;

const getContextDirectory = (
    {context, path: contextPath}: {
        context: string | {issuer: string},
        path?: string,
    },
): string => {
    if (contextPath) {
        return contextPath;
    }
    if (typeof context === 'string') {
        return context;
    }
    return path.dirname(context.issuer);
};

const resolveModuleCss = async (resolveData: ResolveData) => {
    if (!resolveData.request.endsWith('.module.css')) {
        return;
    }
    for (const extension of ['.js', '.ts']) {
        const extended = `${resolveData.request}${extension}`;
        const directory = getContextDirectory(resolveData);
        if (await fileExistsAt(path.join(directory, extended))) {
            resolveData.request = extended;
            return;
        }
    }
};

export class EsifyCSSWebpackPlugin {

    public apply(input: ObjectWithHooks) {
        if (isNormalModuleFactoryLike(input)) {
            input.hooks.resolve.tapPromise(pluginName, resolveModuleCss);
        } else if (isCompilerLike(input)) {
            input.hooks.normalModuleFactory.tap(pluginName, (normalModuleFactory) => {
                normalModuleFactory.hooks.resolve.tapPromise(pluginName, resolveModuleCss);
            });
        }
    }

}

export default EsifyCSSWebpackPlugin;
