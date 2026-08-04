# University ERP — Missing Piece: Cloudflare Tunnel & Zero Trust (Origin IP Security)

## What Was Missing

The previous orchestration plan correctly kept Cloudflare's DNS, WAF, and Page Rules outside the Docker Compose stack, but it left one critical gap: **the VM's public IP address is still directly exposed** through the `nginx` service's `ports: ["80:80", "443:443"]` mapping.[web:181] Anyone who discovers your origin IP (via DNS history, SSL certificate transparency logs, or scanning) can bypass Cloudflare's WAF, rate limiting, and bot protection entirely and hit your VM directly — this defeats the purpose of having Cloudflare in front of it at all.[web:181][web:183] The fix is **Cloudflare Tunnel** (`cloudflared`) running in Zero Trust mode, which is free on Cloudflare's Free tier and eliminates inbound ports completely.[web:177][web:185]

---

## How Cloudflare Tunnel Solves This

Instead of Cloudflare routing traffic to your VM's public IP, a lightweight `cloudflared` daemon runs **inside your Docker stack** and opens an **outbound-only** encrypted connection to Cloudflare's edge network.[web:177][web:183] No inbound firewall rule, no open port 80/443 on the VM, and no public IP ever needs to be known to the internet — DNS for your subdomains resolves only to Cloudflare's proxy IPs, never to your VM.[web:185][web:183] This is Cloudflare Zero Trust's core "no exposed IP" model, and it is fully included in the Free plan for this use case (unlimited tunnels, unlimited users for basic Access policies).[web:177][web:178]

| Before (Missing) | After (Corrected) |
|---|---|
| `nginx` binds `80:443` directly on the VM's public IP | `nginx` has **no published ports** — only reachable inside the Docker network |
| Attacker can find VM IP and bypass Cloudflare WAF entirely[web:181] | VM has zero open inbound ports; nothing to scan or bypass[web:185] |
| Cloudflare DNS (orange-cloud) still leaks origin IP under some conditions[web:181] | DNS records point only to the tunnel (`<tunnel-id>.cfargotunnel.com`), never the VM[web:177] |
| VM firewall must be manually hardened | VM firewall can deny **all** inbound traffic — tunnel is outbound-only[web:183] |

---

## Updated Architecture Flow

```text
Browser
  │
  ▼
Cloudflare Edge (WAF, Bot Fight, Rate Limiting, Page Rules — unchanged)
  │
  ▼
Cloudflare Tunnel (encrypted, outbound-only from your VM — NEW)
  │
  ▼
cloudflared container (inside docker-compose, same network as nginx)
  │
  ▼
nginx container (no public ports — internal only)
  │
  ├─→ static portal volumes (student-portal, admin-portal, etc.)
  └─→ proxy_pass → api:5191
```

The `ops/nginx/sites-available/*.conf` files, WAF rules, and page rules from the prior plan remain **completely unchanged** — this addition only removes the direct-IP exposure risk without altering routing logic already in place.[file:172]

---

## Section A — Add `cloudflared` to `docker-compose.yml`

```yaml
services:
  # ... postgres, migrator, api, worker, frontend-builder unchanged ...

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: universityerp-cloudflared
    restart: unless-stopped
    command: tunnel --no-autoupdate run
    environment:
      TUNNEL_TOKEN: ${CLOUDFLARE_TUNNEL_TOKEN}
    depends_on:
      - nginx
    networks:
      - erp-internal

  nginx:
    image: nginx:alpine
    container_name: universityerp-nginx
    restart: unless-stopped
    # NOTE: no "ports:" block anymore — nginx is only reachable inside erp-internal
    volumes:
      - ./University-ERP-Backend/ops/nginx/sites-available:/etc/nginx/sites-available:ro
      - ./University-ERP-Backend/ops/nginx/snippets:/etc/nginx/snippets:ro
      - ./University-ERP-Backend/ops/nginx/ssl:/etc/nginx/ssl:ro
      - identity_dist:/var/www/identity-portal:ro
      - student_dist:/var/www/student-portal:ro
      - faculty_dist:/var/www/faculty-portal:ro
      - admin_dist:/var/www/admin-portal:ro
      - lms_dist:/var/www/lms-web:ro
      - finance_dist:/var/www/finance-console:ro
      - library_dist:/var/www/library-portal:ro
      - governance_dist:/var/www/governance-console:ro
    depends_on:
      - frontend-builder
      - api
    networks:
      - erp-internal
```

