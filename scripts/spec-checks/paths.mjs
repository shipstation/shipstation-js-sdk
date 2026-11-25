export const SAFE_PATH = /^\/(?:[A-Za-z0-9._~/-]|\{[A-Za-z0-9_]+\})*$/;

/**
 * CHECK: keys of `paths`.
 * @param {object} spec the parsed spec
 * @returns {string[]}
 */
export function checkPaths(spec) {
    return Object.keys(spec.paths ?? {})
        .filter((route) => !SAFE_PATH.test(route))
        .map((route) => `paths: path key ${JSON.stringify(route)} must match ${SAFE_PATH}`);
}
