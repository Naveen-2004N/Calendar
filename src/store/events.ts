import create from 'zustand';
import { persist } from 'zustand/middleware';
export const useEvents = create(persist((set)=>({
  events:[],
  add:(e)=> set(s=> ({ events:[...s.events, e] })),
  update:(id,u)=> set(s=> ({ events: s.events.map(ev=> ev.id===id ? {...ev, ...u} : ev) })),
  remove:(id)=> set(s=> ({ events: s.events.filter(ev=> ev.id!==id) }))
}), { name: 'calendar-final-events' }));