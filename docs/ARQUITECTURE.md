# ARQUITECTURA 7 — ACADEME: Plataforma de Gestión Académica

> **Documento de referencia arquitectónica** — Sistema modular para gestión académica personal construido como aplicación Next.js única con backend Go monolítico modular.

---

## 1. Visión General

**ACADEME** es una plataforma personal de gestión académica que integra cursos, evaluaciones, tareas, proyectos y apuntes en un sistema cohesivo. Construida como una aplicación Next.js única con backend Go monolítico modular, permite organizar toda la vida académica desde un solo lugar.

### Concepto Central

El sistema organiza la información académica en **capas de servicios** que se complementan:

- **Servicios Base** — Funcionalidades universales que cualquier entidad académica puede usar: `Calendar` (tiempo), `Tasks` (tareas), `Projects` (organización), `Knowledge` (apuntes). Son la columna vertebral del sistema.
- **Módulo ACADEME** — Capa académica que consume los servicios base y agrega semántica específica: cursos, calificaciones, horarios, evaluaciones.

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js único)                     │
│                                                                 │
│  Dashboard → Calendar → Tasks → Projects → Knowledge           │
│         ↓                                           ↓           │
│      ACADEME                                   TriliumNext      │
│   (Cursos, Notas, Evaluaciones)              (PKM iframe)      │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Go - proceso único)                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   Auth   │  │ Calendar │  │  Tasks   │  │ Projects │        │← BASE
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│  ┌───────────────────────────────────────┐                     │
│  │   Knowledge (abstrae TriliumNext)     │                     │← BASE
│  └────────────────────┬──────────────────┘                     │
│                       │ REST API                               │
│                       ↓                                        │
│  ┌──────────────────────────────┐   TriliumNext               │
│  │         ACADEME              │   (Docker :8888)             │← SATÉLITE
│  │  (Cursos, Calificaciones)    │                             │
│  └──────────────────────────────┘                             │
│       ↑                                                        │
│       └─ inyecta: Calendar, Tasks, Projects, Knowledge         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              PostgreSQL (schemas) + Redis + MinIO               │
│         metadatos Knowledge + todos los demás datos             │
└─────────────────────────────────────────────────────────────────┘
```

### Modelo de Datos: Cursos como Projects

Un **curso** en ACADEME se modela como un **Project** del servicio base, con metadatos académicos adicionales:

```
Curso "Cálculo Diferencial" (Project)
├── Metadatos académicos (schema academe)
│   ├── Código: MAT301
│   ├── Profesor: Dr. Rodríguez
│   ├── Créditos: 6
│   ├── Semestre: 2026-1
│   └── Color: #dc2626
│
├── Milestones (evaluaciones) → vinculados a Calendar
│   ├── Prueba 1 (15 abril)
│   ├── Prueba 2 (20 mayo)
│   └── Examen Final (25 junio)
│
├── Board Kanban (trabajos y estudios) → vinculados a Tasks
│   ├── To Do: "Resolver guía 3"
│   ├── In Progress: "Informe laboratorio"
│   └── Done: "Leer capítulo 5"
│
├── Horario → eventos recurrentes en Calendar
│   ├── Lunes 10:00-12:00
│   └── Miércoles 10:00-12:00
│
└── Apuntes → notas en Knowledge (TriliumNext)
    ├── "Derivadas parciales"
    ├── "Teorema fundamental"
    └── "Ejercicios resueltos"
