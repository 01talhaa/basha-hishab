# Physical device acceptance (pending)

These checks must run on the real HTTPS Vercel production origin. Headless tests cannot confirm OS installation or splash behavior.

- Android Chrome: sign in, open dashboard install option, accept native prompt, confirm icon, standalone launch, splash, and correct scope. Dismiss prompt and check the fallback instructions. Test Chrome menu installation when the event is unavailable.
- iPhone Safari: open the installation guide, Share → Add to Home Screen → Add. Enable Open as Web App where available. Launch the icon and confirm standalone status, splash, and no redundant install prompt. Check portrait and landscape.
- Bookmark-only flow: verify the UI never reports success without an appinstalled signal or actual standalone mode.
- Offline: after one online load, disable network and open a protected URL. Only the Bangla offline screen should appear. Financial actions must not queue. Reconnect and retry.
- Cache Storage: confirm only offline.html, public icons and /_next/static assets exist. No tenant, invoice, payment, auth, API, page HTML, RSC or bill-copy response may appear.
- Mobile forms: add tenant, select flat, preview bill, record partial payment, close dialogs, rotate device, use navigation and keyboard at 320–430 CSS pixel widths. Check no clipped actions and adequate touch targets.
- Update: deploy a new build, confirm the update notice, save unfinished forms, accept update, and verify the new worker activates.

Record device model, OS/browser version, deployment URL, date and results. Physical device status: NOT TESTED.
