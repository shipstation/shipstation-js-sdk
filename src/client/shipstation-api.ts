import { Configuration, type FetchAPI, type Middleware } from '../generated';
import { createApiClients, type ApiClients } from '../generated/api-registry';

import { withTimeout } from './timeout';
import { ShipStationError, ShipStationApiError, ShipStationConnectionError } from './errors';
import { buildUserAgent } from './user-agent';

const DEFAULT_TIMEOUT = 60000;
const DEFAULT_BASE_URL = 'https://api.shipstation.com';
const ON_BEHALF_OF_HEADER = 'on-behalf-of';
const USER_AGENT_HEADER = 'User-Agent';

export interface ShipStationAPIConfig {
    /** Secret API key generated in the ShipStation API Dashboard. */
    apiKey: string;
    /** Base URL of the ShipStation API. Defaults to `https://api.shipstation.com`. */
    baseUrl?: string;
    /** Per-attempt request timeout in milliseconds. Defaults to 60000. */
    timeout?: number;
    /** Override the fetch implementation (testing, proxies, HTTP/2 clients, ...). */
    fetch?: FetchAPI;
    /** Extra middleware appended after this SDK's own error-translation middleware. */
    middleware?: Middleware[];
    /** Sent as the `on-behalf-of` header on every request. Intended for partners authenticating with a partner API key. */
    onBehalfOf?: string;
}

function errorTranslationMiddleware(): Middleware {
    return {
        async post(context) {
            if (context.response.ok) {
                return context.response;
            }

            throw await ShipStationApiError.fromResponse(context.response.clone());
        },
        onError(context) {
            if (context.error instanceof ShipStationError) {
                throw context.error;
            }

            throw new ShipStationConnectionError(context.error);
        },
    };
}

/**
 * Refuses a URL with a dot segment (`.`, `..` or a percent-encoded form of either) after
 * `basePath`: fetch's URL parser would resolve it, and the request would reach an endpoint other
 * than the one the SDK built the path for. A `URL` or `Request` is already resolved.
 */
function withPathCheck(fetchApi: FetchAPI, basePath: string): FetchAPI {
    return async (url, init) => {
        // dot segments of the configured base URL itself were always resolved, and still are
        const path = typeof url === 'string' && url.startsWith(`${basePath}/`) ? url.slice(basePath.length) : url;
        // the parser drops tabs and newlines, treats `\` as `/` and trims leading and trailing C0
        // controls and spaces (`[^!-\uFFFF]`, U+0000 to U+0020) before it resolves dot segments
        const segments =
            typeof path === 'string'
                ? path
                      .replace(/[\t\n\r]/g, '')
                      .split(/[?#]/, 1)[0]
                      .split(/[/\\]/)
                : [];
        if (segments.some((segment) => /^[^!-\uFFFF]*(?:\.|%2e){1,2}[^!-\uFFFF]*$/i.test(segment))) {
            throw new ShipStationError('Refusing to send a request whose path contains a dot segment');
        }
        return fetchApi(url, init);
    };
}

/**
 * Entry point of the SDK. Instantiate it once and reuse it for every call to
 * the ShipStation API v2.
 */
export class ShipStationAPI {
    readonly configuration: Configuration;

    constructor(apiKey: string);
    constructor(config: ShipStationAPIConfig);
    constructor(apiKeyOrConfig: string | ShipStationAPIConfig) {
        const config = typeof apiKeyOrConfig === 'string' ? { apiKey: apiKeyOrConfig } : apiKeyOrConfig;

        if (!config?.apiKey || (typeof config.apiKey === 'string' && config.apiKey.trim() === '')) {
            throw new Error('A ShipStation API key is required.');
        }

        const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
        const timeout = config.timeout ?? DEFAULT_TIMEOUT;
        const fetchApi = withPathCheck(withTimeout(config.fetch ?? fetch, timeout), baseUrl);
        const headers = {
            [USER_AGENT_HEADER]: buildUserAgent(),
            ...(config.onBehalfOf ? { [ON_BEHALF_OF_HEADER]: config.onBehalfOf } : {}),
        };

        this.configuration = new Configuration({
            basePath: baseUrl,
            apiKey: config.apiKey,
            fetchApi,
            middleware: [errorTranslationMiddleware(), ...(config.middleware ?? [])],
            headers,
        });

        Object.assign(this, createApiClients(this.configuration));
    }
}

export interface ShipStationAPI extends ApiClients {}

export default ShipStationAPI;