```

---

## 2. Filosofía de Diseño

### Por qué NO Microservicios

- Overhead operacional alto para un sistema académico personal
- Complejidad prematura para 1-2 usuarios
- Múltiples bases de datos = sincronización compleja
- Ideal para equipos grandes, no para desarrollo individual

### Por qué NO Monolito Tradicional

- Sin límites claros entre dominios
- Difícil de escalar partes específicas
- Acoplamiento alto entre módulos

### Por qué Modular Monolith

✅ **Límites explícitos** — Servicios Go no se importan entre sí  
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
| **Calendar UI** | Implementación personalizada | Calendario construido con React |
| **Drag & Drop / Kanban** | dnd-kit | Tableros Kanban para cursos |
| **Recurrencia** | rrule.js | Parsing de reglas de recurrencia |
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
│   │   ├── page.tsx                      # Dashboard principal
│   │   │
│   │   ├── (auth)/                       # Route group - sin layout principal
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   └── (platform)/                   # Route group - con sidebar
│   │       ├── layout.tsx                # Layout con sidebar + topbar
│   │       ├── dashboard/page.tsx        # Vista "Today" (Calendar + Tasks)
│   │       │
│   │       ├── calendar/page.tsx         # Vista completa Calendar
│   │       ├── tasks/page.tsx            # Gestión de tareas
│   │       ├── knowledge/page.tsx        # Embed TriliumNext PKM
│   │       │
│   │       └── courses/                  # Gestión de cursos
│   │           ├── page.tsx              # Lista de cursos
│   │           ├── [id]/
│   │           │   ├── page.tsx          # Dashboard del curso
│   │           │   ├── board/page.tsx    # Kanban del curso
│   │           │   ├── grades/page.tsx   # Calificaciones
│   │           │   ├── schedule/page.tsx # Horario
│   │           │   └── notes/page.tsx    # Apuntes vinculados
│   │           └── new/page.tsx          # Crear curso
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
│   │   │   └── topbar.tsx
│   │   │
│   │   ├── calendar/                     # Componentes Calendar
│   │   │   ├── calendar-view.tsx
│   │   │   ├── event-card.tsx
│   │   │   └── event-form.tsx
│   │   │
│   │   ├── tasks/                        # Componentes Tasks
│   │   │   ├── task-list.tsx
│   │   │   ├── task-card.tsx
│   │   │   └── task-form.tsx
│   │   │
│   │   ├── projects/                     # Componentes Projects (cursos)
│   │   │   ├── project-board.tsx
│   │   │   ├── project-card.tsx
│   │   │   └── milestone-list.tsx
│   │   │
│   │   ├── knowledge/                    # Componentes Knowledge
│   │   │   ├── trilium-embed.tsx         # Iframe/embed TriliumNext
│   │   │   ├── note-quick-create.tsx     # Crear nota rápida → Trilium
│   │   │   └── note-links.tsx            # Lista notas vinculadas
│   │   │
│   │   └── courses/                      # Componentes específicos ACADEME
│   │       ├── course-card.tsx
│   │       ├── course-form.tsx
│   │       ├── grade-table.tsx
│   │       ├── schedule-grid.tsx
│   │       └── semester-selector.tsx
│   │
│   ├── lib/
│   │   ├── api/                          # Cliente API tipado
│   │   │   ├── client.ts                 # Fetch base con auth
│   │   │   ├── auth.ts
│   │   │   ├── calendar.ts
│   │   │   ├── tasks.ts
│   │   │   ├── projects.ts
│   │   │   ├── knowledge.ts              # Llama a /api/knowledge (Go → Trilium)
│   │   │   └── courses.ts                # API ACADEME
│   │   │
│   │   ├── store/                        # Zustand stores (UI state)
│   │   │   ├── user.ts                   # Usuario actual + token
│   │   │   ├── sidebar.ts                # Estado sidebar
│   │   │   └── semester.ts               # Semestre activo
│   │   │
│   │   ├── queries/                      # TanStack Query (server state)
│   │   │   ├── queryClient.ts
│   │   │   ├── calendar.ts
│   │   │   ├── tasks.ts
│   │   │   ├── projects.ts
│   │   │   ├── knowledge.ts
│   │   │   └── courses.ts
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
│   ├── calendar/                         # BASE: Time manager
│   │   ├── model.go                      # Event, EntityLink structs
│   │   ├── service.go                    # Interface + implementación
│   │   ├── repository.go                 # Acceso a DB (schema calendar.*)
│   │   ├── handler.go                    # HTTP handlers
│   │   └── router.go                     # Rutas del módulo
│   │
│   ├── tasks/                            # BASE: Task manager
│   │   ├── model.go                      # Task, Label structs
│   │   ├── service.go                    # Interface + implementación
│   │   ├── repository.go                 # Acceso a DB (schema tasks.*)
│   │   ├── handler.go
│   │   └── router.go
│   │
│   ├── projects/                         # BASE: Project manager
│   │   ├── model.go                      # Project, Milestone, Board structs
│   │   ├── service.go                    # Interface + implementación
│   │   ├── repository.go                 # Acceso a DB (schema projects.*)
│   │   ├── handler.go
│   │   └── router.go
│   │
│   ├── knowledge/                        # BASE: Knowledge / PKM
│   │   ├── model.go                      # Note, EntityLink structs (metadatos)
│   │   ├── service.go                    # Interface — oculta TriliumNext
│   │   ├── trilium_client.go             # Cliente REST → TriliumNext API
│   │   ├── repository.go                 # Metadatos en PostgreSQL (índice, links)
│   │   ├── handler.go                    # HTTP handlers expuestos a frontend
│   │   └── router.go
│   │
│   ├── courses/                          # ACADEME: Gestión de cursos
│   │   ├── model.go                      # Course, Grade, Schedule structs
│   │   ├── service.go                    # Inyecta calendar + tasks + projects + knowledge
│   │   ├── repository.go                 # Acceso a DB (schema courses.*)
│   │   ├── handler.go
│   │   └── router.go
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
│   ├── 006_knowledge.sql                 # Solo metadatos e índice
│   └── 007_courses.sql
│
├── Dockerfile
├── go.mod
└── go.sum
```

---

## 5. Servicios del Sistema

