/**
 * Guards the spec gatekeeper (scripts/check-spec.mjs): spec text that could become code in the generated SDK
 * must be rejected before the generator runs. Does not need a build or Docker.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { checkSpec } from '../scripts/check-spec.mjs';
import { neutraliseCommentEnd } from '../scripts/spec-checks/comment-end.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SCRIPT = join(ROOT, 'scripts/check-spec.mjs');
const PAYLOAD = "*/ } throw new Error('x'); interface _I { /*";
const SCOPE_PAYLOAD = `"]); throw new Error('x'); (["`;

const baseSpec = (overrides = {}) => ({
    openapi: '3.1.0',
    info: { title: 't', version: '1' },
    security: [{ api_keys: [] }],
    paths: {
        '/v2/things/{thing_id}': {
            get: {
                operationId: 'getThing',
                parameters: [{ name: 'thing_id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: {
                        description: 'ok',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/thing' } } },
                    },
                },
            },
        },
    },
    components: {
        securitySchemes: { api_keys: { type: 'apiKey', name: 'api-key', in: 'header' } },
        schemas: { thing: { type: 'object', properties: { id: { type: 'string', description: 'plain' } } } },
    },
    ...overrides,
});

const check = (spec) => checkSpec(Buffer.from(typeof spec === 'string' ? spec : JSON.stringify(spec)));
const clone = (value) => structuredClone(value);

const rejected = (spec, fragment) => {
    const { errors, json } = check(spec);
    assert.equal(json, undefined);
    assert.ok(errors?.length > 0, 'expected the spec to be rejected');
    if (fragment)
        assert.ok(
            errors.some((message) => message.includes(fragment)),
            `no error mentions ${fragment}: ${errors.join(' | ')}`
        );
};

test('a well-formed spec is accepted', () => {
    const { errors, json } = check(baseSpec());
    assert.equal(errors, undefined);
    assert.equal(JSON.parse(json).paths['/v2/things/{thing_id}'].get.operationId, 'getThing');
});

test('the checked-in spec is accepted', () => {
    const { errors } = checkSpec(readFileSync(join(ROOT, 'spec/openapi.yaml')));
    assert.equal(errors, undefined);
});

test('"*/" is rejected in parameter, anyOf schema and model property descriptions', () => {
    const parameter = clone(baseSpec());
    parameter.paths['/v2/things/{thing_id}'].get.parameters[0].description = PAYLOAD;
    rejected(parameter, '*/');

    const anyOf = clone(baseSpec());
    anyOf.components.schemas.either = { anyOf: [{ type: 'string', description: PAYLOAD }, { type: 'integer' }] };
    rejected(anyOf, '*/');

    const property = clone(baseSpec());
    property.components.schemas.thing.properties.id.description = PAYLOAD;
    rejected(property, '*/');

    const key = clone(baseSpec());
    key.components.schemas.thing.properties[PAYLOAD] = { type: 'string' };
    rejected(key, '*/');
});

test('an oauth2 scope that is not on the allow-list is rejected, in the scheme and in security requirements', () => {
    const oauth = (extra) =>
        clone(
            baseSpec({
                components: {
                    securitySchemes: {
                        oauth: {
                            type: 'oauth2',
                            flows: { clientCredentials: { tokenUrl: 'https://x.test/t', scopes: extra } },
                        },
                    },
                },
            })
        );

    rejected(oauth({ [SCOPE_PAYLOAD]: 'bad' }), 'scope');

    const global = oauth({ read: 'ok' });
    global.security = [{ oauth: [SCOPE_PAYLOAD] }];
    rejected(global, 'scope');

    const perOperation = oauth({ read: 'ok' });
    perOperation.paths['/v2/things/{thing_id}'].get.security = [{ oauth: [SCOPE_PAYLOAD] }];
    rejected(perOperation, 'scope');

    const accepted = oauth({ 'shipments:read': 'ok', 'a.b/c-d_e~f': 'ok' });
    accepted.security = [{ oauth: ['shipments:read'] }];
    assert.equal(check(accepted).errors, undefined);
});

test('media types with a quote, backtick, backslash, "${" or line terminator are rejected', () => {
    for (const mediaType of ["a/b'c", 'a/b"c', 'a/b`c', 'a/b\\c', 'a/${x}', 'a/b\nc', 'a/b\rc']) {
        const request = clone(baseSpec());
        request.paths['/v2/things/{thing_id}'].get.requestBody = {
            content: { [mediaType]: { schema: { type: 'string' } } },
        };
        rejected(request, 'media type');

        const response = clone(baseSpec());
        response.paths['/v2/things/{thing_id}'].get.responses[200].content = { [mediaType]: {} };
        rejected(response, 'media type');
    }
});

