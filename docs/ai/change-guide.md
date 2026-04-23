# Change Guide

## If you change backend API

Also review:

- frontend API client usage
- telegram-bot backend forwarder
- relevant requirements docs

## If you change item lifecycle or statuses

Also review:

- `docs/requirements/04_domain-model.md`
- `docs/requirements/05_processing-pipeline.md`
- `docs/requirements/06_review-workflow.md`
- frontend status handling
- bot failure messaging

## If you change stack/tooling versions

Also review:

- `docs/requirements/08_tech-stack-decision.md`
- root `README.md`
- subproject READMEs

## If you think a change belongs in deployment/runtime

Stop and check Vault first.
