import { name, version } from '../../package.json';

/**
 * "User-Agent" is a forbidden header name under the Fetch spec, so browsers
 * silently ignore or override it.
 * It is only reliably sent to the server in Node.js/undici-based runtimes.
 */
export function buildUserAgent(): string {
    const nodeVersion = typeof process !== 'undefined' ? process.versions?.node : undefined;
    const runtime = nodeVersion ? `node/${nodeVersion}` : 'unknown-runtime';

    return `${name}/${version} (${runtime})`;
}
