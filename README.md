# BashaHisab · বাসা হিসাব

A Bangla Next.js App Router application for a private family building, with a production Serwist PWA. Designed for Vercel and MongoDB Atlas. No demonstration tenants, financial amounts, payment accounts or localStorage database are included.

## Run locally

Node.js 22.14 or newer is recommended.

```powershell
cd D:\bashahisab
npm ci
Copy-Item .env.example .env.local
# Fill in .env.local with your own credentials.
# After starting, open /signup to create your account.
npm run dev
```

Open `/signup` to create an owner account in the browser. Signup immediately signs you in and opens your private dashboard; every owner's records are isolated. The terminal owner-creation script remains optional for provisioning. Normal signup does not require it. Passwords must contain at least 12 characters and no more than 72 UTF-8 bytes.

Sessions persist for 90 days in HTTP-only secure cookies and renew after a day while the app is used. Closing the browser does not end the session. Visiting login or signup when already signed in opens the dashboard. Signing out clears the device cookie. A password change revokes old sessions while keeping the current device signed in. Browser storage clearing or 90 days without renewal still requires login. Passwords and tokens are never stored in localStorage.

Create AUTH_SECRET using `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` and save it privately in `.env.local`. MongoDB and AUTH_SECRET must be configured before signup works.

### Existing single-family deployments

Owner-specific indexes are required for public signup. The configured database's flat-number and building-settings indexes were updated with explicit approval; no records were changed. For other deployments run `scripts/inspect-owner-migration.ts` first. `scripts/update-owner-indexes.ts` changes only those indexes. If legacy unowned records exist, `scripts/migrate-owners.ts` assigns them to the sole existing owner and refuses ambiguous ownership. Run migration scripts from a trusted terminal with the intended environment file; do not expose them through a public endpoint. Fresh databases create the correct indexes automatically.

MongoDB Atlas must use a replica set (Atlas provides this) for transactional payments. Create a dedicated database user, configure network access for your Vercel deployment, and paste its connection URI into MONGODB_URI. Use a separate development database. Cloudinary is optional until uploading actual utility bill images. Set its three server-side credentials; uploaded images use authenticated delivery.

## Production and installation

```powershell
npm run build
npm start
```

PWA registration runs only in production. Webpack is explicitly selected to use the maintained Serwist webpack integration. The manifest is at `/manifest.webmanifest`, worker at `/sw.js`, public installation guide at `/install`, and offline fallback at `/offline.html`. Dashboard and settings include the prominent Bangla install option.

On Android Chrome, use the install button when offered, or Chrome's menu → Install app / Add to Home screen. On iPhone, open in Safari → Share → Add to Home Screen, enable Open as Web App when offered, then Add. Launch from the home-screen icon. The app distinguishes standalone mode and an observed appinstalled event. It does not persist a guessed installed flag or infer installation from a bookmark. Browser APIs cannot reliably discover installations in another browser.

Android generates its launch screen using the manifest icon, background and theme. Apple touch icons and portrait/landscape startup images are included for common iPhone/iPad dimensions; unlisted devices use the platform fallback. Generate icons and splash assets again with `npm run assets` after changing the source identity.

Service worker caches only the public offline document, its icon, public icons and `/_next/static/` assets. It never runtime-caches page HTML, RSC responses, APIs, authentication, invoices, uploads or tenant/financial data. Navigation uses NetworkOnly with the Bangla offline fallback. New worker versions wait until the user accepts the update notice. No financial operation is queued offline.

## Working workflows

1. Sign in, open settings and enter real building and payment instructions.
2. Add flats, then add tenants with their rent, deposit and start date. One active tenant per flat is enforced by a database index. End tenancies explicitly to retain history.
3. Choose a billing month. Add utility amounts and select occupied flats. Equal, consumption-weighted and manually fixed allocations reconcile to the original amount. Upload JPEG/PNG bill copies when Cloudinary is configured.
4. Choose the partial-month policy, review the new invoice preview and confirm. A unique tenant/period index prevents duplicates. Existing invoices are not regenerated.
5. Open an invoice and download the Bengali PDF with original bill copies, or use Print / Save as PDF. Edit or copy its Bangla message and open WhatsApp. Attach downloaded PDFs manually; click-to-chat does not send attachments or confirm delivery.
6. Record full or partial payments. Transactions atomically save a payment and update the invoice. Corrections use explicit payment reversals.
7. View outstanding invoices, expenses, totals and export a CSV report.

## Validation

```powershell
npm test
npm run typecheck
npm run build
# With the production server running and Playwright Chromium installed:
node scripts/verify-pwa.mjs
# Verification script defaults to localhost:3107 (override the script for another port).
```

If needed set PLAYWRIGHT_CHROMIUM_EXECUTABLE to an existing Chromium executable. Browser screenshots are written to docs/screenshots. Device-emulated Safari guidance is not a real iPhone installation test. See docs/pwa-device-checklist.md for required physical device acceptance.

## Current scope and remaining work

The application implements the core private-building workflow and the PWA requested in section 25. Settings supports structured bKash/Nagad/bank payment accounts (method, number, optional note), shown on invoices, PDFs and the WhatsApp message alongside the free-text payment-instructions note. Remaining differences from the broader specification: editable persisted invoice drafts (current workflow previews then finalizes); dedicated rent/payment-history profile pages (records are available in their respective screens); stored default allocation rules; automatic discount/advance-credit ledgers; richer period-filtered chart/PDF reports; and official optional WhatsApp API integration. Invoice corrections are explicit adjustment entries. Rent updates are effective-dated and do not modify issued invoices. Building and itemized utility snapshots are stored in each new invoice. Utility splits are reviewed before saving; invoice confirmation rejects changed preview inputs. Invoice batches and payments use transactions.

Automated replica-set integration tests use a disposable database with synthetic records. Run `npm run test:integration` to repeat them; MongoDB binaries may download on the first run. Test screenshots explicitly use isolated test records. No test owner or tenant is seeded in production. Downloaded utility attachments through real Cloudinary still need account-backed acceptance testing.
Real database writes, private uploads, production HTTPS installation and physical Android/iPhone behavior require configured services and device testing. Do not treat untested financial workflows as production approved. No production deployment or external account has been provisioned by the source setup.
