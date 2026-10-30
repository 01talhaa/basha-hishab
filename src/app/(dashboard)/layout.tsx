import {redirect} from 'next/navigation';
import {session} from '@/lib/auth';
import {SessionKeeper} from '@/components/session-keeper';
import {Shell} from '@/components/shell';
export const dynamic='force-dynamic';
export default async function Layout({children}:{children:React.ReactNode}){if(!await session())redirect('/login');return <Shell><SessionKeeper/>{children}</Shell>}
