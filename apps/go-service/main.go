package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	// Handler for the root path
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Go service: Received request for /")
		fmt.Fprint(w, "Hello from the Go service!")
	})

	// Handler for Kubernetes health probes
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write(byte("OK"))
	})

	log.Println("Go server starting on port 8080...")
	if err := http.ListenAndServe(":8080", nil); err!= nil {
		log.Fatalf("Failed to start Go server: %v", err)
	}
}