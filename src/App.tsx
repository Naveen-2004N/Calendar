import React, { useState, useEffect } from 'react';
import { useEvents } from './store/events';
import { sampleEvents } from './sample-data';
import { MonthView } from './components/MonthView';
import { WeekView } from './components/WeekView';
import { Modal } from './components/Modal';
import { EventForm } from './components/EventForm';
import { startOfWeek } from './utils/date';

export default function App(){
  const events = useEvents(s=> s.events);
  const add = useEvents(s=> s.add);
  const update = useEvents(s=> s.update);
  const remove = useEvents(s=> s.remove);

  const [view,setView] = useState('month');
  const [date,setDate] = useState(new Date());
  const [modalOpen,setModalOpen] = useState(false);
  const [editing,setEditing] = useState(null);

  useEffect(()=>{ if(!events.length){ sampleEvents.forEach(e=> add(e)); } }, []);

  const openForCreate = (startISO) => { setEditing({ start: startISO, end: new Date(new Date(startISO).getTime()+30*60000).toISOString() }); setModalOpen(true); };
  const openForEdit = (ev) => { setEditing(ev); setModalOpen(true); };

  const saveEvent = (ev) => {
    if(events.find(x=> x.id === ev.id)) update(ev.id, ev); else add(ev);
  };
  const handleDelete = (id) => { remove(id); };

  const onMove = (id, newStartISO) => {
    const ev = events.find(x=> x.id === id); if(!ev) return;
    const oldStart = new Date(ev.start); const oldEnd = new Date(ev.end); const dur = oldEnd.getTime()-oldStart.getTime();
    const newStart = new Date(newStartISO); const newEnd = new Date(newStart.getTime()+dur);
    update(id, { start: newStart.toISOString(), end: newEnd.toISOString() });
  };

  const onResize = (id, newEndISO) => { update(id, { end: newEndISO }); };

  const prev = ()=>{ if(view==='month'){ const d=new Date(date); d.setMonth(d.getMonth()-1); setDate(d); } else { const d=new Date(date); d.setDate(d.getDate()-7); setDate(d); } };
  const next = ()=>{ if(view==='month'){ const d=new Date(date); d.setMonth(d.getMonth()+1); setDate(d); } else { const d=new Date(date); d.setDate(d.getDate()+7); setDate(d); } };

  return (<div className="container">
    <div className="header">
      <button onClick={()=> setView('month')} className="btn">Month</button>
      <button onClick={()=> setView('week')} className="btn">Week</button>
      <div style={{marginLeft:'auto',display:'flex',gap:8}}>
        <div className="small">{date.toLocaleString('default',{month:'long', year:'numeric'})}</div>
        <button className="btn" onClick={()=> setDate(new Date())}>Today</button>
        <button className="btn" onClick={prev}>Prev</button>
        <button className="btn" onClick={next}>Next</button>
      </div>
    </div>
    <div className="card">
      {view==='month' ? <MonthView date={date} events={events} onDayClick={(d)=> openForCreate(new Date(d).toISOString())} onEventClick={(e)=> openForEdit(e)} /> : <WeekView startOfWeek={startOfWeek(date)} events={events} onEventClick={(e)=> openForEdit(e)} onCreate={(s,e)=> saveEvent({ id:'evt-'+Date.now(), title:'New Event', start:s, end:e, color:'#3b82f6'})} onMove={(id,d)=> onMove(id,d)} onResize={(id,newEnd)=> onResize(id,newEnd)} />}
    </div>
    <Modal open={modalOpen} onClose={()=> setModalOpen(false)}>
      <EventForm initial={editing} onSave={(ev)=>{ saveEvent(ev); setModalOpen(false); }} onDelete={(id)=>{ handleDelete(id); setModalOpen(false); }} />
    </Modal>
  </div>);
}
