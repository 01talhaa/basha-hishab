import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {existsSync,mkdirSync} from 'node:fs';
const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
mkdirSync('docs/screenshots',{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3107/install');await page.getByRole('heading',{name:'আপনার ফোনে বাসা হিসাব'}).waitFor();
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();
 const manifest=await (await page.request.get('http://localhost:3107/manifest.webmanifest')).json();assert.equal(manifest.display,'standalone');assert.equal(manifest.lang,'bn-BD');assert.equal(manifest.theme_color,'#3730a3');
 for(const icon of manifest.icons){const r=await page.request.get('http://localhost:3107'+icon.src);assert.equal(r.status(),200)}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'mobile layout must not overflow');
 await page.screenshot({path:'docs/screenshots/install-mobile.png',fullPage:true});
 await page.goto('http://localhost:3107/login');await page.getByRole('heading',{name:'স্বাগতম'}).waitFor();await page.screenshot({path:'docs/screenshots/login-mobile.png',fullPage:true});
 const auth=await page.request.get('http://localhost:3107/api/data/tenants');assert.equal(auth.status(),401);assert.match(auth.headers()['cache-control'],/no-store/);
 await context.setOffline(true);await page.goto('http://localhost:3107/dashboard');await page.getByRole('heading',{name:'আবার সংযোগ হলেই দেখা হবে'}).waitFor();await page.screenshot({path:'docs/screenshots/offline-mobile.png',fullPage:true});
 await context.setOffline(false);await page.goto('http://localhost:3107/install');
 const keys=await page.evaluate(async()=>{const result=[];for(const name of await caches.keys()){for(const r of await(await caches.open(name)).keys())result.push(new URL(r.url).pathname)}return result});
 assert(keys.includes('/offline.html'));assert(keys.every(p=>p==='/offline.html'||p.startsWith('/icons/')||p.startsWith('/_next/static/')),'cache must contain public assets only');
 // A plain browser bookmark creates no appinstalled signal and must not show success.
 assert.equal(await page.getByText('ইনস্টল হয়েছে। হোম স্ক্রিনের আইকন থেকে খুলুন।').count(),0);
 const ios=await browser.newContext({viewport:{width:390,height:844},userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'});const iphone=await ios.newPage();await iphone.goto('http://localhost:3107/install');await iphone.getByRole('heading',{name:'আইফোনে যেভাবে ইনস্টল করবেন'}).waitFor();
 const standalone=await browser.newContext();await standalone.addInitScript(()=>Object.defineProperty(navigator,'standalone',{value:true}));const app=await standalone.newPage();await app.goto('http://localhost:3107/install');await app.getByText('ইনস্টল করা অ্যাপ হিসেবে চলছে।').waitFor();assert.equal(await app.getByRole('button',{name:'ইনস্টল করার নিয়ম'}).count(),0);
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://localhost:3107/login');await page.screenshot({path:'docs/screenshots/login-desktop.png',fullPage:true});assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: manifest, icons, mobile overflow, production worker, offline navigation, private API protection, public-only cache, Safari guide, standalone state, screenshots.');console.log('Cache paths:',keys);
}finally{await browser.close()}
