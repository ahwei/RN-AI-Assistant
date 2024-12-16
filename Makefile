.PHONY: help build up down dev clean logs test rn-install rn-start rn-android rn-ios rn-clean

# Display help
help:
	@echo "Usage:"
	@echo "Backend Commands:"
	@echo "  make build      - Build Docker images"
	@echo "  make up         - Start backend containers"
	@echo "  make down       - Stop and remove containers"
	@echo "  make dev        - Start backend development environment"
	@echo "  make clean      - Clean the backend project"
	@echo "  make logs       - Show backend container logs"
	@echo "  make test       - Run backend tests"
	@echo ""
	@echo "Frontend Commands:"
	@echo "  make rn-install - Install React Native dependencies"
	@echo "  make rn-start   - Start React Native development server"
	@echo "  make rn-android - Run on Android emulator"
	@echo "  make rn-ios     - Run on iOS simulator"
	@echo "  make rn-clean   - Clean React Native project"

# Backend commands
build:
	cd backend && docker compose build

up:
	cd backend && docker compose up -d

down:
	cd backend && docker compose down

dev:
	cd backend && docker compose up

clean:
	cd backend && docker compose down -v --rmi all
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type f -name "*.pyc" -delete

logs:
	cd backend && docker compose logs -f

test:
	cd backend && docker compose run --rm backend pytest

# Frontend commands
rn-install:
	cd my-app && npm install

rn-start:
	cd my-app && npm start

rn-android:
	cd my-app && npm run android

rn-ios:
	cd my-app && npm run ios

rn-clean:
	cd my-app && npm run clean
