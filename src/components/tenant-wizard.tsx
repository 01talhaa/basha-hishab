'use client';
import {useState} from 'react';
import {toast} from 'sonner';
import {ArrowLeft,ArrowUpRight,Check} from 'lucide-react';
import {Button} from './ui/button';
import {FlatPicker} from './ui/flat-picker';
import {AmountStepper} from './ui/amount-stepper';
import {taka} from '@/lib/money';
type Flat={_id:string;number:string;floor?:string};
const todayBD=()=>new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Dhaka'}).format(new Date());
const stepLabels=['ধাপ ১ · নাম','ধাপ ২ · মোবাইল','ধাপ ৩ · হোয়াটসঅ্যাপ','ধাপ ৪ · ফ্ল্যাট','ধাপ ৫ · ভাড়া','ধাপ ৬ · জামানত','ধাপ ৭ · শুরুর তারিখ','ধাপ ৮ · নিশ্চিত করুন'];
export function TenantWizard({flats,onSave}:{flats:Flat[];onSave:(v:Record<string,string>)=>Promise<void>}){
  const [step,setStep]=useState(0);
  const [name,setName]=useState('');
  const [phone,setPhone]=useState('');
  const [whatsapp,setWhatsapp]=useState('');
  const [flat,setFlat]=useState('');
  const [rent,setRent]=useState('');
  const [deposit,setDeposit]=useState('');
  const [start,setStart]=useState(todayBD());
  const [busy,setBusy]=useState(false);
  async function confirm(){
    setBusy(true);
    try{
      await onSave({name,phone,whatsapp,flat,rent,deposit,start});
    }catch(e){toast.error(e instanceof Error?e.message:'সংরক্ষণ হয়নি।')}finally{setBusy(false)}
  }
  return <div className="wizard">
    <div className="wizard-progress">{stepLabels[step]}</div>
    {step===0&&<section><h3>ভাড়াটিয়ার নাম কী?</h3><input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="যেমন: করিম মিয়া"/><div className="button-row"><Button disabled={!name.trim()} onClick={()=>setStep(1)}>পরের ধাপ <ArrowUpRight size={18}/></Button></div></section>}
    {step===1&&<section><h3>মোবাইল নম্বর কত?</h3><input autoFocus type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="01XXXXXXXXX"/><div className="button-row"><Button className="secondary" onClick={()=>setStep(0)}><ArrowLeft size={18}/> আগের ধাপ</Button><Button disabled={!phone.trim()} onClick={()=>setStep(2)}>পরের ধাপ <ArrowUpRight size={18}/></Button></div></section>}
    {step===2&&<section><h3>হোয়াটসঅ্যাপ নম্বর কত?</h3><input autoFocus type="tel" value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} placeholder="01XXXXXXXXX"/><div className="button-row"><Button className="secondary" onClick={()=>{setWhatsapp(phone);setStep(3)}}>মোবাইল নম্বরের মতই</Button></div><div className="button-row"><Button className="secondary" onClick={()=>setStep(1)}><ArrowLeft size={18}/> আগের ধাপ</Button><Button disabled={!whatsapp.trim()} onClick={()=>setStep(3)}>পরের ধাপ <ArrowUpRight size={18}/></Button></div></section>}
    {step===3&&<section><h3>কোন ফ্ল্যাটে থাকবেন?</h3><FlatPicker flats={flats} value={flat} onChange={setFlat} empty="কোনো খালি ফ্ল্যাট নেই। আগে একটি ফ্ল্যাট যোগ করুন।"/><div className="button-row"><Button className="secondary" onClick={()=>setStep(2)}><ArrowLeft size={18}/> আগের ধাপ</Button><Button disabled={!flat} onClick={()=>setStep(4)}>পরের ধাপ <ArrowUpRight size={18}/></Button></div></section>}
    {step===4&&<section><h3>মাসিক ভাড়া কত টাকা?</h3><AmountStepper value={rent} onChange={setRent}/><div className="button-row"><Button className="secondary" onClick={()=>setStep(3)}><ArrowLeft size={18}/> আগের ধাপ</Button><Button disabled={!rent} onClick={()=>setStep(5)}>পরের ধাপ <ArrowUpRight size={18}/></Button></div></section>}
    {step===5&&<section><h3>জামানত কত টাকা?</h3><AmountStepper value={deposit} onChange={setDeposit}/><div className="button-row"><Button className="secondary" onClick={()=>setDeposit(rent)}>ভাড়ার সমান</Button><Button className="secondary" onClick={()=>setDeposit(String(Number(rent)*2))}>ভাড়ার দ্বিগুণ</Button></div><div className="button-row"><Button className="secondary" onClick={()=>setStep(4)}><ArrowLeft size={18}/> আগের ধাপ</Button><Button disabled={!deposit} onClick={()=>setStep(6)}>পরের ধাপ <ArrowUpRight size={18}/></Button></div></section>}
    {step===6&&<section><h3>ভাড়া শুরুর তারিখ</h3><input autoFocus type="date" value={start} onChange={e=>setStart(e.target.value)}/><div className="button-row"><Button className="secondary" onClick={()=>setStep(5)}><ArrowLeft size={18}/> আগের ধাপ</Button><Button disabled={!start} onClick={()=>setStep(7)}>পরের ধাপ <ArrowUpRight size={18}/></Button></div></section>}
    {step===7&&<section><h3>সব ঠিক আছে তো?</h3><div className="review-list">
      <div className="list-row"><span>নাম</span><strong>{name}</strong></div>
      <div className="list-row"><span>মোবাইল</span><strong>{phone}</strong></div>
      <div className="list-row"><span>হোয়াটসঅ্যাপ</span><strong>{whatsapp}</strong></div>
      <div className="list-row"><span>ফ্ল্যাট</span><strong>{flats.find(f=>f._id===flat)?.number}</strong></div>
      <div className="list-row"><span>মাসিক ভাড়া</span><strong>{taka(Math.round(Number(rent)*100))}</strong></div>
      <div className="list-row"><span>জামানত</span><strong>{taka(Math.round(Number(deposit)*100))}</strong></div>
      <div className="list-row"><span>শুরুর তারিখ</span><strong>{start}</strong></div>
    </div><div className="button-row"><Button className="secondary" onClick={()=>setStep(6)}><ArrowLeft size={18}/> আগের ধাপ</Button><Button disabled={busy} onClick={confirm}>{busy?'সংরক্ষণ হচ্ছে…':<>নিশ্চিত করে সংরক্ষণ করুন <Check size={18}/></>}</Button></div></section>}
  </div>;
}
