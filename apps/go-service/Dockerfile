# Stage 1: Build the Go binary
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy Go module files and download dependencies to leverage Docker cache
COPY go.mod go.sum./
RUN go mod download

# Copy the rest of the source code
COPY..

# Build the application into a statically linked binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /go-service

# Stage 2: Create the final, minimal production image
FROM scratch

# Copy only the compiled binary from the builder stage
COPY --from=builder /go-service /go-service

# Expose the port the application runs on
EXPOSE 8080

# Set the entrypoint for the container
ENTRYPOINT ["/go-service"]