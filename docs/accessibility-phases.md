# Low-literacy accessibility redesign — phases

Goal: every feature usable by someone who cannot read Bangla text fluently, by
leaning on icons, photos, color, large tap targets, and spoken audio instead
of relying on reading dense forms and tables.

Principles applied in every phase (see README conversation for full rationale):
icon/photo over text label; one decision per screen; color+icon for status,
never text alone; big tap targets (50px+); consistent icon↔concept mapping;
confirmations shown with a picture and a number, not a sentence.

**Update:** the text-to-speech "শুনুন" (listen) feature described in Phases 1,
4 and 7 below was removed entirely per explicit user request — `speak()`,
`speak-button.tsx`, and every call site (dashboard, invoice dialog, guide
page) are gone. The phase write-ups below are left as a historical record of
what each phase originally shipped; treat any "শুনুন"/speak mention in them
as no longer present in the app. The voice-note *recorder* in Phase 5 (for
attaching a recorded message to WhatsApp) is unrelated and was kept.

Each phase ships a working, demoable slice. Later phases build on earlier
ones; none require reverting prior work.

## Phase 1 — Foundation, navigation, dashboard home
**Status: done**
- `src/lib/speech.ts` — `speak()`/`stopSpeaking()` wrapper over the Web Speech
  API (bn-BD), no backend needed.
- `src/components/ui/speak-button.tsx` — reusable "শুনুন" (listen) icon button.
- `globals.css` — bigger tap targets everywhere (buttons/inputs 46px→50px,
  icon buttons 44px→48px); larger nav icons/text in the sidebar and the
  mobile bottom nav; bigger dashboard stat tiles and quick-action icons.
- `shell.tsx` — larger nav icons and label text.
- `workspace.tsx` (dashboard section only) — "শুনুন" button next to the
  welcome heading that reads the day's summary aloud; enlarged stat numerals
  and quick-action icons.

## Phase 2 — Flats & tenants
**Status: done**
- Replace the flat `<select>` in the tenant form with a visual flat-picker:
  tap a flat card (icon + number + vacant/occupied color), not a dropdown
  that must be read.
- Tenant list: lead with a big colored initial-avatar and name, bigger rent
  number, a colored dot + icon for active/previous instead of a text-only
  badge.
- Flat cards: bigger occupied/vacant color block, bigger edit/delete icon
  buttons.

## Phase 3 — Billing wizard
**Status: done**
- Break the current two-dense-card billing flow and the single long
  `UtilityForm` into a step wizard, one decision per screen:
  1. Pick a utility category from icon tiles (electricity/water/gas/...).
  2. Enter the amount (big numeric input, Bangla numerals).
  3. Pick affected flats by tapping flat cards (reuse Phase 2's picker).
  4. Pick split method from 3 big icon options (equal / meter / custom)
     instead of a `<select>`.
  5. Review a big, icon-led preview; one big confirm button.
- Partial-month policy becomes 3 icon choices instead of a `<select>`.

## Phase 4 — Invoices, payments & dues
**Status: done**
- "শুনুন" button on the invoice dialog that reads the bill aloud (amount,
  due date, what's owed).
- Status shown as a big colored icon + amount (paid/partial/unpaid), not a
  small text badge.
- Payment entry: quick preset buttons ("পুরো টাকা" / "অর্ধেক" / custom),
  big numeric keypad-style input instead of a plain number field.
  Shipped as a contextual "পেমেন্ট নিন" section directly inside the invoice
  dialog (`PaymentQuickForm`), not the generic Payments-tab form — the due
  amount is already known there, so the presets need no cross-field
  watching. The original dropdown-based Payments-tab form is left
  unchanged for bulk/historical entry.

## Phase 5 — Sharing / WhatsApp
**Status: done**
- Optional voice-note recording (MediaRecorder) attached alongside the
  Bangla text message, for tenants who will listen rather than read.
- Bigger, single primary "পাঠান" call-to-action; delivery status as a big
  icon, not just a badge word.

## Phase 6 — Expenses, reports, settings
**Status: done (light touch, as scoped)**
- Lower priority: these screens are owner-only and already text-form-heavy
  by nature (bulk data entry). Apply icon-grouped sections and bigger tap
  targets, but keep tables/forms — a full visual redesign here has the
  least payoff per effort.
- Shipped: icon-grouped headers (expenses, reports, and the two main
  settings cards) via a reusable `.icon-heading` wrapper. Tables/forms left
  as-is per the above rationale; Phase 1's global tap-target bump already
  covers this screen's buttons/inputs.

## Phase 7 — Guided tenant onboarding, quick-amount entry, in-app tutorial
**Status: done**
- `src/components/tenant-wizard.tsx` — "Add tenant" is now an 8-step wizard
  (name → phone → WhatsApp, with a "same as phone" shortcut → flat picker →
  rent → deposit, with "equal to rent" / "double rent" shortcuts → start
  date → review & confirm), replacing the old 6-fields-at-once form. Tenant
  *editing* still uses the plain form — only onboarding (the hardest, most
  decision-heavy flow) got the wizard treatment.
- `src/components/ui/amount-stepper.tsx` — a number input paired with
  "+100/+500/+1000/+5000" tap-to-add chips, used for the utility-bill amount
  and the tenant wizard's rent/deposit steps, so entering round amounts
  needs taps instead of typing full numbers from scratch.
- `src/components/guide.tsx` + a new "কীভাবে ব্যবহার করবেন" nav entry
  (route `/guide`, reachable anytime from the sidebar/menu, independent of
  whether data is still loading) — a visual, numbered step-by-step tutorial
  for every workflow (navigation basics, adding flats/tenants, creating a
  monthly bill, sending it on WhatsApp, taking a payment, checking dues/
  reports). Each topic's icons intentionally match the icons used in the
  real screens it explains, and every topic has a "শুনুন" button that reads
  the whole topic aloud.

## Acceptance check per phase
`npm run typecheck` and `npm run build` must pass; manually click through the
touched section in the dev server at each phase before moving on.
