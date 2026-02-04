
import React, { useState, useEffect } from 'react';
import { InvitationConfig } from '../types';

interface InvitationPortalProps {
  config: InvitationConfig;
}

export const InvitationPortal: React.FC<InvitationPortalProps> = ({ config }) => {
  const [attendanceStatus, setAttendanceStatus] = useState<'yes' | 'no' | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [showCopyStatus, setShowCopyStatus] = useState(false);

  // Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (!config.eventDateIso) return;
      
      const eventDate = new Date(config.eventDateIso).getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      } else {
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        
        setTimeLeft({
          days: String(d).padStart(2, '0'),
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0')
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config.eventDateIso]);

  const handleConfirm = () => {
    if (attendanceStatus === 'yes' && !guestName.trim()) {
      alert("Mohon masukkan nama Anda");
      return;
    }
    setIsSuccess(true);
  };

  const handleShare = async () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('view', 'invitation');
    const shareUrl = url.toString();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Undangan Pernikahan ${config.groomName} & ${config.brideName}`,
          url: shareUrl
        });
      } catch (err) { console.log(err); }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopyStatus(true);
      setTimeout(() => setShowCopyStatus(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto font-serif relative overflow-hidden flex flex-col items-center">
      
      {/* Floating Ornaments */}
      <div className="absolute top-10 left-5 text-4xl animate-float opacity-60 pointer-events-none">🌸</div>
      <div className="absolute top-20 right-8 text-3xl animate-float-reverse delay-500 opacity-50 pointer-events-none">✨</div>
      <div className="absolute top-40 left-10 text-2xl animate-sparkle delay-1000 opacity-70 pointer-events-none">💫</div>

      {/* Main Invitation Card */}
      <div className="w-full gold-border rounded-[2.5rem] card-shadow overflow-hidden relative mt-4" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)' }}>
        
        {/* Top Decorative Border */}
        <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f4e4ba, #d4af37, transparent)' }} />
        
        <div className="p-8 md:p-12 text-center relative">
          
          {/* Header */}
          <div className="animate-fade-in-up">
            <p className="text-yellow-200/70 text-sm tracking-[0.3em] uppercase mb-2">The Wedding of</p>
            <div className="w-24 h-0.5 mx-auto mb-10" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
          </div>

          {/* Couple Names */}
          <div className="mb-12">
            <h1 className="font-script text-6xl md:text-7xl shimmer-text animate-fade-in-up delay-200 py-6 leading-normal">
              {config.groomName || "Mempelai Pria"}
            </h1>
            <div className="my-2 animate-fade-in-up delay-400">
              <span className="text-4xl animate-heartbeat inline-block">💕</span>
            </div>
            <h1 className="font-script text-6xl md:text-7xl shimmer-text animate-fade-in-up delay-600 py-6 leading-normal">
              {config.brideName || "Mempelai Wanita"}
            </h1>
          </div>

          {/* Countdown Timer */}
          <div className="mb-12 animate-fade-in-up delay-700">
            <p className="text-yellow-200/60 text-[10px] tracking-[0.2em] uppercase mb-4">⏳ Menuju Hari Bahagia</p>
            <div className="flex gap-3 justify-center">
              <div className="countdown-item">
                <span className="text-2xl font-bold block text-yellow-100 font-display">{timeLeft.days}</span>
                <span className="text-[10px] uppercase text-yellow-200/60">Hari</span>
              </div>
              <div className="countdown-item">
                <span className="text-2xl font-bold block text-yellow-100 font-display">{timeLeft.hours}</span>
                <span className="text-[10px] uppercase text-yellow-200/60">Jam</span>
              </div>
              <div className="countdown-item">
                <span className="text-2xl font-bold block text-yellow-100 font-display">{timeLeft.minutes}</span>
                <span className="text-[10px] uppercase text-yellow-200/60">Menit</span>
              </div>
              <div className="countdown-item">
                <span className="text-2xl font-bold block text-yellow-100 font-display">{timeLeft.seconds}</span>
                <span className="text-[10px] uppercase text-yellow-200/60">Detik</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-10 animate-fade-in-up delay-1000">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
            <div className="text-2xl opacity-80">🕊️</div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>

          {/* Event Details */}
          <div className="space-y-8 animate-fade-in-up delay-1000">
            <div>
              <p className="text-yellow-200/60 text-[10px] tracking-[0.2em] uppercase mb-2">📅 Tanggal</p>
              <p className="font-display text-xl text-yellow-100 font-medium">{config.eventDateDisplay || "Belum ditentukan"}</p>
            </div>
            <div>
              <p className="text-yellow-200/60 text-[10px] tracking-[0.2em] uppercase mb-2">🕐 Waktu</p>
              <p className="font-display text-xl text-yellow-100 font-medium">{config.eventTime || "Segera"}</p>
            </div>
            <div>
              <p className="text-yellow-200/60 text-[10px] tracking-[0.2em] uppercase mb-2">📍 Tempat</p>
              <p className="font-display text-xl text-yellow-100 font-medium mb-1">{config.venueName || "Lokasi Acara"}</p>
              <p className="text-yellow-200/50 text-xs italic">{config.venueAddress}</p>
            </div>
          </div>

          {/* Message Section */}
          <div className="mt-12 p-6 rounded-3xl glass-panel animate-fade-in-up delay-1500 border-yellow-500/10">
            <p className="text-yellow-200/40 text-[10px] tracking-widest uppercase mb-3">💌 Pesan</p>
            <p className="text-yellow-100/90 text-sm leading-relaxed italic font-serif">
              "{config.message}"
            </p>
          </div>

          {/* RSVP Section */}
          <div className="mt-12 border-t border-white/5 pt-10 animate-fade-in-up delay-1500">
            <p className="text-yellow-200/60 text-[10px] tracking-[0.2em] uppercase mb-6">✋ Konfirmasi Kehadiran</p>
            
            {!isSuccess ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setAttendanceStatus('yes')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border ${attendanceStatus === 'yes' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
                  >
                    ✓ Hadir
                  </button>
                  <button 
                    onClick={() => { setAttendanceStatus('no'); handleConfirm(); }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all border ${attendanceStatus === 'no' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
                  >
                    ✗ Tidak
                  </button>
                </div>

                {attendanceStatus === 'yes' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <input 
                      type="text" 
                      placeholder="Nama Anda..." 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50 transition-colors"
                    />
                    <div className="flex items-center justify-between glass-panel p-3 rounded-xl border-white/5">
                      <span className="text-xs text-yellow-200/50 uppercase tracking-widest">Jumlah Tamu</span>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-8 h-8 rounded-lg bg-white/10 text-yellow-500 font-bold">-</button>
                        <span className="text-lg font-display text-white w-4">{guestCount}</span>
                        <button onClick={() => setGuestCount(guestCount + 1)} className="w-8 h-8 rounded-lg bg-white/10 text-yellow-500 font-bold">+</button>
                      </div>
                    </div>
                    <button 
                      onClick={handleConfirm}
                      className="w-full py-4 rounded-full font-bold text-slate-950 animate-pulse-glow"
                      style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f4e4ba 100%)' }}
                    >
                      Kirim Konfirmasi
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl animate-in zoom-in duration-500">
                <p className="text-green-400 font-bold text-lg mb-2">Terima Kasih!</p>
                <p className="text-yellow-200/60 text-xs">
                  {attendanceStatus === 'yes' ? "Konfirmasi kehadiran Anda telah tercatat." : "Terima kasih telah memberikan kabar."}
                </p>
                <button 
                  onClick={() => { setIsSuccess(false); setAttendanceStatus(null); }}
                  className="mt-4 text-xs text-yellow-500/50 underline uppercase tracking-widest"
                >
                  Ubah Respon
                </button>
              </div>
            )}
          </div>

          {/* Share Button */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <button 
              onClick={handleShare}
              className="w-full py-4 rounded-full bg-slate-900 border border-yellow-500/30 text-yellow-100 font-bold tracking-widest uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-yellow-500/10 transition-colors"
            >
              {showCopyStatus ? "✓ Link Disalin!" : "Bagikan Undangan"}
            </button>
          </div>

        </div>

        {/* Bottom Decorative Border */}
        <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f4e4ba, #d4af37, transparent)' }} />
      </div>

      {/* Scroll Indicator */}
      <div className="mt-8 mb-10 text-yellow-200/30 text-center animate-fade-in-up delay-2000">
        <p className="text-[10px] tracking-widest uppercase mb-2">Scroll untuk detail</p>
        <div className="scroll-indicator">
          <span className="text-2xl">↓</span>
        </div>
      </div>
    </div>
  );
};
