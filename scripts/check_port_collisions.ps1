# scripts/check_port_collisions.ps1
#
# Wrapper for the Node.js Docker-aware port collision validation engine.

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
node "$ScriptDir\port_validator.js" $args
exit $LASTEXITCODE
