/**
 * scripts/port_validator.js
 * Docker-aware port collision validation engine.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_NAME = process.argv[2] || 'university-erp';
const REGISTRY_FILE = path.join(__dirname, '..', 'PORT_REGISTRY.md');
const COMPOSE_DIR = path.join(__dirname, '..');
const DOTENV_PATH = path.join(__dirname, '..', '.env');

function runCommand(command, cwd = process.cwd()) {
    try {
        return execSync(command, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    } catch (e) {
        return null; // Return null if command fails
    }
}

function parseDockerCompose() {
    console.log("Resolving final docker compose configuration...");
    const cmd = `npx dotenvx run --env-file="${DOTENV_PATH}" -q -- docker compose -f docker-compose.yml config --format json`;
    const output = runCommand(cmd, COMPOSE_DIR);
    if (!output) {
        console.error("Failed to execute docker compose config. Ensure Docker is running.");
        process.exit(1);
    }
    
    let config;
    try {
        config = JSON.parse(output);
    } catch (e) {
        console.error("Failed to parse Docker Compose JSON.");
        process.exit(1);
    }

    const resolvedProjectName = config.name || PROJECT_NAME;
    const requestedPorts = [];
    if (config.services) {
        for (const [serviceName, serviceData] of Object.entries(config.services)) {
            if (serviceData.ports) {
                for (const portMap of serviceData.ports) {
                    if (portMap.published) {
                        requestedPorts.push({
                            host_ip: portMap.host_ip || '0.0.0.0',
                            host_port: String(portMap.published),
                            container_port: portMap.target,
                            protocol: portMap.protocol || 'tcp',
                            compose_project: resolvedProjectName,
                            compose_service: serviceName
                        });
                    }
                }
            }
        }
    }
    return requestedPorts;
}

function parseRegistry() {
    const registry = {};
    if (!fs.existsSync(REGISTRY_FILE)) return registry;
    
    const content = fs.readFileSync(REGISTRY_FILE, 'utf-8');
    const lines = content.split('\n');
    let inInventory = false;
    
    for (const line of lines) {
        if (line.match(/^## Final Port Inventory/)) {
            inInventory = true;
            continue;
        }
        if (inInventory && line.match(/^## /)) {
            inInventory = false;
        }
        if (inInventory && line.match(/^\|\s*\d+/)) {
            const parts = line.split('|').map(s => s.trim());
            const port = parts[1];
            const project = parts[3] === '-' ? null : parts[3];
            const service = parts[4] === '-' ? null : parts[4];
            const status = parts[6];
            registry[port] = { status, owner_project: project, owner_service: service };
        }
    }
    return registry;
}

function getDockerRuntime() {
    const dockerPorts = {};
    const psOutput = runCommand('docker ps -q');
    if (!psOutput) return dockerPorts;
    
    const containerIds = psOutput.trim().split('\n').filter(Boolean);
    if (containerIds.length === 0) return dockerPorts;

    for (let i=0; i<containerIds.length; i+=10) {
        const batch = containerIds.slice(i, i+10).join(' ');
        const inspectOut = runCommand(`docker inspect ${batch}`);
        if (!inspectOut) continue;
        
        let containers;
        try { containers = JSON.parse(inspectOut); } catch (e) { continue; }

        for (const c of containers) {
            const project = c.Config.Labels['com.docker.compose.project'] || 'UNKNOWN';
            const service = c.Config.Labels['com.docker.compose.service'] || 'UNKNOWN';
            const name = c.Name.replace(/^\//, '');
            
            if (c.NetworkSettings && c.NetworkSettings.Ports) {
                for (const [portProto, bindings] of Object.entries(c.NetworkSettings.Ports)) {
                    if (bindings) {
                        const [cPort, proto] = portProto.split('/');
                        for (const b of bindings) {
                            dockerPorts[b.HostPort] = {
                                type: 'docker',
                                container_id: c.Id.substring(0, 12),
                                container_name: name,
                                compose_project: project,
                                compose_service: service,
                                container_port: parseInt(cPort, 10),
                                protocol: proto
                            };
                        }
                    }
                }
            }
        }
    }
    return dockerPorts;
}

function getHostOccupiedPorts() {
    const occupied = {};
    const isWindows = process.platform === 'win32';
    const netstatCmd = isWindows ? 'netstat -ano' : 'netstat -tuln';
    
    const out = runCommand(netstatCmd);
    if (!out) return occupied;
    
    const lines = out.split('\n');
    for (const line of lines) {
        if (line.includes('LISTEN')) {
            const parts = line.trim().split(/\s+/);
            // netstat -ano: TCP  0.0.0.0:8080  0.0.0.0:0  LISTENING  1234
            // netstat -tuln: tcp 0 0 0.0.0.0:8080 0.0.0.0:* LISTEN 1234/nginx
            const localAddress = isWindows ? parts[1] : parts[3];
            const pidInfo = isWindows ? parts[4] : parts[6];
            
            const match = localAddress.match(/:(\d+)$/);
            if (match) {
                const port = match[1];
                occupied[port] = pidInfo || 'UNKNOWN';
            }
        }
    }
    return occupied;
}

function getProcessName(pid) {
    if (!pid || pid === 'UNKNOWN') return 'UNKNOWN';
    if (process.platform === 'win32') {
        const out = runCommand(`tasklist /FI "PID eq ${pid}" /NH`);
        if (out) {
            const match = out.trim().match(/^([^\s]+)/);
            if (match) return match[1];
        }
    }
    return pid; // On Linux usually netstat provides PID/Program name
}

function main() {
    console.log("============================================================");
    console.log("       DOCKER HOST PORT OWNERSHIP AUDIT");
    console.log("============================================================\n");
    
    const requested = parseDockerCompose();
    const registry = parseRegistry();
    const dockerRuntime = getDockerRuntime();
    const hostSockets = getHostOccupiedPorts();
    
    const auditResults = [];
    let hasFailure = false;

    if (requested.length === 0) {
        console.log("No published host ports detected in configuration.");
        process.exit(0);
    }

    for (const req of requested) {
        const pStr = String(req.host_port);
        let result = '';
        let classification = '';
        let runtimeInfo = null;
        const regInfo = registry[pStr] || { status: 'UNREGISTERED' };

        console.log(`Port: ${pStr}/${req.protocol}`);
        console.log(`Binding: ${req.host_ip}\n`);
        
        console.log(`Requested owner:`);
        console.log(`  Project : ${req.compose_project}`);
        console.log(`  Service : ${req.compose_service}`);
        console.log(`  Container port: ${req.container_port}\n`);

        console.log(`Registry:`);
        console.log(`  Status  : ${regInfo.status}`);
        if (regInfo.owner_project) {
            console.log(`  Owner   : ${regInfo.owner_project} / ${regInfo.owner_service}\n`);
        } else {
            console.log(`  Owner   : N/A\n`);
        }

        // Logic
        if (regInfo.status === 'RESERVED') {
            classification = 'RESERVED PORT';
            result = 'BLOCKED';
            console.log(`Runtime:\n  AVAILABLE\n`);
        } else if (dockerRuntime[pStr]) {
            const owner = dockerRuntime[pStr];
            runtimeInfo = owner;
            console.log(`Runtime:`);
            console.log(`  Type      : Docker`);
            console.log(`  Container : ${owner.container_name}`);
            console.log(`  Project   : ${owner.compose_project}`);
            console.log(`  Service   : ${owner.compose_service}`);
            console.log(`  Mapping   : ${req.host_ip}:${pStr} -> ${owner.container_port}/${owner.protocol}\n`);

            if (regInfo.status === 'ACTIVE' && regInfo.owner_project && regInfo.owner_project !== req.compose_project) {
                classification = 'REGISTRY DRIFT (Requested project mismatches registry owner)';
                result = 'BLOCKED';
            } else if (regInfo.status === 'ACTIVE' && regInfo.owner_project && regInfo.owner_project !== owner.compose_project) {
                classification = 'REGISTRY DRIFT (Runtime project mismatches registry owner)';
                result = 'BLOCKED';
            } else if (owner.compose_project === req.compose_project && owner.compose_service === req.compose_service) {
                classification = 'OWNED BY CURRENT PROJECT';
                result = 'PASS';
            } else if (owner.compose_project === req.compose_project) {
                classification = 'COLLISION (Same project, different service)';
                result = 'BLOCKED';
            } else {
                classification = 'PORT COLLISION';
                result = 'BLOCKED';
            }
        } else {
            if (hostSockets[pStr]) {
                const procInfo = getProcessName(hostSockets[pStr]);
                runtimeInfo = { type: 'host', process: procInfo, pid: hostSockets[pStr] };
                console.log(`Runtime:`);
                console.log(`  Type      : Host Process`);
                console.log(`  Process   : ${procInfo} (PID: ${hostSockets[pStr]})\n`);
                
                // Exclude common docker proxy names that might hide behind netstat if docker inspect missed them
                if (procInfo.toLowerCase().includes('docker') || procInfo.toLowerCase().includes('com.docker')) {
                    classification = 'UNMANAGED DOCKER COLLISION';
                } else {
                    classification = 'HOST PROCESS COLLISION';
                }
                result = 'BLOCKED';
            } else {
                console.log(`Runtime:\n  AVAILABLE\n`);
                if (regInfo.status === 'ACTIVE' && regInfo.owner_project !== req.compose_project) {
                    classification = 'REGISTRY CONFLICT';
                    result = 'BLOCKED';
                } else {
                    classification = 'AVAILABLE';
                    result = 'PASS';
                }
            }
        }

        console.log(`Result:\n  ${result} - ${classification}\n`);
        console.log("------------------------------------------------------------\n");

        if (result === 'BLOCKED') hasFailure = true;

        auditResults.push({
            host_ip: req.host_ip,
            host_port: parseInt(pStr, 10),
            protocol: req.protocol,
            requested: {
                project: req.compose_project,
                service: req.compose_service
            },
            registry: {
                status: regInfo.status,
                owner_project: regInfo.owner_project,
                owner_service: regInfo.owner_service
            },
            runtime: runtimeInfo,
            classification: classification,
            result: result
        });
    }

    const auditData = {
        project: PROJECT_NAME,
        result: hasFailure ? 'BLOCKED' : 'PASSED',
        ports: auditResults
    };

    fs.writeFileSync(path.join(__dirname, '..', '.port-audit.json'), JSON.stringify(auditData, null, 2));

    if (hasFailure) {
        console.log("============================================================");
        console.log("RESULT: DEPLOYMENT BLOCKED");
        console.log("============================================================");
        process.exit(1);
    } else {
        console.log("============================================================");
        console.log("RESULT: VALIDATION PASSED");
        console.log("============================================================");
        process.exit(0);
    }
}

main();
