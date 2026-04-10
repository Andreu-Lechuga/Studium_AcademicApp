-- ============================================================================
-- MIGRACIÓN 002: Schema Auth
-- ============================================================================
-- Crea las tablas necesarias para autenticación y gestión de usuarios

-- Tabla de usuarios
-- Almacena la información básica de cada usuario del sistema
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- ID único generado automáticamente
    email VARCHAR(255) UNIQUE NOT NULL,              -- Email único para login
    password_hash VARCHAR(255) NOT NULL,             -- Contraseña hasheada con bcrypt
    name VARCHAR(255) NOT NULL,                      -- Nombre completo del usuario
    role VARCHAR(50) DEFAULT 'user',                 -- Rol: 'user' o 'admin'
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),     -- Fecha de creación
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()      -- Fecha de última actualización
);

-- Tabla de sesiones
-- Almacena los refresh tokens para mantener sesiones activas
CREATE TABLE auth.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  -- Usuario dueño de la sesión
    refresh_token VARCHAR(500) NOT NULL,                                 -- Token para renovar access token
    expires_at TIMESTAMP NOT NULL,                                       -- Fecha de expiración del token
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_sessions_user_id ON auth.sessions(user_id);        -- Buscar sesiones por usuario
CREATE INDEX idx_sessions_expires_at ON auth.sessions(expires_at);  -- Limpiar sesiones expiradas
