/**
 * \x85 = U+0085 (NEL), \u{2028} / \u{2029} = line / paragraph separator, \u{FEFF} = BOM
 */
const AMBIGUOUS_CHARS = /[\x85\u{2028}\u{2029}\u{FEFF}]/gu;

/**
 * CHECK: the raw file, before any YAML parsing.
 * @param {Uint8Array} buffer contents of the spec file
 * @returns {{ text: string } | { errors: string[] }}
 */
export function checkRawText(buffer) {
    let text;
    try {
        /**
         * ignoreBOM: true keeps a leading BOM in the text (by default the decoder drops it silently)
         */
        text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(buffer);
    } catch {
        return { errors: ['spec is not valid UTF-8'] };
    }

    const errors = [];
    text.split(/\r\n|\r|\n/).forEach((line, index) => {
        for (const match of line.matchAll(AMBIGUOUS_CHARS)) {
            const code = match[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
            errors.push(`line ${index + 1}, column ${match.index + 1}: forbidden character U+${code}`);
        }
    });
    return errors.length > 0 ? { errors } : { text };
}
