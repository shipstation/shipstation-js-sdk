[![ShipStation API](https://www.shipengine.com/wp-content/uploads/Logo_ShipStationAPI_WhiteGreen_RGB-1.svg)](https://www.shipengine.com/)

# ShipStation API JavaScript SDK

JavaScript/TypeScript SDK for the [ShipStation API v2](https://docs.shipstation.com/). The client
surface is generated from the API's OpenAPI spec; the transport, error handling, and configuration
around it are hand-written.

## Installation

```bash
npm install @shipstation/shipstation-js-sdk
```

Requires Node.js `>=22.22.2`. Ships as both ESM and CommonJS.

## Quickstart

```ts
import { ShipStationAPI } from '@shipstation/shipstation-js-sdk';

const api = new ShipStationAPI('your-api-key');

const shipments = await api.shipments.listShipments();
```

You can also pass a config object instead of a bare API key:

```ts
const api = new ShipStationAPI({
    apiKey: 'your-api-key',
    baseUrl: 'https://api.shipstation.com', // default
    timeout: 60000, // per-attempt request timeout, in ms
    onBehalfOf: 'partner-seller-id', // sent as the `on-behalf-of` header; for partner API keys
    fetch: customFetch, // override the fetch implementation (testing, proxies, HTTP/2, ...)
    middleware: [myMiddleware], // extra middleware appended after this SDK's own
});
```

Every resource in the API is exposed as a property on the `ShipStationAPI` instance (e.g.
`api.shipments`, `api.labels`, `api.rates`, ...), matching the tags in the OpenAPI spec.

## `method` vs `methodRaw`

Every operation is generated twice, e.g. `listCarriers` and `listCarriersRaw`:

```ts
// Raw: returns the parsed response wrapped with access to status/headers
const raw = await api.carriers.listCarriersRaw();
raw.raw.status; // 201
const carriers = await raw.value();

// Plain: just the parsed body
const carriers = await api.carriers.listCarriers();
```

Use the plain method by default. Use `Raw` only when you need the status code or headers.

## Error handling

All errors thrown by the SDK extend `ShipStationError`:

- `ShipStationApiError` — the API responded with a non-2xx status. Carries `status`, `errors`
  (the parsed error body), and `requestId` when the API returned one.
- `ShipStationConnectionError` — the request failed before getting a response (network error,
  DNS, etc).
- `ShipStationTimeoutError` — the request exceeded the configured `timeout`.

```ts
import { ShipStationApiError } from '@shipstation/shipstation-js-sdk';

await api.labels
  .createLabel({ createLabelRequest: { ... } })
  .catch((error: ShipStationApiError) => {
    console.error(error.status, error.errors, error.requestId);
  })
```

## Versioning and changelogs

This package follows [semantic versioning](https://semver.org/), released automatically by
[semantic-release](https://semantic-release.gitbook.io/) from conventional commits.

- [CHANGELOG.md](./CHANGELOG.md) — SDK package releases (versions, dates, what changed in code).
- [API-CHANGELOG.md](./API-CHANGELOG.md) — changes to the underlying API contract that this SDK is
  generated from, independent of SDK code changes.

---

## Development and releases

### Contributing

Contributions, enhancements, and bug-fixes are welcome! [Open an issue](https://github.com/shipstation/shipstation-js-sdk/issues) on GitHub and [submit a pull request](https://github.com/shipstation/shipstation-js-sdk/pulls).
See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development workflow and PR conventions, and
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community expectations. CI runs `npm run verify` and
`npm test` on every pull request.

To report a security vulnerability, follow [SECURITY.md](./SECURITY.md) instead of opening a public issue.

### Generating the SDK locally

The generated client (`src/generated/`) is never committed — it's derived code, rebuilt from the
OpenAPI spec on demand. Generating it requires [Docker](https://docs.docker.com/get-docker/). The spec
itself lives versioned in the repo at [`spec/openapi.yaml`](./spec/openapi.yaml).

```bash
npm run codegen
npm run verify
```

`scripts/generate.sh` uses `spec/openapi.yaml` by default. Point it at a different file with
`SHIPSTATION_SPEC_FILE=/path/to/openapi.yaml npm run codegen` if you need to generate against a spec
that hasn't been synced yet.

### How releases work

Commit messages on `main` (in practice, the PR titles from squash-merged PRs) are analyzed as
[conventional commits](https://www.conventionalcommits.org/):

| Commit type                                      | Release    |
| ------------------------------------------------ | ---------- |
| `feat`                                           | minor      |
| `fix`, `perf`, `refactor`                        | patch      |
| any type with `!` or a `BREAKING CHANGE:` footer | major      |
| `docs`, `chore`, `test`, `ci`, `build`, `style`  | no release |

On a release, semantic-release updates `CHANGELOG.md`, bumps `package.json`, creates a git tag and
GitHub Release, and publish the package.

### Making a breaking change

**The automated spec-sync PR always ships as `feat:` (minor).** `oasdiff` only generates a report
of what changed — it never decides the version, and nothing detects breaking changes for you. The
PR body includes an advisory `oasdiff breaking` report, but it's just that: advisory.

If a spec change is actually breaking for SDK consumers, **edit the PR title before merging**, from:

```
feat: sync ShipStation API v2 spec
```

to:

```
feat!: sync ShipStation API v2 spec
```

The `!` is what makes semantic-release cut a major release.

For a manual, hand-written SDK change, use the same convention: `feat!:` / `fix!:` in the commit
subject, or a `BREAKING CHANGE:` footer in the commit body.

## License

Apache-2.0 — see [LICENSE](./LICENSE).
