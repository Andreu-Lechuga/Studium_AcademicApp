# ARQUITECTURA 5 — Plataforma Modular Unificada

> **Documento de referencia arquitectónica** — Diseño híbrido que combina lo mejor de arquitecturas monolíticas modulares y plataformas multi-app.

---

## 1. Visión General

Una **plataforma personal modular** construida como una aplicación Next.js única con backend Go monolítico modular. El sistema permite desarrollar y desplegar nuevas funcionalidades de forma incremental sin romper las existentes.

### Concepto Central

**Dashboard Launcher** → El usuario accede a un dashboard central con cards/tiles que abren diferentes módulos (ACADEME, Finanzas, etc.) como vistas dentro de la misma SPA. No hay múltiples aplicaciones separadas, sino módulos cargados dinámicamente como rutas Next.js.

El sistema se organiza en dos capas principales:

- **Backbone** — Servicios universales que todos los módulos pueden usar: `Calendar` (tiempo), `Tasks` (tareas), `Projects` (proyectos), `Habits` (hábitos) y `Knowledge` (PKM). Son la columna vertebral de la plataforma. Ningún módulo reimplementa estas funcionalidades — las inyectan.
- **Módulos** — Dominios funcionales concretos (ACADEME, Finanzas, Salud, etc.) que consumen el backbone pero nunca se importan entre sí.

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js único)                     │
│                                                                 │
│  Dashboard → Calendar → Tasks → Projects → Habits → Knowledge  │
│         ↓                                              ↓        │
│    ACADEME, Finanzas, Salud, Módulo N...          TriliumNext   │
│                                                   (PKM iframe)  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Go - proceso único)                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   Auth   │  │ Calendar │  │  Tasks   │  │ Projects │        │← BACKBONE
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│  ┌──────────┐  ┌───────────────────────────────────────┐        │
│  │  Habits  │  │   Knowledge (abstrae TriliumNext)     │        │← BACKBONE
│  └──────────┘  └────────────────────┬──────────────────┘        │
│                                     │ REST API                  │
│                                     ↓                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   TriliumNext        │
│  │ ACADEME  │  │ Finanzas │  │  Salud   │   (Docker :8888)     │← SATÉLITE
│  └──────────┘  └──────────┘  └──────────┘                      │
│       ↑               ↑            ↑                            │
│       └───────────────┴────────────┘                            │
│   inyectan: Calendar, Tasks, Projects, Habits, Knowledge        │← MÓDULOS
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              PostgreSQL (schemas) + Redis + MinIO               │
│         metadatos Knowledge + todos los demás datos             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Filosofía de Diseño

### Por qué NO Microservicios

- Overhead operacional alto (service discovery, distributed tracing)
- Complejidad prematura para desarrollo incremental
- Múltiples bases de datos = sincronización compleja
- Ideal para equipos grandes, no para 1-2 desarrolladores

### Por qué NO Monolito Tradicional

- Sin límites claros entre dominios
- Difícil de escalar partes específicas
- Acoplamiento alto entre módulos

### Por qué Modular Monolith

✅ **Límites explícitos** — Módulos Go no se importan entre sí  
✅ **Schemas separados** — Aislamiento lógico en PostgreSQL  
✅ **Eficiencia** — Un solo proceso, pool de conexiones compartido  
✅ **Evolutivo** — Extraer a microservicio después si es necesario  
✅ **Desarrollo rápido** — Sin complejidad de red interna  

---

## 3. Stack Tecnológico

| Capa | Tecnología | Rol |
|------|-----------|-----|
| **Frontend** | Next.js 15 (App Router) | Aplicación única SPA |
| **Lenguaje Frontend** | TypeScript | Tipado estático |
| **Styling** | Tailwind CSS 4 | Utilidades CSS |
| **Componentes UI** | Radix UI (shadcn/ui) | Primitivos accesibles |
| **State Management** | Zustand | Estado UI efímero |
| **Server State** | TanStack Query | Cache y sincronización API |
| **Calendar UI** | FullCalendar | Visualización de eventos |
| **Drag & Drop / Kanban** | dnd-kit | Tableros Kanban para Tasks, Projects y Habits |
| **Recurrencia** | rrule.js | Parsing de reglas de recurrencia (Tasks y Habits) |
| **Rich Text Editor** | TipTap (pendiente spike) | Editor notas y contenido |
| **Forms** | react-hook-form | Gestión de formularios |
| **Icons** | lucide-react | Iconografía |
| **Backend** | Go 1.22+ | Servidor API único |
| **HTTP Framework** | Gin | Router y middleware |
| **Database Driver** | pgx/v5 | Cliente PostgreSQL |
| **Cache Client** | go-redis/v9 | Cliente Redis |
| **Auth** | golang-jwt/v5 | Tokens JWT |
| **Password** | bcrypt | Hashing seguro |
| **Database** | PostgreSQL 16 | Persistencia principal |
| **Cache/Sessions** | Redis 7 | Cache y rate limiting |
| **Object Storage** | MinIO (S3-compatible) | Archivos binarios |
| **PKM Motor** | TriliumNext (Docker) | Knowledge base + Zettelkasten |
| **Containerization** | Docker + Compose | Orquestación local |

---

## 4. Estructura de Directorios

### Frontend (Next.js)

