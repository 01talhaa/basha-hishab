'use client';
import type {ComponentType} from 'react';
import {LayoutDashboard,Building2,Users,Plus,Receipt,Wallet,Clock,Check,Download,Mic,MessageCircle,Zap,Scale,CalendarCheck,ChartNoAxesCombined} from 'lucide-react';
type Step={icon:ComponentType<{size?:number}>;text:string};
type Topic={icon:ComponentType<{size?:number}>;title:string;steps:Step[]};
const topics:Topic[]=[
  {icon:LayoutDashboard,title:'অ্যাপটি কীভাবে কাজ করে',steps:[
    {icon:LayoutDashboard,text:'বাম পাশের (মোবাইলে নিচের) মেনুতে আইকন দেখে কাজ বেছে নিন। প্রতিটি আইকনের নিজস্ব অর্থ আছে, যেমন বাড়ি মানে ফ্ল্যাট, মানুষ মানে ভাড়াটিয়া।'},
{icon:Check,text:'সবুজ রং ও ✓ চিহ্ন মানে কাজ সম্পন্ন হয়েছে। হলুদ রং মানে আংশিক। লাল/ঘড়ির চিহ্ন মানে এখনো বাকি আছে।'},
  ]},
  {icon:Building2,title:'ফ্ল্যাট ও ভাড়াটিয়া যোগ করা',steps:[
    {icon:Plus,text:'"বিল্ডিং ও ফ্ল্যাট" মেনুতে গিয়ে "ফ্ল্যাট যোগ করুন" চাপুন। ফ্ল্যাট নম্বর ও তলা লিখে সংরক্ষণ করুন।'},
    {icon:Users,text:'"ভাড়াটিয়া" মেনুতে গিয়ে "ভাড়াটিয়া যোগ করুন" চাপুন। একবারে একটি করে তথ্য জিজ্ঞেস করা হবে।'},
    {icon:Building2,text:'ছবির মতো দেখানো ফ্ল্যাটগুলো থেকে কোনটিতে ভাড়াটিয়া থাকবেন, চেপে বেছে নিন।'},
    {icon:Wallet,text:'মাসিক ভাড়া ও জামানতের পরিমাণ লিখুন। নিচের "+" বোতাম চেপেও সহজে টাকা যোগ করতে পারবেন।'},
    {icon:Check,text:'সব তথ্য একসাথে দেখে, ঠিক থাকলে "নিশ্চিত করে সংরক্ষণ করুন" চাপুন।'},
  ]},
  {icon:Receipt,title:'মাসিক বিল তৈরি করা',steps:[
    {icon:Plus,text:'"মাসিক বিল তৈরি" মেনুতে গিয়ে "ইউটিলিটি যোগ করুন" চাপুন।'},
    {icon:Zap,text:'কোন খাতের বিল তা আইকন দেখে বেছে নিন — বিদ্যুৎ, পানি, গ্যাস, ইন্টারনেট ইত্যাদি।'},
    {icon:Wallet,text:'মোট বিলের পরিমাণ লিখুন। তারপর কোন ফ্ল্যাটে এই বিল প্রযোজ্য, ফ্ল্যাট ছবিতে চেপে বেছে নিন।'},
    {icon:Scale,text:'বিলটি কীভাবে ভাগ হবে বেছে নিন — সবার সমান, মিটার অনুযায়ী, অথবা নিজে ঠিক করে দিন।'},
    {icon:Check,text:'ভাগের হিসাব দেখে সংরক্ষণ করুন। তারপর "মাসিক বিল তৈরি" পর্দায় "হিসাব দেখুন" চেপে সবার ভাড়ার বিল একসাথে তৈরি করে নিশ্চিত করুন।'},
  ]},
  {icon:MessageCircle,title:'বিল পাঠানো (হোয়াটসঅ্যাপ)',steps:[
    {icon:Receipt,text:'"বিল পাঠান" মেনুতে গিয়ে কোন ভাড়াটিয়ার বিল পাঠাবেন, বেছে নিন।'},
    {icon:Download,text:'পিডিএফ বিল ডাউনলোড করুন।'},
    {icon:Mic,text:'চাইলে মাইক বোতামে চেপে একটি কথ্য (ভয়েস) বার্তাও রেকর্ড করে রাখতে পারেন।'},
    {icon:MessageCircle,text:'"হোয়াটসঅ্যাপে খুলুন" চাপুন, তারপর ডাউনলোড করা পিডিএফ ও ভয়েস বার্তা সংযুক্ত করে পাঠান।'},
    {icon:Check,text:'ভাড়াটিয়া বিলটি পেয়েছেন নিশ্চিত হলে "পৌঁছেছে নিশ্চিত করুন" চাপুন।'},
  ]},
  {icon:Wallet,title:'পেমেন্ট নেওয়া',steps:[
    {icon:Receipt,text:'যে কোনো বিলের ভেতরে গিয়ে "পেমেন্ট নিন" চাপুন।'},
    {icon:Check,text:'"সম্পূর্ণ বাকি", "অর্ধেক", অথবা "নিজে লিখুন" — এই তিনটির একটি চেপে বেছে নিন।'},
    {icon:CalendarCheck,text:'টাকা পাওয়ার তারিখ ও মাধ্যম (নগদ টাকা, বিকাশ, Nagad বা ব্যাংক) বেছে নিন।'},
    {icon:Check,text:'"পেমেন্ট সংরক্ষণ করুন" চাপুন। বিলের বাকি টাকা নিজে থেকেই হিসাব হয়ে যাবে।'},
  ]},
  {icon:Clock,title:'বকেয়া ও রিপোর্ট দেখা',steps:[
    {icon:Clock,text:'"বকেয়া" মেনুতে গিয়ে কার কত টাকা বাকি আছে, তালিকায় দেখুন।'},
    {icon:ChartNoAxesCombined,text:'"রিপোর্ট" মেনুতে মাস অনুযায়ী মোট বিল, সংগ্রহ, বকেয়া ও ব্যয় একসাথে দেখুন।'},
    {icon:Download,text:'প্রয়োজনে "সিএসভি ডাউনলোড" চেপে পুরো হিসাব ফাইল আকারে নিয়ে নিন।'},
  ]},
];
export function Guide(){
  return <div className="guide">{topics.map((t,i)=>{
    const Icon=t.icon;
    return <section className="card guide-topic" key={i}>
      <div className="section-title">
        <div className="icon-heading"><Icon size={22}/><h2>{t.title}</h2></div>
      </div>
      <div className="guide-steps">{t.steps.map((s,j)=>{
        const SIcon=s.icon;
        return <div className="guide-step" key={j}>
          <span className="guide-step-num">{j+1}</span>
          <span className="guide-step-icon"><SIcon size={20}/></span>
          <p>{s.text}</p>
        </div>;
      })}</div>
    </section>;
  })}</div>;
}
