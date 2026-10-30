# Database schema

All monetary fields are integer paisa; dates without times are ISO date strings. Mongoose records timestamps.

| Collection | Principal fields / indexes |
| --- | --- |
| users | email unique, name, ownerId for administrators, bcrypt password, Owner/Administrator role, sessionVersion |
| flats | ownerId + number unique, floor, notes |
| tenants | name, phone, whatsapp, flat, rent, deposit, start/end, active, effective-dated rentChanges; unique flat where active |
| utilities | period, category, amount, allocation method, allocations, authenticated Cloudinary URL/public ID |
| invoices | tenant+period unique, tenant/flat/rent snapshot, utilities total, total, paid, due, payment instructions/building/itemized utility snapshots, append-only adjustments |
| payments | invoice, amount, method, date, reference, key unique, reversed |
| sharings | invoice unique, prepared/manually confirmed status, confirmation date |
| expenses | label, amount, category, date |
| settings | singleton key=building per owner, building/address/owner/phone/paymentInstructions/dueDay |
| rates | normalized account + time window unique, attempt count, expiry TTL |

Do not delete historical invoices or payments. Before first use verify unique indexes were created successfully in Atlas. Do not import unvalidated financial data directly.

All building/financial records have required immutable ownerId. The authenticated Owner uses their own user ID as the workspace ID; Administrator users reference that ID.
