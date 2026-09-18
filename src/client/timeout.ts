import type { FetchAPI } from '../generated/runtime';
import { ShipStationTimeoutError } from './errors';

/**
 * Wraps a fetch-compatible function with a per-attempt timeout. Deliberately done here
 * rather than as a `Middleware.pre` hook: a middleware can attach an AbortSignal but has
 * no `finally` to clear the timer once the request settles, which would leak a timer per
 * call. `AbortSignal.timeout` self-clears; this decorator just has to combine it with
 * whatever signal the caller already passed in.
 */
export function withTimeout(fetchApi: FetchAPI, timeoutMs: number): FetchAPI {
    return async (url, init) => {
        const timeoutSignal = AbortSignal.timeout(timeoutMs);
        const signal = init?.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal;

        try {
            return await fetchApi(url, { ...init, signal });
        } catch (error) {
            const callerAborted = init?.signal?.aborted ?? false;
            if (timeoutSignal.aborted && !callerAborted) {
                throw new ShipStationTimeoutError(timeoutMs);
            }
            throw error;
        }
    };
}