test('a property named "content" is not treated as a media type map', () => {
    const spec = clone(baseSpec());
    spec.components.schemas.thing.properties.content = { type: 'object', properties: { "it's": { type: 'string' } } };
    assert.equal(check(spec).errors, undefined);
});

test('security scheme names and apiKey names that are not on the allow-list are rejected', () => {
    const scheme = clone(baseSpec());
    scheme.components.securitySchemes['a"b'] = { type: 'http', scheme: 'bearer' };
    rejected(scheme, 'security scheme name');

    const requirement = clone(baseSpec());
    requirement.security = [{ 'a"b': [] }];
    rejected(requirement, 'security scheme name');

    for (const name of ['a"b', 'a`b', 'a\\b', 'a\nb', '']) {
        const apiKey = clone(baseSpec());
        apiKey.components.securitySchemes.api_keys.name = name;
        rejected(apiKey, 'apiKey name');
    }
});

test('path keys that are not URL-safe are rejected', () => {
    for (const key of ['/v2/x`y', '/v2/x${code}', '/v2/x\\y', 'v2/x']) {
        const spec = clone(baseSpec());
        spec.paths[key] = { get: { responses: { 200: { description: 'ok' } } } };
        rejected(spec, 'path key');
    }
});

test('U+0085, U+2028, U+2029 and a BOM are rejected anywhere in the file, including inside a comment', () => {
    const yaml = (comment) => `openapi: 3.1.0\ninfo:\n  title: t\n  version: '1'\n${comment}\npaths: {}\n`;
    const smuggled = (char) => yaml(`# comment${char}  /v2/x\${code}: {}`);

    for (const [name, char] of [
        ['U+0085', '\u0085'],
        ['U+2028', '\u2028'],
        ['U+2029', '\u2029'],
        ['U+FEFF', '\uFEFF'],
    ]) {
        const { errors } = check(smuggled(char));
        assert.ok(
            errors?.some((message) => message.includes(name)),
            `${name} was not reported`
        );
    }
    assert.ok(check(`${String.fromCharCode(0xfeff)}${yaml('')}`).errors?.some((message) => message.includes('U+FEFF')));
    assert.equal(check(yaml('# plain comment')).errors, undefined);
});

test('invalid UTF-8 is rejected', () => {
    const { errors } = checkSpec(Buffer.from([0x6f, 0x70, 0xff, 0xfe]));
    assert.match(errors[0], /UTF-8/);
});

test('"*/" is neutralised in every string and key of the generator input', () => {
    const json = neutraliseCommentEnd(
        JSON.stringify({ [PAYLOAD]: [PAYLOAD, { nested: PAYLOAD }], n: 1, t: true, z: null })
    );
    const document = JSON.parse(json);
    assert.ok(!JSON.stringify(document).includes('*/'));
    assert.ok(Object.hasOwn(document, PAYLOAD.replaceAll('*/', '*\\/')));
    assert.deepEqual([document.n, document.t, document.z], [1, true, null]);
});

test('the CLI writes the validated JSON on success and nothing on rejection', () => {
    const dir = mkdtempSync(join(tmpdir(), 'check-spec-'));
    const good = join(dir, 'good.yaml');
    const bad = join(dir, 'bad.yaml');
    writeFileSync(good, JSON.stringify(baseSpec()));
    const evil = clone(baseSpec());
    evil.components.schemas.thing.properties.id.description = PAYLOAD;
    writeFileSync(bad, JSON.stringify(evil));

    const ok = spawnSync(process.execPath, [SCRIPT, good, join(dir, 'good.json')], { encoding: 'utf8' });
    assert.equal(ok.status, 0, ok.stderr);
    assert.equal(JSON.parse(readFileSync(join(dir, 'good.json'), 'utf8')).openapi, '3.1.0');

    const fail = spawnSync(process.execPath, [SCRIPT, bad, join(dir, 'bad.json')], { encoding: 'utf8' });
    assert.equal(fail.status, 1);
    assert.match(fail.stderr, /\*\//);
    assert.throws(() => readFileSync(join(dir, 'bad.json')), { code: 'ENOENT' });
});

test('the generator is fed the validated JSON, not the original YAML', () => {
    const config = readFileSync(join(ROOT, 'openapi-generator-config.yaml'), 'utf8');
    const script = readFileSync(join(ROOT, 'scripts/generate.sh'), 'utf8');

    assert.match(config, /^inputSpec: \/spec\/openapi\.json$/m);
    assert.match(script, /scripts\/check-spec\.mjs" "\$SPEC_FILE" "\$INPUT_DIR\/openapi\.json"/);
    assert.match(script, /-v "\$INPUT_DIR:\/spec:ro"/);
    assert.ok(!/\$SPEC_DIR|\$SPEC_MOUNT/.test(script), 'the original spec directory must not be mounted');
});
