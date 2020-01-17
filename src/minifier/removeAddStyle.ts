export const removeAddStyle = (
    script: string,
): string => script
.replace(/import\s+\{\s*addStyle\s*\}\s*from.*;?\s*?[\n\r]/, '')
.replace(/addStyle\([^)]*\);?\s*?[\n\r]/g, '');

