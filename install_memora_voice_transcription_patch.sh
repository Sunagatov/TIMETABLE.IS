#!/usr/bin/env bash
set -euo pipefail

ARCHIVE_NAME="memora-voice-transcription-patch.zip"
MEMORA_ROOT="$(pwd)"
VAULT_ROOT="${VAULT_ROOT:-/Users/zufar/IdeaProjects/Vault}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_ROOT="$MEMORA_ROOT/.patch-backup/$STAMP"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [[ ! -f "$MEMORA_ROOT/$ARCHIVE_NAME" ]]; then
  echo "Error: $ARCHIVE_NAME was not found in $MEMORA_ROOT"
  exit 1
fi

echo "==> Unpacking patch archive"
unzip -q "$MEMORA_ROOT/$ARCHIVE_NAME" -d "$TMP_DIR"

copy_tree() {
  local source_dir="$1"
  local target_dir="$2"
  local backup_dir="$3"

  if [[ ! -d "$source_dir" ]]; then
    return 0
  fi

  mkdir -p "$backup_dir"

  while IFS= read -r -d '' source_file; do
    local relative_path="${source_file#$source_dir/}"
    local target_file="$target_dir/$relative_path"
    local backup_file="$backup_dir/$relative_path"

    mkdir -p "$(dirname "$target_file")"
    mkdir -p "$(dirname "$backup_file")"

    if [[ -f "$target_file" ]]; then
      cp "$target_file" "$backup_file"
    fi

    cp "$source_file" "$target_file"
    echo "Applied: $target_file"
  done < <(find "$source_dir" -type f -print0)
}

echo "==> Backing up and applying Memora files"
copy_tree "$TMP_DIR/Memora" "$MEMORA_ROOT" "$BACKUP_ROOT/Memora"

if [[ -d "$VAULT_ROOT" ]]; then
  echo "==> Backing up and applying Vault files"
  copy_tree "$TMP_DIR/Vault" "$VAULT_ROOT" "$BACKUP_ROOT/Vault"
else
  echo "==> Vault root not found at $VAULT_ROOT. Skipping Vault patch."
fi

echo "==> Checking local tools"
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Warning: ffmpeg is not installed on this machine."
  echo "Voice transcription for local backend bootRun will fail until ffmpeg is installed."
  echo "On macOS: brew install ffmpeg"
fi

echo "==> Building backend"
./backend/gradlew -p backend clean compileKotlin

echo "==> Building telegram bot"
./telegram-bot/gradlew -p telegram-bot clean compileKotlin

if [[ -d "$MEMORA_ROOT/frontend/node_modules" ]]; then
  echo "==> Building frontend"
  (cd "$MEMORA_ROOT/frontend" && npm run build)
else
  echo "==> frontend/node_modules not found. Skipping frontend build."
fi

BOT_ENV_FILE="$MEMORA_ROOT/telegram-bot/.env.local"
CAN_RUN_BOT="yes"

if [[ -f "$BOT_ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$BOT_ENV_FILE"
  set +a
fi

if [[ -z "${BACKEND_BASE_URL:-}" || "${BACKEND_BASE_URL}" == "replace-me" ]]; then
  export BACKEND_BASE_URL="http://localhost:8080"
fi

for required_var in TELEGRAM_BOT_TOKEN BACKEND_BOT_INGEST_TOKEN OWNER_TELEGRAM_USER_ID; do
  if [[ -z "${!required_var:-}" || "${!required_var}" == "replace-with-your-real-bot-token" ]]; then
    CAN_RUN_BOT="no"
  fi
done

echo ""
echo "Patch applied."
echo "Backups: $BACKUP_ROOT"

if [[ "$CAN_RUN_BOT" == "yes" ]]; then
  echo "==> Starting Telegram bot"
  exec ./telegram-bot/gradlew -p telegram-bot run
else
  echo "Telegram bot was not started because required env vars are missing."
  echo "Create telegram-bot/.env.local from telegram-bot/.env.local.example or export:"
  echo "  TELEGRAM_BOT_TOKEN"
  echo "  BACKEND_BOT_INGEST_TOKEN"
  echo "  OWNER_TELEGRAM_USER_ID"
  echo ""
  echo "Then run:"
  echo "  ./telegram-bot/gradlew -p telegram-bot run"
fi
