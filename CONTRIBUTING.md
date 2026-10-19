# Contributing

Thanks for your interest in improving the ShipStation JavaScript SDK.

## Before you start

- For bugs and feature requests, [open an issue](https://github.com/shipstation/shipstation-js-sdk/issues) first.
- For security issues, follow [SECURITY.md](./SECURITY.md) instead.
- Everything under `src/generated/` is derived from [`spec/openapi.yaml`](./spec/openapi.yaml) and is
  never committed. Do not edit generated code; change the hand-written code in `src/client/`, the
  generator `templates/`, or the spec sync process instead.

## Development setup

Requires Node.js (see [`.nvmrc`](./.nvmrc)) and [Docker](https://docs.docker.com/get-docker/) for code generation.

```bash
npm ci
npm run codegen
npm run verify
npm test
```

`npm run verify` runs typecheck, lint, format check and build. `npm test` runs against the built
package, so run `verify` (or `build`) first. Use `npm run lint:fix` to apply lint and formatting fixes.

## Pull requests

- Branch from `main` and keep each PR focused on a single change.
- Add or update tests in `tests/` for behavior changes.
- CI runs `npm run verify` and `npm test` on every PR; both must pass.
- PRs are squash-merged and the **PR title becomes the commit message**, so it must follow
  [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, ...).
  Releases are cut automatically from these titles. Use `!` (for example `feat!:`) for breaking
  changes. See the [release rules in the README](./README.md#how-releases-work).

## License

By contributing, you agree that your contributions are licensed under the [Apache-2.0 License](./LICENSE).
