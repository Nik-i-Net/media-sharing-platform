# MediaHub Backend

Backend API for MediaHub, a platform for uploading, organizing, and sharing media files.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Integrations](#integrations)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#clone-repo-and-install-dependencies)
  - [External services](#setup-external-services)
  - [Development](#development)
  - [Testing](#testing)
  - [Production](#production)
- [API Docs](#api-docs)

## Features

- Authentication
- Media uploads with deduplication
- Albums for organizing media
- Visibility and expiration controls 
- Subscriptions
- Rate limiting and abuse protection

## Architecture

The project uses a hybrid of Clean Architecture and Vertical Slices, with a light DDD-inspired domain layer and Hexagonal Architecture (Ports & Adapters) principles for external integrations.

Features are grouped by domain and designed to be mostly isolated, but limited cross-feature dependencies are allowed where needed.

Each feature is implemented as a vertical slice that contains all its own layers:
- domain (entities, repository interfaces, value objects)
- application (use cases, ports)
- http (controllers, webhooks)
- infrastructure (adapters)

External events:
- Cloudflare webhook confirms uploads initiated via signed URLs
- Stripe webhook updates user subscription states

Background processing:
- Cron jobs handle maintenance tasks such as cleanup and expiration

Design decisions:
- File deduplication. Implemented `uploads` vs `blobs` split where unique files are identified by their hash to optimize storage usage. So, identical files uploaded by different users are mapped to a single blob.

## Tech Stack

- Node.js (TypeScript), Express
- PostgreSQL (Drizzle ORM)
- Redis
- Docker
- Zod
- OpenAPI, SwaggerUI
- Vitest, Supertest

## Integrations

- Auth0 - authentication
- Cloudflare - R2 storage, Workers, Queues
- Stripe - subscriptions

## Setup

### Prerequisites

- Node.js v24+
- pnpm v10+
- Docker v29+

### Clone repo and install dependencies

```bash
git clone https://github.com/Nik-i-Net/mediahub-backend
cd mediahub-backend
pnpm install --frozen-lockfile
```

### Setup external services

> **Note**: For development (and E2E tests), the backend must be accessible to external services. Use a tunneling tool (e.g. ngrok) or other approaches to expose your local server.

- Auth0 - see [setup guide](./external/auth0/README.md)
- Cloudflare - see [setup guide](./external/cloudflare-worker/README.md)
- Stripe - see [setup guide](./external/stripe/README.md)

### Development

Copy example env file and update it with development-specific values:

```bash
cp .env.example .env.development
```

Start required services (Postgres, Redis):

```bash
pnpm dev:services:start
```

Initialize database (first-time or after schema changes):

```bash
pnpm dev:db:push
pnpm dev:db:seed
```

Start and expose backend server:

```bash
pnpm dev
ngrok http 5000 # example
```

> **Note**: Don't forget to close the tunnel, and stop the services  when you're done.

```bash
pnpm dev:services:stop
```

### Testing

Copy example env file and update it with test-specific values:

```bash
cp .env.example .env.test
```

Run tests:

```bash
pnpm test:unit
pnpm test:int
pnpm test:e2e
```

**Bruno** collections for manual testing are located in `tests/bruno`

### Production

Copy example env file and update it with production-specific values:

```bash
cp .env.example .env.production
```

Initialize database (first-time or after schema changes):

```bash
pnpm dev:db:generate # Generate migrations
pnpm db:migrate # Apply migrations
pnpm db:seed # Seed database
```

Build Docker image:

```bash
pnpm docker:build
```

Deploy: TBD

Run:

```bash
pnpm start
```

## API Docs
- SwaggerUI: http://localhost:5000/api-docs
- OpenAPI (raw json): http://localhost:5000/api-docs.json
