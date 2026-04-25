# Vault Boundary

## Rule

This repository must not become a duplicate runtime/deployment workspace.

## Memora owns
- app source
- requirements
- AI/human implementation docs

## Vault owns
- production deployment files
- runtime contracts
- server-facing operations

Primary location:
- `Sunagatov/Vault`
- `apps/memora/`
- `apps/whisper/` — self-hosted transcription service; Memora backend is a client of it

## Whisper as external service

The voice transcription service (`whisper-worker`) is deployed by Vault, not by Memora.

- Vault deployment: `apps/whisper/docker-compose.yml`
- Network: `whisper-network` (external Docker network, created by whisper compose)
- Memora backend joins this network and calls `http://whisper-worker:8000/v1/audio/transcriptions`
- Config on Memora side: `MEMORA_TRANSCRIPTION_API_BASE_URL`, `MEMORA_TRANSCRIPTION_MODEL`, `MEMORA_TRANSCRIPTION_API_KEY`
- Whisper must start before Memora backend or the external network join will fail

Do not add whisper container management to Memora source or compose files.
