package shared

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Database es un wrapper alrededor del pool de conexiones de PostgreSQL
type Database struct {
	Pool *pgxpool.Pool
}

// NewDatabase crea una nueva conexión a PostgreSQL
// Usa pgxpool que maneja automáticamente un pool de conexiones
// Esto es más eficiente que crear una conexión nueva para cada request
func NewDatabase(databaseURL string) (*Database, error) {
	// Validar que la URL no esté vacía
	if databaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL no puede estar vacía")
	}

	// Crear configuración del pool
	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("error al parsear DATABASE_URL: %w", err)
	}

	// Configurar el tamaño del pool
	// MaxConns: número máximo de conexiones simultáneas
	// MinConns: número mínimo de conexiones que se mantienen abiertas
	config.MaxConns = 10
	config.MinConns = 2

	// Crear el pool de conexiones
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("error al crear pool de conexiones: %w", err)
	}

	// Verificar que la conexión funciona
	if err := pool.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("error al hacer ping a la base de datos: %w", err)
	}

	return &Database{Pool: pool}, nil
}

// Close cierra todas las conexiones del pool
func (db *Database) Close() {
	if db.Pool != nil {
		db.Pool.Close()
	}
}

// Ping verifica que la conexión a la base de datos esté activa
func (db *Database) Ping(ctx context.Context) error {
	return db.Pool.Ping(ctx)
}

// GetPool retorna el pool de conexiones
// Útil para pasarlo a los repositorios
func (db *Database) GetPool() *pgxpool.Pool {
	return db.Pool
}
