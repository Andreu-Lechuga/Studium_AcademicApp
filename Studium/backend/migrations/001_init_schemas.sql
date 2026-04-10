-- ============================================================================
-- MIGRACIÓN 001: Inicializar Schemas
-- ============================================================================
-- Crea los schemas separados para cada módulo del sistema
-- Esto permite organizar las tablas de forma lógica y mantener separación de responsabilidades

-- Schema para autenticación y usuarios
CREATE SCHEMA IF NOT EXISTS auth;

-- Schema para calendario y eventos
CREATE SCHEMA IF NOT EXISTS calendar;

-- Schema para tareas (se implementará después)
CREATE SCHEMA IF NOT EXISTS tasks;

-- Schema para proyectos (se implementará después)
CREATE SCHEMA IF NOT EXISTS projects;

-- Schema para knowledge base (se implementará después)
CREATE SCHEMA IF NOT EXISTS knowledge;

-- Schema para cursos académicos (se implementará después)
CREATE SCHEMA IF NOT EXISTS courses;