### 5.1 Base: Auth

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Registro, login, gestión de sesiones, JWT |
| **Schema PostgreSQL** | `auth.users`, `auth.sessions` |
| **Endpoints** | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me` |
| **Dependencias** | Ninguna (base transversal) |

---

### 5.2 Base: Calendar (Time Manager)

**Rol en ACADEME**: Gestiona toda la dimensión temporal — horarios de clases, deadlines de entregas, fechas de evaluaciones, eventos académicos.

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Gestión de eventos, timeline universal, vinculación temporal con cualquier entidad |
| **Herramienta UI** | **Implementación personalizada** con React + react-dnd para drag & drop |
| **Schema PostgreSQL** | `calendar.events`, `calendar.entity_links` |
| **Endpoints** | `GET/POST/PUT/DELETE /api/calendar/events`, `POST /api/calendar/events/:id/link` |
| **Patrón de vinculación** | Tabla polimórfica `entity_links(event_id, entity_kind, entity_id)` |
| **Usado por** | Courses (horarios, deadlines), Projects (milestones de evaluaciones) |
| **Dificultad implementación** | Baja-Media — la parte compleja es recurrencia; usar **rrule.js** (frontend) |
| **Ejemplo** | Curso crea deadline "Entrega Tarea 1" → `calendar.CreateEvent(...)` → aparece en calendario |

```go
type Service interface {
    CreateEvent(ctx context.Context, userID string, req CreateEventRequest) (*Event, error)
    GetEvents(ctx context.Context, userID string, start, end time.Time) ([]*Event, error)
    UpdateEvent(ctx context.Context, eventID string, req UpdateEventRequest) (*Event, error)
    DeleteEvent(ctx context.Context, eventID string) error
    LinkToEntity(ctx context.Context, eventID, entityKind, entityID string) error
}
```

**Casos de uso en ACADEME**:
- Horario de clases (eventos recurrentes semanales)
- Deadlines de entregas (eventos de día completo)
- Fechas de evaluaciones (eventos con hora específica)
- Eventos académicos (charlas, seminarios)

---

### 5.3 Base: Tasks (Task Manager)

**Rol en ACADEME**: Gestiona tareas individuales — resolver guías, estudiar capítulos, preparar presentaciones, trabajos puntuales.

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Gestión de tareas individuales con estados, prioridades, recurrencia y vinculación a entidades |
| **Herramienta UI** | **dnd-kit** (MIT) — drag & drop para vistas Kanban y listas reordenables |
| **Schema PostgreSQL** | `tasks.tasks`, `tasks.labels`, `tasks.entity_links` |
| **Endpoints** | `GET/POST/PUT/DELETE /api/tasks`, `PATCH /api/tasks/:id/status`, `GET /api/tasks?project_id=&due=today` |
| **Patrón de vinculación** | Tabla polimórfica `entity_links(task_id, entity_kind, entity_id)` |
| **Modelo de datos clave** | `status`: todo/in_progress/done/cancelled · `priority`: 1-4 · `recurrence`: rrule string · `parent_task_id` para subtareas |
| **Usado por** | Courses (tareas de curso), Projects (ítems de board Kanban) |
| **Dificultad implementación** | Baja-Media — CRUD + Kanban: ~1-2 semanas. Con recurrencia: +1-2 semanas |
| **Librería clave** | **rrule.js** para recurrencia en frontend; schema `recurrence TEXT` guarda la rrule string |
| **Ejemplo** | Curso crea tarea "Resolver guía 3" → `tasks.CreateTask(...)` → aparece en board del curso |

```go
type Service interface {
    CreateTask(ctx context.Context, userID string, req CreateTaskRequest) (*Task, error)
    GetTasks(ctx context.Context, userID string, filters TaskFilters) ([]*Task, error)
    UpdateStatus(ctx context.Context, taskID string, status TaskStatus) error
    LinkToEntity(ctx context.Context, taskID, entityKind, entityID string) error
}
```

**Casos de uso en ACADEME**:
- Tareas de curso (resolver ejercicios, leer capítulos)
- Trabajos y proyectos (divididos en subtareas)
- Preparación de evaluaciones (estudiar temas específicos)
- Tareas administrativas (inscripción de ramos, trámites)

---

### 5.4 Base: Projects (Project Manager)

**Rol en ACADEME**: Modela **cursos** como proyectos académicos con estructura, milestones (evaluaciones) y board Kanban (trabajos/estudios).

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Gestión de proyectos con milestones, boards Kanban y vinculación a tareas/eventos |
| **Herramienta UI** | **dnd-kit** para board Kanban + **Frappe Gantt** (MIT) opcional para timeline |
| **Schema PostgreSQL** | `projects.projects`, `projects.milestones`, `projects.boards`, `projects.entity_links` |
| **Endpoints** | `GET/POST/PUT/DELETE /api/projects`, `/api/projects/:id/milestones`, `/api/projects/:id/board` |
| **Patrón de vinculación** | Tabla polimórfica `entity_links(project_id, entity_kind, entity_id)` |
| **Modelo de datos clave** | `status`: active/on_hold/completed/archived · `milestones` con due_date · board con columnas configurables |
| **Usado por** | Courses (cada curso es un proyecto) |
| **Dificultad implementación** | Media-Alta — CRUD + milestones + board: ~2-3 semanas. Con Gantt: +1-2 semanas |
| **Ejemplo** | Curso "Cálculo" → Project con milestones (Prueba 1, Prueba 2, Examen) + board Kanban (tareas del curso) |

```go
type Service interface {
    CreateProject(ctx context.Context, userID string, req CreateProjectRequest) (*Project, error)
    GetProjects(ctx context.Context, userID string) ([]*Project, error)
    AddMilestone(ctx context.Context, projectID string, req MilestoneRequest) (*Milestone, error)
    GetBoard(ctx context.Context, projectID string) (*Board, error)
    LinkToEntity(ctx context.Context, projectID, entityKind, entityID string) error
}
```

**Modelo para cursos**:
```
Project (curso)
├── Milestones → Evaluaciones (vinculadas a Calendar)
├── Board Kanban → Trabajos y estudios (vinculados a Tasks)
└── Timeline → Calendario del semestre
```

**Casos de uso en ACADEME**:
- Cada curso es un Project
- Evaluaciones son Milestones con fechas
- Trabajos y estudios son Tasks en el board Kanban
- Proyectos semestrales (memoria, tesis) son Projects especiales

---

### 5.5 Base: Knowledge (PKM — motor: TriliumNext)

**Rol en ACADEME**: Gestiona apuntes de clase, resúmenes, ejercicios resueltos, documentación de proyectos — toda la memoria académica.

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | PKM profundo (Zettelkasten, graph view, backlinks) + notas vinculadas a entidades académicas |
| **Motor** | **TriliumNext** — corre como contenedor Docker separado (`:8888`), AGPL-3.0 |
| **Schema PostgreSQL** | `knowledge.note_index` — metadatos e índice para búsqueda y vinculación (NO el contenido) |
| **Endpoints** | `POST /api/knowledge/notes`, `GET /api/knowledge/notes?entity_kind=&entity_id=`, `POST /api/knowledge/notes/:id/link` |
| **Patrón de vinculación** | `knowledge.note_index(trilium_note_id, entity_kind, entity_id)` — el contenido vive en Trilium, el vínculo en PostgreSQL |
| **Usado por** | Courses (apuntes de clase), Projects (documentación de trabajos) |
| **Frontend** | Card "Knowledge" en dashboard abre TriliumNext via iframe/redirect. Cursos muestran notas vinculadas |

**Principio clave**: Courses nunca habla con TriliumNext directamente. Siempre a través de `knowledge.Service` en Go.

```go
type Service interface {
    CreateNote(ctx context.Context, userID string, req CreateNoteRequest) (*Note, error)
    LinkToEntity(ctx context.Context, noteID, entityKind, entityID string) error
    GetNotesForEntity(ctx context.Context, entityKind, entityID string) ([]*Note, error)
    Search(ctx context.Context, userID, query string) ([]*Note, error)
}
```

**Casos de uso en ACADEME**:
- Apuntes de clase vinculados a curso
- Resúmenes de capítulos vinculados a tareas
- Ejercicios resueltos vinculados a evaluaciones
- Documentación de proyectos semestrales
- Zettelkasten para conectar conceptos entre cursos

---

### 5.6 Módulo: Courses (ACADEME)

**Rol**: Capa académica que agrega semántica específica sobre los servicios base.

| Aspecto | Descripción |
|---------|-------------|
| **Responsabilidad** | Gestión de cursos, calificaciones, horarios, evaluaciones |
| **Schema PostgreSQL** | `courses.course_metadata`, `courses.grades`, `courses.schedules` |
| **Endpoints** | `GET/POST/PUT/DELETE /api/courses`, `/api/courses/:id/grades`, `/api/courses/:id/schedule` |
| **Dependencias base** | Inyecta `calendar.Service`, `tasks.Service`, `projects.Service`, `knowledge.Service` |
| **Modelo de datos** | Ver schema completo abajo |

```go
// Modelo de datos completo
type CourseMetadata struct {
    ID         string
    UserID     string
    ProjectID  string    // vincula con projects.projects
    Code       string    // MAT301
    Name       string    // Cálculo Diferencial
    Professor  string
    Credits    int
    Semester   string    // "2026-1"
    Color      string    // para UI
    Status     string    // active/completed/dropped
    CreatedAt  time.Time
    UpdatedAt  time.Time
}

