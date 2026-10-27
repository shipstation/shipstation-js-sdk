/**
 * Runs against the built package: `npm run build && npm test`.
 * Guards against path parameters that fetch would resolve to another endpoint ('', '.', '..').
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ShipStationAPI, ShipStationError } from '../dist/index.js';

const recordingClient = (urls, middleware) =>
    new ShipStationAPI({
        apiKey: 'test-key',
        middleware,
        fetch: async (url) => {
            urls.push(url);
            return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
        },
    });

test('dot-segment or empty path parameters are refused before any request is sent', async () => {
    const urls = [];
    const api = recordingClient(urls);

    const calls = [
        () =>
            api.servicePoints.servicePointsGetById({
                carrierCode: '..',
                countryCode: 'account',
                servicePointId: 'settings',
            }),
        () => api.downloads.downloadFile({ dir: '..', subdir: 'shipments', filename: 'se-1' }),
        () => api.shipments.untagShipment({ shipmentId: '..', tagName: 'x' }),
        () => api.documents.listShipmentLabelDocuments({ shipmentId: '..' }),
        () => api.labels.getLabelById({ labelId: '' }),
        () => api.labels.getLabelById({ labelId: '.' }),
    ];
    for (const call of calls) {
        await assert.rejects(call, { name: 'RequiredError' });
    }
    assert.deepEqual(urls, []);
});

test('ordinary path parameters build the same URL as before', async () => {
    const urls = [];
    const api = recordingClient(urls);

    await api.labels.getLabelById({ labelId: 'se-123' });
    await api.shipments.untagShipment({ shipmentId: 'se-1', tagName: 'a b/..' });

    assert.deepEqual(urls, [
        'https://api.shipstation.com/v2/labels/se-123',
        'https://api.shipstation.com/v2/shipments/se-1/tags/a%20b%2F..',
    ]);
});

test('a URL whose path fetch would rewrite never reaches fetch', async () => {
    const rewrites = [
        ...['..', '.%2E', '%2e%2e', '.\t.', '.\\.'].map((dots) => (url) => url.replace('/se-1/', `/${dots}/`)),
        // fetch trims trailing C0 controls and spaces before it resolves the final segment
        ...[' ', '\x00'].map((tail) => (url) => url.replace(/\/se-1\/.*$/, `/..${tail}`)),
    ];
    for (const rewrite of rewrites) {
        const urls = [];
        const api = recordingClient(urls, [{ pre: async ({ url, init }) => ({ url: rewrite(url), init }) }]);

        await assert.rejects(api.documents.listShipmentLabelDocuments({ shipmentId: 'se-1' }), ShipStationError);
        assert.deepEqual(urls, []);
    }
});

test('base URLs that worked before are still accepted', async () => {
    for (const baseUrl of ['https://proxy.example/envío', 'https://proxy.example/a/../b']) {
        const urls = [];
        const api = new ShipStationAPI({
            apiKey: 'test-key',
            baseUrl,
            fetch: async (url) => {
                urls.push(url);
                return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
            },
        });

        await api.labels.getLabelById({ labelId: 'se-123' });
        assert.deepEqual(urls, [`${baseUrl}/v2/labels/se-123`]);
    }
});
