#!/usr/bin/env bash

# Builds the spec-sync PR body, embedding the oasdiff report and truncating it to fit GitHub's body limit.
set -euo pipefail

docs_repo="$1"
docs_spec_path="$2"
local_spec_path="$3"
docs_commit_sha="$4"
report_file="$5"
run_url="$6"
output_file="$7"

# GitHub rejects PR bodies over 65536 characters; bytes are an upper bound for characters.
max_body_bytes=65000

{
  echo "- Source: \`$docs_repo\` @ \`$docs_commit_sha\`"
  echo "- Path: \`$docs_spec_path\` → \`$local_spec_path\`"
  echo "- \`src/generated/\` is produced on demand and is not committed."
  echo
  echo "The SDK was regenerated from this spec and \`npm run verify\` (typecheck, lint, format check, build) passed on this runner."
  echo
  echo "See the \`$local_spec_path\` diff in this PR for the raw spec change, and the API contract changes below for the human-readable summary."
  echo
  echo "### Versioning"
  echo
  echo "This PR ships as \`feat:\` → **minor** release."
  echo
  echo "Review the breaking changes below and decide whether this is breaking for SDK consumers."
  echo "If it is, **edit the PR title** to \`feat!: sync ShipStation API v2 spec\` before"
  echo "merging."
  echo
  echo "---"
  echo
} >"$output_file"

trimmed_report="$(mktemp)"
trap 'rm -f "$trimmed_report"' EXIT
awk '/./{f=1} f' "$report_file" >"$trimmed_report"
report_file="$trimmed_report"

truncation_notice="$(printf '\n---\n\n**The report was truncated to fit the PR body limit.** The full report is in the [workflow run summary](%s).\n' "$run_url")"
available=$((max_body_bytes - $(wc -c <"$output_file")))

if [ "$(wc -c <"$report_file")" -le "$available" ]; then
  cat "$report_file" >>"$output_file"
else
  # Cut at the last complete line within the budget.
  head -c $((available - ${#truncation_notice} - 1)) "$report_file" | sed '$d' >>"$output_file"
  printf '%s\n' "$truncation_notice" >>"$output_file"
fi
