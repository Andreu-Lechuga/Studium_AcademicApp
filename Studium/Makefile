# Makefile para Studium Academic App
# Simplifica el desarrollo y gestión del proyecto

.PHONY: help install up down logs clean db-migrate db-connect db-reset dev backend frontend health

# Variables
DOCKER_COMPOSE = docker compose
BACKEND_DIR = backend
POSTGRES_CONTAINER = local_postgres
REDIS_CONTAINER = local_redis
BACKEND_CONTAINER = local_backend

# Colores para output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

help: ## Mostrar esta ayuda
	@echo "$(GREEN)Studium Academic App - Comandos disponibles:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

# === INSTALACIÓN Y SETUP ===
install: ## Instalar todas las dependencias (frontend + backend)
	@echo "$(GREEN)📦 Instalando dependencias del frontend...$(NC)"
	npm install
	@echo "$(GREEN)📦 Instalando dependencias del backend...$(NC)"
	cd $(BACKEND_DIR) && go mod download
	@echo "$(GREEN)✅ Dependencias instaladas correctamente$(NC)"

# === GESTIÓN DE DOCKER ===
up: ## Iniciar servicios con Docker Compose
	@echo "$(GREEN)🐳 Iniciando servicios Docker...$(NC)"
	$(DOCKER_COMPOSE) up postgres redis -d
	@echo "$(GREEN)✅ Servicios iniciados. Esperando que estén listos...$(NC)"
	@sleep 5
	@make health

down: ## Detener todos los servicios
	@echo "$(YELLOW)🛑 Deteniendo servicios Docker...$(NC)"
	$(DOCKER_COMPOSE) down

logs: ## Ver logs de todos los servicios
	$(DOCKER_COMPOSE) logs -f

clean: ## Limpiar contenedores, volúmenes e imágenes
	@echo "$(RED)🧹 Limpiando Docker (contenedores, volúmenes, imágenes)...$(NC)"
	$(DOCKER_COMPOSE) down -v --remove-orphans
	docker system prune -f
	@echo "$(GREEN)✅ Limpieza completada$(NC)"

# === BASE DE DATOS ===
db-migrate: ## Ejecutar migraciones de base de datos
	@echo "$(GREEN)🗄️ Ejecutando migraciones...$(NC)"
	docker exec -i $(POSTGRES_CONTAINER) psql -U admin -d studium < $(BACKEND_DIR)/migrations/001_init_schemas.sql
	docker exec -i $(POSTGRES_CONTAINER) psql -U admin -d studium < $(BACKEND_DIR)/migrations/002_auth.sql
	docker exec -i $(POSTGRES_CONTAINER) psql -U admin -d studium < $(BACKEND_DIR)/migrations/003_calendar.sql
	@echo "$(GREEN)✅ Migraciones ejecutadas correctamente$(NC)"

db-connect: ## Conectar a PostgreSQL
	@echo "$(GREEN)🔌 Conectando a PostgreSQL...$(NC)"
	docker exec -it $(POSTGRES_CONTAINER) psql -U admin -d studium

db-reset: ## Reset completo de la base de datos
	@echo "$(RED)⚠️  Reseteando base de datos...$(NC)"
	$(DOCKER_COMPOSE) down postgres
	docker volume rm studium_academicapp_postgres_data 2>/dev/null || true
	$(DOCKER_COMPOSE) up postgres -d
	@echo "$(YELLOW)⏳ Esperando que PostgreSQL esté listo...$(NC)"
	@sleep 10
	@make db-migrate
	@echo "$(GREEN)✅ Base de datos reseteada$(NC)"

# === DESARROLLO ===
dev: ## Iniciar frontend y backend en modo desarrollo
	@echo "$(GREEN)🚀 Iniciando aplicación en modo desarrollo...$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:5173$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:8080$(NC)"
	@echo "$(YELLOW)Presiona Ctrl+C para detener ambos servicios$(NC)"
	@echo ""
	@make -j2 backend frontend

backend: ## Iniciar solo el backend
	@echo "$(GREEN)🔧 Iniciando backend...$(NC)"
	cd $(BACKEND_DIR) && go run cmd/server/main.go

frontend: ## Iniciar solo el frontend
	@echo "$(GREEN)🎨 Iniciando frontend...$(NC)"
	npm run dev

# === UTILIDADES ===
health: ## Verificar estado de los servicios
	@echo "$(GREEN)🏥 Verificando estado de servicios...$(NC)"
	@echo "PostgreSQL:"
	@docker exec $(POSTGRES_CONTAINER) pg_isready -U admin || echo "$(RED)❌ PostgreSQL no está listo$(NC)"
	@echo "Redis:"
	@docker exec $(REDIS_CONTAINER) redis-cli ping || echo "$(RED)❌ Redis no está listo$(NC)"
	@echo "$(GREEN)✅ Verificación completada$(NC)"

test-backend: ## Probar el backend (health check)
	@echo "$(GREEN)🧪 Probando backend...$(NC)"
	@curl -s http://localhost:8080/health | jq . || echo "$(RED)❌ Backend no responde$(NC)"

setup: install up db-migrate ## Setup completo del proyecto (primera vez)
	@echo "$(GREEN)🎉 Setup completo! Usa 'make dev' para iniciar el desarrollo$(NC)"

# === COMANDOS DE PRODUCCIÓN ===
build: ## Construir imágenes Docker
	@echo "$(GREEN)🏗️ Construyendo imágenes...$(NC)"
	$(DOCKER_COMPOSE) build

deploy: ## Desplegar en modo producción
	@echo "$(GREEN)🚀 Desplegando en producción...$(NC)"
	$(DOCKER_COMPOSE) up -d

# === INFORMACIÓN ===
status: ## Mostrar estado actual del proyecto
	@echo "$(GREEN)📊 Estado del proyecto Studium:$(NC)"
	@echo ""
	@echo "Docker containers:"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(local_|NAMES)" || echo "No hay contenedores corriendo"
	@echo ""
	@echo "Servicios disponibles:"
	@echo "  Frontend: http://localhost:5173"
	@echo "  Backend:  http://localhost:8080"
	@echo "  PostgreSQL: localhost:5432"
	@echo "  Redis: localhost:6379"

# Default target
.DEFAULT_GOAL := help