import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {compare,hash} from 'bcryptjs';
import {z} from 'zod';
import {createHash} from 'node:crypto';
import {db} from '@/lib/db';
import {User,Rate} from '@/models';
import {loginCookie,sameOrigin,session,RENEW_AFTER_SECONDS,SESSION_SECONDS} from '@/lib/auth';
const email=z.string().trim().toLowerCase().max(254).pipe(z.email());
const password=z.string().min(12).max(72).refine(v=>Buffer.byteLength(v,'utf8')<=72);
async function limit(key:string,max:number){const window=Math.floor(Date.now()/900000);const record=await Rate.findOneAndUpdate({key:`${key}:${window}`},{$inc:{count:1},$setOnInsert:{expires:new Date(Date.now()+900000)}},{upsert:true,new:true});return record.count<=max}
export async function POST(req:Request){try{
 if(!sameOrigin(req))return NextResponse.json({error:'অনুমতি নেই।'},{status:403});
 await db();const data=await req.json();
 if(data.action==='logout'){(await cookies()).delete('bh-session');return NextResponse.json({ok:true})}
 if(data.action==='refresh'){const s=await session();if(!s)return NextResponse.json({error:'আবার প্রবেশ করুন।'},{status:401});if(Date.now()/1000-s.issuedAt>=RENEW_AFTER_SECONDS||s.expiresAt-Date.now()/1000<SESSION_SECONDS-RENEW_AFTER_SECONDS)await loginCookie(s.id,s.version);return NextResponse.json({ok:true})}
 if(data.action==='password'){const s=await session();if(!s)return NextResponse.json({error:'আবার প্রবেশ করুন।'},{status:401});const v=z.object({old:z.string().max(72),password}).parse(data);if(!await limit('password:'+s.id,10))return NextResponse.json({error:'কিছুক্ষণ পর আবার চেষ্টা করুন।'},{status:429});const u=await User.findById(s.id);if(!await compare(v.old,u.password))return NextResponse.json({error:'বর্তমান পাসওয়ার্ড সঠিক নয়।'},{status:400});u.password=await hash(v.password,12);u.sessionVersion++;await u.save();await loginCookie(String(u._id),u.sessionVersion);return NextResponse.json({ok:true})}
 if(data.action==='signup'){
  const v=z.object({name:z.string().trim().min(2).max(100),email,password,confirmPassword:z.string()}).refine(v=>v.password===v.confirmPassword).parse(data);
  const ip=req.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim()||'local';const ipKey=createHash('sha256').update(ip).digest('hex');
  if(!await limit('signup-ip:'+ipKey,10)||!await limit('signup-email:'+v.email,5))return NextResponse.json({error:'অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।'},{status:429});
  if(await User.exists({email:v.email}))return NextResponse.json({error:'এই ইমেইলে অ্যাকাউন্ট আছে। প্রবেশ করুন।'},{status:409});
  const u=await User.create({name:v.name,email:v.email,password:await hash(v.password,12),role:'Owner'});
  await loginCookie(String(u._id),u.sessionVersion);return NextResponse.json({ok:true},{status:201});
 }
 const v=z.object({email,password:z.string().min(1).max(72)}).parse(data);
 if(!await limit('login:'+v.email,10))return NextResponse.json({error:'কিছুক্ষণ পর আবার চেষ্টা করুন।'},{status:429});
 const u=await User.findOne({email:v.email});if(!u||!await compare(v.password,u.password))return NextResponse.json({error:'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।'},{status:401});
 await loginCookie(String(u._id),u.sessionVersion);return NextResponse.json({ok:true});
}catch(e){const duplicate=!!e&&typeof e==='object'&&'code'in e&&e.code===11000;return NextResponse.json({error:duplicate?'এই ইমেইলে অ্যাকাউন্ট আছে। প্রবেশ করুন।':e instanceof z.ZodError?'তথ্য ঠিকভাবে পূরণ করুন। পাসওয়ার্ড কমপক্ষে ১২ অক্ষরের হতে হবে এবং দুইবার একই হতে হবে।':'কাজটি সম্পন্ন হয়নি। সংযোগ ও দেওয়া তথ্য পরীক্ষা করুন।'},{status:duplicate?409:400})}}
