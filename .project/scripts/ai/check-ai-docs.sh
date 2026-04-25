#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT_DIR" || exit 1

failures=0

fail() {
  printf 'FAIL: %s\n' "$1"
  failures=$((failures + 1))
}

pass() {
  printf 'PASS: %s\n' "$1"
}

check_absent_path() {
  path="$1"
  if [ -e "$path" ]; then
    fail "legacy or generated active-looking path still exists: $path"
  else
    pass "legacy/generated path absent: $path"
  fi
}

check_max_lines() {
  file="$1"
  max="$2"
  if [ ! -f "$file" ]; then
    fail "adapter file missing: $file"
    return
  fi
  lines="$(wc -l < "$file" | tr -d ' ')"
  if [ "$lines" -gt "$max" ]; then
    fail "$file has $lines lines; expected <= $max so it stays adapter-sized"
  else
    pass "$file is adapter-sized ($lines <= $max lines)"
  fi
}

check_no_pattern() {
  label="$1"
  pattern="$2"
  shift 2
  matches="$(grep -RInE "$pattern" "$@" 2>/dev/null || true)"
  if [ -n "$matches" ]; then
    fail "$label"
    printf '%s\n' "$matches"
  else
    pass "$label"
  fi
}

check_no_root_patch_artifacts() {
  matches="$(find . -maxdepth 1 \
    \( -name '*.zip' \
    -o -name 'install_*_patch.sh' \
    -o -name 'apply_*_patch.sh' \
    -o -name '.patch-backup' \
    -o -name 'patch-backup' \
    -o -name '*_patch.zip' \
    -o -name '*-patch.zip' \) \
    -print 2>/dev/null)"
  if [ -n "$matches" ]; then
    fail "root-level patch/archive artifacts found"
    printf '%s\n' "$matches"
  else
    pass "no root-level patch/archive artifacts"
  fi
}

check_single_change_guide_owner() {
  if [ -f ".project/docs/ai/change-guide.md" ]; then
    pass "single AI change checklist owner: .project/docs/ai/change-guide.md"
  else
    fail "no active AI change checklist doc found"
  fi
}

check_legacy_names_are_marked() {
  files="$(find AGENTS.md CLAUDE.md CODEX.md AMAZONQ.md README.md .project/docs .claude .amazonq \
    -type f -name '*.md' 2>/dev/null)"
  legacy_name_pattern="$(
    printf '%s|%s|%s' \
      'Mind'"draft" \
      'Lex'"ora" \
      'mind'"raft"
  )"
  matches="$(grep -InE "$legacy_name_pattern" $files 2>/dev/null | \
    grep -viE 'deprecated|legacy|compatibility|do not use|incorrect|not active' || true)"
  if [ -n "$matches" ]; then
    fail "legacy project/API names found without an explicit deprecated/legacy/compatibility marker"
    printf '%s\n' "$matches"
  else
    pass "legacy project/API names are absent or explicitly marked"
  fi
}

check_active_object_storage_claims() {
  files="$(find AGENTS.md CLAUDE.md CODEX.md AMAZONQ.md README.md .project/docs .claude .amazonq \
    -type f -name '*.md' 2>/dev/null)"
  matches="$(grep -InE 'audio.*object storage|object storage.*audio|object storage for original audio|audio stored in object storage' $files 2>/dev/null | \
    grep -viE 'out of scope|no Memora-managed audio storage|no audio|not Memora-managed|not active|deprecated|future' || true)"
  if [ -n "$matches" ]; then
    fail "active-looking audio object storage claim found"
    printf '%s\n' "$matches"
  else
    pass "no active-looking audio object storage claims"
  fi
}

check_absent_path ".important"
check_absent_path ".claude/generated"
check_absent_path "legacy_docs"
check_absent_path "old_docs"
check_absent_path "copied_docs"
check_absent_path ".patch-backup"
check_absent_path "patch-backup"

check_no_root_patch_artifacts

check_max_lines "AGENTS.md" 120
check_max_lines "CLAUDE.md" 80
check_max_lines "CODEX.md" 80
check_max_lines "AMAZONQ.md" 80
check_max_lines ".claude/request-routing.md" 40
check_max_lines ".amazonq/rules/00-entrypoint.md" 40

check_legacy_names_are_marked
check_active_object_storage_claims
check_single_change_guide_owner

check_no_pattern \
  "README has no obsolete starter-state claims" \
  'in-memory starter persistence|voice capture is currently accepted.*full transcription|full transcription integration is a later implementation slice|MongoDB target persistence' \
  README.md

check_no_pattern \
  "active docs have no obsolete transcription/AI/bot persistence claims" \
  'voice transcription is not implemented|transcription slice is not implemented|transcription is not implemented|full voice transcription pipeline implementation|AI categorization.*stub|AI categorization is stub only|telegram bot stores directly to DB|in-memory FailureNotificationStore|populated when transcription is implemented|memora-voice-transcription-patch|install_memora_voice_transcription_patch' \
  AGENTS.md CLAUDE.md CODEX.md AMAZONQ.md README.md .project/docs .claude .amazonq

check_no_pattern \
  "source comments have no obsolete transcription implementation claims" \
  'populated when transcription is implemented' \
  backend/src/main/kotlin telegram-bot/src/main/kotlin

check_no_pattern \
  "adapter docs do not duplicate detailed endpoint/state summaries" \
  'POST /api/|GET /api/|PATCH /api/|DELETE /api/|AI_PROCESSED_UNREVIEWED|TRANSCRIPTION_FAILED|HUMAN_APPROVED|createdFrom.*createdTo|spring\.mongodb\.uri|whisper-worker' \
  CLAUDE.md CODEX.md AMAZONQ.md .claude .amazonq

if [ "$failures" -eq 0 ]; then
  printf 'PASS: AI docs drift check passed\n'
  exit 0
fi

printf 'FAIL: AI docs drift check found %s issue(s)\n' "$failures"
exit 1