```
/frontend
├── src/
│   ├── app/                              # App Router
│   │   ├── layout.tsx                    # Root layout (providers, theme)
│   │   ├── page.tsx                      # Dashboard Launcher
│   │   │
│   │   ├── (auth)/                       # Route group - sin layout principal
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   └── (platform)/                   # Route group - con sidebar
│   │       ├── layout.tsx                # Layout con sidebar + topbar
│   │       ├── dashboard/page.tsx        # Vista "Today" (Calendar + Tasks)
│   │       │
│   │       ├── calendar/page.tsx         # Backbone: Vista completa Calendar
│   │       ├── tasks/page.tsx            # Backbone: Gestión de tareas
│   │       ├── projects/page.tsx         # Backbone: Gestión de proyectos y boards
│   │       ├── habits/page.tsx           # Backbone: Seguimiento de hábitos
│   │       ├── knowledge/page.tsx        # Backbone: Embed TriliumNext PKM
│   │       │
│   │       └── modules/                  # Módulos de la plataforma
│   │           ├── academe/
│   │           │   ├── page.tsx          # Dashboard ACADEME
│   │           │   ├── courses/page.tsx
│   │           │   └── grades/page.tsx
│   │           │
│   │           └── [slug]/page.tsx       # Módulos futuros dinámicos
│   │
│   ├── components/
│   │   ├── ui/                           # Primitivos shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                       # Componentes de layout
│   │   │   ├── sidebar.tsx
│   │   │   ├── topbar.tsx
│   │   │   └── module-launcher.tsx       # Cards del dashboard
│   │   │
│   │   ├── calendar/                     # Componentes Calendar backbone
│   │   │   ├── calendar-view.tsx
│   │   │   ├── event-card.tsx
│   │   │   └── event-form.tsx
│   │   │
│   │   ├── tasks/                        # Componentes Tasks backbone
│   │   │   ├── task-list.tsx
│   │   │   ├── task-card.tsx
│   │   │   └── task-form.tsx
│   │   │
│   │   ├── projects/                     # Componentes Projects backbone
│   │   │   ├── project-board.tsx
│   │   │   ├── project-card.tsx
│   │   │   └── milestone-list.tsx
│   │   │
│   │   ├── habits/                       # Componentes Habits backbone
│   │   │   ├── habit-list.tsx
│   │   │   ├── habit-card.tsx
│   │   │   ├── habit-form.tsx
│   │   │   ├── habit-heatmap.tsx         # Visualización tipo GitHub contributions
│   │   │   └── habit-streak.tsx          # Componente de racha actual/máxima
│   │   │
│   │   ├── knowledge/                    # Componentes Knowledge backbone
│   │   │   ├── trilium-embed.tsx         # Iframe/embed TriliumNext
│   │   │   ├── note-quick-create.tsx     # Crear nota rápida → Trilium
│   │   │   └── note-links.tsx            # Lista notas vinculadas a entidad
│   │   │
│   │   └── modules/                      # Componentes por módulo
│   │       └── academe/
│   │           ├── course-card.tsx
│   │           └── grade-table.tsx
│   │
│   ├── lib/
│   │   ├── api/                          # Cliente API tipado
│   │   │   ├── client.ts                 # Fetch base con auth
│   │   │   ├── auth.ts
│   │   │   ├── calendar.ts
│   │   │   ├── tasks.ts
│   │   │   ├── projects.ts
│   │   │   ├── habits.ts
│   │   │   ├── knowledge.ts              # Llama a /api/knowledge (Go → Trilium)
│   │   │   └── academe.ts
│   │   │
│   │   ├── store/                        # Zustand stores (UI state)
│   │   │   ├── user.ts                   # Usuario actual + token
│   │   │   ├── sidebar.ts                # Estado sidebar
│   │   │   └── module.ts                 # Módulo activo
│   │   │
│   │   ├── queries/                      # TanStack Query (server state)
│   │   │   ├── queryClient.ts
│   │   │   ├── calendar.ts
│   │   │   ├── tasks.ts
│   │   │   ├── projects.ts
│   │   │   ├── habits.ts
│   │   │   ├── knowledge.ts
│   │   │   └── academe.ts
│   │   │
│   │   └── utils.ts                      # Utilidades (cn, formatters)
│   │
│   └── styles/
│       ├── globals.css
│       └── theme.css
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Backend (Go)

```
/backend
├── cmd/
│   └── server/
│       └── main.go                       # Entrypoint único - monta todos los routers
│
├── internal/
│   ├── auth/                             # BASE: Autenticación
│   │   ├── model.go                      # User, Session structs
│   │   ├── service.go                    # Lógica de negocio
│   │   ├── repository.go                 # Acceso a DB (schema auth.*)
│   │   ├── handler.go                    # HTTP handlers
│   │   ├── middleware.go                 # JWT validation
│   │   └── router.go                     # Rutas del módulo
│   │
│   ├── calendar/                         # BACKBONE: Time manager
│   │   ├── model.go                      # Event, EntityLink structs
│   │   ├── service.go                    # Interface + implementación
│   │   ├── repository.go                 # Acceso a DB (schema calendar.*)
│   │   ├── handler.go                    # HTTP handlers
│   │   └── router.go                     # Rutas del módulo
│   │
│   ├── tasks/                            # BACKBONE: Task manager
│   │   ├── model.go                      # Task, Label structs
│   │   ├── service.go                    # Interface + implementación
│   │   ├── repository.go                 # Acceso a DB (schema tasks.*)
│   │   ├── handler.go
│   │   └── router.go
│   │
│   ├── projects/                         # BACKBONE: Project manager
│   │   ├── model.go                      # Project, Milestone, Board structs
│   │   ├── service.go                    # Interface + implementación
│   │   ├── repository.go                 # Acceso a DB (schema projects.*)
│   │   ├── handler.go
│   │   └── router.go
│   │
│   ├── habits/                           # BACKBONE: Habit tracker
│   │   ├── model.go                      # Habit, HabitLog, HabitFrequency structs
│   │   ├── service.go                    # Interface + lógica streaks/scoring
│   │   ├── repository.go                 # Acceso a DB (schema habits.*)
│   │   ├── handler.go
│   │   └── router.go
│   │
│   ├── knowledge/                        # BACKBONE: Knowledge / PKM
│   │   ├── model.go                      # Note, EntityLink structs (metadatos)
│   │   ├── service.go                    # Interface — oculta TriliumNext
│   │   ├── trilium_client.go             # Cliente REST → TriliumNext API
│   │   ├── repository.go                 # Metadatos en PostgreSQL (índice, links)
│   │   ├── handler.go                    # HTTP handlers expuestos a frontend
│   │   └── router.go
│   │
│   ├── academe/                          # MÓDULO: Gestión académica
│   │   ├── model.go                      # Course, Grade, Schedule structs
│   │   ├── service.go                    # Inyecta calendar + tasks + knowledge
│   │   ├── repository.go                 # Acceso a DB (schema academe.*)
│   │   ├── handler.go
│   │   └── router.go
│   │
│   ├── finanzas/                         # MÓDULO: Finanzas (futuro)
│   │   └── ...
│   │
│   ├── salud/                            # MÓDULO: Salud (futuro)
│   │   └── ...
│   │
│   └── shared/                           # Utilidades transversales
│       ├── config.go                     # Variables de entorno
│       ├── db.go                         # Pool PostgreSQL
│       ├── redis.go                      # Cliente Redis
│       ├── logger.go                     # Logger estructurado
│       └── middleware.go                 # CORS, rate limiting, logging
│
├── migrations/                           # Migraciones SQL
│   ├── 001_init_schemas.sql
│   ├── 002_auth.sql
│   ├── 003_calendar.sql
│   ├── 004_tasks.sql
│   ├── 005_projects.sql
│   ├── 006_habits.sql
│   ├── 007_knowledge.sql                 # Solo metadatos e índice
│   └── 008_academe.sql
│
├── Dockerfile
├── go.mod
└── go.sum
```

---

## 5. Backbone y Módulos del Sistema

El backbone es el conjunto de **5 servicios universales** que cualquier módulo puede consumir. Son la columna vertebral de LifeOS: ningún módulo reimplementa estas funcionalidades, sino que las **inyectan como dependencias**. Un módulo que necesite registrar tiempo, gestionar tareas, organizar proyectos, trackear hábitos o vincular notas, usa el backbone correspondiente.

```
                    ┌─────────────────────────────┐
                    │      BACKBONE (5 servicios)  │
                    │                              │
                    │  Calendar  ←─ el tiempo      │
                    │  Tasks     ←─ la acción      │
                    │  Projects  ←─ la organización│
                    │  Habits    ←─ la constancia  │
                    │  Knowledge ←─ el contexto    │
                    └──────────────┬───────────────┘
                                   │ inyectados via Service interface
                    ┌──────────────▼───────────────┐
                    │         MÓDULOS               │
                    │  ACADEME · Finanzas · Salud   │
                    └──────────────────────────────┘
