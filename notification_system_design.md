# Notification System Design

## Overview
This document describes the high-level backend design for a notification system.

## Components
- API service: accepts notification requests.
- Scheduler/worker: processes queued jobs and retries.
- Storage: persists notification requests and delivery status.
- Providers: email/SMS/push integrations.

## Flow
1. Client calls API to create a notification.
2. API validates input and stores the request.
3. Worker picks pending notifications and attempts delivery.
4. Status is updated (sent/failed/retry scheduled).

## Non-functional
- Idempotency for duplicate requests
- Retry with backoff
- Logging and observability
- Rate limiting and provider fallback