type Grade struct {
    ID          string
    CourseID    string
    MilestoneID string    // vincula con projects.milestones
    Name        string    // "Prueba 1"
    Score       float64   // 6.5
    Weight      float64   // 0.25 (25% de la nota final)
    Notes       string
    Date        time.Time
}

type Schedule struct {
    ID        string
    CourseID  string
    EventID   string    // vincula con calendar.events (recurrente)
    Day       int       // 1=Lun, 2=Mar, etc.
    StartTime string    // "10:00"
    EndTime   string    // "12:00"
    Room      string
}
```

```go
type Service interface {
    // Cursos
    CreateCourse(ctx context.Context, userID string, req CreateCourseRequest) (*CourseMetadata, error)
    GetCourses(ctx context.Context, userID string, semester string) ([]*CourseMetadata, error)
    GetCourse(ctx context.Context, courseID string) (*CourseMetadata, error)
    UpdateCourse(ctx context.Context, courseID string, req UpdateCourseRequest) error
    DeleteCourse(ctx context.Context, courseID string) error
    
    // Calificaciones
    AddGrade(ctx context.Context, courseID string, req AddGradeRequest) (*Grade, error)
    GetGrades(ctx context.Context, courseID string) ([]*Grade, error)
    CalculateFinalGrade(ctx context.Context, courseID string) (float64, error)
    
    // Horarios
    SetSchedule(ctx context.Context, courseID string, schedule []ScheduleEntry) error
    GetSchedule(ctx context.Context, courseID string) ([]*Schedule, error)
}
```

**Flujo completo de creación de curso**:

```go
// 1. Usuario crea curso "Cálculo Diferencial"
course, err := coursesService.CreateCourse(ctx, userID, CreateCourseRequest{
    Code:      "MAT301",
    Name:      "Cálculo Diferencial",
    Professor: "Dr. Rodríguez",
    Credits:   6,
    Semester:  "2026-1",
    Color:     "#dc2626",
})

