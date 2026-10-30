import {test} from 'node:test';
import assert from 'node:assert/strict';
import {rentForMonth,periodDays,paymentBalance} from '../src/lib/billing';
test('partial month requires an explicit policy',()=>{assert.equal(rentForMonth(3100000,'2026-10-16',undefined,'2026-10','prorate'),1600000);assert.equal(rentForMonth(3100000,'2026-10-16',undefined,'2026-10','full'),3100000);assert.equal(rentForMonth(3100000,'2026-10-16',undefined,'2026-10','skip'),null)});
test('tenancy overlap and leap years',()=>{assert.equal(periodDays('2028-02'),29);assert.equal(periodDays('2026-02'),28);assert.equal(rentForMonth(10000,'2026-11-01',undefined,'2026-10','full'),null);assert.equal(rentForMonth(10000,'2025-01-01','2026-09-30','2026-10','full'),null);assert.equal(rentForMonth(3100000,'2025-01-01','2026-10-10','2026-10','prorate'),1000000)});
test('full, partial and multiple payment balances',()=>{const a=paymentBalance(100000,0,25000);assert.deepEqual(a,{paid:25000,due:75000});const b=paymentBalance(100000,a.paid,75000);assert.deepEqual(b,{paid:100000,due:0});assert.throws(()=>paymentBalance(100000,b.paid,1));assert.throws(()=>paymentBalance(100000,0,0))});
