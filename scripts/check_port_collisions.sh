#!/bin/bash
# scripts/check_port_collisions.sh
# 
# Wrapper for the Node.js Docker-aware port collision validation engine.

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
node "$SCRIPT_DIR/port_validator.js" "$@"
exit $?