```

### 5.1 Base: Auth

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Registro, login, gestión de sesiones, JWT |
| **Schema PostgreSQL** | `auth.users`, `auth.sessions` |
| **Endpoints** | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me` |
| **Dependencias** | Ninguna (base transversal) |
| **Nota** | Auth no es backbone en el sentido de que los módulos lo inyecten — es infraestructura base que todos usan via middleware |

---

### 5.2 Backbone: Calendar (Time Manager)

**Rol en LifeOS**: Es la dimensión temporal de toda la plataforma. Cualquier entidad que tenga una fecha — un deadline, una clase, un milestone, una cita médica — vive aquí. Es el único lugar donde el tiempo existe en el sistema.

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Gestión de eventos, timeline universal, vinculación temporal con cualquier entidad |
| **Herramienta UI** | **FullCalendar** (MIT) — vistas day/week/month/list, drag & drop, timezone |
| **Schema PostgreSQL** | `calendar.events`, `calendar.entity_links` |
| **Endpoints** | `GET/POST/PUT/DELETE /api/calendar/events`, `POST /api/calendar/events/:id/link` |
| **Patrón de vinculación** | Tabla polimórfica `entity_links(event_id, entity_kind, entity_id)` |
| **Usado por** | ACADEME (clases, deadlines), Finanzas (pagos recurrentes), Salud (citas), Projects (milestones), Habits (scheduled habits) |
| **Dificultad implementación** | Baja-Media — la parte compleja es recurrencia; usar **rrule.js** (frontend) |
| **Ejemplo** | ACADEME crea deadline → `calendar.CreateEvent(...)` → aparece en el calendario universal |

```go
type Service interface {
    CreateEvent(ctx context.Context, userID string, req CreateEventRequest) (*Event, error)
    GetEvents(ctx context.Context, userID string, start, end time.Time) ([]*Event, error)
    UpdateEvent(ctx context.Context, eventID string, req UpdateEventRequest) (*Event, error)
    DeleteEvent(ctx context.Context, eventID string) error
    LinkToEntity(ctx context.Context, eventID, entityKind, entityID string) error
}
```

---

### 5.3 Backbone: Tasks (Task Manager)

**Rol en LifeOS**: Es la unidad de acción atómica del sistema. Una tarea es algo concreto que hacer, con un estado y opcionalmente una fecha. Es el building block que Projects organiza y que Habits puede generar automáticamente.

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Gestión de tareas individuales con estados, prioridades, recurrencia y vinculación a entidades |
| **Herramienta UI** | **dnd-kit** (MIT) — drag & drop para vistas Kanban y listas reordenables |
| **Schema PostgreSQL** | `tasks.tasks`, `tasks.labels`, `tasks.entity_links` |
| **Endpoints** | `GET/POST/PUT/DELETE /api/tasks`, `PATCH /api/tasks/:id/status`, `GET /api/tasks?project_id=&due=today` |
| **Patrón de vinculación** | Tabla polimórfica `entity_links(task_id, entity_kind, entity_id)` |
| **Modelo de datos clave** | `status`: todo/in_progress/done/cancelled · `priority`: 1-4 · `recurrence`: rrule string · `parent_task_id` para subtareas |
| **Usado por** | ACADEME (tareas de curso), Projects (ítems de sprint/board), Salud (rutinas puntuales) |
| **Dificultad implementación** | Baja-Media — CRUD + Kanban: ~1-2 semanas. Con recurrencia: +1-2 semanas |
| **Librería clave** | **rrule.js** para recurrencia en frontend; schema `recurrence TEXT` guarda la rrule string |
| **Ejemplo** | ACADEME crea tarea "Entregar informe" → `tasks.CreateTask(...)` → aparece en vista Tasks global |

```go
type Service interface {
    CreateTask(ctx context.Context, userID string, req CreateTaskRequest) (*Task, error)
    GetTasks(ctx context.Context, userID string, filters TaskFilters) ([]*Task, error)
    UpdateStatus(ctx context.Context, taskID string, status TaskStatus) error
    LinkToEntity(ctx context.Context, taskID, entityKind, entityID string) error
}
```

**Nota sobre subtareas**: `parent_task_id` permite jerarquía de un nivel. No implementar más de 2 niveles — se vuelve Projects territory.

---

### 5.4 Backbone: Projects (Project Manager)

