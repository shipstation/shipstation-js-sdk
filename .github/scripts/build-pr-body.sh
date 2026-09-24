#!/usr/bin/env bash

# Builds the spec-sync PR body.
set -euo pipefail

docs_repo="$1"
docs_spec_path="$2"
local_spec_path="$3"
docs_commit_sha="$4"
output_file="$5"

{
  echo "- Source: \`$docs_repo\` @ \`$docs_commit_sha\`"
  echo "- Path: \`$docs_spec_path\` → \`$local_spec_path\`"
  echo "- \`src/generated/\` is produced on demand and is not committed."
  echo
  echo "The SDK was regenerated from this spec and \`npm run verify\` (typecheck, lint, format check, build) passed on this runner."
  echo
  echo "See the \`$local_spec_path\` diff in this PR for the raw spec change, and the changelog entry above for the human-readable summary."
  echo
  echo "---"
  echo
  echo "### Versioning"
  echo
  echo "This PR ships as \`feat:\` → **minor** release."
  echo
  echo "Review the changelog above and decide whether this is breaking for SDK consumers."
  echo "If it is, **edit the PR title** to \`feat!: sync ShipStation API v2 spec\` before"
  echo "merging."
} >"$output_file"