// Internamente, coursesService hace:
// a) Crear Project en projects.Service
project, _ := projectsService.CreateProject(ctx, userID, CreateProjectRequest{
    Name:        "Cálculo Diferencial",
    Description: "MAT301 - 2026-1",
    Status:      "active",
})

// b) Guardar metadatos académicos vinculados al Project
courseMetadata := CourseMetadata{
    ProjectID: project.ID,
    Code:      "MAT301",
    // ... resto de campos
}
repository.SaveCourseMetadata(ctx, courseMetadata)

// 2. Usuario agrega horario
coursesService.SetSchedule(ctx, course.ID, []ScheduleEntry{
    {Day: 1, StartTime: "10:00", EndTime: "12:00", Room: "A-201"}, // Lunes
    {Day: 3, StartTime: "10:00", EndTime: "12:00", Room: "A-201"}, // Miércoles
})

// Internamente:
// a) Crear evento recurrente en Calendar
calendarService.CreateEvent(ctx, userID, CreateEventRequest{
    Title:      "Cálculo Diferencial",
    Recurrence: "FREQ=WEEKLY;BYDAY=MO,WE", // rrule
    StartTime:  "10:00",
    EndTime:    "12:00",
    // ...
})

// 3. Usuario agrega evaluación "Prueba 1"
coursesService.AddGrade(ctx, course.ID, AddGradeRequest{
    Name:   "Prueba 1",
    Weight: 0.25,
    Date:   time.Date(2026, 4, 15, 10, 0, 0, 0, time.UTC),
})

// Internamente:
// a) Crear Milestone en Project
milestone, _ := projectsService.AddMilestone(ctx, project.ID, MilestoneRequest{
    Title:   "Prueba 1",
    DueDate: time.Date(2026, 4, 15, 10, 0, 0, 0, time.UTC),
})

// b) Crear evento en Calendar vinculado al Milestone
calendarService.CreateEvent(ctx, userID, CreateEventRequest{
    Title:     "Prueba 1 - Cálculo",
    StartTime: time.Date(2026, 4, 15, 10, 0, 0, 0, time.UTC),
    EndTime:   time.Date(2026, 4, 15, 12, 0, 0, 0, time.UTC),
})
calendarService.LinkToEntity(ctx, event.ID, "milestone", milestone.ID)

// c) Guardar Grade vinculado al Milestone
grade := Grade{
    CourseID:    course.ID,
    MilestoneID: milestone.ID,
    Name:        "Prueba 1",
    Weight:      0.25,
    // ...
}
repository.SaveGrade(ctx, grade)

// 4. Usuario agrega tarea "Resolver guía 3"
tasksService.CreateTask(ctx, userID, CreateTaskRequest{
    Title:   "Resolver guía 3",
    DueDate: time.Date(2026, 4, 10, 23, 59, 0, 0, time.UTC),
})
tasksService.LinkToEntity(ctx, task.ID, "project", project.ID)

// 5. Usuario crea apunte "Derivadas parciales"
knowledgeService.CreateNote(ctx, userID, CreateNoteRequest{
    Title:   "Derivadas parciales",
    Content: "...",
})
knowledgeService.LinkToEntity(ctx, note.ID, "course", course.ID)
```

---

## 6. Base de Datos — PostgreSQL con Schemas

### Estrategia de Aislamiento

Un solo PostgreSQL con **schemas lógicos** por servicio:

```sql
CREATE SCHEMA auth;
CREATE SCHEMA calendar;
CREATE SCHEMA tasks;
CREATE SCHEMA projects;
CREATE SCHEMA knowledge;   -- solo metadatos e índice, contenido en Trilium
CREATE SCHEMA courses;     -- ACADEME
```

### Ventajas

- Pool de conexiones compartido (eficiente)
- Transacciones cross-schema posibles
- Backups unificados
- Menos overhead operacional que múltiples DBs

### Schema Completo

```sql
-- ============================================================================
-- SCHEMA: auth
-- ============================================================================
CREATE SCHEMA auth;

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE auth.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON auth.sessions(expires_at);

-- ============================================================================
-- SCHEMA: calendar
-- ============================================================================
CREATE SCHEMA calendar;

CREATE TABLE calendar.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    recurrence TEXT,  -- rrule string (RFC 5545)
    color VARCHAR(7),
    location VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE calendar.entity_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES calendar.events(id) ON DELETE CASCADE,
    entity_kind VARCHAR(50) NOT NULL,  -- 'course', 'milestone', 'task', etc.
    entity_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_user_id ON calendar.events(user_id);
