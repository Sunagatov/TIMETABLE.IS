.PHONY: help build up down logs restart clean install test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install Python dependencies
	pip install -r requirements.txt

build: ## Build Docker image
	docker-compose build

up: ## Start the bot
	docker-compose up -d

down: ## Stop the bot
	docker-compose down

logs: ## View bot logs
	docker-compose logs -f timetable-bot

restart: ## Restart the bot
	docker-compose restart timetable-bot

clean: ## Remove containers and images
	docker-compose down -v
	docker rmi timetable-bot:latest || true

rebuild: ## Rebuild and restart
	docker-compose up -d --build

status: ## Show container status
	docker-compose ps

shell: ## Open shell in running container
	docker-compose exec timetable-bot /bin/bash
