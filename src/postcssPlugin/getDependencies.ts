import * as postcss from 'postcss';
import * as path from 'path';

export const REGEX_IMPORT = /^(['"])([^\s'"]+)\1\s*([^\s]*)$/;

export const getDependencies = (
    root: postcss.Root,
    id: string,
): Map<string, string> => {
    const dependencies = new Map<string, string>();
    const directory = path.dirname(id);
    let count = 0;
    root.walkAtRules((node): void => {
        if (node.name === 'import') {
            const match = REGEX_IMPORT.exec(node.params);
            if (match) {
                count++;
                const [,, target, name = `$${count}`] = match;
                dependencies.set(
                    name,
                    path.resolve(target, directory),
                );
                node.remove();
            }
        }
    });
    return dependencies;
};
