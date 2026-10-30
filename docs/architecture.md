# Architecture

Next.js 16 App Router + React 19 + TypeScript; server-rendered protected layout, client interactions only where needed. Tailwind 4, Radix/shadcn-style Button, Lucide, React Hook Form and Sonner provide the UI. Noto Sans Bengali is self-hosted through bundled font assets. `/api/auth` uses bcrypt and rolling 90-day HS256 JWTs with HTTP-only same-site cookies. User session versions invalidate sessions after password changes. Mutation routes check Origin before authentication. Public owner signup is rate-limited and immediately creates an authenticated, isolated owner workspace.

MongoDB connections are cached per serverless instance. Mongoose unique indexes enforce flat numbers, one active tenant per flat, tenant-period invoice uniqueness and payment idempotency keys. Payment writes and reversals require replica-set transactions. Monetary values are integer paisa. Serwist's default cache rules are deliberately unused. Network-only navigations fail into a public offline page. API fetches use no-store.

The current client fetches paginated collections and aggregates them in memory; for large buildings replace this with server-side dashboard/report aggregates. Auth rate limits are per normalized account and 15-minute window in MongoDB; configure edge/IP limits on the hosting platform as additional protection. Cloudinary image bytes and upload size are checked server-side and use authenticated storage. Secrets never enter client components.

Deployment target is Vercel, per the project requirement; no Sites hosting substitution is used. See README for remaining modules and validation limits.

All building and financial collections carry immutable ownerId. Route handlers use owner-scoped models for collection reads, ID lookups, writes, billing batches and PDF downloads. Owner identity comes from the authenticated user, never from request bodies. Administrators inherit their owner workspace. Password changes increment sessionVersion and issue a new cookie only for the current device.
