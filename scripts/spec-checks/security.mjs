import { HTTP_METHODS } from './http-methods.mjs';

export const SAFE_NAME = /^[A-Za-z0-9._:/~-]+$/;

/**
 * @param {string} path where `value` sits in the spec, used in the message
 * @param {string} kind what `value` is, used in the message
 * @param {unknown} value
 * @returns {string[]}
 */
const checkName = (path, kind, value) =>
    typeof value === 'string' && SAFE_NAME.test(value)
        ? []
        : [`${path}: ${kind} ${JSON.stringify(value)} must match ${SAFE_NAME}`];

/**
 * A `security` list looks like: [{ schemeName: [scope, scope] }, ...]
 *
 * @param {string} path
 * @param {object[] | undefined} requirements
 * @returns {string[]}
 */
const checkRequirements = (path, requirements) =>
    (requirements ?? []).flatMap((requirement, index) =>
        Object.entries(requirement ?? {}).flatMap(([scheme, scopes]) => [
            ...checkName(`${path}[${index}]`, 'security scheme name', scheme),
            ...(scopes ?? []).flatMap((scope) => checkName(`${path}[${index}].${scheme}`, 'scope', scope)),
        ])
    );

/**
 * @param {string} name key of the scheme under `components.securitySchemes`
 * @param {object} scheme
 * @returns {string[]}
 */
function checkScheme(name, scheme) {
    const path = `components.securitySchemes.${name}`;
    return [
        ...checkName(path, 'security scheme name', name),
        ...(scheme?.type === 'apiKey' ? checkName(`${path}.name`, 'apiKey name', scheme.name) : []),
        ...Object.entries(scheme?.flows ?? {}).flatMap(([flow, definition]) =>
            Object.keys(definition?.scopes ?? {}).flatMap((scope) => checkName(`${path}.flows.${flow}`, 'scope', scope))
        ),
    ];
}

/**
 * CHECK: security schemes, scopes and apiKey names.
 * @param {object} spec the parsed spec
 * @returns {string[]}
 */
export function checkSecurity(spec) {
    const schemes = Object.entries(spec.components?.securitySchemes ?? {}).flatMap(([name, scheme]) =>
        checkScheme(name, scheme)
    );

    const perOperation = Object.entries(spec.paths ?? {}).flatMap(([route, pathItem]) =>
        HTTP_METHODS.flatMap((method) =>
            checkRequirements(`paths.${route}.${method}.security`, pathItem?.[method]?.security)
        )
    );

    return [...schemes, ...checkRequirements('security', spec.security), ...perOperation];
}
