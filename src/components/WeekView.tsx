import React, { useRef, useState, useEffect } from 'react';
import { formatTime } from '../utils/date';
import { posFromMinutes, minutesFromTop } from '../components/weekCalc';
import { motion } from 'framer-motion';

export const WeekView = ({ startOfWeek, events, onEventClick, onCreate, onMove, onResize }) => {
  const ref = useRef(null);
  const [drag, setDrag] = useState(null);
  const [resizing, setResizing] = useState(null);
  const containerH = 600;

  const dayCols = Array.from({length:7},(_,i)=>{ const d=new Date(startOfWeek); d.setDate(d.getDate()+i); return d; });
  const dayEvents = dayCols.map(d=> events.filter(e=> new Date(e.start).toDateString()===d.toDateString()));

  const computeLayout = (evs)=>{
    const items = evs.map(e=> ({...e, startMin: (new Date(e.start)).getHours()*60 + (new Date(e.start)).getMinutes(), endMin: (new Date(e.end)).getHours()*60 + (new Date(e.end)).getMinutes()}));
    const columns = [];
    items.forEach(it=>{
      let placed=false;
      for(const col of columns){
        if(!col.some(c=> !(it.endMin<=c.startMin || it.startMin>=c.endMin))){
          col.push(it); placed=true; break;
        }
      }
      if(!placed) columns.push([it]);
    });
    const positioned = [];
    columns.forEach((col,ci)=> col.forEach(it=> positioned.push({...it, col:ci, cols:columns.length})));
    return positioned;
  };

  const handleMouseDown = (e, dayIndex)=>{
    if(e.button !== 0) return;
    const rect = ref.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    setDrag({ day: dayIndex, startY: y, endY: y });
  };

  const handleMouseMove = (e)=>{
    if(drag){
      const rect = ref.current.getBoundingClientRect();
      const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
      setDrag(d=> d? {...d, endY: y}: d);
    }
    if(resizing){
      const rect = ref.current.getBoundingClientRect();
      const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
      setResizing(r=> r? {...r, endY: y}: r);
    }
  };

  const handleMouseUp = ()=>{
    if(drag){
      const rect = ref.current.getBoundingClientRect();
      const startM = minutesFromTop(Math.min(drag.startY, drag.endY), rect.height);
      const endM = minutesFromTop(Math.max(drag.startY, drag.endY), rect.height);
      const day = new Date(startOfWeek); day.setDate(day.getDate() + drag.day);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(startM/60), Math.round(startM%60));
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(endM/60), Math.round(endM%60));
      onCreate(start.toISOString(), end.toISOString());
      setDrag(null);
    }
    if(resizing){
      const rect = ref.current.getBoundingClientRect();
      const endM = minutesFromTop(resizing.endY, rect.height);
      const ev = events.find(x=> x.id === resizing.id);
      if(ev){
        const start = new Date(ev.start);
        const newEnd = new Date(start.getFullYear(), start.getMonth(), start.getDate(), Math.floor(endM/60), Math.round(endM%60));
        onResize(resizing.id, newEnd.toISOString());
      }
      setResizing(null);
    }
  };

  useEffect(()=>{
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return ()=>{ window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [drag, resizing]);

  const handleDragStart = (e, id)=> { e.dataTransfer.setData('text/id', id); e.dataTransfer.effectAllowed = 'move'; };
  const handleDrop = (e, dayIndex)=>{
    const id = e.dataTransfer.getData('text/id');
    if(!id) return;
    const rect = ref.current.getBoundingClientRect();
    const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
    const mins = minutesFromTop(y, rect.height);
    const day = new Date(startOfWeek); day.setDate(day.getDate() + dayIndex);
    const newStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), Math.floor(mins/60), Math.round(mins%60));
    onMove(id, newStart.toISOString());
  };

  return (
    <div className="card">
      <div className="grid grid-cols-7 border-b bg-white/30">
        {dayCols.map((d,i)=> <div key={i} className="p-2 text-sm border-r">{d.toDateString()}</div>)}
      </div>
      <div ref={ref} className="relative h-[600px] grid grid-cols-7" onMouseDown={(e)=>{ const col = Math.floor(((e.clientX - ref.current.getBoundingClientRect().left)/ref.current.getBoundingClientRect().width)*7); handleMouseDown(e,col); }} onDragOver={(e)=> e.preventDefault()} onDrop={(e)=>{ const col = Math.floor(((e.clientX - ref.current.getBoundingClientRect().left)/ref.current.getBoundingClientRect().width)*7); handleDrop(e,col); }}>
        {dayEvents.map((evs,ci)=>{
          const layout = computeLayout(evs);
          return <div key={ci} className="relative border-r">
            {layout.map(ev=>{
              const top = posFromMinutes(ev.startMin,600);
              const height = posFromMinutes(ev.endMin - ev.startMin,600);
              const leftPercent = (ev.col / ev.cols) * 100;
              const widthPercent = 100 / ev.cols;
              // choose text color with good contrast
              const textColor = (ev.color && (ev.color === '#fff' || ev.color === '#ffffff')) ? '#000' : '#fff';
              return (
                <motion.div key={ev.id} draggable onDragStart={(e)=> handleDragStart(e, ev.id)} onClick={()=> onEventClick(ev)} style={{ position:'absolute', top: `${top}px`, left: `${leftPercent}%`, width: `calc(${widthPercent}% - 8px)`, height: `${height}px`, backgroundColor: ev.color, padding:8, borderRadius:8, color:textColor, overflow:'hidden' }} whileHover={{ scale:1.02 }}>
                  <div style={{fontWeight:700, fontSize:13}}>{ev.title}</div>
                  <div style={{fontSize:12, opacity:0.95}}>{formatTime(ev.start)} - {formatTime(ev.end)}</div>
                  <div className="resizer" onMouseDown={(e)=>{ e.stopPropagation(); setResizing({ id: ev.id, startY: e.clientY - ref.current.getBoundingClientRect().top, endY: e.clientY - ref.current.getBoundingClientRect().top }); }} />
                </motion.div>
              );
            })}
          </div>;
        })}
        {drag && <div style={{position:'absolute', left:(drag.day*(100/7)) + '%', top: Math.min(drag.startY, drag.endY), height: Math.abs(drag.endY - drag.startY), width: (100/7)+'%', background:'rgba(14,165,233,0.12)'}} />}
      </div>
    </div>
  );
};
