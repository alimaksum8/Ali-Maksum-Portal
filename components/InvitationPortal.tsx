
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
  const [allRsvps, setAllRsvps] = useState<RSVP[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('darul_huda_rsvps');
    if (saved) setAllRsvps(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!config.eventDateIso) {
        setIsExpired(false);
        return;
      }
      
      const eventDate = new Date(config.eventDateIso).getTime();
      const now = new Date().getTime();
      
      // Jika format tanggal salah, getTime akan NaN
      if (isNaN(eventDate)) {
        setIsExpired(false);
        return;
      }

      const distance = eventDate - now;

      if (distance <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
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

  const totalConfirmedPeople = allRsvps.filter(r => r.status === 'yes').reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto font-serif relative overflow-hidden flex flex-col items-center">
      {isExpired && (
        <div className="absolute top-20 -right-4 z-50 animate-heartbeat pointer-events-none">
          <div className="bg-rose-600/90 border-2 border-rose-400 text-white font-display px-6 py-2 rotate-12 shadow-lg">
            <p className="text-sm font-black tracking-widest uppercase">Undangan Kadaluarsa</p>
          </div>
        </div>
      )}

      <div className="absolute top-10 left-5 text-4xl animate-float opacity-60">🕌</div>
      <div className="absolute top-20 right-8 text-3xl animate-float-reverse opacity-50">🌙</div>

      <div className="w-full gold-border rounded-[2.5rem] card-shadow overflow-hidden relative mt-4 bg-slate-900">
        <div className="h-2 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
        
        <div className="p-8 md:p-12 text-center">
          <p className="text-yellow-200/70 text-xs tracking-[0.3em] uppercase mb-10">UNDANGAN DALAM RANGKA:</p>

          <div className="mb-12 space-y-4">
            <h1 className="font-script text-4xl shimmer-text">{config.line1 || "Judul Acara"}</h1>
            <p className="font-display text-lg text-yellow-100/90">{config.line2}</p>
            <div className="py-2"><span className="text-4xl font-bold tracking-widest text-yellow-500 font-display border-y border-yellow-500/20 px-8 py-2">{config.line3}</span></div>
            <p className="text-yellow-200/60 text-xs italic tracking-widest uppercase">{config.line4}</p>
          </div>

          {!isExpired ? (
            <div className="mb-12 animate-in fade-in duration-700">
              <p className="text-yellow-200/60 text-[10px] tracking-[0.2em] uppercase mb-4">⏳ Menuju Acara</p>
              <div className="flex gap-2 justify-center">
                {Object.entries(timeLeft).map(([label, value]) => (
                  <div key={label} className="countdown-item min-w-[60px]">
                    <span className="text-2xl font-bold block text-yellow-100">{value}</span>
                    <span className="text-[8px] uppercase text-yellow-200/60">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-12 py-4 glass-panel border-rose-500/20 rounded-2xl mx-4">
              <p className="text-rose-400 text-xs font-bold tracking-widest uppercase">Acara Telah Berlangsung</p>
            </div>
          )}

          {config.showMuballigh && config.muballighs.some(m => m.trim() !== "") && (
            <div className="mb-12 border-y border-white/5 py-6">
              <p className="text-yellow-200/40 text-[10px] tracking-widest uppercase mb-4">📢 Muballigh</p>
              {config.muballighs.map((name, idx) => name.trim() !== "" && (
                <p key={idx} className="font-display text-lg text-yellow-100 italic">{name}</p>
              ))}
            </div>
          )}

          <div className="space-y-8 my-12">
            <div><p className="text-yellow-200/60 text-[10px] uppercase mb-1">📅 Tanggal</p><p className="font-display text-xl text-yellow-100">{config.eventDateDisplay || "TBA"}</p></div>
            <div><p className="text-yellow-200/60 text-[10px] uppercase mb-1">🕐 Waktu</p><p className="font-display text-xl text-yellow-100">{config.eventTime || "TBA"}</p></div>
            <div><p className="text-yellow-200/60 text-[10px] uppercase mb-1">📍 Tempat</p><p className="font-display text-xl text-yellow-100">{config.venueName || "TBA"}</p><p className="text-yellow-200/50 text-xs italic">{config.venueAddress}</p></div>
          </div>

          <div className="mt-12 p-6 rounded-3xl glass-panel border-yellow-500/10 italic text-yellow-100/90 text-sm">"{config.message}"</div>

          <div className="mt-12 border-t border-white/5 pt-10">
            <p className="text-yellow-200/60 text-[10px] uppercase mb-6 tracking-widest">✋ Konfirmasi Kehadiran</p>
            {isExpired ? (
              <p className="text-slate-500 text-sm italic">Pendaftaran ditutup karena acara sudah terlewati.</p>
            ) : !isSuccess ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button onClick={() => setAttendanceStatus('yes')} className={`flex-1 py-3 rounded-xl font-bold border transition-all ${attendanceStatus === 'yes' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>✓ Hadir</button>
                  <button onClick={() => { setAttendanceStatus('no'); handleConfirm(); }} className={`flex-1 py-3 rounded-xl font-bold border transition-all ${attendanceStatus === 'no' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>✗ Tidak</button>
                </div>
                {attendanceStatus === 'yes' && (
                  <div className="space-y-4 animate-in slide-in-from-top-2">
                    <input type="text" placeholder="Nama Anda..." value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/50"/>
                    <div className="flex items-center justify-between glass-panel p-3 rounded-xl">
                      <span className="text-xs text-yellow-200/50">Jumlah Tamu</span>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-8 h-8 rounded-lg bg-white/10 text-yellow-500">-</button>
                        <span className="text-lg text-white font-display">{guestCount}</span>
                        <button onClick={() => setGuestCount(guestCount + 1)} className="w-8 h-8 rounded-lg bg-white/10 text-yellow-500">+</button>
                      </div>
                    </div>
                    <button onClick={handleConfirm} className="w-full py-4 rounded-full font-bold text-slate-950 animate-pulse-glow bg-gradient-to-r from-yellow-600 to-yellow-300">Kirim Konfirmasi</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl animate-in zoom-in"><p className="text-green-400 font-bold">Terima Kasih!</p><p className="text-yellow-200/60 text-xs">Respon Anda telah tercatat.</p></div>
            )}
          </div>

          <div className="mt-10 p-6 rounded-3xl glass-panel bg-yellow-500/5">
            <p className="text-yellow-200/60 text-[10px] uppercase mb-3">👥 Daftar Tamu</p>
            <div className="flex items-center justify-center gap-2 mb-4"><span className="text-4xl font-display text-yellow-100">{totalConfirmedPeople}</span><span className="text-yellow-200/50 text-sm">orang</span></div>
            <div className="flex flex-wrap justify-center gap-2">
              {allRsvps.filter(r => r.status === 'yes').map((r, idx) => (
                <span key={idx} className="text-[10px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-200/60">{r.name}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="h-2 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
      </div>
    </div>
  );
};
