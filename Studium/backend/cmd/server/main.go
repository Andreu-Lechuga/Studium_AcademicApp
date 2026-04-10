package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
    "github.com/Andreu-Lechuga/Studium_AcademicApp/internal/shared"
    "github.com/gin-gonic/gin"
)

func main() {
	// Carga backend/.env si existe
	_ = godotenv.Load() 

	// 1. Cargar configuración desde variables de entorno
	config := shared.LoadConfig()

	// 2. Inicializar logger
	logger := shared.NewLogger()
	logger.Info("🚀 Iniciando Studium API Server...")

	// 3. Conectar a PostgreSQL
	db, err := shared.NewDatabase(config.DatabaseURL)
	if err != nil {
		logger.Fatal("❌ Error al conectar a PostgreSQL: %v", err)
	}
	defer db.Close()
	logger.Info("✅ Conectado a PostgreSQL")

	// 4. Conectar a Redis
	redisClient := shared.NewRedisClient(config.RedisURL)
	defer redisClient.Close()
	
	// Verificar conexión a Redis
	if err := redisClient.Ping(context.Background()); err != nil {
		logger.Warn("⚠️  No se pudo conectar a Redis: %v", err)
	} else {
		logger.Info("✅ Conectado a Redis")
	}

	// 5. Configurar Gin (framework HTTP)
	if config.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.New() // Usar New() en lugar de Default() para control total

	// 6. Middleware global
	router.Use(shared.CORSMiddleware())
	router.Use(shared.LoggerMiddleware(logger))
	router.Use(shared.RecoveryMiddleware(logger))

	// 7. Health check endpoint
	// Este endpoint sirve para verificar que el servidor está funcionando
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "studium-api",
			"version": "1.0.0",
		})
	})

	// 8. Grupo de rutas API
	api := router.Group("/api")
	{
		// Ruta de bienvenida
		api.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Bienvenido a Studium API",
				"version": "1.0.0",
				"endpoints": gin.H{
					"health": "/health",
					"auth":   "/api/auth (próximamente)",
					"calendar": "/api/calendar (próximamente)",
				},
			})
		})

		// TODO: Montar routers de módulos
		// authRouter := auth.NewRouter(db, redisClient, config)
		// api.Group("/auth").Use(authRouter.Routes())
		
		// calendarRouter := calendar.NewRouter(db, config)
		// api.Group("/calendar").Use(calendarRouter.Routes())
	}

	// 9. Iniciar servidor con graceful shutdown
	srv := &http.Server{
		Addr:    ":" + config.Port,
		Handler: router,
	}

	// Canal para escuchar señales del sistema operativo
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Iniciar servidor en una goroutine (hilo concurrente)
	go func() {
		logger.Info("🌐 Servidor escuchando en puerto %s", config.Port)
		logger.Info("📍 URL: http://localhost:%s", config.Port)
		
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("❌ Error al iniciar servidor: %v", err)
		}
	}()

	// Esperar señal de terminación (Ctrl+C)
	<-quit
	logger.Info("⏳ Apagando servidor...")

	// Dar 5 segundos para terminar requests en curso
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("❌ Error al apagar servidor: %v", err)
	}

	logger.Info("✅ Servidor apagado correctamente")
}
