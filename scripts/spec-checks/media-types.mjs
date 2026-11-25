import { HTTP_METHODS } from './http-methods.mjs';

/**
 * Rejected: quote, double quote, backtick, backslash, "${", and any line break or control character.
 */
const UNSAFE_MEDIA_TYPE = /["'`\\]|\$\{|[\p{Cc}\p{Zl}\p{Zp}]/u;

/**
 * @param {string} path where `holder` sits in the spec, used in the messages
 * @param {object | undefined} holder an object that may have a `content` map (requestBody, response, parameter)
 * @returns {string[]}
 */
const checkContent = (path, holder) => {
    return Object.keys(holder?.content ?? {})
        .filter((mediaType) => UNSAFE_MEDIA_TYPE.test(mediaType))
        .map((mediaType) => `${path}.content: unsafe media type ${JSON.stringify(mediaType)}`);
};

/**
 * @param {string} path
 * @param {object} operation one operation (e.g. the `get` of a path item)
 * @returns {string[]}
 */
function checkOperation(path, operation) {
    return [
        ...checkContent(`${path}.requestBody`, operation.requestBody),
        ...Object.entries(operation.responses ?? {}).flatMap(([code, response]) =>
            checkContent(`${path}.responses.${code}`, response)
        ),
        ...(operation.parameters ?? []).flatMap((parameter, index) =>
            checkContent(`${path}.parameters[${index}]`, parameter)
        ),
    ];
}

/**
 * CHECK: media types (the keys of any `content` map).
 * @param {object} spec the parsed spec
 * @returns {string[]}
 */
export function checkMediaTypes(spec) {
    const fromOperations = Object.entries(spec.paths ?? {}).flatMap(([route, pathItem]) =>
        HTTP_METHODS.filter((method) => pathItem?.[method]).flatMap((method) =>
            checkOperation(`paths.${route}.${method}`, pathItem[method])
        )
    );

    const fromComponents = ['requestBodies', 'responses', 'parameters'].flatMap((kind) =>
        Object.entries(spec.components?.[kind] ?? {}).flatMap(([name, holder]) =>
            checkContent(`components.${kind}.${name}`, holder)
        )
    );

    return [...fromOperations, ...fromComponents];
}
