FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o go-service .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
RUN adduser -D -s /bin/sh appuser
WORKDIR /app
COPY --from=builder /app/go-service .
RUN chown appuser:appuser go-service
USER appuser
EXPOSE 8080
CMD ["./go-service"]
