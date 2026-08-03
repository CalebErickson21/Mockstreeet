# Deployment

## Current architecture

```text
Browser → Vercel frontend → Render backend (Docker) → Render PostgreSQL
```

Nginx is not part of the architecture. Day-to-day local development runs Vite and Express on the host with Compose Postgres. Use `docker compose -f docker-compose.yml -f docker-compose.staging.yml up --build` for a production-like staging QA stack before deploying to Vercel + Render.

See [README.md](README.md) for the full local and production runbook.

## Manual steps (not done by this repo alone)

1. Create Render PostgreSQL and copy `DATABASE_URL` to the backend service.
2. Create a Render Web Service (Docker, root `backend`, health `/health`, pre-deploy `npm run migrate`).
3. Set backend env vars: `NODE_ENV`, `DATABASE_URL`, `SESSION_SECRET`, `ALLOWED_ORIGINS`, `EMAIL_USER`, `EMAIL_PASS`, `FINNHUB_API_KEY`.
4. Create a Vercel project (root `frontend`, Vite, `dist`) with `VITE_API_URL` pointing at the Render API.
5. After the Vercel domain is final, update Render `ALLOWED_ORIGINS` and redeploy the frontend if the API URL changed.

## Known risks

- Cross-origin cookie sessions require `SameSite=None`, `Secure`, CORS credentials, and exact `ALLOWED_ORIGINS`.
- Gmail SMTP from cloud hosts can be blocked; consider an HTTPS email API later if contact mail fails in production.
- Free-tier Render services may cold-start; health checks and client retry behavior matter.

---

## Historical

### What I tried on AWS

MockStreet originally ran as a Docker Compose application on an EC2 VM with:

- React frontend
- Node/Express backend
- PostgreSQL
- Nginx

The goal was to stop the VM when the app was idle and automatically restart it when someone visited the site.

Because a stopped VM cannot receive web traffic, the design required several AWS and host-level components:

- `systemd` to start Docker Compose on boot
- Nginx activity logging
- An idle-shutdown script and timer
- An EC2 IAM role that could stop only its own instance
- A Lambda Function URL to start the VM
- A startup page that polled application health
- CloudFront and Route 53 routing
- Separate TLS certificate handling for CloudFront and the EC2 origin
- Health checks that verified the backend and PostgreSQL were ready

The design worked, and the VM successfully stopped, restarted, restored its Docker services, and preserved PostgreSQL data.

### Why I did not move to pure AWS serverless

A fully serverless AWS architecture would require a significant application redesign rather than a deployment change.

The Express backend currently depends on concepts such as:

- Long-running Node processes
- PostgreSQL connection pools
- Session-based authentication
- Dockerized services

Moving this to Lambda would likely require:

- API Gateway
- Stateless request handling
- External session storage
- Different database connection management
- Potentially RDS Proxy, DynamoDB, or Aurora Serverless
- Changes to backend architecture and deployment workflows

That overhaul was not justified for the current size of the project.

### Why the sleeping EC2 design was not worth it

Keeping the existing VM required fewer application-code changes, but much more infrastructure.

It became a case of using a sledgehammer to kill an ant: the monthly compute savings were modest, while the system required many AWS services, IAM policies, timers, health checks, certificates, and custom routing rules.

The solution was technically interesting, but it created a small custom hosting platform that I would have to maintain.

### Final direction

MockStreet moved to simpler managed infrastructure:

```text
React frontend → Vercel
Node/Express backend → Render
PostgreSQL → Render Postgres
```

This preserves the existing application architecture while removing most of the infrastructure work:

- No VM patching
- No custom wake endpoint
- No EC2 idle-shutdown system
- No self-managed PostgreSQL container
- No manual TLS renewal
- No CloudFront wake routing

### Main takeaway

AWS EC2 is best treated as an always-running VM for a public application unless there is a strong reason to build custom start/stop automation.

Managed platforms such as Vercel and Render are a better fit for MockStreet because they reduce cost and operational complexity without requiring a major rewrite.

The AWS work was still valuable. It provided practical experience with:

- EC2 lifecycle management
- Docker Compose in production
- `systemd`
- IAM and least-privilege policies
- Lambda
- CloudFront
- Route 53
- TLS certificates
- Health checks
- Persistent storage
- Application readiness and graceful shutdown