CREATE INDEX idx_events_start_time ON calendar.events(start_time);
CREATE INDEX idx_entity_links_event_id ON calendar.entity_links(event_id);
CREATE INDEX idx_entity_links_entity ON calendar.entity_links(entity_kind, entity_id);

-- ============================================================================
-- SCHEMA: tasks
-- ============================================================================
CREATE SCHEMA tasks;

CREATE TABLE tasks.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo',  -- todo/in_progress/done/cancelled
    priority INTEGER DEFAULT 3,  -- 1=urgent, 4=low
    due_date TIMESTAMP,
    recurrence TEXT,  -- rrule string
    parent_task_id UUID REFERENCES tasks.tasks(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE TABLE tasks.labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks.tasks(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7)
);

CREATE TABLE tasks.entity_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks.tasks(id) ON DELETE CASCADE,
    entity_kind VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks.tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks.tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks.tasks(due_date);
CREATE INDEX idx_task_entity_links_task_id ON tasks.entity_links(task_id);
CREATE INDEX idx_task_entity_links_entity ON tasks.entity_links(entity_kind, entity_id);

-- ============================================================================
-- SCHEMA: projects
-- ============================================================================
CREATE SCHEMA projects;

CREATE TABLE projects.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',  -- active/on_hold/completed/archived
    color VARCHAR(7),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE projects.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE projects.boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
    columns JSONB NOT NULL DEFAULT '["To Do", "In Progress", "Done"]',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE projects.entity_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
    entity_kind VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects.projects(user_id);
CREATE INDEX idx_milestones_project_id ON projects.milestones(project_id);
CREATE INDEX idx_milestones_due_date ON projects.milestones(due_date);
CREATE INDEX idx_project_entity_links_project_id ON projects.entity_links(project_id);

-- ============================================================================
-- SCHEMA: knowledge
-- ============================================================================
CREATE SCHEMA knowledge;

CREATE TABLE knowledge.note_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trilium_note_id VARCHAR(255) NOT NULL,  -- ID en TriliumNext
    title VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE knowledge.entity_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_index_id UUID NOT NULL REFERENCES knowledge.note_index(id) ON DELETE CASCADE,
    entity_kind VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_note_index_user_id ON knowledge.note_index(user_id);
CREATE INDEX idx_note_index_trilium_id ON knowledge.note_index(trilium_note_id);
CREATE INDEX idx_knowledge_entity_links_note ON knowledge.entity_links(note_index_id);
CREATE INDEX idx_knowledge_entity_links_entity ON knowledge.entity_links(entity_kind, entity_id);

-- ============================================================================
-- SCHEMA: courses (ACADEME)
-- ============================================================================
CREATE SCHEMA courses;

