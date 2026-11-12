{{- /* A change is "shared" when its text also appears under another endpoint. */ -}}
{{- define "changes" }}
{{- $groups := . }}
{{- range $pass := 2 }}
{{- $wantBreaking := eq $pass 0 }}
{{- $anyShared := false }}{{ $anySingle := false }}
{{- range $i, $g := $groups }}{{ range $g.Changes }}{{ if eq .IsBreaking $wantBreaking }}{{ $c := . }}
{{- $shared := false }}{{ range $k, $g2 := $groups }}{{ if ne $k $i }}{{ range $g2.Changes }}{{ if eq .Text $c.Text }}{{ $shared = true }}{{ end }}{{ end }}{{ end }}{{ end }}
{{- if $shared }}{{ $anyShared = true }}{{ else }}{{ $anySingle = true }}{{ end }}
{{- end }}{{ end }}{{ end }}
{{- if or $anyShared $anySingle }}
### {{ if $wantBreaking }}Breaking changes{{ else }}Non-breaking changes{{ end }}
{{- if $anyShared }}

#### Shared changes
{{ range $i, $g := $groups }}
{{- range $j, $c := $g.Changes }}
{{- if eq $c.IsBreaking $wantBreaking }}
{{- $shared := false }}{{ $first := true }}
{{- range $k, $g2 := $groups }}{{ range $l, $c2 := $g2.Changes }}{{ if eq $c2.Text $c.Text }}
{{- if ne $k $i }}{{ $shared = true }}{{ end }}
{{- if or (lt $k $i) (and (eq $k $i) (lt $l $j)) }}{{ $first = false }}{{ end }}
{{- end }}{{ end }}{{ end }}
{{- if and $shared $first }}
- {{ $c.Text }}
{{- range $groups }}{{ $gg := . }}{{ range .Changes }}{{ if eq .Text $c.Text }}
  - `{{ $gg.Group.Operation }} {{ $gg.Group.Path }}`
{{- end }}{{ end }}{{ end }}
{{- end }}
{{- end }}
{{- end }}
{{- end }}
{{- end }}
{{- if $anySingle }}

#### By endpoint
{{ range $i, $g := $groups }}
{{- $has := false }}
{{- range $g.Changes }}{{ if eq .IsBreaking $wantBreaking }}{{ $c := . }}
{{- $shared := false }}{{ range $k, $g2 := $groups }}{{ if ne $k $i }}{{ range $g2.Changes }}{{ if eq .Text $c.Text }}{{ $shared = true }}{{ end }}{{ end }}{{ end }}{{ end }}
{{- if not $shared }}{{ $has = true }}{{ end }}
{{- end }}{{ end }}
{{- if $has }}
- `{{ $g.Group.Operation }} {{ $g.Group.Path }}`
{{- range $g.Changes }}{{ if eq .IsBreaking $wantBreaking }}{{ $c := . }}
{{- $shared := false }}{{ range $k, $g2 := $groups }}{{ if ne $k $i }}{{ range $g2.Changes }}{{ if eq .Text $c.Text }}{{ $shared = true }}{{ end }}{{ end }}{{ end }}{{ end }}
{{- if not $shared }}
  - {{ $c.Text }}
{{- end }}
{{- end }}{{ end }}
{{- end }}
{{- end }}
{{- end }}
{{ end }}
{{- end }}
{{- end -}}


{{- if .GroupedChanges -}}
{{- with pathGroups .GroupedChanges }}
## API Changes
{{ template "changes" . }}
{{- end }}
{{- range sectionGroups .GroupedChanges }}
{{- $section := . }}
## {{ capitalize .Group.Section }}
{{ range $pass := 2 }}
{{- $wantBreaking := eq $pass 0 }}
{{- $any := false }}
{{- range $section.Changes }}{{ if eq .IsBreaking $wantBreaking }}{{ $any = true }}{{ end }}{{ end }}
{{- if $any }}
### {{ if $wantBreaking }}Breaking changes{{ else }}Non-breaking changes{{ end }}

{{ range $section.Changes }}{{ if eq .IsBreaking $wantBreaking }}- {{ .Text }}
{{ end }}{{ end }}
{{- end }}
{{- end }}
{{- end }}
{{- else -}}
{{ if .DiffEmpty }}No changes detected{{ else }}No changes to report, but the specs are different{{ end }}
{{ end -}}
