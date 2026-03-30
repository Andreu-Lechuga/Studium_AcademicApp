# Plan de Implementación: Calendario Avanzado para Academe

## Resumen Ejecutivo

Este documento describe el plan completo para implementar funcionalidades avanzadas en el calendario de Academe, incluyendo eventos recurrentes, drag & drop, y la arquitectura del servidor backend en Go.

---

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Frontend: React/TypeScript](#frontend-reacttypescript)
3. [Backend: Go Server](#backend-go-server)
4. [Base de Datos](#base-de-datos)
5. [Plan de Implementación por Fases](#plan-de-implementación-por-fases)
6. [Ejemplos de Código](#ejemplos-de-código)

---

## Arquitectura General

### División de Responsabilidades

**Frontend (React/TypeScript):**
- ✅ UI/UX del calendario
- ✅ Drag & drop visual
- ✅ Renderizado de eventos
- ✅ Validaciones básicas del cliente
- ✅ Gestión de estado local (Zustand/Context)

**Backend (Go):**
- 🔧 Almacenamiento de eventos (base de datos)
- 🔧 Lógica de eventos recurrentes (cálculo de ocurrencias)
- 🔧 Validaciones de negocio
- 🔧 API REST
- 🔧 Autenticación y permisos
- 🔧 Sincronización en tiempo real (opcional: WebSockets)

---

## Frontend: React/TypeScript

### Librerías Necesarias

```bash
# Drag & Drop (ya instalado en el proyecto)
"react-dnd": "16.0.1"
"react-dnd-html5-backend": "16.0.1"

# Eventos recurrentes
npm install rrule

# Gestión de estado (opcional, alternativa a Context)
npm install zustand

# Manejo de fechas con zonas horarias
npm install date-fns-tz
```

### 1. Eventos Recurrentes con RRule

#### Instalación
```bash
npm install rrule
```

#### Tipos TypeScript
```typescript
// src/types/calendar.ts
import { RRule } from 'rrule';

export interface RecurrenceRule {
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number;
  byweekday?: number[];
  bymonthday?: number[];
  count?: number;
  until?: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  color: string;
  category: string;
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
  recurrenceExceptions?: Date[]; // Fechas excluidas
  courseId?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Hook para Eventos Recurrentes
```typescript
// src/hooks/useRecurringEvents.ts
import { useMemo } from 'react';
import { RRule } from 'rrule';
import { CalendarEvent } from '../types/calendar';

export function useRecurringEvents(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date
) {
  return useMemo(() => {
    const expandedEvents: CalendarEvent[] = [];

    events.forEach((event) => {
      if (!event.isRecurring) {
        // Evento simple
        expandedEvents.push(event);
      } else if (event.recurrenceRule) {
        // Evento recurrente - generar ocurrencias
        const rule = new RRule({
          freq: RRule[event.recurrenceRule.freq],
          interval: event.recurrenceRule.interval || 1,
          byweekday: event.recurrenceRule.byweekday,
          bymonthday: event.recurrenceRule.bymonthday,
          dtstart: event.startTime,
          until: event.recurrenceRule.until,
          count: event.recurrenceRule.count,
        });

        const occurrences = rule.between(startDate, endDate, true);
        
        occurrences.forEach((occurrence) => {
          // Verificar si esta ocurrencia está en las excepciones
          const isException = event.recurrenceExceptions?.some(
            (exception) => exception.getTime() === occurrence.getTime()
          );

          if (!isException) {
            const duration = event.endTime.getTime() - event.startTime.getTime();
            expandedEvents.push({
              ...event,
              id: `${event.id}-${occurrence.getTime()}`,
              startTime: occurrence,
              endTime: new Date(occurrence.getTime() + duration),
            });
          }
        });
      }
    });

    return expandedEvents;
  }, [events, startDate, endDate]);
}
```

#### Componente de Formulario para Recurrencia
```typescript
// src/components/calendar/RecurrenceForm.tsx
import { useState } from 'react';
import { RecurrenceRule } from '../../types/calendar';

interface RecurrenceFormProps {
  value: RecurrenceRule | null;
  onChange: (rule: RecurrenceRule | null) => void;
}

export function RecurrenceForm({ value, onChange }: RecurrenceFormProps) {
  const [isRecurring, setIsRecurring] = useState(!!value);

  const handleFrequencyChange = (freq: RecurrenceRule['freq']) => {
    onChange({
      freq,
      interval: 1,
    });
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => {
            setIsRecurring(e.target.checked);
            if (!e.target.checked) {
              onChange(null);
            } else {
              onChange({ freq: 'WEEKLY', interval: 1 });
            }
          }}
        />
        <span>Evento recurrente</span>
      </label>

      {isRecurring && (
        <>
          <div>
            <label>Frecuencia:</label>
            <select
              value={value?.freq || 'WEEKLY'}
              onChange={(e) => handleFrequencyChange(e.target.value as RecurrenceRule['freq'])}
            >
              <option value="DAILY">Diario</option>
              <option value="WEEKLY">Semanal</option>
              <option value="MONTHLY">Mensual</option>
              <option value="YEARLY">Anual</option>
            </select>
          </div>

          <div>
            <label>Repetir cada:</label>
            <input
              type="number"
              min="1"
              value={value?.interval || 1}
              onChange={(e) => onChange({ ...value!, interval: parseInt(e.target.value) })}
            />
            <span>
              {value?.freq === 'DAILY' && 'día(s)'}
              {value?.freq === 'WEEKLY' && 'semana(s)'}
              {value?.freq === 'MONTHLY' && 'mes(es)'}
              {value?.freq === 'YEARLY' && 'año(s)'}
            </span>
          </div>

          {value?.freq === 'WEEKLY' && (
            <div>
              <label>Días de la semana:</label>
              <div className="flex gap-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-8 h-8 rounded-full ${
                      value?.byweekday?.includes(index) ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                    onClick={() => {
                      const current = value?.byweekday || [];
                      const updated = current.includes(index)
                        ? current.filter((d) => d !== index)
                        : [...current, index];
                      onChange({ ...value!, byweekday: updated });
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label>Termina:</label>
            <select
              onChange={(e) => {
                if (e.target.value === 'never') {
                  const { until, count, ...rest } = value!;
                  onChange(rest);
                }
              }}
            >
              <option value="never">Nunca</option>
              <option value="on">En fecha específica</option>
              <option value="after">Después de N ocurrencias</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
```

### 2. Drag & Drop con React DND

#### Configuración del DndProvider
```typescript
// src/app/App.tsx (o donde tengas el root)
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      {/* Tu aplicación */}
    </DndProvider>
  );
}
```

#### Componente de Evento Arrastrable
```typescript
// src/components/calendar/DraggableEvent.tsx
import { useDrag } from 'react-dnd';
import { CalendarEvent } from '../../types/calendar';

interface DraggableEventProps {
  event: CalendarEvent;
  children: React.ReactNode;
}

export function DraggableEvent({ event, children }: DraggableEventProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'CALENDAR_EVENT',
    item: {
      id: event.id,
      startTime: event.startTime,
      endTime: event.endTime,
      duration: event.endTime.getTime() - event.startTime.getTime(),
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
}
```

#### Celda del Calendario como Drop Target
```typescript
// src/components/calendar/DroppableCell.tsx
import { useDrop } from 'react-dnd';

interface DroppableCellProps {
  day: Date;
  hour: number;
  onEventDrop: (eventId: string, newStartTime: Date) => void;
  children: React.ReactNode;
}

export function DroppableCell({ day, hour, onEventDrop, children }: DroppableCellProps) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CALENDAR_EVENT',
    drop: (item: any) => {
      const newStartTime = new Date(day);
      newStartTime.setHours(hour, 0, 0, 0);
      onEventDrop(item.id, newStartTime);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: isOver && canDrop ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      }}
    >
      {children}
    </div>
  );
}
```

#### Integración en Calendar.tsx
```typescript
// src/pages/Calendar/Calendar.tsx
import { DraggableEvent } from '../../components/calendar/DraggableEvent';
import { DroppableCell } from '../../components/calendar/DroppableCell';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';

export function Calendar() {
  const { events, updateEvent } = useCalendarEvents();

  const handleEventDrop = async (eventId: string, newStartTime: Date) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    const duration = event.endTime.getTime() - event.startTime.getTime();
    const newEndTime = new Date(newStartTime.getTime() + duration);

    await updateEvent(eventId, {
      startTime: newStartTime,
      endTime: newEndTime,
    });
  };

  return (
    <div className="calendar-grid">
      {hours.map((hour) => (
        <div key={hour} className="hour-row">
          {days.map((day) => (
            <DroppableCell
              key={day.toISOString()}
              day={day}
              hour={hour}
              onEventDrop={handleEventDrop}
            >
              {/* Renderizar eventos en esta celda */}
              {getEventsForCell(day, hour).map((event) => (
                <DraggableEvent key={event.id} event={event}>
                  <div className="event-card">
                    {event.title}
                  </div>
                </DraggableEvent>
              ))}
            </DroppableCell>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### 3. Gestión de Estado con Zustand

```typescript
// src/stores/calendarStore.ts
import { create } from 'zustand';
import { CalendarEvent } from '../types/calendar';

interface CalendarStore {
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  selectEvent: (event: CalendarEvent | null) => void;
  
  // Async actions (se conectarán al backend)
  fetchEvents: (startDate: Date, endDate: Date) => Promise<void>;
  saveEvent: (event: CalendarEvent) => Promise<void>;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,

  setEvents: (events) => set({ events }),
  
  addEvent: (event) => set((state) => ({
    events: [...state.events, event],
  })),
  
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map((event) =>
      event.id === id ? { ...event, ...updates } : event
    ),
  })),
  
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((event) => event.id !== id),
  })),
  
  selectEvent: (event) => set({ selectedEvent: event }),

  fetchEvents: async (startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Conectar con API Go
      const response = await fetch(
        `/api/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      const events = await response.json();
      set({ events, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  saveEvent: async (event) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Conectar con API Go
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      const savedEvent = await response.json();
      get().addEvent(savedEvent);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
```

---

## Backend: Go Server

### Estructura del Proyecto Go

```
academe-server/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── api/
│   │   ├── handlers/
│   │   │   ├── events.go
│   │   │   ├── auth.go
│   │   │   └── courses.go
│   │   ├── middleware/
│   │   │   ├── auth.go
│   │   │   ├── cors.go
│   │   │   └── logger.go
│   │   └── router.go
│   ├── models/
│   │   ├── event.go
│   │   ├── user.go
│   │   └── course.go
│   ├── repository/
│   │   ├── event_repository.go
│   │   └── user_repository.go
│   ├── service/
│   │   ├── event_service.go
│   │   ├── recurrence_service.go
│   │   └── auth_service.go
│   └── config/
│       └── config.go
├── pkg/
│   └── rrule/
│       └── parser.go
├── migrations/
│   └── 001_initial_schema.sql
├── go.mod
└── go.sum
```

### Dependencias Go

```bash
# Inicializar módulo
go mod init github.com/tuusuario/academe-server

# Framework web
go get github.com/gin-gonic/gin

# ORM
go get gorm.io/gorm
go get gorm.io/driver/postgres
# O para desarrollo local:
go get gorm.io/driver/sqlite

# Eventos recurrentes
go get github.com/teambition/rrule-go

# Validación
go get github.com/go-playground/validator/v10

# JWT para autenticación
go get github.com/golang-jwt/jwt/v5

# Variables de entorno
go get github.com/joho/godotenv

# UUID
go get github.com/google/uuid

# CORS
go get github.com/gin-contrib/cors
```

### Modelos

```go
// internal/models/event.go
package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type Event struct {
    ID                    uuid.UUID  `gorm:"type:uuid;primary_key" json:"id"`
    UserID                uuid.UUID  `gorm:"type:uuid;not null;index" json:"userId"`
    CourseID              *uuid.UUID `gorm:"type:uuid;index" json:"courseId,omitempty"`
    Title                 string     `gorm:"not null" json:"title" binding:"required"`
    Description           string     `json:"description"`
    StartTime             time.Time  `gorm:"not null;index" json:"startTime" binding:"required"`
    EndTime               time.Time  `gorm:"not null" json:"endTime" binding:"required"`
    Color                 string     `gorm:"not null" json:"color"`
    Category              string     `gorm:"not null" json:"category"`
    Location              string     `json:"location"`
    IsRecurring           bool       `gorm:"default:false" json:"isRecurring"`
    RecurrenceRule        string     `json:"recurrenceRule,omitempty"` // RFC 5545 format
    RecurrenceExceptions  []time.Time `gorm:"type:jsonb" json:"recurrenceExceptions,omitempty"`
    ParentEventID         *uuid.UUID `gorm:"type:uuid;index" json:"parentEventId,omitempty"` // Para instancias modificadas
    CreatedAt             time.Time  `json:"createdAt"`
    UpdatedAt             time.Time  `json:"updatedAt"`
    DeletedAt             gorm.DeletedAt `gorm:"index" json:"-"`
    
    // Relaciones
    User                  User       `gorm:"foreignKey:UserID" json:"-"`
    Course                *Course    `gorm:"foreignKey:CourseID" json:"course,omitempty"`
}

func (e *Event) BeforeCreate(tx *gorm.DB) error {
    if e.ID == uuid.Nil {
        e.ID = uuid.New()
    }
    return nil
}

// Validar que EndTime sea después de StartTime
func (e *Event) Validate() error {
    if e.EndTime.Before(e.StartTime) {
        return fmt.Errorf("end time must be after start time")
    }
    return nil
}
```

```go
// internal/models/user.go
package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type User struct {
    ID        uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    Email     string    `gorm:"unique;not null" json:"email"`
    Password  string    `gorm:"not null" json:"-"` // No exponer en JSON
    Name      string    `gorm:"not null" json:"name"`
    CreatedAt time.Time `json:"createdAt"`
    UpdatedAt time.Time `json:"updatedAt"`
    
    // Relaciones
    Events    []Event   `gorm:"foreignKey:UserID" json:"-"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
    if u.ID == uuid.Nil {
        u.ID = uuid.New()
    }
    return nil
}
```

```go
// internal/models/course.go
package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type Course struct {
    ID          uuid.UUID `gorm:"type:uuid;primary_key" json:"id"`
    UserID      uuid.UUID `gorm:"type:uuid;not null;index" json:"userId"`
    Code        string    `gorm:"not null" json:"code"`
    Name        string    `gorm:"not null" json:"name"`
    Professor   string    `json:"professor"`
    Color       string    `gorm:"not null" json:"color"`
    CreatedAt   time.Time `json:"createdAt"`
    UpdatedAt   time.Time `json:"updatedAt"`
    
    // Relaciones
    User        User      `gorm:"foreignKey:UserID" json:"-"`
    Events      []Event   `gorm:"foreignKey:CourseID" json:"-"`
}

func (c *Course) BeforeCreate(tx *gorm.DB) error {
    if c.ID == uuid.Nil {
        c.ID = uuid.New()
    }
    return nil
}
```

### Repositorio

```go
// internal/repository/event_repository.go
package repository

import (
    "context"
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
    "academe-server/internal/models"
)

type EventRepository interface {
    Create(ctx context.Context, event *models.Event) error
    GetByID(ctx context.Context, id uuid.UUID) (*models.Event, error)
    GetByUserID(ctx context.Context, userID uuid.UUID, start, end time.Time) ([]models.Event, error)
    Update(ctx context.Context, event *models.Event) error
    Delete(ctx context.Context, id uuid.UUID) error
    AddException(ctx context.Context, eventID uuid.UUID, exceptionDate time.Time) error
}

type eventRepository struct {
    db *gorm.DB
}

func NewEventRepository(db *gorm.DB) EventRepository {
    return &eventRepository{db: db}
}

func (r *eventRepository) Create(ctx context.Context, event *models.Event) error {
    return r.db.WithContext(ctx).Create(event).Error
}

func (r *eventRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Event, error) {
    var event models.Event
    err := r.db.WithContext(ctx).
        Preload("Course").
        First(&event, "id = ?", id).Error
    if err != nil {
        return nil, err
    }
    return &event, nil
}

func (r *eventRepository) GetByUserID(ctx context.Context, userID uuid.UUID, start, end time.Time) ([]models.Event, error) {
    var events []models.Event
    err := r.db.WithContext(ctx).
        Preload("Course").
        Where("user_id = ?", userID).
        Where("(start_time BETWEEN ? AND ?) OR (is_recurring = true)", start, end).
        Find(&events).Error
    return events, err
}

func (r *eventRepository) Update(ctx context.Context, event *models.Event) error {
    return r.db.WithContext(ctx).Save(event).Error
}

func (r *eventRepository) Delete(ctx context.Context, id uuid.UUID) error {
    return r.db.WithContext(ctx).Delete(&models.Event{}, "id = ?", id).Error
}

func (r *eventRepository) AddException(ctx context.Context, eventID uuid.UUID, exceptionDate time.Time) error {
    return r.db.WithContext(ctx).
        Model(&models.Event{}).
        Where("id = ?", eventID).
        Update("recurrence_exceptions", gorm.Expr("array_append(recurrence_exceptions, ?)", exceptionDate)).
        Error
}
```

### Servicio de Recurrencia

```go
// internal/service/recurrence_service.go
package service

import (
    "time"
    "github.com/teambition/rrule-go"
    "academe-server/internal/models"
)

type RecurrenceService interface {
    ExpandRecurringEvent(event *models.Event, start, end time.Time) ([]models.Event, error)
    ValidateRRule(rule string) error
}

type recurrenceService struct{}

func NewRecurrenceService() RecurrenceService {
    return &recurrenceService{}
}

func (s *recurrenceService) ExpandRecurringEvent(event *models.Event, start, end time.Time) ([]models.Event, error) {
    if !event.IsRecurring || event.RecurrenceRule == "" {
        return []models.Event{*event}, nil
    }

    // Parsear la regla de recurrencia
    rule, err := rrule.StrToRRule(event.RecurrenceRule)
    if err != nil {
        return nil, err
    }

    // Obtener todas las ocurrencias en el rango
    occurrences := rule.Between(start, end, true)

    // Crear eventos para cada ocurrencia
    expandedEvents := make([]models.Event, 0, len(occurrences))
    duration := event.EndTime.Sub(event.StartTime)

    for _, occurrence := range occurrences {
        // Verificar si esta ocurrencia está en las excepciones
        isException := false
        for _, exception := range event.RecurrenceExceptions {
            if occurrence.Equal(exception) {
                isException = true
                break
            }
        }

        if !isException {
            expandedEvent := *event
            expandedEvent.StartTime = occurrence
            expandedEvent.EndTime = occurrence.Add(duration)
            expandedEvents = append(expandedEvents, expandedEvent)
        }
    }

    return expandedEvents, nil
}

func (s *recurrenceService) ValidateRRule(rule string) error {
    _, err := rrule.StrToRRule(rule)
    return err
}
```

### Servicio de Eventos

```go
// internal/service/event_service.go
package service

import (
    "context"
    "fmt"
    "time"
    "github.com/google/uuid"
    "academe-server/internal/models"
    "academe-server/internal/repository"
)

type EventService interface {
    CreateEvent(ctx context.Context, event *models.Event) error
    GetEvent(ctx context.Context, id uuid.UUID) (*models.Event, error)
    GetUserEvents(ctx context.Context, userID uuid.UUID, start, end time.Time) ([]models.Event, error)
    UpdateEvent(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error
    DeleteEvent(ctx context.Context, id uuid.UUID) error
    MoveEvent(ctx context.Context, id uuid.UUID, newStartTime time.Time) error
    DeleteRecurringInstance(ctx context.Context, eventID uuid.UUID, instanceDate time.Time) error
}

type eventService struct {
    repo              repository.EventRepository
    recurrenceService RecurrenceService
}

func NewEventService(repo repository.EventRepository, recurrenceService RecurrenceService) EventService {
    return &eventService{
        repo:              repo,
        recurrenceService: recurrenceService,
    }
}

func (s *eventService) CreateEvent(ctx context.Context, event *models.Event) error {
    // Validar el evento
    if err := event.Validate(); err != nil {
        return err
    }

    // Si es recurrente, validar la regla
    if event.IsRecurring && event.RecurrenceRule != "" {
        if err := s.recurrenceService.ValidateRRule(event.RecurrenceRule); err != nil {
            return fmt.Errorf("invalid recurrence rule: %w", err)
        }
    }

    return s.repo.Create(ctx, event)
}

func (s *eventService) GetEvent(ctx context.Context, id uuid.UUID) (*models.Event, error) {
    return s.repo.GetByID(ctx, id)
}

func (s *eventService) GetUserEvents(ctx context.Context, userID uuid.UUID, start, end time.Time) ([]models.Event, error) {
    // Obtener eventos de la base de datos
    events, err := s.repo.GetByUserID(ctx, userID, start, end)
    if err != nil {
        return nil, err
    }

    // Expandir eventos recurrentes
    expandedEvents := make([]models.Event, 0)
    for _, event := range events {
        if event.IsRecurring {
            occurrences, err := s.recurrenceService.ExpandRecurringEvent(&event, start, end)
            if err != nil {
                return nil, err
            }
            expandedEvents = append(expandedEvents, occurrences...)
        } else {
            expandedEvents = append(expandedEvents, event)
        }
    }

    return expandedEvents, nil
}

func (s *eventService) UpdateEvent(ctx context.Context, id uuid.UUID, updates map[string]interface{}) error {
    event, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return err
    }

    // Aplicar actualizaciones
    // (Aquí deberías implementar la lógica para actualizar campos específicos)

    return s.repo.Update(ctx, event)
}

func (s *eventService) DeleteEvent(ctx context.Context, id uuid.UUID) error {
    return s.repo.Delete(ctx, id)
}

func (s *eventService) MoveEvent(ctx context.Context, id uuid.UUID, newStartTime time.Time) error {
    event, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return err
    }

    duration := event.EndTime.Sub(event.StartTime)
    event.StartTime = newStartTime
    event.EndTime = newStartTime.Add(duration)

    return s.repo.Update(ctx, event)
}

func (s *eventService) DeleteRecurringInstance(ctx context.Context, eventID uuid.UUID, instanceDate time.Time) error {
    return s.repo.AddException(ctx, eventID, instanceDate)
}
```

### Handlers (API)

```go
// internal/api/handlers/events.go
package handlers

import (
    "net/http"
    "time"
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
    "academe-server/internal/models"
    "academe-server/internal/service"
)

type EventHandler struct {
    eventService service.EventService
}

func NewEventHandler(eventService service.EventService) *EventHandler {
    return &EventHandler{
        eventService: eventService,
    }
}

// CreateEvent godoc
// @Summary Create a new event
// @Tags events
// @Accept json
// @Produce json
// @Param event body models.Event true "Event object"
// @Success 201 {object} models.Event
// @Failure 400 {object} ErrorResponse
// @Router /api/events [post]
func (h *EventHandler) CreateEvent(c *gin.Context) {
    var event models.Event
    if err := c.ShouldBindJSON(&event); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Obtener userID del contexto (del middleware de autenticación)
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
        return
    }
    event.UserID = userID.(uuid.UUID)

    if err := h.eventService.CreateEvent(c.Request.Context(), &event); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, event)
}

// GetEvents godoc
// @Summary Get user events
// @Tags events
// @Produce json
// @Param start query string true "Start date (RFC3339)"
// @Param end query string true "End date (RFC3339)"
// @Success 200 {array} models.Event
// @Failure 400 {object} ErrorResponse
// @Router /api/events [get]
func (h *EventHandler) GetEvents(c *gin.Context) {
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
        return
    }

    startStr := c.Query("start")
    endStr := c.Query("end")

    start, err := time.Parse(time.RFC3339, startStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start date"})
        return
    }

    end, err := time.Parse(time.RFC3339, endStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end date"})
        return
    }

    events, err := h.eventService.GetUserEvents(c.Request.Context(), userID.(uuid.UUID), start, end)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, events)
}

// GetEvent godoc
// @Summary Get event by ID
// @Tags events
// @Produce json
// @Param id path string true "Event ID"
// @Success 200 {object} models.Event
// @Failure 404 {object} ErrorResponse
// @Router /api/events/{id} [get]
func (h *EventHandler) GetEvent(c *gin.Context) {
    idStr := c.Param("id")
    id, err := uuid.Parse(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event ID"})
        return
    }

    event, err := h.eventService.GetEvent(c.Request.Context(), id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "event not found"})
        return
    }

    c.JSON(http.StatusOK, event)
}

// UpdateEvent godoc
// @Summary Update an event
// @Tags events
// @Accept json
// @Produce json
// @Param id path string true "Event ID"
// @Param updates body map[string]interface{} true "Updates"
// @Success 200 {object} models.Event
// @Failure 400 {object} ErrorResponse
// @Router /api/events/{id} [put]
func (h *EventHandler) UpdateEvent(c *gin.Context) {
    idStr := c.Param("id")
    id, err := uuid.Parse(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event ID"})
        return
    }

    var updates map[string]interface{}
    if err := c.ShouldBindJSON(&updates); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := h.eventService.UpdateEvent(c.Request.Context(), id, updates); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    event, _ := h.eventService.GetEvent(c.Request.Context(), id)
    c.JSON(http.StatusOK, event)
}

// DeleteEvent godoc
// @Summary Delete an event
// @Tags events
// @Param id path string true "Event ID"
// @Success 204
// @Failure 404 {object} ErrorResponse
// @Router /api/events/{id} [delete]
func (h *EventHandler) DeleteEvent(c *gin.Context) {
    idStr := c.Param("id")
    id, err := uuid.Parse(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event ID"})
        return
    }

    if err := h.eventService.DeleteEvent(c.Request.Context(), id); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.Status(http.StatusNoContent)
}

// MoveEvent godoc
// @Summary Move an event (drag & drop)
// @Tags events
// @Accept json
// @Produce json
// @Param id path string true "Event ID"
// @Param body body MoveEventRequest true "New start time"
// @Success 200 {object} models.Event
// @Router /api/events/{id}/move [post]
func (h *EventHandler) MoveEvent(c *gin.Context) {
    idStr := c.Param("id")
    id, err := uuid.Parse(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event ID"})
        return
    }

    var req struct {
        NewStartTime time.Time `json:"newStartTime" binding:"required"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := h.eventService.MoveEvent(c.Request.Context(), id, req.NewStartTime); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    event, _ := h.eventService.GetEvent(c.Request.Context(), id)
    c.JSON(http.StatusOK, event)
}

// DeleteRecurringInstance godoc
// @Summary Delete a single instance of a recurring event
// @Tags events
// @Param id path string true "Event ID"
// @Param date query string true "Instance date (RFC3339)"
// @Success 204
// @Router /api/events/{id}/instances [delete]
func (h *EventHandler) DeleteRecurringInstance(c *gin.Context) {
    idStr := c.Param("id")
    id, err := uuid.Parse(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid event ID"})
        return
    }

    dateStr := c.Query("date")
    date, err := time.Parse(time.RFC3339, dateStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date"})
        return
    }

    if err := h.eventService.DeleteRecurringInstance(c.Request.Context(), id, date); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.Status(http.StatusNoContent)
}
```

### Middleware de Autenticación

```go
// internal/api/middleware/auth.go
package middleware

import (
    "net/http"
    "strings"
    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
    "github.com/google/uuid"
)

var jwtSecret = []byte("tu-secreto-super-seguro") // Usar variable de entorno en producción

type Claims struct {
    UserID uuid.UUID `json:"userId"`
    Email  string    `json:"email"`
    jwt.RegisteredClaims
}

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header required"})
            c.Abort()
            return
        }

        // Formato: "Bearer <token>"
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header"})
            c.Abort()
            return
        }

        tokenString := parts[1]
        claims := &Claims{}

        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            return jwtSecret, nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
            c.Abort()
            return
        }

        // Guardar userID en el contexto
        c.Set("userID", claims.UserID)
        c.Next()
    }
}
```

### Router

```go
// internal/api/router.go
package api

import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "academe-server/internal/api/handlers"
    "academe-server/internal/api/middleware"
)

func SetupRouter(eventHandler *handlers.EventHandler) *gin.Engine {
    r := gin.Default()

    // CORS
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"}, // URL de tu frontend Vite
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))

    // Health check
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })

    // API routes
    api := r.Group("/api")
    {
        // Rutas públicas (login, registro)
        // auth := api.Group("/auth")
        // {
        //     auth.POST("/login", authHandler.Login)
        //     auth.POST("/register", authHandler.Register)
        // }

        // Rutas protegidas
        protected := api.Group("")
        protected.Use(middleware.AuthMiddleware())
        {
            // Events
            events := protected.Group("/events")
            {
                events.POST("", eventHandler.CreateEvent)
                events.GET("", eventHandler.GetEvents)
                events.GET("/:id", eventHandler.GetEvent)
                events.PUT("/:id", eventHandler.UpdateEvent)
                events.DELETE("/:id", eventHandler.DeleteEvent)
                events.POST("/:id/move", eventHandler.MoveEvent)
                events.DELETE("/:id/instances", eventHandler.DeleteRecurringInstance)
            }
        }
    }

    return r
}
```

### Main

```go
// cmd/server/main.go
package main

import (
    "log"
    "os"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    "academe-server/internal/api"
    "academe-server/internal/api/handlers"
    "academe-server/internal/models"
    "academe-server/internal/repository"
    "academe-server/internal/service"
)

func main() {
    // Conectar a la base de datos
    db, err := gorm.Open(sqlite.Open("academe.db"), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    // Migrar esquemas
    if err := db.AutoMigrate(&models.User{}, &models.Course{}, &models.Event{}); err != nil {
        log.Fatal("Failed to migrate database:", err)
    }

    // Inicializar repositorios
    eventRepo := repository.NewEventRepository(db)

    // Inicializar servicios
    recurrenceService := service.NewRecurrenceService()
    eventService := service.NewEventService(eventRepo, recurrenceService)

    // Inicializar handlers
    eventHandler := handlers.NewEventHandler(eventService)

    // Configurar router
    router := api.SetupRouter(eventHandler)

    // Obtener puerto del entorno o usar 8080 por defecto
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("Server starting on port %s...", port)
    if err := router.Run(":" + port); err != nil {
        log.Fatal("Failed to start server:", err)
    }
}
```

---

## Base de Datos

### Schema SQL (PostgreSQL)

```sql
-- migrations/001_initial_schema.sql

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de cursos
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    professor VARCHAR(255),
    color VARCHAR(7) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de eventos
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    color VARCHAR(7) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    recurrence_exceptions JSONB DEFAULT '[]',
    parent_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_course_id ON events(course_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_parent_event_id ON events(parent_event_id);
CREATE INDEX idx_courses_user_id ON courses(user_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Plan de Implementación por Fases

### **Fase 1: Frontend - Eventos Recurrentes (1-2 semanas)**

**Objetivos:**
- ✅ Instalar y configurar `rrule`
- ✅ Crear tipos TypeScript para eventos recurrentes
- ✅ Implementar hook `useRecurringEvents`
- ✅ Crear componente `RecurrenceForm`
- ✅ Integrar en el calendario existente
- ✅ Almacenar temporalmente en localStorage

**Tareas:**
1. `npm install rrule`
2. Crear `src/types/calendar.ts`
3. Crear `src/hooks/useRecurringEvents.ts`
4. Crear `src/components/calendar/RecurrenceForm.tsx`
5. Actualizar `src/pages/Calendar/Calendar.tsx`
6. Crear modal para crear/editar eventos
7. Probar con diferentes patrones de recurrencia

### **Fase 2: Frontend - Drag & Drop (1 semana)**

**Objetivos:**
- ✅ Configurar react-dnd (ya instalado)
- ✅ Hacer eventos arrastrables
- ✅ Hacer celdas receptoras
- ✅ Implementar lógica de movimiento
- ✅ Añadir feedback visual

**Tareas:**
1. Configurar `DndProvider` en `App.tsx`
2. Crear `src/components/calendar/DraggableEvent.tsx`
3. Crear `src/components/calendar/DroppableCell.tsx`
4. Integrar en `Calendar.tsx`
5. Implementar validaciones (no permitir solapamientos)
6. Añadir animaciones y feedback visual
7. Probar en diferentes vistas

### **Fase 3: Frontend - Gestión de Estado (3-5 días)**

**Objetivos:**
- ✅ Instalar Zustand
- ✅ Crear store de calendario
- ✅ Migrar lógica de Context a Zustand
- ✅ Preparar para integración con API

**Tareas:**
1. `npm install zustand`
2. Crear `src/stores/calendarStore.ts`
3. Implementar acciones CRUD
4. Migrar componentes a usar el store
5. Añadir manejo de errores y loading states

### **Fase 4: Backend - Setup Inicial (1 semana)**

**Objetivos:**
- 🔧 Configurar proyecto Go
- 🔧 Instalar dependencias
- 🔧 Configurar base de datos
- 🔧 Crear modelos

**Tareas:**
1. Inicializar módulo Go
2. Instalar dependencias (Gin, GORM, etc.)
3. Configurar SQLite/PostgreSQL
4. Crear modelos (User, Course, Event)
5. Ejecutar migraciones
6. Crear seeds de prueba

### **Fase 5: Backend - API REST (2 semanas)**

**Objetivos:**
- 🔧 Implementar repositorios
- 🔧 Implementar servicios
- 🔧 Crear handlers
- 🔧 Configurar router
- 🔧 Implementar autenticación

**Tareas:**
1. Crear `EventRepository`
2. Crear `RecurrenceService`
3. Crear `EventService`
4. Crear `EventHandler`
5. Implementar middleware de autenticación
6. Configurar CORS
7. Probar endpoints con Postman/Thunder Client

### **Fase 6: Integración Frontend-Backend (1 semana)**

**Objetivos:**
- 🔄 Conectar frontend con API
- 🔄 Implementar autenticación en frontend
- 🔄 Sincronizar eventos
- 🔄 Manejo de errores

**Tareas:**
1. Crear cliente API en frontend (`src/api/client.ts`)
2. Implementar login/registro
3. Actualizar store para usar API
4. Implementar sincronización de eventos
5. Añadir manejo de errores y retry logic
6. Implementar optimistic updates

### **Fase 7: Funcionalidades Avanzadas (2-3 semanas)**

**Objetivos:**
- 🚀 Vistas Monthly y Timeline
- 🚀 Notificaciones
- 🚀 Exportar/Importar (iCalendar)
- 🚀 Compartir eventos
- 🚀 WebSockets para tiempo real

**Tareas:**
1. Implementar vista Monthly
2. Implementar vista Timeline
3. Sistema de notificaciones
4. Exportar a .ics
5. Importar desde .ics
6. Compartir eventos con otros usuarios
7. WebSockets para actualizaciones en tiempo real

### **Fase 8: Testing y Optimización (1-2 semanas)**

**Objetivos:**
- ✅ Tests unitarios
- ✅ Tests de integración
- ✅ Optimización de rendimiento
- ✅ Documentación

**Tareas:**
1. Tests unitarios en Go
2. Tests de componentes en React
3. Tests E2E con Playwright
4. Optimizar queries de base de datos
5. Implementar caché
6. Documentar API (Swagger)
7. Documentar código

---

## Ejemplos de Código

### Ejemplo: Crear Evento Recurrente desde Frontend

```typescript
// src/pages/Calendar/CreateEventModal.tsx
import { useState } from 'react';
import { useCalendarStore } from '../../stores/calendarStore';
import { RecurrenceForm } from '../../components/calendar/RecurrenceForm';
import { RRule } from 'rrule';

export function CreateEventModal({ isOpen, onClose }) {
  const { saveEvent } = useCalendarStore();
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [recurrenceRule, setRecurrenceRule] = useState(null);

  const handleSubmit = async () => {
    const event = {
      id: crypto.randomUUID(),
      title,
      startTime,
      endTime,
      color: '#3b82f6',
      category: 'class',
      isRecurring: !!recurrenceRule,
      recurrenceRule: recurrenceRule ? convertToRRuleString(recurrenceRule) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await saveEvent(event);
    onClose();
  };

  const convertToRRuleString = (rule) => {
    const rrule = new RRule({
      freq: RRule[rule.freq],
      interval: rule.interval,
      byweekday: rule.byweekday,
      dtstart: startTime,
      until: rule.until,
      count: rule.count,
    });
    return rrule.toString();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <h2>Crear Evento</h2>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="datetime-local"
        value={startTime.toISOString().slice(0, 16)}
        onChange={(e) => setStartTime(new Date(e.target.value))}
      />
      <input
        type="datetime-local"
        value={endTime.toISOString().slice(0, 16)}
        onChange={(e) => setEndTime(new Date(e.target.value))}
      />
      <RecurrenceForm value={recurrenceRule} onChange={setRecurrenceRule} />
      <button onClick={handleSubmit}>Crear</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}
```

### Ejemplo: Endpoint Go para Crear Evento

```bash
# Crear evento simple
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Clase de Cálculo",
    "startTime": "2026-03-30T10:00:00Z",
    "endTime": "2026-03-30T11:30:00Z",
    "color": "#dc2626",
    "category": "class",
    "isRecurring": false
  }'

# Crear evento recurrente (todos los lunes a las 10am)
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Clase de Cálculo",
    "startTime": "2026-03-30T10:00:00Z",
    "endTime": "2026-03-30T11:30:00Z",
    "color": "#dc2626",
    "category": "class",
    "isRecurring": true,
    "recurrenceRule": "FREQ=WEEKLY;BYDAY=MO;UNTIL=20261231T235959Z"
  }'
```

### Ejemplo: Mover Evento (Drag & Drop)

```typescript
// Frontend
const handleEventDrop = async (eventId: string, newStartTime: Date) => {
  try {
    const response = await fetch(`/api/events/${eventId}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ newStartTime }),
    });
    
    if (response.ok) {
      const updatedEvent = await response.json();
      updateEvent(eventId, updatedEvent);
    }
  } catch (error) {
    console.error('Error moving event:', error);
  }
};
```

---

## Recursos Adicionales

### Documentación

- **RRule**: https://github.com/jakubroztocil/rrule
- **React DND**: https://react-dnd.github.io/react-dnd/
- **Zustand**: https://github.com/pmndrs/zustand
- **Gin**: https://gin-gonic.com/docs/
- **GORM**: https://gorm.io/docs/
- **RRule Go**: https://github.com/teambition/rrule-go

### Herramientas de Desarrollo

- **Thunder Client** (VS Code): Para probar API
- **Postman**: Alternativa para probar API
- **TablePlus**: Cliente de base de datos
- **Air**: Hot reload para Go (`go install github.com/cosmtrek/air@latest`)

### Comandos Útiles

```bash
# Frontend
npm run dev                    # Iniciar servidor de desarrollo
npm run build                  # Build para producción

# Backend
go run cmd/server/main.go      # Ejecutar servidor
air                            # Ejecutar con hot reload
go test ./...                  # Ejecutar tests
go mod tidy                    # Limpiar dependencias

# Base de datos
psql -U postgres -d academe    # Conectar a PostgreSQL
sqlite3 academe.db             # Conectar a SQLite
```

---

## Consideraciones de Seguridad

1. **Autenticación**: Usar JWT con expiración corta
2. **Validación**: Validar todos los inputs en backend
3. **CORS**: Configurar correctamente para producción
4. **SQL Injection**: GORM previene esto automáticamente
5. **Rate Limiting**: Implementar para prevenir abuso
6. **HTTPS**: Usar en producción
7. **Variables de entorno**: No hardcodear secretos

---

## Próximos Pasos

1. **Decidir qué fase implementar primero**
2. **Configurar entorno de desarrollo**
3. **Crear repositorio Git separado para el backend**
4. **Comenzar con Fase 1 (Eventos Recurrentes)**

---

## Contacto y Soporte

Para preguntas o problemas durante la implementación, consultar:
- Documentación oficial de cada librería
- Stack Overflow
- GitHub Issues de las librerías

---

**Última actualización**: 29 de marzo de 2026
**Versión**: 1.0
**Autor**: Equipo Academe
