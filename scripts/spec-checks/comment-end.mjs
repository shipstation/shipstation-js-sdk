const COMMENT_END = '*/';

/**
 * CHECK: "*\/" inside any string or key of the spec.
 * @param {unknown} node any value of the parsed spec
 * @param {string} path where `node` sits in the spec, used in the messages
 * @returns {string[]} one message per offending string or key
 */
export function checkCommentEnd(node, path = '$') {
    if (typeof node === 'string') {
        return node.includes(COMMENT_END)
            ? [`${path}: string contains "${COMMENT_END}": ${JSON.stringify(node.slice(0, 80))}`]
            : [];
    }

    if (node === null || typeof node !== 'object') {
        return [];
    }

    return Object.entries(node).flatMap(([key, value]) => [
        ...(key.includes(COMMENT_END) ? [`${path}.${key}: key contains "${COMMENT_END}"`] : []),
        ...checkCommentEnd(value, `${path}.${key}`),
    ]);
}

/**
 * Defense in depth. In JSON text, the three characters `*\/` are written `*\\/`.
 *
 * @param {string} json
 * @returns {string}
 */
export const neutraliseCommentEnd = (json) => json.replaceAll(COMMENT_END, '*\\\\/');
