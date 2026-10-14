# Custom generator templates

Overrides of the `typescript-fetch` templates of `openapi-generator` (see `templateDir` in
[`openapi-generator-config.yaml`](../openapi-generator-config.yaml)). They are based on the generator version pinned
in [`scripts/generate.sh`](../scripts/generate.sh).

| Template                | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| `api-registry.mustache` | Generates `api-registry.ts`, the per-API clients behind `ShipStationAPI`. |
| `apis.mustache`         | `*Raw` methods always take `requestParameters` (`{}` if no params).       |
| `models.mustache`       | Renders `anyOf` models with `modelAnyOf.mustache`.                        |
| `modelAnyOf.mustache`   | Renders `anyOf` of models as a union type.                                |
| `modelOneOf.mustache`   | Merges every matching member when (de)serializing unions.                 |

## Why the model templates are overridden

- **`anyOf`:** upstream does not support it. It merges all members into one interface, which breaks with duplicate
  properties (e.g. `connect_carrier_request_body`). `modelAnyOf` only takes effect once a schema in `spec/openapi.yaml`
  uses `anyOf`; the `sync` workflow exercises it when the spec adopts it.
- **Unions:** upstream (de)serializes with the first member that matches, silently dropping the fields it does not
  know (12 of 28 carriers in `connectCarrier`). We merge all matching members instead.

Covered by `tests/connect-carrier-serialization.test.mjs` (`npm run build && npm test`).

## Upgrading the generator

Diff these templates against the new upstream version. If upstream supports `anyOf` and no longer drops fields, delete
the model overrides and keep the test.
