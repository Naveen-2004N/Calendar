import dayjs from 'dayjs';
export const startOfWeek = (d=new Date()) => { const copy=new Date(d); const day = copy.getDay(); copy.setDate(copy.getDate()-day); copy.setHours(0,0,0,0); return copy; };
export const getMonthGrid = (date=new Date()) => {
  const year=date.getFullYear(), month=date.getMonth();
  const first=new Date(year,month,1);
  const start=new Date(first); start.setDate(start.getDate()-first.getDay());
  const grid=[]; for(let i=0;i<42;i++){ grid.push(new Date(start)); start.setDate(start.getDate()+1); } return grid;
};
export const isSameDay=(a,b)=> dayjs(a).isSame(dayjs(b),'day');
export const formatTime=(iso)=> dayjs(iso).format('HH:mm');
