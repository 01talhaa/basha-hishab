import {redirect} from 'next/navigation';
import {session} from '@/lib/auth';
import LoginForm from '@/components/login-form';
export const dynamic='force-dynamic';
export default async function Page(){if(await session())redirect('/dashboard');return <LoginForm/>}
