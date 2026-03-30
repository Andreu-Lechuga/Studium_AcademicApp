package shared

import "os"

// Config contiene toda la configuración de la aplicación
// Se carga desde variables de entorno al iniciar el servidor
type Config struct {
	Environment string // "development" o "production"
	Port        string // Puerto donde escucha el servidor (ej: "8080")
	DatabaseURL string // URL de conexión a PostgreSQL
	RedisURL    string // URL de conexión a Redis
	JWTSecret   string // Secreto para firmar tokens JWT
}

// LoadConfig carga la configuración desde variables de entorno
// Si una variable no existe, usa un valor por defecto
func LoadConfig() *Config {
	return &Config{
		Environment: getEnv("ENVIRONMENT", "development"),
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", ""),
		RedisURL:    getEnv("REDIS_URL", "localhost:6379"),
		JWTSecret:   getEnv("JWT_SECRET", ""),
	}
}

// getEnv obtiene una variable de entorno o retorna un valor por defecto
// Parámetros:
//   - key: nombre de la variable de entorno
//   - defaultValue: valor a retornar si la variable no existe
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
