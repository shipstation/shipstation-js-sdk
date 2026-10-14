// Runs against the built package: `npm run build && npm test`.
// Guards against union request bodies dropping fields of the matched carrier.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ShipStationAPI } from '../dist/index.js';

const CASES = [
    {
        carrierName: 'fedex',
        body: {
            nickname: 'fedex',
            accountNumber: '123456789',
            agreeToEula: true,
            meterNumber: '999',
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.com',
            phone: '5125550100',
            address1: '1 Main St',
            city: 'Austin',
            state: 'TX',
            postalCode: '78701',
            countryCode: 'US',
        },
        expected: {
            nickname: 'fedex',
            account_number: '123456789',
            agree_to_eula: true,
            meter_number: '999',
            first_name: 'Ada',
            last_name: 'Lovelace',
            email: 'ada@example.com',
            phone: '5125550100',
            address1: '1 Main St',
            city: 'Austin',
            state: 'TX',
            postal_code: '78701',
            country_code: 'US',
        },
    },
    {
        carrierName: 'ups',
        body: { nickname: 'ups', accountNumber: 'A1B2C3', accountPostalCode: '78701', accountCountryCode: 'US' },
        expected: {
            nickname: 'ups',
            account_number: 'A1B2C3',
            account_postal_code: '78701',
            account_country_code: 'US',
        },
    },
    {
        carrierName: 'dhl_ecommerce',
        body: {
            nickname: 'dhl',
            clientId: 'client',
            username: 'user',
            password: 'secret',
            pickupNumber: '1234',
            distributionCenter: 'USORD1',
            apiKey: 'key',
            apiSecret: 'shh',
        },
        expected: {
            nickname: 'dhl',
            client_id: 'client',
            username: 'user',
            password: 'secret',
            pickup_number: '1234',
            distribution_center: 'USORD1',
            api_key: 'key',
            api_secret: 'shh',
        },
    },
];

for (const { carrierName, body, expected } of CASES) {
    test(`connectCarrier sends every field for ${carrierName}`, async () => {
        let sentBody;
        const client = new ShipStationAPI({
            apiKey: 'test-key',
            fetch: async (_url, init) => {
                sentBody = JSON.parse(init.body);
                return new Response(JSON.stringify({ carrier_id: 'se-123' }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            },
        });

        await client.connections.connectCarrier({ carrierName, connectCarrierRequestBody: body });

        assert.deepEqual(sentBody, expected);
    });
}
