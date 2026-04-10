FROM golang:1.22-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache git

# Copiar archivos de dependencias
COPY go.mod go.sum* ./
RUN go mod download

# Copiar código fuente
COPY . .

# Compilar aplicación
RUN go build -o main cmd/server/main.go

# Exponer puerto
EXPOSE 8080

# Ejecutar aplicación
CMD ["./main"]
