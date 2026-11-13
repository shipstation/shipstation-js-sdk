// Rejects a spec whose text the templates would turn into code in the generated SDK:
// - path keys must hold only URL-safe characters and {param} segments: templates/apis.mustache writes each one
//   verbatim into a template literal, so a backtick, `${` or backslash would otherwise become code.
// - no key or string may contain `*/`: descriptions are written raw into JSDoc comments (e.g. `unescapedDescription`
//   in templates/apis.mustache, templates/modelAnyOf.mustache and the upstream model templates), so `*/` would end
//   the comment and the text after it would become code.
// - every $ref and discriminator mapping must stay in this file: the generator resolves external ones, and their
//   strings would bypass the checks above.
import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';

const SAFE_PATH = /^\/(?:[A-Za-z0-9._~/-]|\{[A-Za-z0-9_]+\})*$/;
const SCHEMA_NAME = /^[A-Za-z0-9._-]+$/;

const specFile = process.argv[2];
const spec = load(readFileSync(specFile, 'utf8'));
const unsafe = Object.keys(spec?.paths ?? {})
    .filter((key) => !SAFE_PATH.test(key))
    .map((key) => `path key ${JSON.stringify(key)} has unsupported characters`);

const isLocalRef = (ref) => typeof ref !== 'string' || ref.startsWith('#');
const walk = (node, at) => {
    if (typeof node === 'string') {
        if (node.includes('*/')) unsafe.push(`${at} contains "*/"`);
        return;
    }
    if (node === null || typeof node !== 'object') return;
    for (const [key, value] of Object.entries(node)) {
        const here = `${at}/${key}`;
        if (key.includes('*/')) unsafe.push(`key ${JSON.stringify(here)} contains "*/"`);
        if (key === '$ref' && !isLocalRef(value)) unsafe.push(`${here} is not a local reference`);
        if (key === 'discriminator' && value?.mapping && typeof value.mapping === 'object') {
            for (const [name, target] of Object.entries(value.mapping)) {
                const isName = typeof target === 'string' && SCHEMA_NAME.test(target);
                if (!isName && !isLocalRef(target)) unsafe.push(`${here}/mapping/${name} is not a local reference`);
            }
        }
        walk(value, here);
    }
};
walk(spec, '#');

if (unsafe.length > 0) {
    console.error(`error: ${specFile} is unsafe to generate from:`);
    for (const problem of unsafe) console.error(`  ${problem}`);
    process.exit(1);
}
