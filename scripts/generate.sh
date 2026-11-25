#!/usr/bin/env bash
# Regenerates src/generated from a ShipStation API v2 OpenAPI spec using
# openapi-generator (typescript-fetch), via Docker. Version pinned deliberately.
set -euo pipefail

# Pinned by digest: a re-pushed tag must not change what runs. Update both together.
GENERATOR_IMAGE="openapitools/openapi-generator-cli:v7.25.0@sha256:2ab0a9680222de65dc9d3baf861aa02b99e1b80c211d8221ebf3ae8f8a102524"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SPEC_FILE="${SHIPSTATION_SPEC_FILE:-$REPO_ROOT/spec/openapi.yaml}"
case "$SPEC_FILE" in
    /*) ;;
    *) SPEC_FILE="$REPO_ROOT/$SPEC_FILE" ;;
esac

if [ ! -f "$SPEC_FILE" ]; then
    echo "error: spec not found at $SPEC_FILE" >&2
    exit 1
fi

# The generator never reads the original YAML: it gets the JSON that check-spec.mjs validated, so what is
# checked is exactly what is generated (no second YAML parser involved).
INPUT_DIR="$(mktemp -d)"
trap 'rm -rf "$INPUT_DIR"' EXIT
node "$REPO_ROOT/scripts/check-spec.mjs" "$SPEC_FILE" "$INPUT_DIR/openapi.json"

if ! docker info >/dev/null 2>&1; then
    echo "error: Docker daemon is not running" >&2
    exit 1
fi

GENERATED_DIR="$REPO_ROOT/src/generated"

USER_ARGS=()
if [ "$(uname -s)" = "Linux" ]; then
    USER_ARGS=("--user" "$(id -u):$(id -g)")
fi

echo "==> Spec: $SPEC_FILE"

echo "==> Removing previous src/generated (avoids orphaned files from removed schemas)"
rm -rf "$GENERATED_DIR"

echo "==> Seeding outputDir with .openapi-generator-ignore (openapi-generator requires it in place before generating; src/generated/ is rebuilt from scratch each run so the canonical copy lives at the repo root)"
mkdir -p "$GENERATED_DIR"
cp "$REPO_ROOT/.openapi-generator-ignore" "$GENERATED_DIR/.openapi-generator-ignore"

echo "==> Generating with ${GENERATOR_IMAGE}"
# Only src/generated is writable; config and templates are mounted read-only.
docker run --rm \
    "${USER_ARGS[@]+"${USER_ARGS[@]}"}" \
    -v "$REPO_ROOT/openapi-generator-config.yaml:/local/openapi-generator-config.yaml:ro" \
    -v "$REPO_ROOT/templates:/local/templates:ro" \
    -v "$GENERATED_DIR:/local/src/generated" \
    -v "$INPUT_DIR:/spec:ro" \
    "$GENERATOR_IMAGE" generate \
    -c /local/openapi-generator-config.yaml

rm -f "$GENERATED_DIR/.openapi-generator-ignore"

echo "==> Formatting generated output"
cd "$REPO_ROOT"
npx prettier --write "src/generated/**/*.ts" >/dev/null

echo "==> Done: $(find src/generated -name '*.ts' | wc -l | tr -d ' ') files generated"
