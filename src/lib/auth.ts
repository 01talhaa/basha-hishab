import {cookies} from 'next/headers';
import {SignJWT,jwtVerify} from 'jose';
import {db} from './db';
import {User} from '@/models';
export const SESSION_SECONDS=60*60*24*90;
export const RENEW_AFTER_SECONDS=60*60*24;
function secret(){const s=process.env.AUTH_SECRET;if(!s||s.length<32)throw new Error('AUTH_SECRET কমপক্ষে ৩২ অক্ষরের হতে হবে।');return new TextEncoder().encode(s)}
export async function session(){try {const token=(await cookies()).get('bh-session')?.value;if(!token)return null;const {payload}=await jwtVerify(token,secret(),{algorithms:['HS256'],issuer:'bashahisab',audience:'family'});await db();const u=await User.findById(payload.sub);if(!u||u.sessionVersion!==payload.version)return null;const ownerId=u.role==='Owner'?String(u._id):u.ownerId?String(u.ownerId):null;if(!ownerId)return null;return {id:String(u._id),ownerId,role:u.role,version:u.sessionVersion,issuedAt:payload.iat||0,expiresAt:payload.exp||0}}catch{return null}}
export async function loginCookie(id:string,version:number){const token=await new SignJWT({version}).setProtectedHeader({alg:'HS256'}).setSubject(id).setIssuer('bashahisab').setAudience('family').setIssuedAt().setExpirationTime(`${SESSION_SECONDS}s`).sign(secret());(await cookies()).set('bh-session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:SESSION_SECONDS})}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return origin===new URL(req.url).origin||!!process.env.NEXT_PUBLIC_APP_URL&&origin===new URL(process.env.NEXT_PUBLIC_APP_URL).origin}