CREATE TABLE courses.course_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects.projects(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    professor VARCHAR(255),
    credits INTEGER,
    semester VARCHAR(50) NOT NULL,  -- "2026-1"
    color VARCHAR(7),
    status VARCHAR(50) DEFAULT 'active',  -- active/completed/dropped
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE courses.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses.course_metadata(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES projects.milestones(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    score DECIMAL(4,2),  -- 6.5
    weight DECIMAL(4,2),  -- 0.25 (25%)
    notes TEXT,
    date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE courses.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses.course_metadata(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES calendar.events(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,  -- 1=Mon, 7=Sun
    start_time VARCHAR(5) NOT NULL,  -- "10:00"
    end_time VARCHAR(5) NOT NULL,    -- "12:00"
    room VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_course_metadata_user_id ON courses.course_metadata(user_id);
CREATE INDEX idx_course_metadata_semester ON courses.course_metadata(semester);
CREATE INDEX idx_course_metadata_project_id ON courses.course_metadata(project_id);
CREATE INDEX idx_grades_course_id ON courses.grades(course_id);
CREATE INDEX idx_schedules_course_id ON courses.schedules(course_id);
```

---

## 7. Navegación y UX

### Dashboard Principal

```
┌─────────────────────────────────────────────────────────────┐
│  ACADEME                                    Usuario ▼       │
│                                                             │
│  — HOY ────────────────────────────────────────────────── │
│  📅 Próximas clases:                                        │
│     • Cálculo Diferencial (10:00 - 12:00)                  │
│     • Física General (14:00 - 16:00)                       │
│                                                             │
│  ✅ Tareas pendientes:                                      │
│     • Resolver guía 3 (Cálculo) - Vence hoy                │
│     • Leer capítulo 5 (Física) - Vence mañana              │
│                                                             │
│  — SEMANA ─────────────────────────────────────────────── │
│  📋 Evaluaciones próximas:                                  │
│     • Prueba 1 - Cálculo (15 abril)                        │
│     • Control - Física (18 abril)                          │
│                                                             │
│  — ACCESO RÁPIDO ──────────────────────────────────────── │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Cursos   │ │ Calendar │ │  Tareas  │ │  Apuntes │      │
│  │   📚     │ │   📅     │ │    ✅    │ │    🧠    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Rutas Next.js

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard principal (vista "Hoy") |
| `/login` | Autenticación |
| `/dashboard` | Vista "Today" (eventos + tareas del día) |
| `/calendar` | Vista completa Calendar (FullCalendar) |
| `/tasks` | Gestión de tareas global |
| `/knowledge` | PKM — embed TriliumNext + notas vinculadas |
| `/courses` | Lista de cursos del semestre |
| `/courses/[id]` | Dashboard del curso |
| `/courses/[id]/board` | Kanban del curso (trabajos y estudios) |
| `/courses/[id]/grades` | Calificaciones y promedio |
| `/courses/[id]/schedule` | Horario del curso |
| `/courses/[id]/notes` | Apuntes vinculados al curso |
| `/courses/new` | Crear nuevo curso |

### Sidebar

```
ACADEME
─────────────
Dashboard
Calendar
Tareas
Apuntes (PKM)
─────────────
CURSOS
  Cálculo Diferencial
  Física General
  Programación
  Álgebra Lineal
─────────────
+ Nuevo Curso
```

---

## 8. Reglas de Arquitectura

### Regla 1: Dependencias Unidireccionales

```
Courses  →  Base (Calendar + Tasks + Projects + Knowledge)  →  Database
Courses  ✗  Courses   (no hay otros módulos)
Base     ✗  Courses   (nunca importa el módulo)
Knowledge → TriliumNext (via trilium_client.go, nunca directo desde Courses)
```

### Regla 2: Aislamiento de Datos

- Cada servicio solo accede a su propio schema PostgreSQL
- Toda query de usuario incluye `WHERE user_id = $1`
- No hay queries cross-schema directas (usar servicios base)
- Knowledge: el contenido vive en TriliumNext; PostgreSQL solo guarda metadatos e índice

### Regla 3: Patrón de 5 Archivos

Cada paquete Go tiene:
- `model.go` — Structs y tipos (sin lógica)
- `service.go` — Lógica de negocio (sin HTTP)
- `handler.go` — HTTP handlers (sin DB)
- `repository.go` — Acceso a DB (sin lógica de negocio)
- `router.go` — Definición de rutas

### Regla 4: State Management Frontend

- **TanStack Query** — Todo lo que viene del servidor (cache, refetch, mutations)
- **Zustand** — Estado UI efímero (sidebar abierto, semestre activo, filtros)
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
├── academe/              ← repo principal (ARQUITECTURA 7)
│   └── docker-compose.yml
│
└── labs/                 ← fuera del repo, gitignoreado o repo propio
    ├── fullcalendar-spike/
    ├── trilium-spike/     ← validar REST API, iframe, token auth
    ├── tiptap-spike/
    └── dndkit-spike/
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

### Para integrar en ACADEME
- Instalar: `@fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction`
- Crear: `frontend/src/components/calendar/calendar-view.tsx`
- Endpoint Go: `GET /api/calendar/events?start=&end=` ya definido en ARQUITECTURA 7
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
| **TriliumNext** | PKM motor | ¿REST API funcional? ¿Auth por token? ¿Embed via iframe? |

---

### Criterio para "graduarse" del spike al repo principal

Una herramienta pasa de `labs/` a `academe/` cuando:

- ✅ Las preguntas del spike tienen respuesta
- ✅ El README documenta decisiones y problemas encontrados
- ✅ Está claro dónde vive en la arquitectura (qué componente, qué endpoint)
- ✅ No requiere cambios estructurales al `docker-compose.yml` principal
- ❌ Si requiere cambios grandes → iterar la arquitectura primero

---

## 10. Roadmap de Desarrollo

> Las herramientas marcadas con 🧪 deben pasar por un spike en `labs/` antes de integrarse.

### Fase 1: Infraestructura Base (Semana 1-2)

- [ ] Setup Docker Compose (PostgreSQL + Redis + MinIO + TriliumNext)
- [ ] Scaffold Next.js con TypeScript + Tailwind
- [ ] Scaffold Go con Gin + pgx
- [ ] Configuración de variables de entorno
- [ ] Migraciones base (schemas: auth, calendar, tasks, projects, knowledge, courses)

### Fase 2: Auth + Dashboard (Semana 3-4)

- [ ] Módulo `auth` completo (registro, login, JWT)
- [ ] Middleware de autenticación
- [ ] Páginas login/register en Next.js
- [ ] Dashboard principal con vista "Hoy"
- [ ] Layout con sidebar

### Fase 3: Base — Calendar + Tasks (Semana 5-7)

- [ ] 🧪 Spike dnd-kit en `labs/dndkit-spike/` (validar Kanban + drag & drop en calendario)
- [ ] 🧪 Spike rrule.js en `labs/rrule-spike/` (recurrencia en tasks y calendar)
- [ ] Base `calendar` completo (CRUD eventos + vinculación polimórfica)
- [ ] Base `tasks` completo (CRUD tareas + estados + recurrencia + vinculación)
- [ ] Implementación personalizada de calendario con React + react-dnd
- [ ] Vista "Today" en dashboard (eventos + tareas del día)
- [ ] Patrón de vinculación polimórfica funcionando y documentado

### Fase 4: Base — Projects (Semana 8-9)

- [ ] 🧪 Spike Frappe Gantt en `labs/gantt-spike/` (opcional, si se requiere timeline)
- [ ] Base `projects` completo (CRUD proyectos + milestones + board Kanban)
- [ ] Vinculación con Calendar (milestones → eventos)
- [ ] Vinculación con Tasks (ítems del board → tareas)

### Fase 5: Base — Knowledge (TriliumNext) (Semana 10-11)

- [ ] 🧪 Spike TriliumNext en `labs/trilium-spike/` (REST API + auth token + iframe)
- [ ] TriliumNext corriendo en Docker Compose principal
- [ ] Base `knowledge` en Go (service + trilium_client + repository metadatos)
- [ ] Card "Knowledge" en dashboard → embed TriliumNext
- [ ] `knowledge.CreateNote` y `knowledge.LinkToEntity` funcionando
- [ ] Notas vinculadas visibles en contexto de entidades

### Fase 6: Módulo Courses (ACADEME) (Semana 12-16)

- [ ] Schema `courses` con tablas
- [ ] CRUD de cursos (integrado con Projects)
- [ ] CRUD de calificaciones (vinculado a Milestones)
- [ ] Horarios vinculados a Calendar (eventos recurrentes)
- [ ] Dashboard del curso con métricas
- [ ] Board Kanban del curso (trabajos y estudios)
- [ ] Cálculo de promedio ponderado
- [ ] Apuntes de clase → Knowledge (TriliumNext) via base
- [ ] Vista de semestre con todos los cursos

### Fase 7: Refinamiento y Optimización (Semana 17-20)

- [ ] Mejoras de UX basadas en uso real
- [ ] Optimización de queries PostgreSQL
- [ ] Implementación de caché con Redis
- [ ] Tests unitarios en Go
- [ ] Tests de componentes en React
- [ ] Documentación de API
- [ ] Guía de usuario

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
| Modular Monolith | Microservicios | Overhead innecesario para sistema académico personal |
| 1 Next.js con rutas | Múltiples apps | Eficiencia en RPi5, UX cohesiva |
| Schemas PostgreSQL | Múltiples DBs | Pool compartido, transacciones cross-schema |
| Cursos como Projects | Schema courses independiente | Reutilización de lógica de milestones y boards |
| 4 servicios base (Calendar + Tasks + Projects + Knowledge) | Todo en módulo ACADEME | Separación de responsabilidades, reutilización |
| Calendario personalizado | FullCalendar | Control total sobre UI/UX, más ligero, integración perfecta con diseño existente |
| dnd-kit para Kanban | Librería PM completa | Control total sobre modelo de datos |
| rrule.js para recurrencia | Lógica manual | Estándar RFC 5545, casos edge resueltos |
| TriliumNext como motor de Knowledge | Construir PKM propio | PKM profundo sin reinventar la rueda |
| knowledge.Service abstrae TriliumNext | Courses llama Trilium directo | Intercambiable sin tocar Courses |
| knowledge.note_index en PostgreSQL | Todo en SQLite de Trilium | Vinculación polimórfica con entidades |
| Go monolítico modular | Go + Node.js API | Mejor performance, tipado fuerte |
| JWT + Redis blacklist | Sessions en DB | Performance, logout inmediato |
| Spike en `labs/` antes de integrar | Prototipar en repo principal | Evita contaminar el repo con experimentos |
| Vite en spikes, Next.js en plataforma | Next.js siempre | Arranque instantáneo para explorar herramientas |

---

## 14. Próximos Pasos

1. **Clonar/crear repositorio** con estructura de carpetas
2. **Configurar Docker Compose** — levantar PostgreSQL + Redis + MinIO + TriliumNext
3. **Crear directorio `labs/`** fuera del repo principal para spikes
4. **Spike FullCalendar** en `labs/fullcalendar-spike/`
5. **Spike dnd-kit** en `labs/dndkit-spike/` (validar Kanban)
6. **Spike rrule.js** en `labs/rrule-spike/` (validar recurrencia)
7. **Spike TriliumNext** en `labs/trilium-spike/` (validar REST API + iframe + auth token)
8. **Implementar Fase 1** (infraestructura base con 6 schemas)
9. **Implementar Fase 2** (Auth + Dashboard)
10. **Implementar Fase 3** (Calendar + Tasks base)
11. **Implementar Fase 4** (Projects base)
12. **Implementar Fase 5** (Knowledge base + integración TriliumNext)
13. **Implementar Fase 6** (Courses como módulo completo)
14. **Iterar** refinando funcionalidades según uso real

---

## 15. Contexto del Proyecto

- **Desarrollador**: Estudiante Ingeniería Civil Informática, UTFSM Santiago
- **Objetivo**: Plataforma personal de gestión académica
- **Usuarios**: 1-2 usuarios inicialmente (personal)
- **Deploy**: Raspberry Pi 5 (8GB RAM, 500GB SSD) como servidor local
- **Stack preferido**: React, TypeScript, Next.js, Zustand, TanStack Query, Go, PostgreSQL, Redis, Docker

---

> **Este documento es la fuente de verdad arquitectónica para ACADEME.** Cualquier cambio estructural debe reflejarse aquí primero.
