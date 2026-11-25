/**
 * Gatekeeper between the OpenAPI spec and the code generator.
 * Usage: node scripts/check-spec.mjs <spec.yaml> <output.json>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { JSON_SCHEMA, load } from 'js-yaml';

import { checkCommentEnd, neutraliseCommentEnd } from './spec-checks/comment-end.mjs';
import { checkMediaTypes } from './spec-checks/media-types.mjs';
import { checkPaths } from './spec-checks/paths.mjs';
import { checkRawText } from './spec-checks/raw-text.mjs';
import { checkSecurity } from './spec-checks/security.mjs';

/**
 * Checks on the parsed document: each one takes the spec and returns a list of error messages.
 */
const DOCUMENT_CHECKS = [checkCommentEnd, checkPaths, checkMediaTypes, checkSecurity];

/**
 * @param {Uint8Array} buffer contents of the spec file
 * @returns {{ json: string } | { errors: string[] }}
 */
export function checkSpec(buffer) {
    const raw = checkRawText(buffer);
    if (raw.errors) {
        return raw;
    }

    /**
     * JSON_SCHEMA: plain YAML types only (no timestamps, binary, merge keys...), so the result maps 1:1 to JSON
     */
    const spec = load(raw.text, { schema: JSON_SCHEMA });
    if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) {
        return { errors: ['spec root must be a mapping'] };
    }

    let json;
    try {
        json = JSON.stringify(spec);
    } catch {
        return { errors: ['spec has a circular YAML alias'] };
    }

    const errors = DOCUMENT_CHECKS.flatMap((check) => check(spec));
    return errors.length > 0 ? { errors } : { json: neutraliseCommentEnd(json) };
}

function main() {
    const [specFile, outputFile] = process.argv.slice(2);

    if (!specFile || !outputFile) {
        console.error('usage: check-spec.mjs <spec.yaml> <output.json>');
        process.exit(2);
    }

    const { errors, json } = checkSpec(readFileSync(specFile));

    if (errors) {
        console.error(`error: ${specFile} was rejected:`);

        for (const message of errors) {
            console.error(`  ${message}`);
        }

        process.exit(1);
    }

    writeFileSync(outputFile, json);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
