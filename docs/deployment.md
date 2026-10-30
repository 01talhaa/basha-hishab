# Vercel deployment

Import this directory into a private Git repository, then create a Vercel project with Next.js detected. Use Node 22, install `npm ci`, build `npm run build`. Add MONGODB_URI, AUTH_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET and NEXT_PUBLIC_APP_URL as environment variables. Set NEXT_PUBLIC_APP_URL to the exact HTTPS production origin. Never add a NEXT_PUBLIC prefix to secrets. Redeploy after environment changes.

Owners register through /signup. Existing single-family databases need the owner-index migration described in README before public signup. Verify MongoDB indexes and connection allowlists. Cloudinary uses authenticated upload delivery; do not make private originals public just to obtain downloadable URLs. The authenticated /api/document/[id] route provides private bill downloads and combined invoice PDFs. Confirm real Cloudinary downloads before financial release.

Check production /manifest.webmanifest, /sw.js, /icons/icon-192.png, /icons/icon-512.png and /install. The worker must have JavaScript MIME, no-cache headers and root scope. Do not configure a CDN to cache protected HTML or `/api/*`. Keep Vercel preview deployment protection in mind: authentication gates may interfere with installation; test the canonical production domain over HTTPS. Localhost is accepted for desktop development but a plain HTTP LAN address is not a substitute for production HTTPS testing.

No Vercel project/domain, database or Cloudinary account has been created automatically. Actual deployment requires the owner's accounts and secrets. Follow the physical device checklist before claiming installation works on both platforms.
