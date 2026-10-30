'use client';
import {Building2,Check} from 'lucide-react';
type Flat={_id:string;number:string;floor?:string};
export function FlatPicker({flats,value,onChange,multiple,empty}:{flats:Flat[];value?:string|string[];onChange:(id:any)=>void;multiple?:boolean;empty?:string}){
  if(!flats.length) return <p className="flat-picker-empty">{empty||'কোনো ফ্ল্যাট নেই।'}</p>;
  const selected=Array.isArray(value)?value:value?[value]:[];
  return <div className="flat-picker">{flats.map(f=>{
    const active=selected.includes(f._id);
    function toggle(){
      if(!multiple){onChange(f._id);return}
      onChange(active?selected.filter(id=>id!==f._id):[...selected,f._id]);
    }
    return <button type="button" key={f._id} className={'flat-pick'+(active?' active':'')} onClick={toggle} aria-pressed={active}>
      <span className="flat-pick-icon"><Building2 size={26}/></span>
      <strong>{f.number}</strong>
      {f.floor&&<small>{f.floor} তলা</small>}
      {active&&<span className="flat-pick-check"><Check size={14}/></span>}
    </button>;
  })}</div>;
}
