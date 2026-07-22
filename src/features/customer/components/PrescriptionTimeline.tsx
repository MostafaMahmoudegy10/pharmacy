import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCheck, MessageCircle, Paperclip, Send, UserRound } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Locale, Prescription } from '../../../types/pharmacy';
import { prescriptionNotes, prescriptionResponse, prescriptionStatusLabel } from '../../../utils/pharmacy';

const copy = {
  ar: { eyebrow:'المتابعة والمحادثة', title:'خليك متابع مع الصيدلي', description:'اختار الروشتة وشوف حالتها، واسأل الصيدلي في نفس المحادثة.', empty:'اكتب رسالة للصيدلي...', pharmacist:'صيدلي RxFlow', online:'متاح الآن', sent:'تم الإرسال', select:'الروشتات الأخيرة', newMessage:'الصيدلي هيرد عليك هنا بمجرد ما يراجع الروشتة.' },
  en: { eyebrow:'Tracking & chat', title:'Stay connected to your pharmacist', description:'Choose a prescription, see its status and ask questions in one conversation.', empty:'Message your pharmacist...', pharmacist:'RxFlow Pharmacist', online:'Online now', sent:'Sent', select:'Recent prescriptions', newMessage:'Your pharmacist will reply here after reviewing the prescription.' },
};

export function PrescriptionTimeline({ locale, prescriptions }: { locale: Locale; prescriptions: Prescription[] }) {
  const t=copy[locale];
  const [selectedId,setSelectedId]=useState(prescriptions[0]?.id || '');
  const [draft,setDraft]=useState('');
  const [localMessages,setLocalMessages]=useState<Record<string,{text:string;time:string}[]>>({});
  useEffect(()=>{ if(!prescriptions.some(p=>p.id===selectedId)) setSelectedId(prescriptions[0]?.id||''); },[prescriptions,selectedId]);
  const selected=prescriptions.find(p=>p.id===selectedId) || prescriptions[0];
  const messages=useMemo(()=>selected ? selected.messages.map(m=>({from:m.from,text:locale==='ar'?m.text:m.textEn,time:locale==='ar'?m.time:m.timeEn})):[],[selected,locale]);
  const send=()=>{const value=draft.trim();if(!value||!selected)return;setLocalMessages(current=>({...current,[selected.id]:[...(current[selected.id]||[]),{text:value,time:locale==='ar'?'الآن':'Now'}]}));setDraft('');};
  if(!selected) return null;
  return <section id="tracking" className="mt-10">
    <div className="section-title-row"><div><span>{t.eyebrow}</span><h2>{t.title}</h2><p>{t.description}</p></div></div>
    <div className="chat-shell mt-7">
      <aside className="chat-list"><h3>{t.select}</h3>{prescriptions.slice(0,5).map(p=><button type="button" key={p.id} onClick={()=>setSelectedId(p.id)} className={selected.id===p.id?'active':''}><div className="rx-avatar">RX</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><b>{p.id}</b><small>{locale==='ar'?p.uploadedAt:p.uploadedAtEn}</small></div><p>{prescriptionNotes(p,locale)}</p></div></button>)}</aside>
      <div className="chat-window">
        <header><div className="relative"><div className="pharmacist-avatar"><UserRound/></div><i/></div><div className="flex-1"><h3>{t.pharmacist}</h3><p>{t.online}</p></div><StatusBadge>{prescriptionStatusLabel(selected.status,locale)}</StatusBadge></header>
        <div className="chat-context"><b>{selected.id}</b><span>{prescriptionNotes(selected,locale)}</span></div>
        <div className="messages-area">
          <div className="day-label">{locale==='ar'?'اليوم':'Today'}</div>
          {messages.map((message,index)=><motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} key={index} className={`message ${message.from==='customer'?'mine':'theirs'}`}><p>{message.text}</p><small>{message.time}{message.from==='customer'&&<CheckCheck size={13}/>}</small></motion.div>)}
          {prescriptionResponse(selected,locale)&&<div className="message theirs"><p>{prescriptionResponse(selected,locale)}</p><small>{locale==='ar'?'رد الصيدلي':'Pharmacist reply'}</small></div>}
          {!messages.length&&!prescriptionResponse(selected,locale)&&<div className="chat-empty"><MessageCircle/><p>{t.newMessage}</p></div>}
          {(localMessages[selected.id]||[]).map((message,index)=><motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} key={`local-${index}`} className="message mine"><p>{message.text}</p><small>{message.time}<CheckCheck size={13}/></small></motion.div>)}
        </div>
        <div className="chat-compose"><button type="button" aria-label="attach"><Paperclip/></button><input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send();}} placeholder={t.empty}/><button type="button" onClick={send} className="send-btn" aria-label={t.sent}><Send/></button></div>
      </div>
    </div>
  </section>;
}
