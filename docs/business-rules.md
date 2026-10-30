# Business rules

All currency parsing rejects more than two decimals and unsafe totals. Equal and meter allocation use integer largest remainders, so the final sum equals the utility total. Custom allocations must reconcile exactly. Zero-use flats receive no meter allocation. Only selected occupied flats are offered in the utility UI. Utility records retain selected allocation shares.

Invoices select tenancy dates intersecting the billing month, including ended tenancies that overlap. Partial months require an explicit prorate/full/skip policy. Rent is snapshotted. Prior dues remain on original invoices; account outstanding totals sum each invoice exactly once instead of copying old balances into new bills. This avoids double-counting. Each tenant/period has one invoice. Confirmed bills are immutable through the existing API except for explicit appended positive adjustments and payment balance changes. Adjustments are currently API-only.

Payments must be positive and cannot exceed invoice outstanding. A unique idempotency key prevents replay of the same payment. Transactional writes prevent mismatched balances. Reversal records remain in history and restore outstanding once. Reversal is conditional on not already reversed.

Invoice confirmation hashes tenancy, utility, configuration and existing-invoice inputs; stale previews are rejected. Batch generation runs inside a replica-set transaction. Rent schedules use an effective billing month and preserve historical snapshots. Shared flat utilities are apportioned across month-overlapping tenancies by occupied days, reconciling integer remainder amounts.

Integration coverage includes authentication, active-flat uniqueness, multiple utilities, proration, duplicate invoices, stale preview rejection, partial/full/multiple payments, payment idempotency and reversal, effective-dated rent snapshots and PDF generation. Advance credits and persisted editable drafts remain outside the current workflow. See README for the remaining broader-specification differences.
