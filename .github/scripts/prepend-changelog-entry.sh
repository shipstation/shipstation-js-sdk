#!/usr/bin/env bash

# Prepends a changelog entry (dated header + oasdiff output) to API-CHANGELOG.md.
set -euo pipefail

entry_file="$1"
changelog_file="$2"
tmp_entry="$(mktemp)"
tmp_changelog="$(mktemp)"
trap 'rm -f "$tmp_entry" "$tmp_changelog"' EXIT

entry="$(awk 'NR==1 && /^# API Changelog/ {next} {print}' "$entry_file" | awk '/./{f=1} f')"
{
  echo "## $(date -u +%Y-%m-%d)"
  echo
  printf '%s\n' "$entry"
  echo
} >"$tmp_entry"

awk -v entry_file="$tmp_entry" '
  NR==1 { print; next }
  !inserted && /^## / {
    while ((getline line < entry_file) > 0) print line
    inserted = 1
  }
  { print }
  END {
    if (!inserted) {
      while ((getline line < entry_file) > 0) print line
    }
  }
' "$changelog_file" >"$tmp_changelog"

mv "$tmp_changelog" "$changelog_file"
