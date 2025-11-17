import React, { useState, useEffect } from "react";

export const EventForm = ({ initial, onSave, onDelete }) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [start, setStart] = useState(
    initial?.start ? initial.start.slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [end, setEnd] = useState(
    initial?.end ? initial.end.slice(0, 16) : new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16)
  );
  const [color, setColor] = useState(initial?.color || "#3b82f6");

  const handleSave = () => {
    const id = initial?.id || "evt-" + Date.now();

    onSave({
      id,
      title: title.trim(),     // Save exactly what the user typed
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      color,
    });
  };

  return (
    <div className="space-y-2">
      {/* Title */}
      <label className="block text-sm font-medium">Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Enter event title"
      />

      {/* Start */}
      <label className="block text-sm font-medium">Start</label>
      <input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* End */}
      <label className="block text-sm font-medium">End</label>
      <input
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* Color */}
      <label className="block text-sm font-medium">Color</label>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-16 h-8 rounded"
      />

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-2">

        
        {initial?.id && (
          <button
            className="btn px-3 py-1 border rounded"
            onClick={() => onDelete(initial.id)}
          >
            Delete
          </button>
        )}

      
        <button
          className="px-3 py-1 bg-accent border rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};
