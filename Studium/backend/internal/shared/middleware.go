package shared

import (
	"time"

	"github.com/gin-gonic/gin"
)

// CORSMiddleware configura los headers CORS para permitir requests desde el frontend
// CORS (Cross-Origin Resource Sharing) permite que el frontend en un puerto
// diferente pueda hacer requests al backend
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Permitir requests desde cualquier origen en desarrollo
		// En producción, cambiar "*" por la URL específica del frontend
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		
		// Métodos HTTP permitidos
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		
		// Headers permitidos en las requests
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		// Headers que el frontend puede leer en las responses
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
		
		// Permitir envío de cookies/credenciales
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		// Si es una request OPTIONS (preflight), responder inmediatamente
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		// Continuar con el siguiente handler
		c.Next()
	}
}

// LoggerMiddleware registra información de cada request HTTP
func LoggerMiddleware(logger *Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Guardar el tiempo de inicio
		startTime := time.Now()

		// Procesar la request
		c.Next()

		// Calcular duración
		duration := time.Since(startTime)

		// Registrar información de la request
		logger.LogRequest(
			c.Request.Method,
			c.Request.URL.Path,
			c.Writer.Status(),
			duration.String(),
		)
	}
}

// RecoveryMiddleware captura panics y los convierte en errores HTTP 500
// Esto evita que el servidor se caiga si hay un error inesperado
func RecoveryMiddleware(logger *Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				// Registrar el panic
				logger.Error("Panic recuperado: %v", err)
				
				// Responder con error 500
				c.JSON(500, gin.H{
					"error": "Error interno del servidor",
				})
				
				// Abortar el procesamiento
				c.Abort()
			}
		}()
		
		// Continuar con el siguiente handler
		c.Next()
	}
}
