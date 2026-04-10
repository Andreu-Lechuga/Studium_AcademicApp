# 🚀 Guía de Setup - Studium

Esta guía te ayudará a configurar el proyecto Studium desde cero.

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js 20+** y **npm** (para el frontend)
- ✅ **Go 1.22+** (para el backend)
- ✅ **Docker Desktop** (para PostgreSQL y Redis)
- ✅ **Git** (para control de versiones)

## 🏗️ Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Andreu-Lechuga/Studium_AcademicApp.git
cd Studium_AcademicApp
```

## 🐳 Paso 2: Iniciar Servicios con Docker

```bash
# Iniciar PostgreSQL y Redis
docker compose up postgres redis -d

# Verificar que los contenedores estén corriendo
docker ps
```

Deberías ver:
- `local_postgres` en puerto 5432
- `local_redis` en puerto 6379

## 🗄️ Paso 3: Ejecutar Migraciones de Base de Datos

**Importante:** Antes de ejecutar las migraciones, asegúrate de que los contenedores estén corriendo. Si acabas de modificar el `docker-compose.yml`, reinicia los contenedores:

```bash
# Detener contenedores actuales
docker compose down

# Iniciar nuevamente con la configuración actualizada
docker compose up postgres redis -d

# Esperar unos segundos a que PostgreSQL esté listo
```

Ahora ejecuta las migraciones:

```bash
# Conectarse a PostgreSQL
docker exec -it local_postgres psql -U admin -d studium

# Dentro de psql, ejecutar las migraciones en orden:
\i /app/migrations/001_init_schemas.sql
\i /app/migrations/002_auth.sql
\i /app/migrations/003_calendar.sql

# Verificar que los schemas se crearon correctamente
\dn

# Salir de psql
\q
```

**Alternativa:** También puedes ejecutar las migraciones directamente desde tu terminal sin entrar a psql:

```bash
docker exec -i local_postgres psql -U admin -d studium < backend/migrations/001_init_schemas.sql
docker exec -i local_postgres psql -U admin -d studium < backend/migrations/002_auth.sql
docker exec -i local_postgres psql -U admin -d studium < backend/migrations/003_calendar.sql
```

## 🔧 Paso 4: Configurar Variables de Entorno

Ya existe un archivo `.env` en la raíz del proyecto con la configuración por defecto.

**Para el frontend**, crear archivo `.env` en la carpeta raíz:
```env
VITE_API_URL=http://localhost:8080
```

## 🎯 Paso 5: Instalar Dependencias del Backend

```bash
cd backend
go mod download
cd ..
```

## ⚡ Paso 6: Instalar Dependencias del Frontend

```bash
# Instalar dependencias existentes
npm install

# Instalar nuevas dependencias para API
npm install @tanstack/react-query zustand
```

## 🚀 Paso 7: Iniciar el Backend

```bash
cd backend
go run cmd/server/main.go
```

Deberías ver:
```
INFO: 🚀 Iniciando Studium API Server...
INFO: ✅ Conectado a PostgreSQL
INFO: ✅ Conectado a Redis
INFO: 🌐 Servidor escuchando en puerto 8080
INFO: 📍 URL: http://localhost:8080
```

**Probar el backend:**
```bash
# En otra terminal
curl http://localhost:8080/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "service": "studium-api",
  "version": "1.0.0"
}
```

## 🎨 Paso 8: Iniciar el Frontend

```bash
# En otra terminal, desde la raíz del proyecto
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## ✅ Verificación

### Backend funcionando:
- ✅ `http://localhost:8080/health` responde con status "ok"
- ✅ `http://localhost:8080/api/` muestra mensaje de bienvenida

### Frontend funcionando:
- ✅ `http://localhost:5173` muestra la aplicación
- ✅ El calendario se visualiza correctamente
- ✅ El tema dark/light funciona

### Base de datos:
```bash
# Verificar conexión
docker exec -it local_postgres psql -U admin -d studium -c "\dn"
```

Deberías ver los schemas: `auth`, `calendar`, `tasks`, `projects`, `knowledge`, `courses`

## 🐛 Troubleshooting

### Error: "Cannot connect to PostgreSQL"
```bash
# Verificar que el contenedor esté corriendo
docker ps | grep postgres

# Ver logs del contenedor
docker logs local_postgres

# Reiniciar el contenedor
docker compose restart postgres
```

### Error: "Port 5432 already in use"
Tienes PostgreSQL instalado localmente. Opciones:
1. Detener PostgreSQL local: `sudo service postgresql stop`
2. Cambiar el puerto en `docker-compose.yml`: `"5433:5432"`

### Error: "go: module not found"
```bash
cd backend
go mod tidy
go mod download
```

### Error: Frontend no conecta con backend
Verificar que:
1. El backend esté corriendo en puerto 8080
2. El archivo `.env` tenga `VITE_API_URL=http://localhost:8080`
3. Reiniciar el servidor de Vite después de crear el `.env`

## 📚 Próximos Pasos

Una vez que todo esté funcionando:

1. **Implementar Auth** - Registro y login de usuarios
2. **Implementar Calendar API** - CRUD de eventos
3. **Conectar Frontend con API** - Reemplazar datos mock
4. **Implementar Courses** - Gestión de cursos académicos

## 🔗 Enlaces Útiles

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **Health Check:** http://localhost:8080/health
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

## 📞 Ayuda

Si encuentras problemas, revisa:
- `backend/README.md` - Documentación del backend
- `docs/ARQUITECTURE.md` - Arquitectura del sistema
- Logs del backend: Aparecen en la terminal donde ejecutaste `go run`
- Logs de Docker: `docker compose logs -f`
