
import React, { useState, useEffect } from 'react';
import { InvitationConfig } from '../types';

interface InvitationPortalProps {
  config: InvitationConfig;
}

export const InvitationPortal: React.FC<InvitationPortalProps> = ({ config }) => {
  const [guestCount, setGuestCount] = useState(1);
  const [attendanceStatus, setAttendanceStatus] = useState<'yes' | 'no' | null>(null);
  const [guestName, setGuestName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [showCopyStatus, setShowCopyStatus] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const checkExpiration = () => {
      if (!config.eventDateIso) return;
      const eventDate = new Date(config.eventDateIso).getTime();
      const now = new Date().getTime();
      if (now > eventDate) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
      }
    };

    checkExpiration();
    const timer = setInterval(() => {
      if (!config.eventDateIso) return;
      
      const eventDate = new Date(config.eventDateIso).getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [config.eventDateIso]);

  const handleConfirm = () => {
    if (isExpired || !guestName.trim()) return;
    setIsSuccess(true);
  };

  const resetForm = () => {
    if (isExpired) return;
    setAttendanceStatus(null);
    setGuestName('');
    setGuestCount(1);
    setIsSuccess(false);
  };

  const handleShareLink = async () => {
    if (isExpired) return;
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'invitation');
    const shareUrl = url.toString();
    const shareData = {
      title: `Undangan Pernikahan ${config.groomName} & ${config.brideName}`,
      text: `Halo! Kami mengundang Anda untuk hadir di acara pernikahan kami. Lihat detail lengkapnya di sini:`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShowCopyStatus(true);
        setTimeout(() => setShowCopyStatus(false), 3000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  };

  return (
    <div className={`w-full max-w-md md:max-w-4xl mx-auto gold-border rounded-[2.5rem] card-shadow overflow-hidden relative font-serif transition-all duration-500 mb-20 ${isExpired ? 'grayscale-[0.5]' : ''}`} style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)' }}>
      
      {/* Expiration Watermark Layer */}
      {isExpired && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="transform -rotate-45 border-[10px] border-red-500/40 px-12 py-6 rounded-3xl animate-in zoom-in-50 duration-700 bg-slate-900/40 backdrop-blur-[2px]">
            <h2 className="text-5xl md:text-8xl font-black text-red-500/60 uppercase tracking-[0.2em] font-sans">KADALUARSA</h2>
          </div>
        </div>
      )}

      {/* Block all clicks when expired */}
      {isExpired && (
        <div className="absolute inset-0 z-[95] bg-transparent cursor-not-allowed" title="Undangan ini sudah kadaluarsa" />
      )}

      {/* Top Gold Bar */}
      <div className="h-2 w-full relative z-10" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f4e4ba, #d4af37, transparent)' }} />
      
      <div className={`p-8 md:p-12 lg:p-16 text-center relative overflow-visible ${isExpired ? 'pointer-events-none' : ''}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle" style={{ animationDelay: '0.2s' }} />
          <div className="absolute top-20 right-16 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-sparkle" style={{ animationDelay: '0.7s' }} />
          <div className="absolute bottom-32 left-20 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle" style={{ animationDelay: '1s' }} />
        </div>

        {/* Hero Section */}
        <div className="max-w-2xl mx-auto relative z-10 overflow-visible">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-yellow-200/70 text-sm md:text-base tracking-[0.4em] uppercase mb-4">Pernikahan Suci Dari</p>
            <div className="w-24 md:w-32 h-0.5 mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
          </div>

          <div className="relative overflow-visible">
            <div className="relative z-50 py-4 overflow-visible">
              <h1 className="font-script text-7xl md:text-9xl shimmer-text animate-fade-in-up px-16 block overflow-visible select-none leading-[1.6] py-8" style={{ animationDelay: '0.4s' }}>
                {config.groomName || "Mempelai Pria"}
              </h1>
            </div>
            
            <div className="relative z-30 my-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <span className="text-4xl md:text-5xl animate-heartbeat inline-block">💕</span>
            </div>
            
            <div className="relative z-50 py-4 overflow-visible">
              <h1 className="font-script text-7xl md:text-9xl shimmer-text animate-fade-in-up px-16 block overflow-visible select-none leading-[1.6] py-8" style={{ animationDelay: '0.8s' }}>
                {config.brideName || "Mempelai Wanita"}
              </h1>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="mb-16 mt-10 animate-fade-in-up max-w-3xl mx-auto relative z-20" style={{ animationDelay: '1s' }}>
          <p className="text-yellow-200/60 text-xs md:text-sm tracking-[0.3em] uppercase mb-6">⏳ Menuju Hari Bahagia</p>
          <div className="grid grid-cols-4 gap-3 md:gap-6 justify-center">
            {[
              { label: 'Hari', val: timeLeft.days },
              { label: 'Jam', val: timeLeft.hours },
              { label: 'Menit', val: timeLeft.minutes },
              { label: 'Detik', val: timeLeft.seconds }
            ].map((item, idx) => (
              <div key={idx} className="countdown-item py-4 md:py-8">
                <span className="text-3xl md:text-5xl font-bold block text-yellow-100 mb-1">{item.val}</span>
                <span className="text-[10px] md:text-xs uppercase text-yellow-200/60 tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Details & RSVP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start text-left max-w-5xl mx-auto relative z-20">
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center gap-4 mb-6 md:justify-start justify-center">
              <div className="flex-1 h-px md:hidden" style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }} />
              <div className="text-2xl">🕊️</div>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
            </div>

            <div className="space-y-6">
              <div className="relative py-6 px-6 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 hover:border-yellow-500/30 transition-colors group">
                <p className="text-yellow-200/60 text-xs tracking-[0.2em] uppercase mb-2">📅 Tanggal Acara</p>
                <p className="font-display text-2xl text-yellow-100 group-hover:text-white transition-colors">{config.eventDateDisplay || "Akan Segera Dikabari"}</p>
              </div>
              
              <div className="relative py-6 px-6 bg-yellow-500/5 rounded-2xl border border-yellow-500/10 hover:border-yellow-500/30 transition-colors group">
                <p className="text-yellow-200/60 text-xs tracking-[0.2em] uppercase mb-2">📍 Lokasi</p>
                <p className="font-display text-2xl text-yellow-100 group-hover:text-white transition-colors">{config.venueName || "Lokasi Rahasia"}</p>
                <p className="text-yellow-200/50 text-sm md:text-base mt-2 leading-relaxed">{config.venueAddress || "Detail lokasi akan diinformasikan kemudian."}</p>
              </div>
            </div>
          </div>

          <div className="mt-0 animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
            <div className="bg-white/5 p-8 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl -z-10" />
               <p className="text-yellow-200/60 text-xs md:text-sm tracking-[0.2em] uppercase mb-6 md:text-left text-center">✋ Konfirmasi Kehadiran</p>
              {!isSuccess ? (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <button onClick={() => setAttendanceStatus('yes')} className={`flex-1 py-4 px-4 rounded-xl font-bold transition-all border-2 text-sm md:text-base ${attendanceStatus === 'yes' ? 'bg-green-500/40 border-green-500 text-green-300 scale-[1.02]' : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'}`}> ✓ Hadir </button>
                    <button onClick={() => { setAttendanceStatus('no'); setIsSuccess(true); }} className={`flex-1 py-4 px-4 rounded-xl font-bold transition-all border-2 text-sm md:text-base ${attendanceStatus === 'no' ? 'bg-red-500/40 border-red-500 text-red-300 scale-[1.02]' : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'}`}> ✗ Tidak Hadir </button>
                  </div>
                  {attendanceStatus === 'yes' && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="text-left">
                        <label className="text-yellow-200/40 text-[10px] uppercase font-bold tracking-widest mb-2 block ml-1">Nama Lengkap Anda</label>
                        <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Masukkan nama Anda..." className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-yellow-500/50 text-yellow-100 outline-none transition-all placeholder:text-slate-600" />
                      </div>
                      <div className="text-left">
                        <label className="text-yellow-200/40 text-[10px] uppercase font-bold tracking-widest mb-2 block ml-1">Jumlah Tamu</label>
                        <div className="flex items-center gap-4 bg-white/5 rounded-xl p-2 border border-white/5">
                          <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-12 h-12 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors text-xl font-bold">−</button>
                          <span className="flex-1 text-center font-display text-2xl text-yellow-100">{guestCount}</span>
                          <button onClick={() => setGuestCount(guestCount + 1)} className="w-12 h-12 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors text-xl font-bold">+</button>
                        </div>
                      </div>
                      <button onClick={handleConfirm} className="w-full text-slate-900 font-bold py-5 px-8 rounded-2xl animate-pulse-glow hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-yellow-500/10" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4e4ba 100%)' }}> ✓ Kirim Konfirmasi </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-10 rounded-[2rem] text-center bg-green-500/5 border border-green-500/20 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <h3 className="text-green-400 text-2xl font-bold mb-2">{attendanceStatus === 'no' ? 'Notifikasi Terkirim' : 'Konfirmasi Berhasil!'}</h3>
                  <p className="text-yellow-200/60 text-sm md:text-base leading-relaxed mb-8">{attendanceStatus === 'no' ? 'Terima kasih atas kabarnya. Kami menghargai perhatian Anda.' : 'Terima kasih telah mengonfirmasi kehadiran Anda. Sampai jumpa di hari bahagia kami!'}</p>
                  <button onClick={resetForm} className="py-3 px-8 rounded-xl font-bold bg-white/5 border border-white/10 text-yellow-400 hover:bg-white/10 transition-all text-sm uppercase tracking-widest"> 🔄 Perbarui Konfirmasi </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-16 pt-12 border-t border-yellow-500/10 max-w-lg mx-auto animate-fade-in-up relative z-20" style={{ animationDelay: '1.8s' }}>
          <p className="text-yellow-200/40 text-[10px] uppercase font-bold tracking-[0.3em] mb-6">Bagikan Undangan Ini</p>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-300 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <button onClick={handleShareLink} className="relative w-full flex items-center justify-center gap-4 px-10 py-5 rounded-full bg-slate-900 border border-yellow-500/30 text-yellow-100 hover:bg-slate-800 transition-all duration-300 active:scale-95">
              {showCopyStatus ? (
                 <span className="flex items-center gap-2 text-green-400 animate-in fade-in zoom-in-95 font-bold">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                   Link Berhasil Disalin!
                 </span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500 group-hover:scale-110 transition-transform"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  <span className="font-bold tracking-[0.2em] uppercase text-sm">Bagikan Undangan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Closing */}
        <div className="mt-20 max-w-2xl mx-auto opacity-60 text-xs md:text-sm tracking-[0.2em] flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up relative z-20" style={{ animationDelay: '2s' }}>
           <span className="hidden md:inline">✨</span>
           <span className="text-center font-medium uppercase">Terima Kasih Atas Doa Dan Restunya</span>
           <span className="hidden md:inline">✨</span>
        </div>
      </div>

      {/* Bottom Gold Bar */}
      <div className="h-2 w-full relative z-10" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f4e4ba, #d4af37, transparent)' }} />
    </div>
  );
};
