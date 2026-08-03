#!/bin/sh
# health-logger.sh

echo "Starting Comprehensive Health Logger..."

# Infinite loop to keep checking the services
while true; do
  # Get the current timestamp
  TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

  # Ping the Backend (API Monolith). 
  # -o /dev/null throws away the page content
  # -s hides the progress bar
  # -w "%{http_code}" prints ONLY the HTTP status code (e.g., 200, 404, 502)
  BACKEND_STATUS=$(curl -o /dev/null -s -w "%{http_code}" http://api:5191/)

  # Ping the Frontend (Nginx)
  FRONTEND_STATUS=$(curl -o /dev/null -s -w "%{http_code}" http://nginx:80/)

  # Format and print the log output
  echo "[$TIMESTAMP] 🏥 Health Check | API Backend: HTTP $BACKEND_STATUS | Nginx Frontend: HTTP $FRONTEND_STATUS"

  # Wait 10 seconds before checking again
  sleep 10
done
