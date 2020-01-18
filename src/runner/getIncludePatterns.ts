export const getIncludePatterns = (
    {include, extensions}: {
        include: Array<string>,
        extensions: Array<string>,
    },
) => {
    const includePatterns = new Set<string>();
    for (const includePattern of include) {
        for (const ext of extensions) {
            if (includePattern.endsWith(ext)) {
                includePatterns.add(includePattern);
            } else {
                includePatterns.add(
                    includePattern
                    .replace(/[/*]*$/, `/**/*${ext}`)
                    .replace(/^\/\*/, '*'),
                );
            }
        }
    }
    return [...includePatterns];
};
