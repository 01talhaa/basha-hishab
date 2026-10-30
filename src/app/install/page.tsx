import Link from 'next/link';
import {Install} from '@/components/install';
export default function Page(){return <main className="install-page"><Link className="brand" href="/dashboard"><img src="/icons/icon-192.png" width="44" height="44" alt=""/> বাসা হিসাব</Link><h1>আপনার ফোনে বাসা হিসাব</h1><p>অ্যাপ খুলতে বারবার ব্রাউজার খোঁজার প্রয়োজন নেই।</p><Install/><Link href="/dashboard" className="button">বাসা হিসাবে ফিরে যান</Link></main>}