**Rol en LifeOS**: Es la estructura de organización de mediano-largo plazo. Un proyecto agrupa tareas y milestones bajo un objetivo común con un fin definido. Se diferencia de Habits en que tiene fecha de término; se diferencia de Tasks en que tiene jerarquía y timeline.

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Gestión de proyectos con milestones, boards Kanban y vinculación a tareas/eventos |
| **Herramienta UI** | **dnd-kit** para board Kanban + **Frappe Gantt** (MIT) opcional para timeline |
| **Schema PostgreSQL** | `projects.projects`, `projects.milestones`, `projects.boards`, `projects.entity_links` |
| **Endpoints** | `GET/POST/PUT/DELETE /api/projects`, `/api/projects/:id/milestones`, `/api/projects/:id/board` |
| **Patrón de vinculación** | Tabla polimórfica `entity_links(project_id, entity_kind, entity_id)` |
| **Modelo de datos clave** | `status`: active/on_hold/completed/archived · `milestones` con due_date · board con columnas configurables |
| **Usado por** | ACADEME (proyecto semestral, trabajo de ramo), módulos futuros |
| **Dificultad implementación** | Media-Alta — CRUD + milestones + board: ~2-3 semanas. Con Gantt: +1-2 semanas con librería |
| **Riesgo principal** | **Scope creep** — definir límites claros: Projects no es un PM enterprise, es organización personal |
| **Ejemplo** | ACADEME crea proyecto "Memoria de Título" → tiene milestones vinculados a Calendar + board Kanban con Tasks |

```go
type Service interface {
    CreateProject(ctx context.Context, userID string, req CreateProjectRequest) (*Project, error)
    GetProjects(ctx context.Context, userID string) ([]*Project, error)
    AddMilestone(ctx context.Context, projectID string, req MilestoneRequest) (*Milestone, error)
    GetBoard(ctx context.Context, projectID string) (*Board, error)
    LinkToEntity(ctx context.Context, projectID, entityKind, entityID string) error
}
```

**Modelo mínimo viable** (evitar scope creep):
```
Project → Milestones → (vinculados a Calendar events)
        → Tasks      → (vinculados a Tasks backbone)
        → Board      → columnas configurables con Tasks
```
Sin: resource allocation, burndown charts, múltiples miembros, dependencias entre proyectos.

---

### 5.5 Backbone: Habits (Habit Tracker)

**Rol en LifeOS**: Es la dimensión de la constancia y la identidad. Mientras Tasks captura acciones puntuales y Projects captura objetivos con fin, Habits captura comportamientos recurrentes sin fecha de término — cosas que quieres hacer indefinidamente. Es un backbone propio porque su semántica (rachas, frecuencias, scoring) no encaja en el modelo de Tasks ni de Projects.

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Tracking de hábitos recurrentes, cálculo de rachas, scoring y visualización de consistencia |
| **Herramienta UI** | Custom React — heatmap tipo GitHub contributions para visualización de consistencia |
| **Schema PostgreSQL** | `habits.habits`, `habits.logs`, `habits.entity_links` |
| **Endpoints** | `GET/POST/PUT/DELETE /api/habits`, `POST /api/habits/:id/log`, `GET /api/habits/:id/stats` |
| **Patrón de vinculación** | Tabla polimórfica `entity_links(habit_id, entity_kind, entity_id)` — ej: hábito vinculado a módulo Salud |
| **Modelo de datos clave** | Ver schema completo abajo |
| **Usado por** | Salud (ejercicio, medicación), ACADEME (estudio diario), uso independiente |
| **Dificultad implementación** | Media — CRUD simple, pero lógica de streaks tiene edge cases: ~3-4 semanas completo |
| **Referencia de diseño** | **Loop Habit Tracker** (schema/scoring), **Habitica** (modelo de frecuencias) — no como dependencias, sino como referencia |
| **Librería útil Go** | **carbon** (uniplaces/carbon) para manipulación de fechas en cálculo de streaks |

```go
// Modelo de datos completo
type Habit struct {
    ID          string
    UserID      string
    Name        string
    Description string
    Frequency   HabitFrequency  // ver abajo
    Cue         string          // disparador: "después del café"
    TimeOfDay   string          // morning / afternoon / evening / anytime
    Color       string
    Icon        string
    Tolerance   string          // strict (falla si saltas 1 día) | flexible
    Archived    bool
    CreatedAt   time.Time
}

type HabitFrequency struct {
    Type        string    // daily | weekly | x_per_week | x_per_month
    Days        []int     // para weekly: [1,3,5] = Lun,Mie,Vie
    Count       int       // para x_per_week / x_per_month
}

type HabitLog struct {
    ID        string
    HabitID   string
    Date      time.Time
    Completed bool
    Note      string
    Value     *float64  // para hábitos cuantitativos (ej: "beber 2L de agua")
}

// Stats calculados (no persisten, se calculan al vuelo)
type HabitStats struct {
    CurrentStreak  int
    LongestStreak  int
    CompletionRate float64   // últimos 30/90 días
    TotalLogs      int
}
```

```go
type Service interface {
    CreateHabit(ctx context.Context, userID string, req CreateHabitRequest) (*Habit, error)
    GetHabits(ctx context.Context, userID string) ([]*Habit, error)
    LogCompletion(ctx context.Context, habitID string, date time.Time, note string) (*HabitLog, error)
    GetStats(ctx context.Context, habitID string) (*HabitStats, error)
    GetLogsForPeriod(ctx context.Context, habitID string, start, end time.Time) ([]*HabitLog, error)
    LinkToEntity(ctx context.Context, habitID, entityKind, entityID string) error
}
```

**Edge cases críticos a implementar**:
- ¿Se puede loggear un hábito de días pasados? → Sí, con ventana configurable (ej: hasta 3 días atrás)
- Streaks con `x_per_week`: evaluar por ventana Lun-Dom, no días consecutivos
- Timezone: guardar logs en UTC, mostrar en timezone del usuario
- Hábitos negativos ("no fumar"): el log registra el *fallo*, no el éxito

**Integración con Calendar**: Los hábitos con `time_of_day` pueden aparecer opcionalmente en FullCalendar como eventos recurrentes — usando `calendar.CreateEvent` con `recurrence` rrule. Esto es opt-in por hábito.

---

### 5.6 Backbone: Knowledge (PKM — motor: TriliumNext)

