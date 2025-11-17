import React from 'react';
export const Modal = ({open, onClose, children})=>{
  if(!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        {children}
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
          <button onClick={onClose} className="btn">Close</button>
        </div>
      </div>
    </div>
  );
};
