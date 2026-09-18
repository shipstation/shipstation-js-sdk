#!/usr/bin/env bash
# Regenerates src/generated from a ShipStation API v2 OpenAPI spec using
# openapi-generator (typescript-fetch), via Docker. Version pinned deliberately.
set -euo pipefail

GENERATOR_VERSION="${OPENAPI_GENERATOR_VERSION:-v7.25.0}"
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

if ! docker info >/dev/null 2>&1; then
    echo "error: Docker daemon is not running" >&2
    exit 1
fi

SPEC_DIR="$(cd "$(dirname "$SPEC_FILE")" && pwd)"
SPEC_NAME="$(basename "$SPEC_FILE")"
GENERATED_DIR="$REPO_ROOT/src/generated"

SPEC_MOUNT=("-v" "$SPEC_DIR:/spec:ro")
if [ "$SPEC_NAME" != "openapi.yaml" ]; then
    SPEC_MOUNT=("-v" "$SPEC_FILE:/spec/openapi.yaml:ro")
    echo "==> note: spec is not named openapi.yaml; mounting the file directly (sibling \$refs will not resolve)"
fi

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

echo "==> Generating with openapitools/openapi-generator-cli:${GENERATOR_VERSION}"
docker run --rm \
    "${USER_ARGS[@]}" \
    -v "$REPO_ROOT:/local" \
    "${SPEC_MOUNT[@]}" \
    "openapitools/openapi-generator-cli:${GENERATOR_VERSION}" generate \
    -c /local/openapi-generator-config.yaml

rm -f "$GENERATED_DIR/.openapi-generator-ignore"

echo "==> Formatting generated output"
cd "$REPO_ROOT"
npx prettier --write "src/generated/**/*.ts" >/dev/null

echo "==> Done: $(find src/generated -name '*.ts' | wc -l | tr -d ' ') files generated"
