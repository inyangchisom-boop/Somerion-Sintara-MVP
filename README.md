# Somerion Sintara

**Connected Business. Simple Operations.**

Somerion Sintara is being developed under Somerion as a global business-operations integration platform.

## Current implementation status

This repository currently contains a responsive web interface and Firebase email/password authentication.

Implemented in the current code:
- Firebase email/password sign-in
- Firebase account registration
- Firebase password-reset email request
- Firebase sign-out
- Authenticated dashboard access through Firebase Auth state
- A per-user Firestore profile write using the authenticated user's UID

## Not implemented yet

The following are not currently working product features and must not be presented as active:
- Shopify, QuickBooks, Facebook, Instagram, or other third-party OAuth/API connections
- Business data synchronization
- Integration health monitoring
- Automated error detection or alerts
- Activity event collection
- AI diagnosis or automated repair
- Currency conversion or multi-currency transaction handling

The interface intentionally identifies these capabilities as unavailable until they are implemented and tested.

## Technology

- HTML, CSS, and JavaScript
- Firebase Authentication
- Cloud Firestore
- GitHub Pages for static web hosting

## Important deployment and security notes

- Firestore security rules must allow each authenticated user to read/write only their own `users/{uid}` profile document. The rules configured in the Firebase Console have not been verified from this repository.
- Firebase web configuration is client-side configuration, not a private service-account credential. Never put service-account keys, OAuth client secrets, or other private credentials in this public repository.
- Third-party integrations require a trusted backend for OAuth callbacks, secret storage, token refresh, access control, and API requests. A browser-only GitHub Pages site is not sufficient for those operations.

## Development stage

Early authenticated web foundation. This is not yet a production-ready integration platform.

## Separate backend services

The backend is split into independent Cloudflare Workers and independent D1 databases. The pre-existing `somerion-integration-api` service and its database were not modified or reused.

| Service | Worker | Database |
|---|---|---|
| Core workspace API | `somerion-core-api-v1` | `somerion-core-db-v1` |
| Shopify API | `somerion-shopify-api-v1` | `somerion-shopify-db-v1` |
| WooCommerce API | `somerion-woocommerce-api-v1` | `somerion-woocommerce-db-v1` |
| Accounting API | `somerion-accounting-api-v1` | `somerion-accounting-db-v1` |
| Social API | `somerion-social-api-v1` | `somerion-social-db-v1` |

Each Worker has its own D1 binding. Private routes validate Firebase ID-token signatures and project claims. Public `/health` endpoints report service availability; private routes require a Firebase bearer token.

Workers.dev base URLs:
- Core: https://somerion-core-api-v1.somerion-oi.workers.dev
- Shopify: https://somerion-shopify-api-v1.somerion-oi.workers.dev
- WooCommerce: https://somerion-woocommerce-api-v1.somerion-oi.workers.dev
- Accounting: https://somerion-accounting-api-v1.somerion-oi.workers.dev
- Social: https://somerion-social-api-v1.somerion-oi.workers.dev

Initial API routes:
- `GET /health` — public service health response.
- `GET /v1/status` — authenticated service status.
- Core only: `GET/POST /v1/workspaces`.
- Provider services: `GET /v1/connections` and `POST /v1/oauth/start`.

## Backend implementation boundary

The five services and their databases have been provisioned and deployed. This is a separated backend foundation, not completed third-party integrations. OAuth routes deliberately return `provider_not_configured` until the corresponding developer-app credentials, redirect URLs, consent scopes, token encryption and provider-specific API workflows are configured and tested. Data synchronization, monitoring, alert generation, and automated repair are not active yet.

## Sintara Agent (new service)

The personal AI workspace assistant is deployed as a separate Cloudflare Worker and database:
- Worker: `somerion-agent-api-v1`
- Endpoint: `https://somerion-agent-api-v1.somerion-oi.workers.dev`
- Database: `somerion-agent-db-v1`
- AI: Cloudflare Workers AI binding (`@cf/meta/llama-3.1-8b-instruct`)
- Scheduled due-date reminder check: every 15 minutes.

Agent data is partitioned by the authenticated Firebase UID. It supports personal task creation, listing, completion/deletion, AI assistance using the user's open tasks as context, reminder preferences, and in-app due-date notifications.

Current limits: this agent does not yet monitor external Shopify, accounting, or social-platform events; send emails/SMS/push notifications; message other people; or perform business actions. Those capabilities require the relevant provider connections, notification channels, permissions, and further testing. The AI endpoint and browser-to-Worker end-to-end flow still require a live signed-in user test.
