import {redirect} from 'next/navigation';
import {session} from '@/lib/auth';
import SignupForm from '@/components/signup-form';
export const dynamic='force-dynamic';
export default async function Page(){if(await session())redirect('/dashboard');return <SignupForm/>}
