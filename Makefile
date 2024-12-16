.PHONY: help build up down dev clean logs test

# Display help
help:
	@echo "Usage:"
	@echo "make build    - Build Docker images"
	@echo "make up       - Start containers"
	@echo "make down     - Stop and remove containers"
	@echo "make dev      - Start development environment"
	@echo "make clean    - Clean the project"
	@echo "make logs     - Show container logs"
	@echo "make test     - Run tests"

# Build Docker images
build:
	cd backend && docker compose build

# Start containers
up:
	cd backend && docker compose up -d

# Stop and remove containers
down:
	cd backend && docker compose down

# Development mode (run in foreground)
dev:
	cd backend && docker compose up

# Clean the project
clean:
	cd backend && docker compose down -v --rmi all
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type f -name "*.pyc" -delete

# Show container logs
logs:
	cd backend && docker compose logs -f

# Run tests
test:
	cd backend && docker compose run --rm backend pytest
