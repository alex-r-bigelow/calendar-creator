#!/bin/bash
## who am i? ##
cd "$(dirname ${BASH_SOURCE[0]})"
python -m SimpleHTTPServer 8123 &
SERVER_PID=$!
python -m webbrowser -t "http://127.0.0.1:8123" &
kill $SERVER_PID