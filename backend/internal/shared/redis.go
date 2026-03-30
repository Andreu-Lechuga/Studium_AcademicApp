package shared

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

// RedisClient es un wrapper alrededor del cliente de Redis
type RedisClient struct {
	Client *redis.Client
}

// NewRedisClient crea una nueva conexión a Redis
// Redis se usa para cache y rate limiting
func NewRedisClient(redisURL string) *RedisClient {
	// Parsear la URL de Redis
	// Formato esperado: "localhost:6379" o "redis://localhost:6379"
	opt, err := redis.ParseURL("redis://" + redisURL)
	if err != nil {
		// Si falla el parsing, usar configuración por defecto
		opt = &redis.Options{
			Addr: redisURL,
			DB:   0, // Base de datos 0 (por defecto)
		}
	}

	// Crear el cliente
	client := redis.NewClient(opt)

	return &RedisClient{Client: client}
}

// Close cierra la conexión a Redis
func (r *RedisClient) Close() error {
	if r.Client != nil {
		return r.Client.Close()
	}
	return nil
}

// Ping verifica que la conexión a Redis esté activa
func (r *RedisClient) Ping(ctx context.Context) error {
	return r.Client.Ping(ctx).Err()
}

// Get obtiene un valor de Redis por su clave
func (r *RedisClient) Get(ctx context.Context, key string) (string, error) {
	val, err := r.Client.Get(ctx, key).Result()
	if err == redis.Nil {
		// La clave no existe
		return "", fmt.Errorf("clave no encontrada")
	}
	return val, err
}

// Set guarda un valor en Redis con una clave
// expiration: duración en segundos (0 = sin expiración)
func (r *RedisClient) Set(ctx context.Context, key string, value interface{}, expiration int) error {
	return r.Client.Set(ctx, key, value, 0).Err()
}

// Delete elimina una clave de Redis
func (r *RedisClient) Delete(ctx context.Context, key string) error {
	return r.Client.Del(ctx, key).Err()
}

// Exists verifica si una clave existe en Redis
func (r *RedisClient) Exists(ctx context.Context, key string) (bool, error) {
	result, err := r.Client.Exists(ctx, key).Result()
	return result > 0, err
}
