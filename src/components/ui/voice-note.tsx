'use client';
import {useRef,useState} from 'react';
import {toast} from 'sonner';
import {Mic,Square,Download,Trash2} from 'lucide-react';
import {Button} from './button';
export function VoiceNote(){
  const [recording,setRecording]=useState(false);
  const [url,setUrl]=useState<string|null>(null);
  const mediaRef=useRef<MediaRecorder|null>(null);
  const chunksRef=useRef<Blob[]>([]);
  async function start(){
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const rec=new MediaRecorder(stream);
      chunksRef.current=[];
      rec.ondataavailable=e=>{if(e.data.size)chunksRef.current.push(e.data)};
      rec.onstop=()=>{
        setUrl(URL.createObjectURL(new Blob(chunksRef.current,{type:'audio/webm'})));
        stream.getTracks().forEach(t=>t.stop());
      };
      rec.start();
      mediaRef.current=rec;
      setRecording(true);
    }catch{
      toast.error('মাইক্রোফোনের অনুমতি পাওয়া যায়নি।');
    }
  }
  function stop(){mediaRef.current?.stop();setRecording(false)}
  function clear(){if(url)URL.revokeObjectURL(url);setUrl(null)}
  return <div className="voice-note">
    <p className="small">ভাড়াটিয়ার জন্য একটি কথ্য (ভয়েস) বার্তা রেকর্ড করুন। ডাউনলোড করে হোয়াটসঅ্যাপে সংযুক্ত করুন।</p>
    <div className="button-row">
      {!recording&&!url&&<Button className="secondary" onClick={start}><Mic size={18}/> রেকর্ড শুরু করুন</Button>}
      {recording&&<Button className="secondary" onClick={stop}><Square size={18}/> থামান</Button>}
      {url&&!recording&&<Button asChild className="secondary"><a href={url} download="voice-message.webm"><Download size={18}/> ডাউনলোড করুন</a></Button>}
      {url&&!recording&&<Button className="secondary" onClick={clear}><Trash2 size={18}/> মুছুন</Button>}
    </div>
    {url&&<audio controls src={url}/>}
  </div>;
}
