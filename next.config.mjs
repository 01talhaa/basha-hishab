import withSerwistInit from '@serwist/next';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
const revision=createHash('sha256').update(readFileSync('public/offline.html')).digest('hex');
const withSerwist=withSerwistInit({swSrc:'src/app/sw.ts',swDest:'public/sw.js',disable:process.env.NODE_ENV!=='production',register:true,cacheOnNavigation:false,additionalPrecacheEntries:[{url:'/offline.html',revision},{url:'/icons/icon-192.png',revision:createHash('sha256').update(readFileSync('public/icons/icon-192.png')).digest('hex')}],exclude:[/.*/]});
export default withSerwist({poweredByHeader:false,outputFileTracingIncludes:{"/api/document/*":["./public/fonts/**"]},async headers(){return [{source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'same-origin'},{key:'X-Frame-Options',value:'DENY'}]},{source:'/api/:path*',headers:[{key:'Cache-Control',value:'private, no-store, max-age=0'}]},{source:'/sw.js',headers:[{key:'Cache-Control',value:'no-cache, no-store, must-revalidate'},{key:'Service-Worker-Allowed',value:'/'}]}]}});
