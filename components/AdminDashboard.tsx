
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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...config, [name]: value });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Undangan berhasil dipublikasikan!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteAll = async (e: React.MouseEvent) => {
    // Memastikan event tidak merambat ke elemen lain
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH data undangan ini secara permanen?')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Simulasi proses penghapusan
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mengirimkan objek kosong untuk mereset seluruh field di App.tsx
      onUpdate({
        groomName: "",
        brideName: "",
        eventDateIso: "",
        eventDateDisplay: "",
        eventTime: "",
        venueName: "",
        venueAddress: "",
        message: ""
      });
      
      alert('Sukses: Seluruh data undangan telah dibersihkan.');
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert('Terjadi kesalahan saat mencoba menghapus data.');
    } finally {
      setIsDeleting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logika pengecekan ketersediaan data untuk ditampilkan di tabel
  const hasData = config.groomName.trim() !== "" || config.brideName.trim() !== "" || config.venueName.trim() !== "";

  return (
    <div className="w-full max-w-6xl space-y-10">
      <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Editor Undangan</h2>
            <p className="text-indigo-400 mt-1 font-medium italic">Atur detail hari bahagia Anda dengan mudah.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={onCreateNew}
              className="px-6 py-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all font-bold flex items-center gap-2 group whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Undangan Baru
            </button>
            <button 
              onClick={onBack}
              className="px-6 py-3 rounded-2xl glass-panel border-white/10 hover:bg-white hover:text-slate-950 transition-all font-bold flex items-center gap-2 group whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
              Kembali
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Profil Pasangan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">Mempelai Pria</label>
                  <input 
                    name="groomName"
                    value={config.groomName}
                    onChange={handleChange}
                    type="text" 
                    placeholder="Nama Mempelai Pria"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">Mempelai Wanita</label>
                  <input 
                    name="brideName"
                    value={config.brideName}
                    onChange={handleChange}
                    type="text" 
                    placeholder="Nama Mempelai Wanita"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
                Waktu & Tempat
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">Data ISO (Timer)</label>
                    <input 
                      name="eventDateIso"
                      value={config.eventDateIso}
                      onChange={handleChange}
                      type="datetime-local" 
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">Format Tampilan</label>
                    <input 
                      name="eventDateDisplay"
                      value={config.eventDateDisplay}
                      onChange={handleChange}
                      type="text" 
                      placeholder="Contoh: Sabtu, 15 Feb 2025"
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">Nama Venue</label>
                  <input 
                    name="venueName"
                    value={config.venueName}
                    onChange={handleChange}
                    type="text" 
                    placeholder="Nama Gedung / Tempat Acara"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">Alamat Lengkap</label>
                  <textarea 
                    name="venueAddress"
                    value={config.venueAddress}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Masukkan alamat lengkap lokasi..."
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                Pesan Khusus
              </h3>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-1">Pesan Penutup</label>
                <textarea 
                  name="message"
                  value={config.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Doa atau harapan bagi para tamu..."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>
            </section>

            <div className="p-8 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 text-center">
               <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
               </div>
               <h4 className="text-xl font-bold text-white mb-2">Sistem Siap Sinkronisasi</h4>
               <p className="text-slate-400 text-sm leading-relaxed">
                 Seluruh perubahan akan langsung tercermin pada portal undangan digital.
               </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={handlePublish}
                disabled={isPublishing || isDeleting}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sedang Mengirim...
                  </>
                ) : 'Publikasikan Undangan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-green-500 rounded-full" />
          <h3 className="text-2xl font-bold text-white tracking-tight">Status Undangan Aktif</h3>
        </div>

        {!hasData ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-white/5 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p className="text-slate-400 font-medium">Belum ada data undangan yang terdaftar di sistem.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-[0.2em] font-bold">
                  <th className="px-6 py-2">Nama Pasangan</th>
                  <th className="px-6 py-2">Waktu Acara</th>
                  <th className="px-6 py-2">Lokasi</th>
                  <th className="px-6 py-2 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="group bg-white/5 hover:bg-white/[0.08] transition-colors rounded-2xl">
                  <td className="px-6 py-5 first:rounded-l-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                        {(config.groomName?.[0] || 'A').toUpperCase()}{(config.brideName?.[0] || 'S').toUpperCase()}
                      </div>
                      <span className="text-white font-bold truncate max-w-[150px]">
                        {config.groomName || 'Pria'} & {config.brideName || 'Wanita'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-slate-300 font-medium whitespace-nowrap">{config.eventDateDisplay || "TBA"}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-slate-400 text-sm italic line-clamp-1 max-w-[200px]">{config.venueName || "TBA"}</span>
                  </td>
                  <td className="px-6 py-5 last:rounded-r-2xl text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={scrollToTop}
                        className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                        title="Edit Data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button 
                        onClick={handleDeleteAll}
                        disabled={isDeleting}
                        className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                        title="Hapus Seluruh Data"
                      >
                        {isDeleting ? (
                          <svg className="animate-spin h-[20px] w-[20px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
