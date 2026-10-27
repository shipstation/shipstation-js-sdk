// Rejects a spec whose path keys hold anything other than URL-safe characters and {param} segments.
// templates/apis.mustache writes each path key verbatim into a template literal, so a backtick, `${` or
// backslash in a key would otherwise become code in the generated SDK.
import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';

const SAFE_PATH = /^\/(?:[A-Za-z0-9._~/-]|\{[A-Za-z0-9_]+\})*$/;

const specFile = process.argv[2];
const spec = load(readFileSync(specFile, 'utf8'));
const unsafe = Object.keys(spec?.paths ?? {}).filter((key) => !SAFE_PATH.test(key));

if (unsafe.length > 0) {
    console.error(`error: ${specFile} has path keys with unsupported characters:`);
    for (const key of unsafe) console.error(`  ${JSON.stringify(key)}`);
    process.exit(1);
}
