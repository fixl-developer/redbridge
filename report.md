# Redbridge Deployment Report

A first-project log of every meaningful decision made while getting `redbridge` from a single `index.html` file to a Next.js app live on the public internet at `http://161.118.183.237`.

This document is structured as: **decision → options considered → what we picked → why**.

---

## 1. Hosting platform — Oracle Cloud (Always Free) vs Vercel vs others

| Option | Pros | Cons |
| --- | --- | --- |
| **Vercel** | 2-minute deploys, automatic HTTPS, preview URLs per PR | Hobby tier prohibits commercial use; less control over the runtime |
| **Oracle Cloud Always Free** | Free forever, full root access, real Linux server | Manual setup; no PaaS niceties |
| **DigitalOcean / AWS EC2** | Mature, well-documented | Not free |

**Picked: Oracle Cloud Always Free.**

**Reason:** Goal was to learn how a Node/Next.js app is actually hosted end-to-end. Vercel hides every interesting piece (Nginx, Node process, firewall, DNS). Oracle's Always Free tier gives a real VM at zero cost — ideal for a first deployment where understanding the stack matters more than convenience.

---

## 2. Region — `India West (Mumbai)`

**Picked: `ap-mumbai-1`.**

**Reason:** Closest Oracle data centre to the user (India). Lowest network latency for both SSH access and end-user page loads from the same region. Region choice cannot be changed after the tenancy is created without migrating resources, so this was a one-shot decision.

---

## 3. Compute shape — `VM.Standard.E2.1.Micro`

| Shape | Architecture | OCPU / RAM | Always Free? | Available to us? |
| --- | --- | --- | --- | --- |
| `VM.Standard.E2.1.Micro` | AMD x86 | 1 / 1 GB | Yes | Yes |
| `VM.Standard.A1.Flex` | ARM (Ampere) | up to 4 / 24 GB | Yes | **No — hidden on our tenancy** |
| `VM.Standard.E5.Flex` | AMD x86 | configurable | No (paid) | Available but paid |

**Picked: `VM.Standard.E2.1.Micro`.**

**Reason:** Ampere A1 — normally the better Always Free choice (more CPU/RAM for the same $0) — was not selectable in this tenancy's Mumbai region. This is common on trial accounts where capacity is reserved or the shape isn't exposed. `E2.1.Micro` was the only Always Free shape visible. 1 OCPU / 1 GB RAM is tight but enough for a single static site + Next.js process, with headroom for two or three additional small Node services later.

**Trade-off accepted:** Limited memory means we can't run many large Node apps in parallel. If we hit the limit, the path forward is to switch to Ampere (when available) or pay for a larger shape — without rebuilding the deployment.

---

## 4. Operating system image — `Canonical Ubuntu 22.04`

| Image | Pros | Cons |
| --- | --- | --- |
| **Oracle Linux 9** (default) | Tuned for OCI, default | Smaller community for our use case |
| **Canonical Ubuntu 22.04** | Largest tutorial / Stack Overflow base; `apt` is well-known | Slightly less integrated with OCI tooling |
| Red Hat / CentOS / Rocky | Enterprise-grade | Less common for Node web apps |
| Windows | Familiar GUI | Far heavier; needs RDP; expensive on resources |

**Picked: Canonical Ubuntu 22.04.**

**Reason:**
- All Node.js / Next.js documentation and tutorials assume `apt` and Ubuntu/Debian package layouts.
- Our deploy commands (`apt install nginx git`, NodeSource setup script, `netfilter-persistent`, `certbot --nginx`) all target Ubuntu first.
- Picking a less-common image would have meant translating every command.

---

## 5. Networking — VCN auto-created, public IPv4 enabled

**Picked:** keep Oracle's auto-generated VCN (`vcn-20260427-1740`) and subnet; check "Assign a public IPv4 address".

**Reason:** No reason to design custom networking on a first project. Auto-generated VCN ships with sensible defaults (private + public subnet, Internet Gateway, route table). A public IPv4 is required for the site to be reachable from the open internet.

---

## 6. Authentication — SSH key, not password

**Picked: ED25519 SSH key pair generated locally with `ssh-keygen`.**

**Reason:**
- Oracle blocks password authentication on Ubuntu cloud images by default, so SSH keys were effectively mandatory.
- ED25519 (rather than RSA) was chosen because it produces shorter, faster, and equally secure keys.
- The private key (`redbridge_oci`) stays on the Windows machine; only the public key was pasted into Oracle.

---

## 7. Firewall — three separate layers, each opened individually

OCI traffic must pass two firewalls before reaching Nginx:

1. **OCI Security List** (cloud-level firewall) — opened via the console.
2. **VM `iptables`** (OS-level firewall) — opened via `sudo iptables -I INPUT ...`.
3. **Nginx config** — the application listens on the opened ports.

