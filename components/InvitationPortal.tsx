
import React, { useState, useEffect } from 'react';
import { InvitationConfig, RSVP } from '../types';

interface InvitationPortalProps {
  config: InvitationConfig;
}

export const InvitationPortal: React.FC<InvitationPortalProps> = ({ config }) => {
  const [attendanceStatus, setAttendanceStatus] = useState<'yes' | 'no' | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [isExpired, setIsExpired] = useState(false);
  
  // Real RSVP State
  const [allRsvps, setAllRsvps] = useState<RSVP[]>([]);

  // Load RSVPs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('darul_huda_rsvps');
    if (saved) {
      setAllRsvps(JSON.parse(saved));
    }
  }, []);

  // Countdown and Expiry Logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (!config.eventDateIso) return;
      
      const eventDate = new Date(config.eventDateIso).getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        setIsExpired(true);
      } else {
        setIsExpired(false);
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
    if (isExpired) return;

    const status = attendanceStatus || 'no';
    
    const newRsvp: RSVP = {
      id: Date.now().toString(),
      name: guestName.trim() || (status === 'no' ? 'Seseorang' : 'Tamu Tanpa Nama'),
      count: status === 'yes' ? guestCount : 0,
      status: status,
      timestamp: new Date().toISOString()
    };

    const updatedRsvps = [newRsvp, ...allRsvps];
    setAllRsvps(updatedRsvps);
    localStorage.setItem('darul_huda_rsvps', JSON.stringify(updatedRsvps));
    setIsSuccess(true);
  };

  // Calculate stats from real data
  const totalConfirmedPeople = allRsvps
    .filter(r => r.status === 'yes')
    .reduce((sum, r) => sum + r.count, 0);

  const allGuestNames = allRsvps
    .filter(r => r.status === 'yes')
    .map(r => r.name);

  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto font-serif relative overflow-hidden flex flex-col items-center">
      
      {/* Expiry Seal Badge */}
      {isExpired && (
        <div className="absolute top-20 -right-4 z-50 animate-heartbeat pointer-events-none">
          <div className="bg-rose-600/90 border-2 border-rose-400 text-white font-display px-6 py-2 rotate-12 shadow-[0_0_20px_rgba(225,29,72,0.5)]">
            <p className="text-sm font-black tracking-widest uppercase">Undangan Kadaluarsa</p>
          </div>
        </div>
      )}

      <div className="absolute top-10 left-5 text-4xl animate-float opacity-60 pointer-events-none">🕌</div>
      <div className="absolute top-20 right-8 text-3xl animate-float-reverse delay-500 opacity-50 pointer-events-none">🌙</div>
      <div className="absolute top-40 left-10 text-2xl animate-sparkle delay-1000 opacity-70 pointer-events-none">✨</div>

      <div className="w-full gold-border rounded-[2.5rem] card-shadow overflow-hidden relative mt-4" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)' }}>
        
        <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f4e4ba, #d4af37, transparent)' }} />
        
        <div className="p-8 md:p-12 text-center relative">
          
          <div className="animate-fade-in-up">
            <p className="text-yellow-200/70 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase mb-2 font-bold leading-relaxed px-4">
              UNDANGAN DALAM RANGKA:
            </p>
            <div className="w-24 h-0.5 mx-auto mb-10" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
          </div>

          <div className="mb-12 space-y-4">
            <h1 className="font-script text-3xl md:text-4xl shimmer-text animate-fade-in-up delay-200 py-1 leading-tight whitespace-nowrap overflow-hidden text-ellipsis px-2">
              {config.line1 || "Judul Acara"}
            </h1>
            
            <p className="font-display text-lg md:text-xl text-yellow-100/90 animate-fade-in-up delay-400 font-medium tracking-wide">
              {config.line2}
            </p>

            <div className="py-2 animate-fade-in-up delay-600">
               <div className="inline-block px-8 py-2 border-y border-yellow-500/20">
                  <span className="text-3xl md:text-4xl font-bold tracking-[0.2em] text-yellow-500 font-display">
                    {config.line3}
                  </span>
               </div>
            </div>

            <p className="text-yellow-200/60 text-xs md:text-sm animate-fade-in-up delay-800 italic tracking-widest uppercase">
              {config.line4}
            </p>
          </div>

          {!isExpired ? (
            <div className="mb-12 animate-fade-in-up delay-700">
              <p className="text-yellow-200/60 text-[10px] tracking-[0.2em] uppercase mb-4">⏳ Menuju Pelaksanaan Acara</p>
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
          ) : (
            <div className="mb-12 animate-fade-in-up delay-700 py-4 glass-panel border-rose-500/20 rounded-2xl mx-4">
              <p className="text-rose-400 text-xs font-bold tracking-[0.3em] uppercase">Acara Telah Berlangsung</p>
            </div>
          )}

          {/* Conditional Muballigh Section */}
          {config.showMuballigh && config.muballighs.some(m => m.trim() !== "") && (
            <div className="mb-12 animate-fade-in-up delay-800">
              <div className="inline-flex items-center gap-2 text-yellow-200/40 text-[10px] tracking-[0.2em] uppercase mb-4">
                <div className="w-4 h-px bg-yellow-500/20" />
                <span>📢 Muballigh Acara</span>
                <div className="w-4 h-px bg-yellow-500/20" />
              </div>
              <div className="space-y-2">
                {config.muballighs.map((name, idx) => name.trim() !== "" && (
                  <p key={idx} className="font-display text-lg text-yellow-100 italic">
                    {name}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 my-10 animate-fade-in-up delay-1000">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
            <div className="text-2xl opacity-80">📖</div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>

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

          <div className="mt-12 p-6 rounded-3xl glass-panel animate-fade-in-up delay-1500 border-yellow-500/10">
            <p className="text-yellow-200/40 text-[10px] tracking-widest uppercase mb-3">💌 Pesan Khusus</p>
            <p className="text-yellow-100/90 text-sm leading-relaxed italic font-serif">
              "{config.message}"
            </p>
          </div>

          <div className="mt-12 border-t border-white/5 pt-10 animate-fade-in-up delay-1500">
            <p className="text-yellow-200/60 text-[10px] tracking-[0.2em] uppercase mb-6">✋ Konfirmasi Kehadiran</p>
            
            {isExpired ? (
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl opacity-60">
                <p className="text-slate-400 text-sm font-medium italic">Pendaftaran/Konfirmasi kehadiran telah ditutup karena waktu acara sudah terlewati.</p>
              </div>
            ) : !isSuccess ? (
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
                  onClick={() => { setIsSuccess(false); setAttendanceStatus(null); setGuestName(''); }}
                  className="mt-4 text-xs text-yellow-500/50 underline uppercase tracking-widest"
                >
                  Kirim Respon Lain
                </button>
              </div>
            )}
          </div>

          <div className="mt-10 animate-fade-in-up delay-[1.8s]">
            <div className="p-6 md:p-8 rounded-3xl glass-panel border-white/5" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))' }}>
              <p className="text-yellow-200/60 text-[10px] tracking-[0.1em] uppercase mb-3">👥 Tamu yang Akan Hadir</p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-4xl font-display text-yellow-100">{totalConfirmedPeople}</span>
                <span className="text-yellow-200/50 text-sm">orang</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 max-w-full">
                {allGuestNames.length > 0 ? (
                  allGuestNames.map((name, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] md:text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-200/60 hover:bg-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300"
                    >
                      {name}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-yellow-200/20 italic">Belum ada konfirmasi kehadiran.</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 py-4">
             <div className="flex items-center justify-center gap-2 text-yellow-200/30 text-[10px] tracking-widest uppercase">
               <span>🙏</span> <span>Darul Huda Portal</span> <span>🙏</span>
             </div>
          </div>

        </div>

        <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, #f4e4ba, #d4af37, transparent)' }} />
      </div>

      <div className="mt-8 mb-10 text-yellow-200/30 text-center animate-fade-in-up delay-2000">
        <p className="text-[10px] tracking-widest uppercase mb-2">Scroll untuk detail</p>
        <div className="scroll-indicator">
          <span className="text-2xl">↓</span>
        </div>
      </div>
    </div>
  );
};
