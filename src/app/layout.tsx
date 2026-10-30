import type {Metadata,Viewport} from 'next';
import '@fontsource/noto-sans-bengali/400.css';
import '@fontsource/noto-sans-bengali/500.css';
import '@fontsource/noto-sans-bengali/600.css';
import '@fontsource/noto-sans-bengali/700.css';
import './globals.css';
import {Toaster} from 'sonner';
import splash from '@/lib/splash.json';
import {PwaLifecycle} from '@/components/pwa-lifecycle';
export const metadata:Metadata={title:{default:'বাসা হিসাব',template:'%s • বাসা হিসাব'},description:'পরিবারের ভবনের সব হিসাব, এক জায়গায়।',applicationName:'BashaHisab',appleWebApp:{startupImage:splash,capable:true,title:'বাসা হিসাব',statusBarStyle:'default'},icons:{apple:'/icons/apple-touch-icon.png',icon:'/icons/icon-192.png'},manifest:'/manifest.webmanifest'};
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#3730a3'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="bn"><body>{children}<PwaLifecycle/><Toaster richColors position="top-center"/></body></html>}
