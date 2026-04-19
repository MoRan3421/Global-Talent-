package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Global Talent Microservice Gateway Starting...")
	http.HandleFunc("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Engine Healthy"))
	})
	http.ListenAndServe(":8080", nil)
}
