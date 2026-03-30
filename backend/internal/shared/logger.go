package shared

import (
	"fmt"
	"log"
	"os"
)

// Logger es una estructura simple para logging
// En producción se podría usar una librería más completa como zap o logrus
type Logger struct {
	infoLogger  *log.Logger
	errorLogger *log.Logger
}

// NewLogger crea una nueva instancia del logger
func NewLogger() *Logger {
	return &Logger{
		// Logger para mensajes informativos (stdout)
		infoLogger: log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile),
		// Logger para mensajes de error (stderr)
		errorLogger: log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile),
	}
}

// Info registra un mensaje informativo
func (l *Logger) Info(format string, v ...interface{}) {
	l.infoLogger.Printf(format, v...)
}

// Error registra un mensaje de error
func (l *Logger) Error(format string, v ...interface{}) {
	l.errorLogger.Printf(format, v...)
}

// Fatal registra un error crítico y termina el programa
func (l *Logger) Fatal(format string, v ...interface{}) {
	l.errorLogger.Fatalf(format, v...)
}

// Debug registra un mensaje de debug (solo en development)
func (l *Logger) Debug(format string, v ...interface{}) {
	if os.Getenv("ENVIRONMENT") == "development" {
		l.infoLogger.Printf("DEBUG: "+format, v...)
	}
}

// Warn registra una advertencia
func (l *Logger) Warn(format string, v ...interface{}) {
	l.infoLogger.Printf("WARN: "+format, v...)
}

// LogRequest registra información de una request HTTP
func (l *Logger) LogRequest(method, path string, statusCode int, duration string) {
	l.Info("%s %s - %d - %s", method, path, statusCode, duration)
}

// LogError registra un error con contexto adicional
func (l *Logger) LogError(err error, context string) {
	l.Error("%s: %v", context, err)
}

// Printf implementa la interfaz para compatibilidad con otras librerías
func (l *Logger) Printf(format string, v ...interface{}) {
	l.Info(format, v...)
}

// Println implementa la interfaz para compatibilidad con otras librerías
func (l *Logger) Println(v ...interface{}) {
	l.Info(fmt.Sprint(v...))
}
