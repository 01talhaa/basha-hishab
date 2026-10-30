import {notFound} from 'next/navigation';
import {Workspace} from '@/components/workspace';
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!['dashboard','flats','tenants','billing','payments','sharing','dues','expenses','reports','settings','guide'].includes(section))notFound();return <Workspace section={section}/>}
