import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Edit2, Check, Clock } from 'lucide-react';

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function Timetable() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [newTime, setNewTime] = useState('09:00');
  const [newSubject, setNewSubject] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');

  const addSlot = () => {
    if (!newSubject.trim()) return;
    
    setSlots([...slots, {
      id: Date.now().toString(),
      day: selectedDay,
      time: newTime,
      subject: newSubject.trim()
    }]);
    
    setNewSubject('');
  };

  const removeSlot = (id: string) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  const startEditing = (slot: TimeSlot) => {
    setEditingId(slot.id);
    setEditSubject(slot.subject);
  };

  const saveEdit = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, subject: editSubject.trim() } : s));
    setEditingId(null);
  };

  // Group slots by day
  const slotsByDay = DAYS.reduce((acc, day) => {
    acc[day] = slots.filter(s => s.day === day).sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neo-yellow p-3 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <Calendar className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight">My Timetable</h2>
      </div>

      {/* Add Entry Form */}
      <div className="bg-gray-50 border-4 border-black p-6 rounded-xl shadow-[6px_6px_0px_0px_#000] mb-8">
        <h3 className="font-black uppercase text-xl mb-4 flex items-center gap-2">
          <Plus className="w-6 h-6" /> Add New Entry
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="font-black uppercase text-xs text-gray-600 block mb-2">Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-yellow/50 appearance-none bg-white"
            >
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <div>
            <label className="font-black uppercase text-xs text-gray-600 block mb-2">Time</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-yellow/50 bg-white"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="font-black uppercase text-xs text-gray-600 block mb-2">Subject / Task</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSlot()}
                placeholder="e.g. Advanced Calculus"
                className="flex-1 border-4 border-black rounded-xl p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-yellow/50"
              />
              <button
                onClick={addSlot}
                disabled={!newSubject.trim()}
                className="bg-black text-white px-6 rounded-xl border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-y-1 hover:translate-x-1 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable View */}
      <div className="space-y-6">
        {DAYS.map(day => (
          slotsByDay[day].length > 0 && (
            <div key={day} className="border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#000] bg-white">
              <div className="bg-neo-blue text-white border-b-4 border-black p-3 font-black uppercase text-xl">
                {day}
              </div>
              
              <div className="divide-y-4 divide-black">
                {slotsByDay[day].map(slot => (
                  <div key={slot.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-neo-yellow border-4 border-black px-3 py-1 font-black shadow-[2px_2px_0px_0px_#000] rounded-lg flex items-center gap-2 whitespace-nowrap">
                        <Clock className="w-4 h-4" />
                        {slot.time}
                      </div>
                      
                      {editingId === slot.id ? (
                        <input
                          type="text"
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(slot.id)}
                          className="flex-1 border-4 border-black rounded-lg px-3 py-1 font-bold text-lg w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-black"
                          autoFocus
                        />
                      ) : (
                        <div className="font-black text-xl flex-1">{slot.subject}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-auto">
                      {editingId === slot.id ? (
                        <button
                          onClick={() => saveEdit(slot.id)}
                          className="p-2 bg-neo-green text-black border-4 border-black rounded-lg hover:bg-green-400 transition-colors shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
                          title="Save"
                        >
                          <Check className="w-5 h-5 font-black" />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditing(slot)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 text-black border-4 border-black rounded-lg transition-colors shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5 font-black" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => removeSlot(slot.id)}
                        className="p-2 bg-neo-pink hover:bg-red-400 text-white border-4 border-black rounded-lg transition-colors shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 font-black" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {slots.length === 0 && (
          <div className="text-center p-12 border-4 border-dashed border-gray-300 rounded-2xl">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="font-black text-gray-400 uppercase text-xl">Your timetable is empty</p>
            <p className="font-bold text-gray-500 mt-2">Add your first class or study session above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const timetableInstructions = [
  "Select a day of the week from the dropdown.",
  "Set the exact time for your class or study session.",
  "Type in the subject or task name.",
  "Click 'Add' to place it on your Timetable.",
  "You can edit or delete entries anytime using the buttons next to them."
];
