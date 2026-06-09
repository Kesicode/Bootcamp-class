"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const toDatetimeLocal = (timestamp) => {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const toTimestamp = (datetimeLocal) => {
  if (!datetimeLocal) return undefined;
  return new Date(datetimeLocal).getTime();
};

export default function WeekEditor({ weekId, onClose }) {
  const weeks = useQuery(api.content.getWeeks);
  const updateWeek = useMutation(api.content.updateWeek);

  const [formData, setFormData] = useState({ 
    title: "", 
    description: "",
    unlockAtStr: "", 
    deadlineAtStr: "" 
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const week = weeks?.find((w) => w._id === weekId);

  useEffect(() => {
    if (week) {
      setFormData({ 
        title: week.title || "", 
        description: week.description || "",
        unlockAtStr: toDatetimeLocal(week.unlockAt),
        deadlineAtStr: toDatetimeLocal(week.deadlineAt)
      });
    }
  }, [week]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateWeek({ 
        weekId, 
        title: formData.title,
        description: formData.description,
        unlockAt: toTimestamp(formData.unlockAtStr),
        deadlineAt: toTimestamp(formData.deadlineAtStr)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
      alert("Failed to save week.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!week) return (
    <div className="py-10 text-center">
      <p className="font-mono text-[10px] tracking-widest text-black/25 dark:text-white/25 uppercase">LOADING_WEEK_EDITOR...</p>
    </div>
  );

  const fieldClass = "w-full border border-black/[0.12] dark:border-white/[0.12] rounded-lg px-4 py-2.5 font-mono text-sm outline-none focus:border-black dark:focus:border-white transition-colors bg-white dark:bg-[#111111] text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20";
  const labelClass = "block font-mono text-[9px] tracking-[0.2em] text-black/40 dark:text-white/40 uppercase mb-1.5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="border border-black/[0.08] dark:border-white/[0.08] rounded-xl p-6 bg-[#F8F9FA] dark:bg-[#0f0f0f] relative mb-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-mono text-[9px] tracking-[0.3em] text-black/30 dark:text-white/30 uppercase mb-1">EDITING_WEEK</p>
          <h3 className="font-display font-black text-xl tracking-tight uppercase text-black dark:text-white">{week.title}</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Form fields */}
      <div className="space-y-4 mb-8">
        <div>
          <label className={labelClass}>TITLE</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>DESCRIPTION</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the week's overall theme..." rows={3} className={fieldClass} />
        </div>
      </div>

      {/* Access Control */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className={labelClass}>UNLOCK_AT (START DATE)</label>
          <input type="datetime-local" value={formData.unlockAtStr} onChange={e => setFormData({...formData, unlockAtStr: e.target.value})} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>DEADLINE_AT (END DATE)</label>
          <input type="datetime-local" value={formData.deadlineAtStr} onChange={e => setFormData({...formData, deadlineAtStr: e.target.value})} className={fieldClass} />
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-end items-center pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
        <button onClick={handleSave} disabled={isSaving} className="font-mono text-[9px] uppercase tracking-wider px-6 py-2.5 rounded bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 transition-colors disabled:opacity-50 flex items-center gap-2">
          {saved ? (
            <><svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> SAVED</>
          ) : isSaving ? "SAVING..." : (
            <><svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none"><path d="M4 8h8M4 11h8M4 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> SAVE_CHANGES</>
          )}
        </button>
      </div>
    </motion.div>
  );
}
