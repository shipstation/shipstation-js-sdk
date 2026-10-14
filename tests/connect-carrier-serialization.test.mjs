/**
 * Runs against the built package: `npm run build && npm test`.
 * Guards against union bodies dropping fields of the matched member, when serializing and when deserializing.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ShipStationAPI } from '../dist/index.js';

const toSnakeCase = (key) => key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

const snakeCaseKeys = (object) =>
    Object.fromEntries(Object.entries(object).map(([key, value]) => [toSnakeCase(key), value]));

const clientWithResponse = (onRequest, responseBody) =>
    new ShipStationAPI({
        apiKey: 'test-key',
        fetch: async (_url, init) => {
            onRequest(init);
            return new Response(JSON.stringify(responseBody), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        },
    });

// One entry per carrier whose body used to lose fields behind the first-match union dispatch.
const CARRIER_BODIES = {
    fedex: {
        nickname: 'fedex',
        accountNumber: '123456789',
        agreeToEula: true,
        meterNumber: '999',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '5125550100',
        address1: '1 Main St',
        address2: 'Suite 2',
        city: 'Austin',
        company: 'Analytical',
        state: 'TX',
        postalCode: '78701',
        countryCode: 'US',
    },
    fedex_uk: {
        nickname: 'fedex uk',
        accountNumber: '123456789',
        agreeToEula: true,
        meterNumber: '999',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '5125550100',
        address1: '1 Main St',
        city: 'London',
        state: 'LND',
        postalCode: 'SW1A 1AA',
        countryCode: 'GB',
    },
    ups: { nickname: 'ups', accountNumber: 'A1B2C3', accountPostalCode: '78701', accountCountryCode: 'US' },
    dhl_ecommerce: {
        nickname: 'dhl',
        clientId: 'client',
        username: 'user',
        password: 'secret',
        pickupNumber: '1234',
        distributionCenter: 'USORD1',
        apiKey: 'key',
        apiSecret: 'shh',
    },
    dhl_express: { nickname: 'dhl express', accountNumber: '1', siteId: 'site', password: 'secret', countryCode: 'US' },
    dhl_express_uk: { nickname: 'dhl uk', accountNumber: '1', siteId: 'site', password: 'secret' },
    asendia: {
        nickname: 'asendia',
        accountNumber: '1',
        username: 'user',
        password: 'secret',
        apiKey: 'key',
        processingLocation: 'ORD',
        subAccountNumber: '2',
    },
    canada_post: { nickname: 'cp', apiKey: 'key', apiSecret: 'shh', accountNumber: '1', contractId: 'c1' },
    dpd: { nickname: 'dpd', accountNumber: '1', password: 'secret' },
    ontrac: { nickname: 'ontrac', accountNumber: '1', password: 'secret' },
    purolator_canada: { nickname: 'purolator', accountNumber: '1', activationKey: 'act' },
    royal_mail: {
        nickname: 'rm',
        accountNumber: '1',
        contactName: 'Ada',
        city: 'London',
        postalCode: 'SW1A 1AA',
        obaEmail: 'oba@example.com',
        email: 'ada@example.com',
        companyName: 'Analytical',
        streetLine1: '1 Main St',
        streetLine2: 'Floor 2',
        streetLine3: 'Room 3',
        phone: '5125550100',
    },
};

for (const [carrierName, body] of Object.entries(CARRIER_BODIES)) {
    test(`connectCarrier sends every field for ${carrierName}`, async () => {
        let sentBody;
        const client = clientWithResponse((init) => (sentBody = JSON.parse(init.body)), { carrier_id: 'se-123' });
        await client.connections.connectCarrier({ carrierName, connectCarrierRequestBody: body });
        assert.deepEqual(sentBody, snakeCaseKeys(body));
    });
}

test('getCarrierSettings keeps the fields of the matching member when deserializing', async () => {
    // Every member of the response union has only optional fields, so all of them match.
    const client = clientWithResponse(() => {}, {
        nickname: 'ups',
        is_primary_account: true,
        use_negotiated_rates: true,
        account_postal_code: '78701',
    });

    const settings = await client.connections.getCarrierSettings({ carrierName: 'ups', carrierId: 'se-123' });

    assert.equal(settings.nickname, 'ups');
    assert.equal(settings.isPrimaryAccount, true);
    assert.equal(settings.useNegotiatedRates, true);
    assert.equal(settings.accountPostalCode, '78701');
});
