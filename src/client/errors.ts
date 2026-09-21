import type { ModelError } from '../generated/models/ModelError';
import { ErrorResponseBodyFromJSON } from '../generated/models/ErrorResponseBody';

export class ShipStationError extends Error {
    constructor(message: string, options?: { cause?: unknown }) {
        super(message, options);
        this.name = 'ShipStationError';
    }
}

/**
 * The API responded with a non-2xx status and a parseable ShipStation error body.
 * Reuses the generated `ModelError`/`ErrorResponseBody` types instead of a hand-written
 * copy.
 */
export class ShipStationApiError extends ShipStationError {
    readonly status: number;
    readonly raw: Response;
    readonly errors: ModelError[];
    readonly requestId: string | undefined;

    constructor(response: Response, requestId: string | undefined, errors: ModelError[]) {
        const firstMessage = errors[0]?.message;
        const summary = firstMessage ? `${firstMessage}` : `Request failed with status ${response.status}`;
        super(requestId ? `${summary} (requestId: ${requestId})` : summary);
        this.name = 'ShipStationApiError';
        this.status = response.status;
        this.requestId = requestId;
        this.errors = errors;
        this.raw = response;
    }

    is(code: string): boolean {
        return this.errors.some((e) => e.errorCode === code);
    }

    static async fromResponse(response: Response): Promise<ShipStationApiError> {
        let requestId: string | undefined;
        let errors: ModelError[] = [];

        try {
            const body: unknown = await response.clone().json();
            const parsed = ErrorResponseBodyFromJSON(body);
            requestId = parsed.requestId;
            errors = parsed.errors;
        } catch {
            // Response body wasn't JSON, or didn't match ErrorResponseBody's shape
            // (e.g. an upstream proxy error): fall back to a bare status-based error.
        }

        return new ShipStationApiError(response, requestId, errors);
    }
}

export class ShipStationConnectionError extends ShipStationError {
    constructor(cause: unknown) {
        super('Failed to reach the ShipStation API', { cause });
        this.name = 'ShipStationConnectionError';
    }
}

export class ShipStationTimeoutError extends ShipStationError {
    constructor(timeoutMs: number) {
        super(`ShipStation API request timed out after ${timeoutMs}ms`);
        this.name = 'ShipStationTimeoutError';
    }
}