The critical change: **`ports:` is removed entirely from `nginx`**.[web:185] Only `cloudflared` needs to reach `nginx`, and it does so over the internal Docker network (`erp-internal`), never via the host's public interface.

Since TLS is now terminated at Cloudflare's edge and inside the tunnel, you can also simplify `nginx` to listen on plain HTTP (port 80) internally — the `ops/nginx/ssl/` certificates become optional for internal-only traffic, though keeping them for defense-in-depth is still acceptable.

---

## Section B — One-Time Zero Trust Tunnel Setup (Cloudflare Dashboard, Free Tier)

```bash
# 1. Authenticate cloudflared with your Cloudflare account (run once, locally or on VM)
cloudflared tunnel login

# 2. Create the tunnel (creates a persistent tunnel ID under your zone)
cloudflared tunnel create universityerp-tunnel

# 3. Route each subdomain to the tunnel (repeat per subdomain — free tier has no limit)
cloudflared tunnel route dns universityerp-tunnel student.university.edu
cloudflared tunnel route dns universityerp-tunnel faculty.university.edu
cloudflared tunnel route dns universityerp-tunnel admin.university.edu
cloudflared tunnel route dns universityerp-tunnel finance.university.edu
cloudflared tunnel route dns universityerp-tunnel library.university.edu
cloudflared tunnel route dns universityerp-tunnel governance.university.edu
cloudflared tunnel route dns universityerp-tunnel lms.university.edu
cloudflared tunnel route dns universityerp-tunnel portal.university.edu
cloudflared tunnel route dns universityerp-tunnel auth.university.edu
cloudflared tunnel route dns universityerp-tunnel api.university.edu
```

Each `route dns` command automatically creates the correct CNAME record pointing to `<tunnel-id>.cfargotunnel.com` in your Cloudflare zone — no manual DNS editing needed, and this fully replaces the raw `A` records that would otherwise point at your VM's IP in `ops/cloudflare/dns/university-erp-zone.tf`.[file:172][web:177] Update that Terraform file to manage these CNAME-to-tunnel records instead of A-records pointing at a public IP, keeping your infrastructure-as-code source of truth accurate.

### Ingress Configuration (`~/.cloudflared/config.yml`, or Zero Trust Dashboard equivalent)

```yaml
tunnel: universityerp-tunnel
credentials-file: /etc/cloudflared/universityerp-tunnel.json

ingress:
  - hostname: student.university.edu
    service: http://nginx:80
  - hostname: faculty.university.edu
    service: http://nginx:80
  - hostname: admin.university.edu
    service: http://nginx:80
  - hostname: finance.university.edu
    service: http://nginx:80
  - hostname: library.university.edu
    service: http://nginx:80
  - hostname: governance.university.edu
    service: http://nginx:80
  - hostname: lms.university.edu
    service: http://nginx:80
  - hostname: portal.university.edu
    service: http://nginx:80
  - hostname: auth.university.edu
    service: http://nginx:80
  - hostname: api.university.edu
    service: http://nginx:80
  - service: http_status:404
```

All 10 hostnames route to the **same** internal `nginx` container on port 80 — Nginx's existing `server_name` blocks inside `sites-available/*.conf` still do the per-subdomain routing exactly as before; the tunnel only changes *how traffic arrives* at Nginx, not *how Nginx dispatches it*.[file:172] This avoids redundancy: you are not duplicating routing logic in the tunnel config, only forwarding everything to the one internal entry point Nginx already handles.

