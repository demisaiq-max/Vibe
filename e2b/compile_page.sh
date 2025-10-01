# This script runs during building the sandbox template
# and makes sure the Next.js app is (1) running and (2) the / page is compiled

ping_server() {
  local counter=0
  local response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")

  while [[ "${response}" -ne 200 ]]; do
    let counter++
    if ((counter % 20 == 0)); then
      echo "Waiting for server to start..."
      sleep 0.1
    fi
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
  done
}

# Start the ping_server function in the background
ping_server &

# Change to the user's home directory and start the Next.js development server
cd /home/user && npx next dev --turbopack
