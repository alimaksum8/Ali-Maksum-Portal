
import React, { useState } from 'react';
import { InvitationConfig } from '../types';

interface AdminDashboardProps {
  config: InvitationConfig;
  onUpdate: (newConfig: InvitationConfig) => void;
  onBack: () => void;
  onCreateNew: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ config, onUpdate, onBack, onCreateNew }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...config, [name]: value });
  };

  const handleCopyLink = async () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('view', 'invitation');
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      alert("Gagal menyalin link.");
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    handleCopyLink();
    setIsPublishing(false);
    alert('Link undangan berhasil disalin!');
  };

  return (
    <div className="w-full max-w-6xl space-y-10 pb-20">
      <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Editor Undangan</h2>
            <p className="text-indigo-400 mt-1 font-medium">Kelola informasi pernikahan Anda secara real-time.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onCreateNew} className="px-6 py-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all font-bold flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Baru
            </button>
            <button onClick={onBack} className="px-6 py-3 rounded-2xl glass-panel border-white/10 hover:bg-white hover:text-slate-950 transition-all font-bold"> Kembali </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6">Profil Mempelai</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input name="groomName" value={config.groomName} onChange={handleChange} placeholder="Nama Pria" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
                <input name="brideName" value={config.brideName} onChange={handleChange} placeholder="Nama Wanita" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
              </div>
            </section>
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6">Waktu & Tempat</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input name="eventDateIso" value={config.eventDateIso} onChange={handleChange} type="datetime-local" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white" />
                  <input name="eventDateDisplay" value={config.eventDateDisplay} onChange={handleChange} placeholder="Tampilan Tgl" className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white" />
                </div>
                <input name="venueName" value={config.venueName} onChange={handleChange} placeholder="Nama Venue" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white" />
                <textarea name="venueAddress" value={config.venueAddress} onChange={handleChange} placeholder="Alamat" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white h-20" />
              </div>
            </section>
          </div>
          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6">Pesan Utama</h3>
              <textarea name="message" value={config.message} onChange={handleChange} placeholder="Pesan Undangan" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white h-40" />
            </section>
            <div className="flex flex-col gap-4">
               <button onClick={handlePublish} disabled={isPublishing} className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                 {isPublishing ? "Memproses..." : "Publikasikan & Salin Link"}
               </button>
               {copySuccess && <p className="text-center text-green-400 text-sm font-bold">✓ Link Disalin!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
