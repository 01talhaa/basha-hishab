'use client';
export function AmountStepper({value,onChange,presets=[100,500,1000,5000]}:{value:string;onChange:(v:string)=>void;presets?:number[]}){
  function add(n:number){
    const current=Number(value)||0;
    onChange(String(Math.round((current+n)*100)/100));
  }
  return <div className="amount-stepper">
    <input autoFocus type="number" min="0" step="0.01" inputMode="decimal" value={value} onChange={e=>onChange(e.target.value)}/>
    <div className="amount-presets">
      {presets.map(p=><button type="button" key={p} onClick={()=>add(p)}>+{p}</button>)}
      <button type="button" className="clear" onClick={()=>onChange('')}>মুছুন</button>
    </div>
  </div>;
}