If you prefer to configure ingress purely from the Cloudflare Zero Trust dashboard (**Zero Trust → Networks → Tunnels → Public Hostname**) instead of a local `config.yml`, the token-based `TUNNEL_TOKEN` approach in Section A is the simplest path and requires no ingress file on the VM at all — the routing table lives in Cloudflare's dashboard instead.[web:182][web:184]

---

## Section C — Optional Hardening: Cloudflare Access (Zero Trust Policies)

For internal-only portals such as `admin.university.edu`, `finance.university.edu`, `governance.university.edu`, and `faculty.university.edu`, you can additionally require authentication **before Cloudflare even forwards the request through the tunnel**, using free-tier Zero Trust Access policies:

1. Cloudflare Dashboard → **Zero Trust → Access → Applications → Add an application**.
2. Select **Self-hosted**, enter the subdomain (e.g., `admin.university.edu`).
3. Add a policy: e.g., "Allow" only emails ending in `@university.edu`, or require one-time PIN / SSO.
4. Save — Cloudflare now challenges users at the edge before traffic ever reaches your tunnel or Nginx.

This adds a second authentication layer in front of your application's own `IdentityAccess` module login, useful for staff-only portals where you want to block unauthenticated traffic before it consumes any backend resources at all.[web:178]

---

## Section D — VM Firewall: Now Safe to Fully Lock Down

Because `cloudflared` only makes outbound connections, you can configure the VM's firewall (e.g., Google Cloud VPC firewall rules or `ufw`) to **deny all inbound traffic on ports 80 and 443**, and even deny all inbound traffic except SSH from your own IP:[web:183][web:185]

```bash
# Example using ufw on the VM
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from <your-admin-ip> to any port 22
sudo ufw enable
```

No rule for port 80/443 is needed at all — since `nginx` no longer publishes those ports to the host, there is nothing on the VM listening on them for the firewall to protect in the first place.

---

## Section E — Updated `.env.example` Addition

```env
# Cloudflare Zero Trust Tunnel
CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token-from-zero-trust-dashboard
```

Obtain this token from **Zero Trust → Networks → Tunnels → [your tunnel] → Configure → Docker** — Cloudflare generates the exact `docker run` command with the token embedded; extract only the token value for `.env`.[web:182][web:184]

---

## Section F — Revised Deployment Command Sequence

```bash
# 1. One-time: create tunnel + DNS routes (Section B) — run once, not per deploy
cloudflared tunnel login
cloudflared tunnel create universityerp-tunnel
cloudflared tunnel route dns universityerp-tunnel <each subdomain>

# 2. Standard stack startup — now includes cloudflared, nginx has no public ports
docker compose --env-file .env up -d --build

# 3. Verify tunnel connected successfully
docker compose logs cloudflared

# 4. Confirm nginx is NOT reachable from the public internet directly
curl -m 5 http://<your-vm-public-ip>   # should time out / connection refused

# 5. Confirm the platform IS reachable via Cloudflare-routed subdomain
curl -I https://student.university.edu   # should return 200 via Cloudflare edge
```

Step 4 is the actual proof that the missing security gap is closed — if that curl now fails/times out while step 5 succeeds, the origin IP is no longer directly reachable and all traffic is forced through Cloudflare's edge and Zero Trust tunnel.[web:185][web:183]

---

## Redundancy Check (Updated)

- **[Confirmed]** No duplicate TLS termination — Cloudflare terminates public TLS; internal tunnel-to-Nginx traffic can remain plain HTTP inside the private Docker network.
- **[Confirmed]** No duplicate routing logic — the tunnel's ingress rules forward everything to one Nginx entry point; Nginx's existing `sites-available/*.conf` still performs all per-subdomain routing exactly as before.[file:172]
- **[Confirmed]** No open inbound ports remain on the VM — `nginx` no longer publishes `80`/`443`, and the VM firewall can deny all inbound traffic except SSH.
- **[Confirmed]** DNS records change type (A record → CNAME to tunnel) but do not duplicate existing Terraform-managed WAF/page-rule resources in `ops/cloudflare/`.[file:172]
