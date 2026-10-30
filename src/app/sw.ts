/// <reference lib="webworker" />
import {Serwist,CacheFirst,ExpirationPlugin,NetworkOnly} from 'serwist';
import type {PrecacheEntry,SerwistGlobalConfig} from 'serwist';
declare global {interface WorkerGlobalScope extends SerwistGlobalConfig {__SW_MANIFEST:(PrecacheEntry|string)[]|undefined}}
declare const self:ServiceWorkerGlobalScope;
// No default runtime cache: it would include navigations, RSC and API responses.
const sw=new Serwist({precacheEntries:self.__SW_MANIFEST,skipWaiting:false,clientsClaim:true,navigationPreload:true,runtimeCaching:[{matcher:({request})=>request.mode==='navigate',handler:new NetworkOnly()}, {matcher:({url,request})=>url.origin===self.location.origin&&request.method==='GET'&&(url.pathname.startsWith('/_next/static/')||/^\/icons\/[^/]+\.(png|svg)$/.test(url.pathname)),handler:new CacheFirst({cacheName:'bashahisab-public-v1',plugins:[new ExpirationPlugin({maxEntries:150,maxAgeSeconds:2592000})]})}],fallbacks:{entries:[{url:'/offline.html',matcher:({request})=>request.mode==='navigate'}]}});
sw.addEventListeners();
