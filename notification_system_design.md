# Notification System (Backend) — Design

## Goal
Send notifications to users when specific events occur (e.g., vehicle maintenance due, order updates, etc.).

## Scope
- Backend service responsible for creating, storing, and dispatching notifications.
- Delivery channels (initial): Email / SMS / Push (choose what the assignment requires).

## High-level Architecture
- **Producer**: Any backend module that raises an event (e.g., scheduler, API request).
- **Notification Service**: Validates request, persists notification, and triggers delivery.
- **Queue (optional)**: Buffers delivery work (recommended for reliability).
- **Worker**: Sends messages via provider APIs and updates status.
- **Storage**: Persists notifications and delivery attempts.

## Data Model (suggested)
`Notification`
- `id`
- `userId`
- `type` (e.g., MAINTENANCE_DUE)
- `channel` (EMAIL/SMS/PUSH)
- `title`
- `message`
- `status` (PENDING/SENT/FAILED)
- `createdAt`, `sentAt`

## API (suggested)
- `POST /notifications` — create a notification
- `GET /notifications?userId=...` — list notifications for a user

## Scheduler Integration
The maintenance scheduler generates "maintenance due" events and calls the notification service.

## Reliability Notes
- Use retries with backoff for provider failures.
- Persist status updates to support auditing.

## Security
- Validate input.
- Never log secrets (API keys, tokens).
- Use environment variables for provider credentials.
