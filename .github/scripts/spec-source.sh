#!/usr/bin/env bash
# Helper functions for calling the docs repo's GitHub contents API.
set -euo pipefail

# Percent-encodes each path segment so paths with "@" (e.g. apis/@shipstation-v2/openapi.yaml) work.
encode_spec_path() {
    local path="$1"
    printf '%s' "$path" | jq -Rr 'split("/") | map(@uri) | join("/")'
}

# Prints the blob SHA of the spec file at <ref> without downloading it.
blob_sha() {
    local docs_repo="$1" spec_path="$2" ref="$3"
    local encoded_path
    encoded_path="$(encode_spec_path "$spec_path")"
    gh api "/repos/${docs_repo}/contents/${encoded_path}?ref=${ref}" --jq .sha
}

# Downloads the spec file and sanity-checks the result.
download_spec() {
    local docs_repo="$1" spec_path="$2" ref="$3" dest="$4"
    local encoded_path
    encoded_path="$(encode_spec_path "$spec_path")"

    gh api \
        -H "Accept: application/vnd.github.raw" \
        "/repos/${docs_repo}/contents/${encoded_path}?ref=${ref}" \
        >"$dest"

    local bytes
    bytes=$(wc -c <"$dest")
    if [ "$bytes" -lt 1024 ]; then
        echo "error: downloaded spec is suspiciously small ($bytes bytes)" >&2
        head -c 500 "$dest" >&2
        return 1
    fi
    if ! grep -Eq '^openapi:[[:space:]]*"?3\.' "$dest"; then
        echo "error: downloaded file does not look like an OpenAPI 3.x document" >&2
        return 1
    fi
}

# Prints the full commit SHA for <ref> (branch name, tag, or SHA).
resolve_commit_sha() {
    local docs_repo="$1" ref="$2"
    gh api "/repos/${docs_repo}/commits/${ref}" --jq .sha
}

# Lets this file be sourced (no-op) or run directly as `./spec-source.sh <function> [args...]` for manual testing.
if [ "${BASH_SOURCE[0]:-$0}" = "${0}" ] && [ $# -gt 0 ]; then
    "$@"
fi