**Rol en LifeOS**: Es la memoria y el contexto del sistema. Mientras las otras capas gestionan *qué hacer* y *cuándo*, Knowledge gestiona *por qué* y *qué aprendiste*. Cualquier entidad de la plataforma puede tener notas vinculadas — una tarea puede tener contexto, un proyecto puede tener documentación, un curso puede tener apuntes.

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | PKM profundo (Zettelkasten, graph view, backlinks) + notas vinculadas a entidades de la plataforma |
| **Motor** | **TriliumNext** — corre como contenedor Docker separado (`:8888`), AGPL-3.0 |
| **Schema PostgreSQL** | `knowledge.note_index` — metadatos e índice para búsqueda y vinculación (NO el contenido) |
| **Endpoints** | `POST /api/knowledge/notes`, `GET /api/knowledge/notes?entity_kind=&entity_id=`, `POST /api/knowledge/notes/:id/link` |
| **Patrón de vinculación** | `knowledge.note_index(trilium_note_id, entity_kind, entity_id)` — el contenido vive en Trilium, el vínculo en PostgreSQL |
| **Usado por** | ACADEME (apuntes de clase), todos los módulos futuros |
| **Frontend** | Card "Knowledge" en dashboard abre TriliumNext via iframe/redirect. Módulos muestran notas vinculadas via `/api/knowledge/notes?entity_kind=course&entity_id=123` |

**Principio clave**: Los módulos nunca hablan con TriliumNext directamente. Siempre a través de `knowledge.Service` en Go. Si mañana reemplazas TriliumNext, solo cambia `knowledge/trilium_client.go`.

```go
type Service interface {
    CreateNote(ctx context.Context, userID string, req CreateNoteRequest) (*Note, error)
    LinkToEntity(ctx context.Context, noteID, entityKind, entityID string) error
    GetNotesForEntity(ctx context.Context, entityKind, entityID string) ([]*Note, error)
    Search(ctx context.Context, userID, query string) ([]*Note, error)
}
// La implementación habla con Trilium. Los módulos no saben.
```

---

### 5.7 Módulo: ACADEME

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Gestión académica (cursos, calificaciones, horarios, evaluaciones) |
| **Schema PostgreSQL** | `academe.courses`, `academe.grades`, `academe.schedules`, `academe.deadlines` |
| **Endpoints** | `GET/POST/PUT/DELETE /api/academe/courses`, `/grades`, `/schedules` |
### 5.7 Módulo: ACADEME

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Gestión académica (cursos, calificaciones, horarios, evaluaciones) |
| **Schema PostgreSQL** | `academe.courses`, `academe.grades`, `academe.schedules`, `academe.deadlines` |
| **Endpoints** | `GET/POST/PUT/DELETE /api/academe/courses`, `/grades`, `/schedules` |
| **Dependencias backbone** | Inyecta `calendar.Service`, `tasks.Service`, `knowledge.Service` |
| **Ejemplo completo** | Agregar deadline de entrega → crea evento en Calendar + tarea en Tasks + nota de contexto en Knowledge |

---

### 5.8 Patrón para Módulos Futuros

Cada nuevo módulo sigue esta estructura:

1. **Crear schema PostgreSQL**: `CREATE SCHEMA nombre_modulo;`
2. **Crear paquete Go**: `/internal/nombre_modulo/` con archivos estándar
3. **Inyectar servicios backbone**: `calendar.Service`, `tasks.Service`, `projects.Service`, `habits.Service`, `knowledge.Service` según necesidad
4. **Registrar router**: En `cmd/server/main.go` montar rutas
5. **Crear rutas frontend**: `/app/(platform)/modules/nombre_modulo/`
6. **Agregar card**: En dashboard launcher

---

## 6. Base de Datos — PostgreSQL con Schemas

### Estrategia de Aislamiento

Un solo PostgreSQL con **schemas lógicos** por módulo:

```sql
CREATE SCHEMA auth;
CREATE SCHEMA calendar;
CREATE SCHEMA tasks;
CREATE SCHEMA projects;
CREATE SCHEMA habits;
CREATE SCHEMA knowledge;   -- solo metadatos e índice, contenido en Trilium
CREATE SCHEMA academe;
CREATE SCHEMA finanzas;    -- futuro
CREATE SCHEMA salud;       -- futuro
```

### Ventajas

- Pool de conexiones compartido (eficiente)
- Transacciones cross-schema posibles
- Backups unificados
- Menos overhead operacional que múltiples DBs

### Tablas Clave

| Schema | Tabla | Descripción |
|--------|-------|-------------|
| `auth` | `users` | id, email, password_hash, role, created_at |
| `auth` | `sessions` | id, user_id, refresh_token, expires_at |
| `calendar` | `events` | id, user_id, title, starts_at, ends_at, all_day, workspace |
| `calendar` | `entity_links` | event_id, entity_kind, entity_id (polimórfica) |
| `tasks` | `tasks` | id, user_id, title, status, priority, due_at |
| `tasks` | `entity_links` | task_id, entity_kind, entity_id (polimórfica) |
| `projects` | `projects` | id, user_id, name, status, description |
| `projects` | `milestones` | id, project_id, title, due_at |
| `projects` | `entity_links` | project_id, entity_kind, entity_id (polimórfica) |
| `habits` | `habits` | id, user_id, name, frequency (jsonb), tolerance, archived |
| `habits` | `logs` | id, habit_id, date, completed, note, value |
| `habits` | `entity_links` | habit_id, entity_kind, entity_id (polimórfica) |
| `knowledge` | `note_index` | id, trilium_note_id, user_id, title, created_at (índice) |
| `knowledge` | `entity_links` | note_index_id, entity_kind, entity_id (polimórfica) |
| `academe` | `courses` | id, user_id, name, code, semester, credits |
| `academe` | `grades` | id, course_id, name, weight, score |
| `academe` | `schedules` | id, course_id, day, start_time, end_time |

---

## 7. Navegación y UX

### Dashboard Launcher (página principal)

```
┌─────────────────────────────────────────────────────┐
│  Bienvenido, Usuario                                │
│                                                     │
│  — BACKBONE ──────────────────────────────────────  │
│  ┌────────┐ ┌───────┐ ┌─────────┐ ┌──────┐ ┌────┐  │
│  │Calendar│ │ Tasks │ │Projects │ │Habits│ │ PKM│  │
│  │  📅    │ │  ✅   │ │   📋    │ │  🔁  │ │ 🧠 │  │
│  └────────┘ └───────┘ └─────────┘ └──────┘ └────┘  │
│                                                     │
│  — MÓDULOS ────────────────────────────────────── │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ ACADEME  │ │ Finanzas │ │  Salud   │  ...        │
│  │   📚     │ │   💰     │ │   💪     │            │
│  └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────┘
```

