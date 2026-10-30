'use client';
import type {ComponentType} from 'react';
export type Choice<T extends string>={value:T;label:string;icon:ComponentType<{size?:number}>};
export function ChoicePicker<T extends string>({options,value,onChange}:{options:Choice<T>[];value:T;onChange:(v:T)=>void}){
  return <div className="choice-row">{options.map(o=>{
    const Icon=o.icon;const active=value===o.value;
    return <button type="button" key={o.value} className={'choice-pick'+(active?' active':'')} onClick={()=>onChange(o.value)} aria-pressed={active}>
      <Icon size={24}/><span>{o.label}</span>
    </button>;
  })}</div>;
}
