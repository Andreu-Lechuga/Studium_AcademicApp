# Studium Backend - Go API

Backend modular monolítico construido con Go para la plataforma Studium.

## 🏗️ Arquitectura

- **Framework HTTP:** Gin
- **Base de datos:** PostgreSQL 16 con schemas separados
- **Cache:** Redis 7
- **Autenticación:** JWT (JSON Web Tokens)
- **Patrón:** Modular Monolith

## 📁 Estructura

```
backend/
├── cmd/server/          # Punto de entrada de la aplicación
├── internal/
│   ├── auth/           # Módulo de autenticación
│   ├── calendar/       # Módulo de calendario
│   └── shared/         # Código compartido (config, db, logger, middleware)
├── migrations/         # Migraciones SQL
├── go.mod             # Dependencias
└── Dockerfile         # Imagen Docker
```

## 🚀 Inicio Rápido

### Prerequisitos

- Go 1.22+
- Docker y Docker Compose
- PostgreSQL 16 (via Docker)
- Redis 7 (via Docker)

### Instalación

1. **Instalar dependencias de Go:**
```bash
cd backend
go mod download
```

2. **Iniciar servicios con Docker Compose:**
```bash
# Desde la raíz del proyecto
docker compose up postgres redis -d
```

3. **Ejecutar migraciones:**
```bash
# Conectarse a PostgreSQL
docker exec -it local_postgres psql -U admin -d studium

# Ejecutar cada migración en orden
\i /app/migrations/001_init_schemas.sql
\i /app/migrations/002_auth.sql
\i /app/migrations/003_calendar.sql
```

4. **Ejecutar el servidor:**
```bash
go run cmd/server/main.go
```

El servidor estará disponible en `http://localhost:8080`

## 🔧 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgres://admin:admin@localhost:5432/studium?sslmode=disable
REDIS_URL=localhost:6379
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
PORT=8080
ENVIRONMENT=development
```

## 📡 Endpoints

### Health Check
```
GET /health
```

### API Base
```
GET /api/
```

### Próximamente
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login
- `GET /api/calendar/events` - Listar eventos
- `POST /api/calendar/events` - Crear evento

## 🗄️ Base de Datos

### Schemas

- `auth` - Usuarios y sesiones
- `calendar` - Eventos y vinculaciones
- `tasks` - Tareas (próximamente)
- `projects` - Proyectos (próximamente)
- `knowledge` - Knowledge base (próximamente)
- `courses` - Cursos académicos (próximamente)

### Migraciones

Las migraciones se encuentran en `migrations/` y deben ejecutarse en orden:

1. `001_init_schemas.sql` - Crea los schemas
2. `002_auth.sql` - Tablas de autenticación
3. `003_calendar.sql` - Tablas de calendario

## 🧪 Testing

```bash
# Ejecutar tests
go test ./...

# Con cobertura
go test -cover ./...
```

## 📦 Build

```bash
# Build local
go build -o studium cmd/server/main.go

# Build con Docker
docker build -t studium-backend .
```

## 🐛 Debug

El logger incluye diferentes niveles:
- `Info` - Información general
- `Debug` - Solo en modo development
- `Warn` - Advertencias
- `Error` - Errores
- `Fatal` - Errores críticos (termina el programa)

## 📚 Recursos

- [Gin Framework](https://gin-gonic.com/)
- [pgx - PostgreSQL Driver](https://github.com/jackc/pgx)
- [JWT Go](https://github.com/golang-jwt/jwt)
- [Redis Go Client](https://github.com/redis/go-redis)