### Rutas Next.js

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard launcher con cards |
| `/login` | Autenticación |
| `/dashboard` | Vista "Today" (eventos + tareas del día) |
| `/calendar` | Vista completa Calendar (FullCalendar) |
| `/tasks` | Gestión de tareas global |
| `/projects` | Gestión de proyectos y boards |
| `/habits` | Tracking de hábitos + heatmap de consistencia |
| `/knowledge` | PKM — embed TriliumNext + notas vinculadas |
| `/modules/academe` | Dashboard ACADEME |
| `/modules/academe/courses` | Lista de cursos |
| `/modules/[slug]` | Módulos futuros dinámicos |

### Sidebar (en rutas /platform)

```
— BACKBONE
  Dashboard
  Calendar
  Tasks
  Projects
  Habits
  Knowledge (PKM)
─────────────
— MÓDULOS
  ACADEME
  Finanzas
  Salud
  Módulo N
```

---

## 8. Reglas de Arquitectura

### Regla 1: Dependencias Unidireccionales

```
Módulos  →  Backbone (Calendar + Tasks + Projects + Habits + Knowledge)  →  Database
Módulos  ✗  Módulos   (nunca se importan entre sí)
Backbone ✗  Módulos   (nunca importan módulos)
Habits   →  Calendar  (opt-in: hábitos pueden generar eventos recurrentes)
Knowledge → TriliumNext (via trilium_client.go, nunca directo desde módulos)
```

### Regla 2: Aislamiento de Datos

- Cada módulo solo accede a su propio schema PostgreSQL
- Toda query de usuario incluye `WHERE user_id = $1`
- No hay queries cross-schema directas (usar servicios backbone)
- Knowledge: el contenido vive en TriliumNext; PostgreSQL solo guarda metadatos e índice

### Regla 3: Patrón de 3 Archivos

Cada paquete Go tiene:
- `model.go` — Structs y tipos (sin lógica)
- `service.go` — Lógica de negocio (sin HTTP)
- `handler.go` — HTTP handlers (sin DB)
- `repository.go` — Acceso a DB (sin lógica de negocio)
- `router.go` — Definición de rutas

### Regla 4: State Management Frontend

- **TanStack Query** — Todo lo que viene del servidor (cache, refetch, mutations)
- **Zustand** — Estado UI efímero (sidebar abierto, módulo activo, filtros)
- **Nunca** mezclar: datos del servidor no van en Zustand

### Regla 5: API Client Centralizado

- Todos los `fetch` viven en `/lib/api/`
- Componentes nunca hacen `fetch` directo
- Un solo lugar para inyectar auth headers

---

## 9. Ambiente de Desarrollo — Labs (Spikes)

> **Propósito**: Explorar, instalar y ajustar herramientas open source **antes** de integrarlas a la plataforma principal. Completamente aislado del repo principal.

### Filosofía

Antes de integrar una herramienta grande (FullCalendar, TriliumNext, editor de texto, etc.) al stack principal, se desarrolla un **spike** en un directorio separado. Un spike es un experimento desechable con una pregunta concreta que responder.

```
~/dev/
├── my-platform/          ← repo principal (ARQUITECTURA 5)
│   └── docker-compose.yml
│
└── labs/                 ← fuera del repo, gitignoreado o repo propio
    ├── fullcalendar-spike/
    ├── trilium-spike/     ← validar REST API, iframe, token auth
    ├── tiptap-spike/
    └── echarts-spike/
```

**Regla**: Nada del directorio `labs/` entra al repo principal hasta pasar las 3 fases del spike.

---

### Estructura de un Spike

```
labs/fullcalendar-spike/
├── docker-compose.yml    # mínimo: solo lo necesario para esta herramienta
├── frontend/             # Vite + React (NO Next.js — arranque más rápido)
│   ├── src/
│   │   ├── App.tsx
│   │   └── data/
│   │       └── mock-events.json   # datos estáticos, sin DB ni Go
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
└── README.md             # preguntas que querías responder + hallazgos
```

**¿Por qué Vite y no Next.js en el spike?**
- Arranca en ~300ms (vs ~5s de Next.js)
- Sin opiniones sobre routing o SSR que interfieran con la herramienta
- Si algo falla, es la herramienta, no la configuración de Next.js
- Completamente desechable

**¿Por qué JSON mock y no Go?**
- La mayoría de herramientas UI no necesitan un servidor real para ser evaluadas
- Elimina una variable: si algo no funciona, no es el backend
- Agrega Go solo cuando necesitas validar la integración API

---

### Las 3 Fases del Spike

#### Fase 1 — Solo UI (días 1–2)
**Objetivo**: ¿Funciona la herramienta como esperaba? ¿Puedo personalizarla?

```yaml
# docker-compose.yml mínimo
services:
  ui:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./frontend:/app
    ports:
      - "5173:5173"
    command: sh -c "npm install && npm run dev -- --host"
```

```json
// frontend/src/data/mock-events.json
[
  { "id": "1", "title": "Clase Cálculo", "start": "2026-03-23T10:00:00", "end": "2026-03-23T12:00:00" },
  { "id": "2", "title": "Deadline Tarea 1", "start": "2026-03-25", "allDay": true }
]
```

Preguntas a responder:
- ¿Qué views necesito? (dayGrid, timeGrid, list)
- ¿Cómo se comporta drag & drop?
- ¿Qué tan fácil es personalizar el tema con Tailwind?
- ¿Hay problemas de timezone?

#### Fase 2 — UI + API Go mínima (días 3–4)
**Objetivo**: ¿Cómo se comporta la herramienta con datos reales de una API?

Agrega al `docker-compose.yml` solo cuando necesites validar la integración:

```yaml
services:
  ui:
    # igual que Fase 1

  api:
    build: ./api              # Go minimalista, solo endpoints de la herramienta
    ports:
      - "8080:8080"
    # sin DB todavía — datos en memoria en Go
```

```go
// api/main.go — servidor Go mínimo, datos en memoria
func main() {
    r := gin.Default()
    r.GET("/api/events", func(c *gin.Context) {
        // start, end params que FullCalendar envía
        start := c.Query("start")
        end   := c.Query("end")
        _ = start; _ = end
        c.JSON(200, mockEvents())
    })
    r.Run(":8080")
}
```

#### Fase 3 — Documentar decisiones y migrar
**Objetivo**: Registrar qué aprendiste y qué llevarás al repo principal.

