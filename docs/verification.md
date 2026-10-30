# Verification — 30 October 2026

Passed on the final local source state:

- Next.js production build with webpack and generated Serwist worker.
- TypeScript checks.
- Eight unit tests for integer currency, exact allocation, tenancy overlap, leap years, proration and payment balances.
- Disposable MongoDB replica-set integration tests: login, unique flats/active tenancies, utilities, partial-month rent, duplicate prevention, stale invoice preview rejection, partial/full/multiple payments, idempotency, reversals, future rent schedules preserving historical invoices, Bengali PDF output.
- Authenticated responsive checks across dashboard, flats, tenants, billing, payments, dues, expenses, reports, settings and sharing at 390px.
- Headless Chromium PWA checks: valid manifest/icons, production worker registration, offline navigation, protected API returning 401/no-store, public-only cache contents, Safari-specific instructions and standalone-mode prompt suppression.
- Production dependency audit: zero known vulnerabilities at test time.

Screenshots in `docs/screenshots/dashboard-test-*` use synthetic records from the disposable test database, which is removed after the run. No sample records or login are added to the actual app.

Not verified: physical Android installation; physical iPhone Safari installation and splash rendering; real Cloudinary upload/download with account credentials; production Atlas/network configuration; Vercel HTTPS deployment. The app has not been published. The local preview has no configured production database or owner account until setup is completed.

See README for remaining differences from the full initial product specification and docs/pwa-device-checklist.md for device acceptance.

Public-signup update: isolated database tests cover automatic owner login, email normalization/duplicates, password confirmation, forged role/owner rejection, independent same-number flats and settings, cross-owner collection/document/write isolation, 90-day persistent cookies, renewal of a ten-day-old session, password-change revocation, and logout. Mobile signup and authenticated login redirects are also verified. The configured database received only the two explicitly approved owner-index updates; no financial records changed.
