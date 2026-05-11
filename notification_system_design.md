# Notification System Design

## Stage 1 — API Design

### REST APIs

Base path: `/notifications`

#### GET /notifications
Returns notifications for a student, supports filtering and pagination.

Query params:
- `studentId` (number, required in real system)
- `isRead` (boolean, optional)
- `limit` (number, optional, default 20)
- `cursor` (string, optional, for keyset pagination using `createdAt` + `id`)
- `mode=priority` (optional) returns only the priority inbox (top 10)

Response:
```
{
	"notifications": [
		{
			"id": "uuid",
			"studentId": 1042,
			"type": "PLACEMENT|RESULT|EVENT",
			"title": "...",
			"message": "...",
			"isRead": false,
			"createdAt": "2026-05-11T07:00:00.000Z"
		}
	]
}
```

#### POST /notifications
Creates a notification.

Request body:
```
{
	"studentId": 1042,
	"type": "PLACEMENT",
	"title": "Interview scheduled",
	"message": "Company X interview at 4 PM"
}
```

Response: `201 Created` with the created notification.

#### PATCH /notifications/:id/read
Marks a notification as read.

Response: `200 OK` with updated notification.

#### DELETE /notifications/:id
Deletes a notification.

Response: `204 No Content`.

### Realtime Notifications (SSE / WebSocket)

Option A — SSE (Server-Sent Events):
- Endpoint: `GET /notifications/stream?studentId=1042`
- Server keeps an HTTP connection open and pushes events:
	- `notification:new`
	- `notification:read`
	- `notification:deleted`

Why SSE:
- Simple to implement (HTTP only)
- Works well for one-way pushes (server → client)
- Easy to scale with a pub/sub layer (Redis) later

Option B — WebSocket:
- Useful when client needs to push messages back frequently
- More complex infra (sticky sessions or shared pub/sub required)

Tradeoff:
- SSE is simpler; WebSocket is more flexible.

## Stage 2 — Database Choice

Recommended: PostgreSQL

Why:
- Relational consistency for notification state (read/unread, dedupe keys)
- Strong indexing support for filtering/sorting/pagination
- Great fit for queries like “unread for student, newest first”
- Easy to add read replicas later

Example table shape:
```
notifications(
	id UUID PK,
	student_id INT NOT NULL,
	type TEXT NOT NULL,
	title TEXT NOT NULL,
	message TEXT NOT NULL,
	is_read BOOLEAN NOT NULL DEFAULT false,
	created_at TIMESTAMPTZ NOT NULL,
	read_at TIMESTAMPTZ NULL
)
```

## Stage 3 — Query Optimization (Indexing)

Current query:
```
SELECT *
FROM notifications
WHERE studentID = 1042
	AND isRead = false
ORDER BY createdAt DESC;
```

Why it becomes slow at ~5M rows:
- Without a useful index: full table scan
- Sorting large result sets is expensive
- High I/O under concurrency

Fix: composite index aligned with WHERE + ORDER BY
```
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```

Result:
- Query becomes an index range scan
- Eliminates extra sort work

## Stage 4 — When DB Is Overloaded

Mitigations:
- Pagination / keyset pagination (avoid huge offsets)
- Lazy loading (fetch recent first)
- Redis caching for “top unread” per student
- Read replicas for read-heavy workloads
- Background fanout (precompute per-student inbox when needed)
- Realtime pushes (SSE/WS) reduce polling traffic

Tradeoffs:
- Cache adds invalidation complexity
- Replicas add eventual consistency for reads

## Stage 5 — Async Processing (Queue)

Problem: synchronous processing in request path is slow and fragile.

Better flow:
API
→ validate + store notification request
→ enqueue delivery job
→ worker processes job
→ provider (email/SMS/push)
→ update delivery status in DB

Queue tech options:
- Kafka (high throughput, durable streams)
- RabbitMQ (classic job queue patterns)
- BullMQ (Redis-based, easy in Node/TS)

Why this scales:
- API stays fast (low latency)
- Workers scale horizontally
- Retries/backoff handled outside request path

## Stage 6 — Priority Inbox (Top 10)

Goal:
- Return the top 10 notifications using:
	- Priority: `PLACEMENT > RESULT > EVENT`
	- Recency within the same category

Approach:
- Use a min-heap (priority queue) of size `k=10`.
- Iterate all candidate notifications once:
	- push into heap
	- if heap size > k, pop the “worst” item

Complexity:
- Time: $O(n \log k)$ (for k=10, this is very fast)
- Space: $O(k)$

Tradeoffs:
- Faster than sorting all notifications ($O(n \log n)$)
- Needs a clear comparator (type weight + createdAt)

## Non-functional Requirements

- Idempotency (dedupe repeated creates)
- Retry with exponential backoff (for provider failures)
- Observability (structured logs + metrics)
- Rate limiting and abuse prevention
