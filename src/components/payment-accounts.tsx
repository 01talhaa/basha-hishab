'use client';
import {useState} from 'react';
import {toast} from 'sonner';
import {Plus,Trash2,Smartphone,Landmark,Wallet,Check} from 'lucide-react';
import {Button} from './ui/button';
import {ChoicePicker} from './ui/choice-picker';
type Method='bkash'|'nagad'|'bank'|'other';
type Account={method:Method;number:string;label?:string};
const methodChoices:{value:Method;label:string;icon:typeof Smartphone}[]=[
  {value:'bkash',label:'বিকাশ',icon:Smartphone},
  {value:'nagad',label:'নগদ',icon:Smartphone},
  {value:'bank',label:'ব্যাংক',icon:Landmark},
  {value:'other',label:'অন্যান্য',icon:Wallet},
];
export const methodLabel:Record<string,string>={bkash:'বিকাশ',nagad:'নগদ',bank:'ব্যাংক',other:'অন্যান্য'};
export function PaymentAccounts({accounts,onChange}:{accounts:Account[];onChange:(a:Account[])=>Promise<void>}){
  const [adding,setAdding]=useState(false);
  const [method,setMethod]=useState<Method>('bkash');
  const [number,setNumber]=useState('');
  const [label,setLabel]=useState('');
  const [busy,setBusy]=useState(false);
  async function remove(i:number){
    setBusy(true);
    try{await onChange(accounts.filter((_,idx)=>idx!==i))}
    catch(e){toast.error(e instanceof Error?e.message:'মুছা যায়নি।')}
    finally{setBusy(false)}
  }
  async function add(){
    if(!number.trim()){toast.error('নম্বর লিখুন।');return}
    setBusy(true);
    try{
      await onChange([...accounts,{method,number:number.trim(),label:label.trim()||undefined}]);
      setMethod('bkash');setNumber('');setLabel('');setAdding(false);
    }catch(e){toast.error(e instanceof Error?e.message:'সংরক্ষণ হয়নি।')}
    finally{setBusy(false)}
  }
  return <div className="payment-accounts">
    {accounts.map((a,i)=>{
      const meta=methodChoices.find(m=>m.value===a.method);
      const Icon=meta?.icon||Wallet;
      return <div className="list-row" key={i}>
        <div className="payment-account-row"><span className="payment-account-icon"><Icon size={18}/></span><div><strong>{methodLabel[a.method]||a.method}</strong><small>{a.number}{a.label?' · '+a.label:''}</small></div></div>
        <button className="icon-button" aria-label="মুছুন" disabled={busy} onClick={()=>remove(i)}><Trash2 size={18}/></button>
      </div>;
    })}
    {!accounts.length&&<p className="small">এখনো কোনো পেমেন্ট অ্যাকাউন্ট যোগ করা হয়নি।</p>}
    {adding?<div className="data-form">
      <ChoicePicker options={methodChoices} value={method} onChange={setMethod}/>
      <label>নম্বর / হিসাব নম্বর<input value={number} onChange={e=>setNumber(e.target.value)} placeholder="01XXXXXXXXX"/></label>
      <label>নোট (ঐচ্ছিক)<input value={label} onChange={e=>setLabel(e.target.value)} placeholder="যেমন: সেন্ড মানি"/></label>
      <div className="button-row">
        <Button className="secondary" onClick={()=>setAdding(false)}>বাতিল</Button>
        <Button disabled={busy} onClick={add}>{busy?'সংরক্ষণ হচ্ছে…':<><Check size={18}/> যোগ করুন</>}</Button>
      </div>
    </div>:<Button className="secondary" onClick={()=>setAdding(true)}><Plus size={18}/> অ্যাকাউন্ট যোগ করুন</Button>}
  </div>;
}
