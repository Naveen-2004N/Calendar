import React from 'react';
import { getMonthGrid } from '../utils/date';
export const MonthView = ({ date, events, onDayClick, onEventClick }) => {
  const grid = getMonthGrid(date);
  const eventsByDay = new Map();
  events.forEach(ev=> { const key = new Date(ev.start).toDateString(); const arr = eventsByDay.get(key) || []; arr.push(ev); eventsByDay.set(key, arr); });
  return (
    <div className="grid grid-cols-7 gap-1">
      {grid.map((d,i)=>{
        const dayKey = d.toDateString();
        const evs = eventsByDay.get(dayKey) || [];
        const today = new Date().toDateString() === d.toDateString();
        return (
          <div key={i} className="border p-2 h-28 overflow-hidden card" onClick={()=> onDayClick(d)}>
            <div className="flex justify-between items-start mb-1">
              <div className={today? 'bg-accent text-white w-7 h-7 flex items-center justify-center rounded-full':'text-sm font-medium'}>{d.getDate()}</div>
            </div>
            <div className="space-y-1">
              {evs.slice(0,3).map(ev=> <div key={ev.id} onClick={(e)=>{ e.stopPropagation(); onEventClick(ev); }} className="text-xs px-2 py-1 rounded truncate" style={{backgroundColor:ev.color}}>{ev.title}</div>)}
              {evs.length>3 && <button className="text-xs text-accent">+{evs.length-3} more</button>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