Actualizar `README.md` del spike con:

```markdown
## Decisiones tomadas

### FullCalendar
- **Plugins elegidos**: dayGrid, timeGrid, interaction
- **Tema**: fullcalendar-daygrid funciona bien con Tailwind via CSS variables
- **Timezone**: necesita `timeZone: 'America/Santiago'` explícito
- **Formato API**: espera ISO 8601, FullCalendar envía start/end como query params
- **Drag & drop**: requiere plugin `interaction` + `editable: true`
- **Problema encontrado**: rerenders en React — solución: useMemo en events array

### Para integrar en my-platform
- Instalar: `@fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction`
- Crear: `frontend/src/components/calendar/calendar-view.tsx`
- Endpoint Go: `GET /api/calendar/events?start=&end=` ya definido en ARQUITECTURA 4
- Schema DB: ya existe `calendar.events` en la arquitectura
```

---

### Herramientas candidatas para spike

Estas herramientas justifican un spike antes de integrar:

| Herramienta | Categoría | Pregunta principal |
|-------------|-----------|-------------------|
| **FullCalendar** | Calendar UI | ¿Drag & drop + timezone + integración React? |
| **dnd-kit** | Drag & drop / Kanban | ¿Performance con muchas tarjetas? ¿Accesibilidad? ¿Integración con TanStack Query? |
| **rrule.js** | Recurrencia | ¿Parsing de reglas complejas? ¿Integración con FullCalendar? |
| **Frappe Gantt** | Timeline / Gantt | ¿Personalización visual? ¿Integración React? |
| **TipTap / Lexical** | Editor rich text | ¿Markdown + comandos / bloques para notas rápidas? |
| **Apache ECharts** | Gráficos | ¿Dashboards modulares + performance en RPi5? |
| **React PDF** | Generación PDF | ¿Exportar reportes académicos? |
| **TriliumNext** | PKM motor | ¿REST API funcional? ¿Auth por token? ¿Embed via iframe? |

---

### Criterio para "graduarse" del spike al repo principal

Una herramienta pasa de `labs/` a `my-platform/` cuando:

- ✅ Las preguntas del spike tienen respuesta
- ✅ El README documenta decisiones y problemas encontrados
- ✅ Está claro dónde vive en la arquitectura (qué componente, qué endpoint)
- ✅ No requiere cambios estructurales al `docker-compose.yml` principal
- ❌ Si requiere cambios grandes → iterar la arquitectura primero

---

## 10. Roadmap de Desarrollo

> Las herramientas marcadas con 🧪 deben pasar por un spike en `labs/` antes de integrarse (ver Sección 9).

### Fase 1: Infraestructura Base (Semana 1-2)

- [ ] Setup Docker Compose (PostgreSQL + Redis + MinIO + TriliumNext)
- [ ] Scaffold Next.js con TypeScript + Tailwind
- [ ] Scaffold Go con Gin + pgx
- [ ] Configuración de variables de entorno
- [ ] Migraciones base (schemas: auth, calendar, tasks, projects, habits, knowledge)

### Fase 2: Auth + Dashboard (Semana 3-4)

- [ ] Módulo `auth` completo (registro, login, JWT)
- [ ] Middleware de autenticación
- [ ] Páginas login/register en Next.js
- [ ] Dashboard launcher con cards backbone + módulos
- [ ] Layout con sidebar separado (backbone / módulos)

### Fase 3: Backbone — Calendar + Tasks (Semana 5-7)

- [ ] 🧪 Spike FullCalendar en `labs/fullcalendar-spike/`
- [ ] 🧪 Spike dnd-kit en `labs/dndkit-spike/` (validar Kanban + TanStack Query)
- [ ] 🧪 Spike rrule.js en `labs/rrule-spike/` (recurrencia en tasks y habits)
- [ ] Backbone `calendar` completo (CRUD eventos + vinculación polimórfica)
- [ ] Backbone `tasks` completo (CRUD tareas + estados + recurrencia + vinculación)
- [ ] Integración FullCalendar en frontend
- [ ] Vista "Today" en dashboard (eventos + tareas del día)
- [ ] Patrón de vinculación polimórfica funcionando y documentado

### Fase 4: Backbone — Habits (Semana 8-9)

- [ ] Backbone `habits` en Go (CRUD + HabitFrequency + lógica streaks)
- [ ] Endpoint `POST /api/habits/:id/log` — registro de completación
- [ ] Endpoint `GET /api/habits/:id/stats` — streaks y completion rate
- [ ] Vista `/habits` en frontend con lista de hábitos del día
- [ ] Componente `habit-heatmap.tsx` — visualización de consistencia
- [ ] Integración opt-in con Calendar (hábitos → eventos recurrentes)
- [ ] Edge cases implementados: timezone, x_per_week, ventana de log retroactivo

### Fase 5: Backbone — Knowledge (TriliumNext) (Semana 10-11)

- [ ] 🧪 Spike TriliumNext en `labs/trilium-spike/` (REST API + auth token + iframe)
- [ ] TriliumNext corriendo en Docker Compose principal
- [ ] Backbone `knowledge` en Go (service + trilium_client + repository metadatos)
- [ ] Card "Knowledge" en dashboard → embed TriliumNext
- [ ] `knowledge.CreateNote` y `knowledge.LinkToEntity` funcionando
- [ ] Notas vinculadas visibles en contexto de entidades

### Fase 6: Backbone — Projects (Semana 12)

- [ ] 🧪 Spike Frappe Gantt en `labs/gantt-spike/` (opcional, si se requiere timeline)
- [ ] Backbone `projects` completo (CRUD proyectos + milestones + board Kanban)
- [ ] Vinculación con Calendar (milestones → eventos)
- [ ] Vinculación con Tasks (ítems del board → tareas)

### Fase 7: Módulo ACADEME (Semana 13-16)

- [ ] Schema `academe` con tablas
- [ ] CRUD de cursos
- [ ] CRUD de calificaciones
- [ ] Horarios vinculados a Calendar
- [ ] Deadlines → Calendar + Tasks automáticamente
- [ ] Apuntes de clase → Knowledge (TriliumNext) via backbone
- [ ] Dashboard ACADEME con métricas

### Fase 8: Módulos Futuros (Incremental)

