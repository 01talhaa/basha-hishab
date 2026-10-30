function isBangla(ch:string){const cp=ch.codePointAt(0)||0;return cp>=0x0980&&cp<=0x09FF}
function isLatinLetter(ch:string){return /[A-Za-z]/.test(ch)}
function splitRuns(str:string,banglaFont:string,fallbackFont:string){
  const runs:{text:string;font:string}[]=[];
  let current='';let currentFont='';
  for(const ch of str){
    const font=isBangla(ch)?banglaFont:isLatinLetter(ch)?fallbackFont:(currentFont||banglaFont);
    if(font!==currentFont&&current){runs.push({text:current,font:currentFont});current=''}
    currentFont=font;current+=ch;
  }
  if(current)runs.push({text:current,font:currentFont});
  return runs;
}
/**
 * The Bangla PDF font (Noto Sans Bengali) has no Latin glyphs, so any English
 * text mixed into a line (invoice IDs, English names, reference numbers)
 * rendered as blank boxes. This patches PDFKit's `.text()` on a document so
 * every call transparently splits mixed Bangla/Latin text into same-line
 * runs, switching fonts per run, with zero changes needed at call sites.
 */
export function patchMixedScriptText(doc:any,banglaFont:string,fallbackFont:string):void{
  const original=doc.text.bind(doc);
  doc.text=function(str:string,...rest:any[]){
    if(!str)return original(str,...rest);
    let x:number|undefined,y:number|undefined,options:any;
    if(typeof rest[0]==='object'&&rest[0]!==null){options=rest[0]}
    else{x=rest[0];y=rest[1];options=rest[2]}
    const runs=splitRuns(String(str),banglaFont,fallbackFont);
    runs.forEach((r,i)=>{
      doc.font(r.font);
      const callOptions=Object.assign({},options,{continued:i<runs.length-1});
      if(i===0&&x!==undefined&&y!==undefined)original(r.text,x,y,callOptions);
      else original(r.text,callOptions);
    });
    doc.font(banglaFont);
    return doc;
  };
}
