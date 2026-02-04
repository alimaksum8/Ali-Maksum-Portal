
import React, { useState, useEffect } from 'react';
import { InvitationConfig, RSVP } from '../types';

interface AdminDashboardProps {
  config: InvitationConfig;
  onUpdate: (newConfig: InvitationConfig) => void;
  onBack: () => void;
  onCreateNew: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ config, onUpdate, onBack, onCreateNew }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [guestList, setGuestList] = useState<RSVP[]>([]);
  const [publishedHistory, setPublishedHistory] = useState<InvitationConfig[]>([]);

  useEffect(() => {
    const savedGuests = localStorage.getItem('darul_huda_rsvps');
    if (savedGuests) setGuestList(JSON.parse(savedGuests));

    const savedHistory = localStorage.getItem('darul_huda_history');
    if (savedHistory) setPublishedHistory(JSON.parse(savedHistory));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      onUpdate({ ...config, [name]: (e.target as HTMLInputElement).checked });
    } else {
      let updatedConfig = { ...config, [name]: value };

      if (name === 'eventDateIso' && value) {
        try {
          const dateObj = new Date(value);
          if (!isNaN(dateObj.getTime())) {
            const displayDate = new Intl.DateTimeFormat('id-ID', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            }).format(dateObj);

            const displayTime = new Intl.DateTimeFormat('id-ID', {
              hour: '2-digit', minute: '2-digit', hour12: false
            }).format(dateObj).replace('.', ':');

            updatedConfig.eventDateDisplay = displayDate;
            updatedConfig.eventTime = `${displayTime} WIB - Selesai`;
          }
        } catch (err) {
          console.error("Error formatting date:", err);
        }
      }
      onUpdate(updatedConfig);
    }
  };

  const handleMuballighChange = (index: number, value: string) => {
    const newMuballighs = [...config.muballighs];
    newMuballighs[index] = value;
    onUpdate({ ...config, muballighs: newMuballighs });
  };

  const addMuballigh = () => onUpdate({ ...config, muballighs: [...config.muballighs, ""] });
  const removeMuballigh = (index: number) => {
    const newMuballighs = config.muballighs.filter((_, i) => i !== index);
    onUpdate({ ...config, muballighs: newMuballighs.length > 0 ? newMuballighs : [""] });
  };

  const generateUniqueLink = (data: InvitationConfig) => {
    let baseUrl = window.location.origin + window.location.pathname;
    
    // Jika origin adalah blob, gunakan fallback origin (untuk preview sandbox)
    if (window.location.protocol === 'blob:') {
       baseUrl = window.location.href.split('?')[0].split('#')[0];
    }
    
    const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    // Pastikan baseUrl tidak memiliki protokol blob di depannya jika kita ingin link yang bisa dibagikan
    const finalUrl = baseUrl.startsWith('blob:') ? baseUrl.replace('blob:', '') : baseUrl;
    
    return `${finalUrl}?view=invitation&d=${encodedData}`;
  };

  const handleCopyLink = async (dataToCopy: InvitationConfig = config) => {
    const link = generateUniqueLink(dataToCopy);
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      return true;
    } catch (err) {
      alert("Gagal menyalin link.");
      return false;
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const history = [...publishedHistory];
    const existingIndex = history.findIndex(h => h.id === config.id);
    if (existingIndex > -1) history[existingIndex] = { ...config };
    else history.unshift({ ...config });
    
    setPublishedHistory(history);
    localStorage.setItem('darul_huda_history', JSON.stringify(history));

    const success = await handleCopyLink(config);
    setIsPublishing(false);
    if (success) alert('Undangan berhasil dipublikasikan & Link Unik disalin!');
  };

  const handleUpdateFromHistory = (item: InvitationConfig) => {
    if (confirm(`Muat data "${item.line1 || 'Tanpa Judul'}" ke editor?`)) {
      onUpdate(item);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteFromHistory = (id: string) => {
    if (confirm('Hapus undangan ini dari arsip?')) {
      const filtered = publishedHistory.filter(h => h.id !== id);
      setPublishedHistory(filtered);
      localStorage.setItem('darul_huda_history', JSON.stringify(filtered));
    }
  };

  const totalPeople = guestList.filter(g => g.status === 'yes').reduce((sum, g) => sum + g.count, 0);

  return (
    <div className="w-full max-w-6xl space-y-10 pb-20">
      <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Editor Undangan</h2>
            <p className="text-indigo-400 mt-1 font-medium">Data tersimpan otomatis sebagai draft lokal.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onCreateNew} className="px-6 py-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all font-bold flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Acara Baru
            </button>
            <button onClick={onBack} className="px-6 py-3 rounded-2xl glass-panel border-white/10 hover:bg-white hover:text-slate-950 transition-all font-bold"> Kembali </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6">Informasi Acara Utama</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-widest">Judul Utama</label>
                  <input name="line1" value={config.line1} onChange={handleChange} placeholder="Contoh: Maulid Nabi Muhammad Saw" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-widest">Sub-Judul</label>
                  <input name="line2" value={config.line2} onChange={handleChange} placeholder="Contoh: Haul Masyayikh Pon-Pes Darul Huda" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-widest">Organisasi</label>
                  <input name="line3" value={config.line3} onChange={handleChange} placeholder="Contoh: IKSADAH" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-widest">Deskripsi Organisasi</label>
                  <input name="line4" value={config.line4} onChange={handleChange} placeholder="Contoh: Ikatan Alumni Santri Darul Huda" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>

                <div className="pt-4 mt-2 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-3 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                    <input type="checkbox" id="showMuballigh" name="showMuballigh" checked={config.showMuballigh} onChange={handleChange} className="w-5 h-5 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500"/>
                    <label htmlFor="showMuballigh" className="text-sm font-bold text-indigo-300 cursor-pointer">Dihadiri Oleh Mubaligh:</label>
                  </div>
                  {config.showMuballigh && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {config.muballighs.map((name, index) => (
                        <div key={index} className="flex gap-2">
                          <input value={name} onChange={(e) => handleMuballighChange(index, e.target.value)} placeholder={`Muballigh ${index + 1}...`} className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white outline-none text-sm" />
                          <button onClick={() => removeMuballigh(index)} className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                        </div>
                      ))}
                      <button onClick={addMuballigh} className="w-full py-2 rounded-xl border border-dashed border-indigo-500/30 text-indigo-400 text-xs font-bold hover:bg-indigo-500/5 transition-all">+ Tambah Muballigh</button>
                    </div>
                  )}
                </div>
              </div>
            </section>
            
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6">Waktu & Tempat</h3>
              <div className="space-y-4">
                <input name="eventDateIso" value={config.eventDateIso} onChange={handleChange} type="datetime-local" className="w-full bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3 text-white outline-none transition-all" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="eventDateDisplay" value={config.eventDateDisplay} onChange={handleChange} placeholder="Senin, 12 Mei 2025" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
                  <input name="eventTime" value={config.eventTime} onChange={handleChange} placeholder="19:30 WIB" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
                </div>
                <input name="venueName" value={config.venueName} onChange={handleChange} placeholder="Nama Venue" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white" />
                <textarea name="venueAddress" value={config.venueAddress} onChange={handleChange} placeholder="Alamat Lengkap" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white h-20" />
              </div>
            </section>
          </div>
          
          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10 overflow-hidden flex flex-col max-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Konfirmasi Tamu ({totalPeople})</h3>
                <button onClick={() => { if(confirm('Reset?')) { localStorage.removeItem('darul_huda_rsvps'); setGuestList([]); } }} className="text-[10px] text-rose-500 font-bold">Reset</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                {guestList.map(g => (
                  <div key={g.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div><p className="text-sm font-bold text-white">{g.name}</p><p className="text-[10px] text-slate-500">{new Date(g.timestamp).toLocaleString()}</p></div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${g.status === 'yes' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{g.status === 'yes' ? `Hadir +${g.count}` : 'Tidak'}</span>
                  </div>
                ))}
              </div>
            </section>
            
            <button onClick={handlePublish} disabled={isPublishing} className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2">
              {isPublishing ? "Publishing..." : "Publish & Salin Link Unik"}
            </button>
            {copySuccess && <p className="text-center text-green-400 text-sm font-bold animate-bounce">✓ Link Unik Tersalin!</p>}

            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Arsip Publikasi</h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {publishedHistory.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl glass-panel border-white/5 flex flex-col gap-3">
                    <p className="text-white text-sm font-bold line-clamp-1">{item.line1 || "Undangan"}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => handleUpdateFromHistory(item)} className="py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 text-[9px] font-bold border border-indigo-500/20">Edit</button>
                      <button onClick={() => handleCopyLink(item)} className="py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 text-[9px] font-bold border border-emerald-500/20">Link</button>
                      <button onClick={() => handleDeleteFromHistory(item.id)} className="py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-[9px] font-bold border border-rose-500/20">X</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
