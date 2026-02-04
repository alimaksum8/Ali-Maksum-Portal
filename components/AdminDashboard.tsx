
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

  // Load Real Data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('darul_huda_rsvps');
    if (saved) {
      setGuestList(JSON.parse(saved));
    }
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
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }).format(dateObj);

            const displayTime = new Intl.DateTimeFormat('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
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

  const addMuballigh = () => {
    onUpdate({ ...config, muballighs: [...config.muballighs, ""] });
  };

  const removeMuballigh = (index: number) => {
    const newMuballighs = config.muballighs.filter((_, i) => i !== index);
    onUpdate({ ...config, muballighs: newMuballighs.length > 0 ? newMuballighs : [""] });
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

  const handleResetGuests = () => {
    if (confirm('Hapus semua daftar tamu? Tindakan ini tidak dapat dibatalkan.')) {
      setGuestList([]);
      localStorage.removeItem('darul_huda_rsvps');
    }
  };

  const totalPeople = guestList
    .filter(g => g.status === 'yes')
    .reduce((sum, g) => sum + g.count, 0);

  return (
    <div className="w-full max-w-6xl space-y-10 pb-20">
      <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Editor Undangan Acara</h2>
            <p className="text-indigo-400 mt-1 font-medium">Kelola informasi Maulid & Haul secara real-time.</p>
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
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-widest">Baris 1 (Judul Utama)</label>
                  <input name="line1" value={config.line1} onChange={handleChange} placeholder="Contoh: Maulid Nabi Muhammad Saw" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-widest">Baris 2 (Sub-Judul)</label>
                  <input name="line2" value={config.line2} onChange={handleChange} placeholder="Contoh: Haul Masyayikh Pon-Pes Darul Huda" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-widest">Baris 3 (Organisasi/Singkatan)</label>
                  <input name="line3" value={config.line3} onChange={handleChange} placeholder="Contoh: IKSADAH" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-widest">Baris 4 (Deskripsi Organisasi)</label>
                  <input name="line4" value={config.line4} onChange={handleChange} placeholder="Contoh: Ikatan Alumni Santri Darul Huda" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500" />
                </div>

                {/* Muballigh Section */}
                <div className="pt-4 mt-2 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-3 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                    <input 
                      type="checkbox" 
                      id="showMuballigh" 
                      name="showMuballigh" 
                      checked={config.showMuballigh} 
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="showMuballigh" className="text-sm font-bold text-indigo-300 cursor-pointer select-none">Dihadiri Oleh Mubaligh:</label>
                  </div>

                  {config.showMuballigh && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest ml-1">Nama-nama Muballigh</label>
                      {config.muballighs.map((name, index) => (
                        <div key={index} className="flex gap-2 group">
                          <input 
                            value={name} 
                            onChange={(e) => handleMuballighChange(index, e.target.value)} 
                            placeholder={`Muballigh ${index + 1}...`} 
                            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 text-sm" 
                          />
                          <button 
                            onClick={() => removeMuballigh(index)}
                            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                            title="Hapus"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={addMuballigh}
                        className="w-full py-2.5 rounded-xl border border-dashed border-indigo-500/30 text-indigo-400 text-xs font-bold hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Tambah Kolom Muballigh
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
            
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6">Waktu & Tempat</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">1. Input Kalender (Master)</label>
                    <input name="eventDateIso" value={config.eventDateIso} onChange={handleChange} type="datetime-local" className="w-full bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase">2. Tampilan Teks Tanggal</label>
                      <input name="eventDateDisplay" value={config.eventDateDisplay} onChange={handleChange} placeholder="Senin, 12 Mei 2025" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase">3. Tampilan Teks Waktu</label>
                      <input name="eventTime" value={config.eventTime} onChange={handleChange} placeholder="19:30 WIB - Selesai" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
                    </div>
                  </div>
                </div>
                <input name="venueName" value={config.venueName} onChange={handleChange} placeholder="Nama Venue" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white" />
                <textarea name="venueAddress" value={config.venueAddress} onChange={handleChange} placeholder="Alamat Lengkap" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white h-20" />
              </div>
            </section>
          </div>
          
          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10 overflow-hidden flex flex-col max-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Daftar Konfirmasi</h3>
                  <p className="text-xs text-indigo-400">Total Hadir: {totalPeople} Orang</p>
                </div>
                <button onClick={handleResetGuests} className="text-[10px] text-rose-500 hover:underline uppercase tracking-widest font-bold">Reset Daftar</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {guestList.length > 0 ? (
                  guestList.map((guest) => (
                    <div key={guest.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white truncate max-w-[120px]">{guest.name}</p>
                        <p className="text-[10px] text-slate-500">{new Date(guest.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${guest.status === 'yes' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {guest.status === 'yes' ? 'Hadir' : 'Tidak'}
                        </span>
                        {guest.status === 'yes' && (
                          <span className="text-xs font-display text-yellow-500">+{guest.count}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-500 text-sm italic">Belum ada tamu yang mengonfirmasi.</p>
                  </div>
                )}
              </div>
            </section>
            
            <div className="flex flex-col gap-4">
               <button onClick={handlePublish} disabled={isPublishing} className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                 {isPublishing ? "Memproses..." : "Publikasikan & Salin Link Undangan"}
               </button>
               {copySuccess && <p className="text-center text-green-400 text-sm font-bold animate-bounce">✓ Link Berhasil Disalin ke Clipboard!</p>}
            </div>

            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
              <h4 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-widest">Analitik Real-Time</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Data tamu di atas diambil langsung dari formulir undangan. Pastikan untuk mengecek secara berkala untuk estimasi konsumsi dan tempat duduk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
