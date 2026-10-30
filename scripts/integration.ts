import {MongoMemoryReplSet} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {hash} from 'bcryptjs';
import {spawn} from 'node:child_process';
import {randomBytes,randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {User,Flat,Tenant,Invoice,Payment,Settings} from '../src/models';
import {mkdir} from 'node:fs/promises';
import {SignJWT} from 'jose';
async function main(){
const replica=await MongoMemoryReplSet.create({replSet:{count:1}});const uri=replica.getUri('bashahisab_test');await mongoose.connect(uri);await Promise.all([User,Flat,Tenant,Invoice,Payment,Settings].map(m=>m.init()));
const password=randomBytes(18).toString('hex');await User.create({email:'owner@test.invalid',password:await hash(password,12),role:'Owner'});
const authSecret=randomBytes(48).toString('hex');const base='http://localhost:3108';const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3108'],{env:{...process.env,MONGODB_URI:uri,AUTH_SECRET:authSecret,NEXT_PUBLIC_APP_URL:base},stdio:['ignore','pipe','pipe']});let browser:Awaited<ReturnType<typeof chromium.launch>>|undefined;
try{
 for(let i=0;i<80;i++){try{if((await fetch(base+'/login')).ok)break}catch{}await new Promise(r=>setTimeout(r,250))}
 const login=await fetch(base+'/api/auth',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({email:'owner@test.invalid',password})});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie')!.split(';')[0];assert.match(login.headers.get('set-cookie')!,/Max-Age=7776000/i);assert.match(login.headers.get('set-cookie')!,/HttpOnly/i);
 async function post(kind:string,data:unknown,ok=true){const r=await fetch(base+'/api/data/'+kind,{method:'POST',headers:{'Content-Type':'application/json',Origin:base,Cookie:cookie},body:JSON.stringify(data)});const d=await r.json();if(ok)assert.equal(r.status,200,JSON.stringify(d));else assert.equal(r.status,400,JSON.stringify(d));return d}
 async function get(kind:string){return (await(await fetch(base+'/api/data/'+kind,{headers:{Cookie:cookie}})).json()).items}
 await post('settings',{building:'পরীক্ষার বাসা',address:'শুধু স্বয়ংক্রিয় পরীক্ষার জন্য',owner:'পরীক্ষা',phone:'',paymentInstructions:'পরীক্ষামূলক নির্দেশনা',dueDay:10});
 const f=await post('flats',{number:'TEST-1',floor:'২'});await post('flats',{number:'TEST-1',floor:'২'},false);
 const t=await post('tenants',{name:'পরীক্ষার ভাড়াটিয়া',phone:'01700000000',whatsapp:'01700000000',flat:f._id,rent:'30000',deposit:'60000',start:'2026-10-16'});
 await post('tenants',{name:'দ্বিতীয় ভাড়াটিয়া',phone:'01700000001',whatsapp:'01700000001',flat:f._id,rent:'20000',deposit:'0',start:'2026-10-01'},false);
 await post('utilities',{period:'2026-10',category:'পানি',amount:'100',method:'equal',shares:[{flat:f._id,weight:1}]});
 await post('utilities',{period:'2026-10',category:'বিদ্যুৎ',amount:'200',method:'custom',shares:[{flat:f._id,weight:1,amount:'200'}]});
 await post('utilities',{period:'2026-10',category:'গ্যাস',amount:'100',method:'custom',shares:[{flat:f._id,weight:1,amount:'99'}]},false);
 const p=await post('billing',{period:'2026-10',confirm:false,partial:'prorate'});assert.equal(p.items[0].rent,1548387);assert.equal(p.items[0].utilities,30000);
 await post('billing',{period:'2026-10',confirm:true,partial:'prorate',previewHash:'stale'},false);
 await post('billing',{period:'2026-10',confirm:true,partial:'prorate',previewHash:p.previewHash});const inv=(await get('invoices'))[0];assert.equal(inv.total,1578387);
 const again=await post('billing',{period:'2026-10',confirm:false,partial:'prorate'});assert.equal(again.items.length,0);
 await post('billing',{period:'2026-10',confirm:true,partial:'prorate',previewHash:again.previewHash},false);
 const key=randomUUID();await post('payments',{invoice:inv._id,amount:'100',method:'cash',date:'2026-10-30',key});await post('payments',{invoice:inv._id,amount:'100',method:'cash',date:'2026-10-30',key},false);assert.equal((await get('invoices'))[0].paid,10000);
 const pay=(await get('payments'))[0];await post('reversal',{id:pay._id});await post('reversal',{id:pay._id},false);assert.equal((await get('invoices'))[0].paid,0);
 await post('payments',{invoice:inv._id,amount:'100',method:'cash',date:'2026-10-30',key:randomUUID()});await post('payments',{invoice:inv._id,amount:'15683.87',method:'cash',date:'2026-10-30',key:randomUUID()});assert.equal((await get('invoices'))[0].paid,inv.total);
 await post('payments',{invoice:inv._id,amount:'0.01',method:'cash',date:'2026-10-30',key:randomUUID()},false);
 await post('rent-change',{id:t._id,effective:'2026-11',amount:'32000'});assert.equal((await get('invoices'))[0].rent,inv.rent);const nov=await post('billing',{period:'2026-11',confirm:false,partial:'prorate'});assert.equal(nov.items[0].rent,3200000);
 const pdf=await fetch(base+'/api/document/'+inv._id,{headers:{Cookie:cookie}});assert.equal(pdf.status,200);assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0,4).toString(),'%PDF');
 // Public signup must create an independent owner, ignoring injected role/owner fields.
 async function auth(body:unknown,authCookie?:string){return fetch(base+'/api/auth',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,...(authCookie?{Cookie:authCookie}:{})},body:JSON.stringify(body)})}
 const second=await auth({action:'signup',name:'নতুন মালিক',email:'  Second@Test.Invalid  ',password,confirmPassword:password,role:'Administrator',ownerId:t.ownerId});assert.equal(second.status,201);const cookie2=second.headers.get('set-cookie')!.split(';')[0];const owner2=await User.findOne({email:'second@test.invalid'});assert.equal(owner2.role,'Owner');
 assert.equal((await auth({action:'signup',name:'একই ইমেইল',email:'second@test.invalid',password,confirmPassword:password})).status,409);
 assert.equal((await auth({action:'signup',name:'ভুল পাসওয়ার্ড',email:'bad@test.invalid',password,confirmPassword:'mismatch'})).status,400);
 async function other(kind:string,body?:unknown){return fetch(base+'/api/data/'+kind,{method:body?'POST':'GET',headers:{Cookie:cookie2,...(body?{'Content-Type':'application/json',Origin:base}:{})},...(body?{body:JSON.stringify(body)}:{})})}
 for(const kind of ['flats','tenants','invoices','payments','expenses','settings','utilities','shares'])assert.equal((await(await other(kind)).json()).items.length,0,kind+' leaked between owners');
 const ownFlat=await other('flats',{number:'TEST-1',floor:'৩',ownerId:t.ownerId});assert.equal(ownFlat.status,200);assert.equal((await ownFlat.json()).ownerId,String(owner2._id));
 assert.equal((await other('tenants',{name:'অন্যের ফ্ল্যাট',phone:'01700000002',whatsapp:'01700000002',flat:f._id,rent:'10',deposit:'0',start:'2026-10-01'})).status,400);
 assert.equal((await other('payments',{invoice:inv._id,amount:'1',method:'cash',date:'2026-10-30',key:randomUUID()})).status,400);
 assert.notEqual((await fetch(base+'/api/document/'+inv._id,{headers:{Cookie:cookie2}})).status,200);
 assert.notEqual((await fetch(base+'/api/document/'+pay._id+'?kind=receipt',{headers:{Cookie:cookie2}})).status,200);
 await other('flat-edit',{id:f._id,number:'HACKED',floor:'0'});await other('flat-delete',{id:f._id});assert.equal((await Flat.findById(f._id)).number,'TEST-1');
 const setting=await other('settings',{building:'দ্বিতীয় বাসা',address:'',owner:'দ্বিতীয় মালিক',phone:'',paymentInstructions:'',dueDay:12});assert.equal(setting.status,200);assert.equal((await get('settings'))[0].building,'পরীক্ষার বাসা');
 const oldOwner=await User.findOne({email:'owner@test.invalid'});const now=Math.floor(Date.now()/1000);const oldToken=await new SignJWT({version:0}).setProtectedHeader({alg:'HS256'}).setSubject(String(oldOwner._id)).setIssuer('bashahisab').setAudience('family').setIssuedAt(now-10*86400).setExpirationTime(now+80*86400).sign(new TextEncoder().encode(authSecret));
 const refreshed=await auth({action:'refresh'},'bh-session='+oldToken);assert.equal(refreshed.status,200);assert.match(refreshed.headers.get('set-cookie')!,/Max-Age=7776000/i);
 const changed=await auth({action:'password',old:password,password:password+'a'},cookie2);assert.equal(changed.status,200);const newCookie=changed.headers.get('set-cookie')!.split(';')[0];assert.equal((await auth({action:'refresh'},cookie2)).status,401);assert.equal((await auth({action:'refresh'},newCookie)).status,200);
 const loggedOut=await auth({action:'logout'},newCookie);assert.match(loggedOut.headers.get('set-cookie')!,/expires=Thu, 01 Jan 1970/i);
 browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});const context=await browser.newContext({viewport:{width:1440,height:1050}});await context.addCookies([{name:'bh-session',value:cookie.split('=')[1],domain:'localhost',path:'/',httpOnly:true,secure:true,sameSite:'Lax'}]);const page=await context.newPage();await page.goto(base+'/dashboard');await page.getByText('পরীক্ষার বাসা').count();await page.getByRole('heading',{name:'সব হিসাব, এক নজরে'}).waitFor();await page.getByText('মোট সংগ্রহ',{exact:true}).waitFor();await mkdir('docs/screenshots',{recursive:true});await page.screenshot({path:'docs/screenshots/dashboard-test-desktop.png',fullPage:true,animations:'disabled'});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/screenshots/dashboard-test-mobile.png',fullPage:true,animations:'disabled'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const signupPage=await browser.newPage({viewport:{width:390,height:844}});await signupPage.goto(base+'/signup');await signupPage.getByRole('heading',{name:'মালিকের অ্যাকাউন্ট খুলুন'}).waitFor();assert(await signupPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await signupPage.screenshot({path:'docs/screenshots/signup-mobile.png',fullPage:true,animations:'disabled'});await signupPage.close();await page.goto(base+'/login');await page.waitForURL('**/dashboard');
for(const route of ['flats','tenants','billing','payments','dues','expenses','reports','settings','sharing']){await page.goto(base+'/'+route);await page.getByRole('heading',{level:1}).waitFor();await page.locator('.loading').waitFor({state:'hidden'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow on '+route)}
console.log('PASS: real isolated replica-set tests: authentication, uniqueness, tenancy overlap/proration, utility reconciliation, immutable rent, duplicate invoices, stale preview, partial/full/multiple payments, idempotency, reversals, PDF generation, dashboard mobile overflow. Public signup, duplicate email, owner isolation, forged ownership, private PDF isolation, 90-day cookie, 10-day session renewal, password revocation, logout and mobile signup also passed. Test database is destroyed on exit.');
}finally{await browser?.close();server.kill();await mongoose.disconnect();await replica.stop()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