- [ ] Finanzas (gastos, presupuestos vinculados a Calendar)
- [ ] Salud (ejercicio, dieta, citas médicas — consumiendo Habits + Calendar)
- [ ] ...

---

## 11. Recursos en Raspberry Pi 5

### Estimación de Consumo

| Contenedor | RAM | CPU | Disco |
|------------|-----|-----|-------|
| Next.js (dev) | ~800MB | 10-15% | ~500MB |
| Go backend | ~150MB | 5-10% | ~50MB |
| PostgreSQL 16 | ~200MB | 5% | ~1GB (con datos) |
| Redis 7 | ~50MB | <5% | ~100MB |
| MinIO | ~100MB | <5% | Variable (archivos) |
| TriliumNext | ~150MB | <5% | ~200MB (notas) |
| **TOTAL** | **~1.45GB** | **~35%** | **~2GB base** |

### Raspberry Pi 5 (8GB RAM, 500GB SSD)

✅ **Excelente compatibilidad**  
- 85% RAM libre para OS + otros procesos
- CPU ARM64 soporta Go y Node.js nativamente
- SSD proporciona I/O rápido para PostgreSQL
- Arranque completo: ~30-45 segundos

### Optimizaciones para Producción

- Next.js build estático (`output: 'standalone'`) → ~200MB RAM
- PostgreSQL con `shared_buffers=128MB`
- Redis con `maxmemory 50mb`
- Go compilado con `-ldflags="-s -w"` (binario más pequeño)

---

## 12. Docker Compose

### Estructura de Contenedores

```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8080:8080"]
    environment:
      - DATABASE_URL=postgres://...
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      postgres: { condition: service_healthy }
      redis: { condition: service_started }

  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 5s

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio
    ports: ["9000:9000", "9001:9001"]
    environment:
      - MINIO_ROOT_USER=${MINIO_USER}
      - MINIO_ROOT_PASSWORD=${MINIO_PASSWORD}
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

  trilium:
    image: triliumnext/notes:latest
    ports: ["8888:8080"]
    environment:
      - TRILIUM_DATA_DIR=/home/node/trilium-data
    volumes:
      - trilium_data:/home/node/trilium-data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  minio_data:
  trilium_data:
```

### Comandos Comunes

```bash
# Iniciar todo
docker compose up

# Rebuild después de cambios
docker compose up --build

# Ver logs
docker compose logs -f backend

# Ejecutar migraciones
docker compose exec postgres psql -U user -d db < migrations/001_init.sql

# Detener (preserva datos)
docker compose down

# Reset completo (BORRA DATOS)
docker compose down -v
```

---

## 13. Decisiones Arquitectónicas Clave

| Decisión | Alternativa Descartada | Razón |
|----------|----------------------|-------|
| Modular Monolith | Microservicios | Overhead innecesario, complejidad prematura |
| 1 Next.js con rutas | Múltiples apps Next.js | Eficiencia en RPi5, UX cohesiva |
| Schemas PostgreSQL | Múltiples DBs | Pool compartido, transacciones cross-schema |
| Dashboard launcher | Sidebar único | Claridad visual, escalabilidad de módulos |
| 5 backbones (Calendar + Tasks + Projects + Habits + Knowledge) | Cada módulo independiente | Conectividad universal, reutilización sin acoplamiento |
| Habits como backbone propio | Integrado en Tasks o Projects | Semántica diferente (streaks, frecuencias, scoring); contaminaría el modelo de Tasks |
| dnd-kit para Kanban (Tasks + Projects) | Librería PM completa (Plane) | Demasiado opinionada; dnd-kit da control total sobre el modelo de datos |
| rrule.js para recurrencia | Lógica manual | Estándar RFC 5545, parsing de casos edge complejos resuelto |
| TriliumNext como motor de Knowledge | Construir PKM propio | PKM profundo (Zettelkasten, graph) sin reinventar la rueda |
| knowledge.Service abstrae TriliumNext | Módulos llaman Trilium directo | Módulos no conocen el motor — intercambiable sin tocarlos |
| knowledge.note_index en PostgreSQL | Todo en SQLite de Trilium | Permite vinculación polimórfica con entidades de la plataforma |
| Go monolítico modular | Go + Node.js API | Mejor performance, tipado fuerte |
| JWT + Redis blacklist | Sessions en DB | Performance, logout inmediato |
| Spike en `labs/` antes de integrar | Prototipar en repo principal | Evita contaminar el repo con experimentos, decisiones informadas |
| Vite en spikes, Next.js en plataforma | Next.js siempre | Arranque instantáneo para explorar herramientas sin overhead |

---

## 14. Próximos Pasos

1. **Clonar/crear repositorio** con estructura de carpetas
2. **Configurar Docker Compose** — levantar PostgreSQL + Redis + MinIO + TriliumNext
3. **Crear directorio `labs/`** fuera del repo principal para spikes
4. **Spike FullCalendar** en `labs/fullcalendar-spike/`
5. **Spike dnd-kit** en `labs/dndkit-spike/` (validar Kanban)
6. **Spike rrule.js** en `labs/rrule-spike/` (validar recurrencia)
7. **Spike TriliumNext** en `labs/trilium-spike/` (validar REST API + iframe + auth token)
8. **Implementar Fase 1** (infraestructura base con 7 schemas)
9. **Implementar Fase 2** (Auth + Dashboard con sidebar backbone/módulos)
10. **Implementar Fase 3** (Calendar + Tasks backbone)
11. **Implementar Fase 4** (Habits backbone)
12. **Implementar Fase 5** (Knowledge backbone + integración TriliumNext)
13. **Implementar Fase 6** (Projects backbone)
14. **Implementar Fase 7** (ACADEME como módulo piloto completo)
15. **Iterar** agregando módulos según necesidad

---

## 15. Contexto del Proyecto

- **Desarrollador**: Estudiante Ingeniería Civil Informática, UTFSM Santiago
- **Objetivo**: Plataforma personal modular para organización académica y personal
- **Usuarios**: 1-2 usuarios inicialmente (personal/familiar)
- **Deploy**: Raspberry Pi 5 (8GB RAM, 500GB SSD) como servidor local
- **Stack preferido**: React, TypeScript, Next.js, Zustand, TanStack Query, Go, PostgreSQL, Redis, Docker

---

> **Este documento es la fuente de verdad arquitectónica.** Cualquier cambio estructural debe reflejarse aquí primero.