import {test} from 'node:test';
import assert from 'node:assert/strict';
import {paisa,allocate,invoiceTotal} from '../src/lib/money';
test('decimal amounts use integer paisa',()=>{assert.equal(paisa('123.45'),12345);assert.equal(paisa('0.10')+paisa('0.20'),30);assert.throws(()=>paisa('1.001'));assert.throws(()=>paisa('-1'))});
test('equal allocation reconciles leftover paisa',()=>{assert.deepEqual(allocate(100,[1,1,1]),[34,33,33])});
test('meter allocation includes zero consumption without charging it',()=>{assert.deepEqual(allocate(1001,[0,1,2]),[0,334,667]);assert.throws(()=>allocate(100,[0,0]))});
test('weighted allocations always reconcile',()=>{for(let n=0;n<5000;n+=7)assert.equal(allocate(n,[1,3,7,0]).reduce((a,b)=>a+b,0),n)});
test('invalid discounts rejected',()=>{assert.equal(invoiceTotal(1000000,10000,2000),1008000);assert.throws(()=>invoiceTotal(100,0,101))});