**Ports opened:** `22` (SSH), `80` (HTTP), `443` (HTTPS).

**Issue encountered:** the initial iptables rules were inserted at position 6, but Ubuntu's default `REJECT` rule sat at position 5 — so connections to ports 80/443 were rejected before reaching the new ACCEPT rules. Fix was to **insert ACCEPT rules above the REJECT** (position 5).

**Lesson:** `iptables` evaluates rules top-down, first match wins. Insertion order matters.

---

## 8. Web server — Nginx (reverse proxy)

| Option | Why not picked |
| --- | --- |
| `next start` directly on port 80 | Requires running Node as root or fiddling with `setcap`; gives up the ability to host multiple apps on the same machine |
| Apache | Configuration is heavier; community for Node reverse-proxying favours Nginx |
| Caddy | Excellent (auto-HTTPS), but smaller community; would have required learning new config syntax |

**Picked: Nginx.**

**Reason:** Nginx is the de-facto reverse proxy for Node apps. With a few lines of config it forwards incoming HTTP/HTTPS to a Node process on `127.0.0.1:3000`. Same Nginx instance can later proxy multiple apps on different ports, so adding future projects to this VM costs only an additional `server` block.

---

## 9. Process manager — PM2

| Option | Why not picked |
| --- | --- |
| `npm run start` in a `screen`/`tmux` session | Won't survive a reboot; no log rotation |
| `systemd` unit file | Works but requires writing a `.service` file per app |
| Docker | Heavier; adds another layer to learn |

**Picked: PM2.**

**Reason:**
- One command (`pm2 start "npm run start" --name redbridge`) launches and supervises the Node process.
- Auto-restart on crash, log files, process list, memory monitoring — all included.
- `pm2 startup` + `pm2 save` makes the app survive reboots.
- Standard tool for Node deployments outside Kubernetes/Docker.

---

## 10. Application framework — Next.js 14 (App Router)

The original asset was a single 1,300-line `index.html`. We converted it to Next.js for this deployment.

**Reason:**
- The stated goal was "see if Next.js can be deployed on Oracle." A static HTML deploy doesn't exercise the Node runtime.
- Next.js + App Router is the current standard for production React apps.
- Converting via `dangerouslySetInnerHTML` + `next/script` preserved every behaviour of the existing HTML/JS without rewriting all 1,300 lines into idiomatic React.

**Trade-off accepted:** the page is one giant client-rendered block — not idiomatic React, no component reuse, no per-page metadata for SEO. Good enough for proving the deployment path; would be refactored before production.

---

## 11. Deployment topology

```
Internet
   |
   v
Nginx (port 80) ──reverse proxy──> Node (Next.js) on port 3000
   |                                  ^
   |                                  |
   |                            PM2 supervisor
   v                                  |
/var/www/html  (no longer used)       v
                                node_modules / .next build
```

**Reason:** Standard production layout. Nginx handles TLS termination (when we add HTTPS), gzip, static asset caching, and routing. Node only runs application code. Adding a second Node app later is one extra Nginx `server` block plus a new port for PM2.

---

## 12. What was demonstrated by `/status` and `/api/stats`

These two routes were added specifically to **prove** the Node runtime is involved. Both are marked `ƒ (Dynamic)` in the Next.js build output, meaning they are server-rendered on every request. They:

- Read `os.hostname()` — returns `redbridge-web` (the OCI VM hostname).
- Read `process.uptime()` — increments every second the Node process is alive.
- Read `process.memoryUsage()` — live RSS of the Node process.

None of these values could exist on static hosting. Their presence is the test that the deployment is real Next.js, not a static export.

---

## 13. What was NOT done (and why)

| Step | Why deferred |
| --- | --- |
| Custom domain | No domain owned yet |
| HTTPS via Let's Encrypt | Requires a domain pointing at the VM |
| Auto-deploy on `git push` | Could use a GitHub webhook + small listener on the VM; not needed for a first project |
| Tailwind installed as a build dependency | Would require rewriting class strings out of the dynamic JS where Tailwind's JIT scanner cannot find them. Easier to keep the CDN script |
| Componentising the 1,300-line app | Would be the right next step for production, not for proving the deploy path |

---

## Summary

The first project succeeded on its stated goal: a working public URL hosting a real Next.js application on infrastructure we configured ourselves, at zero ongoing cost.

**Live URLs:**
- `http://161.118.183.237/` — the Redbridge marketing site
- `http://161.118.183.237/status` — proof-of-Node status page
- `http://161.118.183.237/api/stats` — same data as JSON

**Repo:** `https://github.com/fixl-developer/redbridge`
