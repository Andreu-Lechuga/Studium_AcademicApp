-- ============================================================================
-- MIGRACIÓN 003: Schema Calendar
-- ============================================================================
-- Crea las tablas necesarias para el sistema de calendario

-- Tabla de eventos
-- Almacena todos los eventos del calendario (clases, evaluaciones, deadlines, etc)
CREATE TABLE calendar.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  -- Dueño del evento
    title VARCHAR(255) NOT NULL,                                         -- Título del evento
    description TEXT,                                                    -- Descripción detallada (opcional)
    start_time TIMESTAMP NOT NULL,                                       -- Fecha y hora de inicio
    end_time TIMESTAMP NOT NULL,                                         -- Fecha y hora de fin
    all_day BOOLEAN DEFAULT FALSE,                                       -- Si es evento de día completo
    color VARCHAR(7),                                                    -- Color en formato hex (#dc2626)
    location VARCHAR(255),                                               -- Ubicación del evento (opcional)
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de vinculación polimórfica
-- Permite vincular eventos con cualquier otra entidad del sistema (cursos, tareas, proyectos, etc)
-- Ejemplo: Un evento "Prueba 1" puede estar vinculado a un curso específico
CREATE TABLE calendar.entity_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES calendar.events(id) ON DELETE CASCADE,  -- Evento vinculado
    entity_kind VARCHAR(50) NOT NULL,                                          -- Tipo de entidad: 'course', 'task', 'milestone', etc
    entity_id UUID NOT NULL,                                                   -- ID de la entidad vinculada
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_events_user_id ON calendar.events(user_id);                      -- Buscar eventos por usuario
CREATE INDEX idx_events_start_time ON calendar.events(start_time);                -- Buscar eventos por fecha
CREATE INDEX idx_entity_links_event_id ON calendar.entity_links(event_id);        -- Buscar vínculos por evento
CREATE INDEX idx_entity_links_entity ON calendar.entity_links(entity_kind, entity_id);  -- Buscar eventos vinculados a una entidad
