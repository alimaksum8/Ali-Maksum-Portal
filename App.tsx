
import React, { useState, useEffect } from 'react';
import { PortalView, InvitationConfig } from './types';
import { PortalCard } from './components/PortalCard';
import { InvitationPortal } from './components/InvitationPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { generatePortalGreeting } from './services/geminiService';
import { db, doc, onSnapshot, setDoc, auth, onAuthStateChanged, User } from './services/firebaseService';

const STORAGE_KEY = 'darul_huda_draft_config';

const App: React.FC = () => {
  const [view, setView] = useState<PortalView>(PortalView.LANDING);
  const [greeting, setGreeting] = useState<string>("Selamat datang kembali di Darul Huda Portal");
  const [isLoadingGreeting, setIsLoadingGreeting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Initial State Default
  const defaultConfig: InvitationConfig = {
    id: "default-event-2025",
    line1: "Maulid Nabi Muhammad Saw",
    line2: "Haul Masyayikh Pon-Pes Darul Huda",
    line3: "IKSADAH",
    line4: "Ikatan Alumni Santri Darul Huda",
    showMuballigh: true,
    muballighs: ["KH. Abdurrahman Wahid", "KH. Maimun Zubair"],
    eventDateIso: "2025-05-12T19:30",
    eventDateDisplay: "Senin, 12 Mei 2025",
    eventTime: "19:30 WIB - Selesai",
    venueName: "Halaman Utama Pon-Pes Darul Huda",
    venueAddress: "Jl. Pengarang No. 12, Jawa Timur",
    message: "Kami mengharap kehadiran Bapak/Ibu/Saudara/i dalam acara tahunan kami sebagai bentuk syukur dan mempererat tali silaturahmi."
  };

  const [invitationConfig, setInvitationConfig] = useState<InvitationConfig>(defaultConfig);

  // 1. Load data saat pertama kali mount & Sinkronisasi Realtime dengan Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const dataParam = urlParams.get('d');
    
    // Hapus sepenuhnya penyimpanan local dari browser
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Gagal menghapus penyimpanan local:", e);
    }

    // Prioritas 1: Data dari URL (untuk tamu / link unik)
    if (dataParam) {
      try {
        const decodedString = decodeURIComponent(escape(atob(dataParam)));
        const decodedData = JSON.parse(decodedString);
        setInvitationConfig(decodedData);
        setView(PortalView.INVITATION);
        return; 
      } catch (e) {
        console.error("Gagal mendekode data undangan dari link:", e);
      }
    }

    // Ambil data draf dari Firestore secara realtime
    const unsubscribe = onSnapshot(doc(db, "configs", "current"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as InvitationConfig;
        setInvitationConfig(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(data)) {
            return data;
          }
          return prev;
        });
      }
    }, (err) => {
      console.error("Gagal mengambil data dari Firestore:", err);
    });

    if (viewParam === 'invitation') setView(PortalView.INVITATION);
    if (viewParam === 'admin') setView(PortalView.ADMIN);

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  // 2. Kirim perubahan draf ke Firestore secara otomatis dengan Debounce 1 Detik
  useEffect(() => {
    const timer = setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      // Jangan timpa draf di Firestore jika sedang melihat link spesifik tamu (?d=...)
      if (!urlParams.get('d') && invitationConfig) {
        setDoc(doc(db, "configs", "current"), invitationConfig)
          .catch(err => console.error("Gagal menyinkronkan draf ke Firestore:", err));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [invitationConfig]);

  const handleCreateNew = () => {
    if (confirm('Mulai buat undangan baru? Seluruh data saat ini akan dikosongkan.')) {
      const newConfig: InvitationConfig = {
        id: `event-${Date.now()}`,
        line1: "",
        line2: "",
        line3: "",
        line4: "",
        showMuballigh: false,
        muballighs: [""],
        eventDateIso: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        eventDateDisplay: "",
        eventTime: "",
        venueName: "",
        venueAddress: "",
        message: ""
      };
      setInvitationConfig(newConfig);
    }
  };

  const handlePortalSwitch = async (targetView: PortalView) => {
    // Hindari manipulasi history jika berada di lingkungan blob: (sering terjadi di sandbox/preview)
    const isBlob = window.location.protocol === 'blob:';

    if (!isBlob) {
      try {
        const url = new URL(window.location.href);
        if (targetView === PortalView.LANDING) {
          url.searchParams.delete('view');
          url.searchParams.delete('d');
        } else {
          url.searchParams.set('view', targetView.toLowerCase());
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {
        console.warn("History API tidak tersedia atau gagal dijalankan:", e);
      }
    }

    setView(targetView);
    setIsLoadingGreeting(true);
    
    try {
      const role = targetView === PortalView.ADMIN ? 'admin' : 'guest';
      const newGreeting = await generatePortalGreeting(role);
      setGreeting(newGreeting);
    } catch (err) {
      setGreeting(targetView === PortalView.ADMIN ? "Selamat bekerja di Panel Admin." : "Selamat datang di Undangan Kami.");
    } finally {
      setIsLoadingGreeting(false);
    }
  };

  const AdminIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  );

  const InvitationIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col bg-slate-950 text-slate-200">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-rose-600/10 blur-[120px]" />
      </div>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 overflow-y-auto">
        {view === PortalView.LANDING && (
          <div className="text-center mb-16 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Sistem Online</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight uppercase">
              DARUL HUDA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 animate-gradient">PORTAL</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed min-h-[3rem]">
              {isLoadingGreeting ? "..." : greeting}
            </p>
          </div>
        )}

        {view === PortalView.LANDING && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl items-center animate-in zoom-in-95 duration-500">
            <PortalCard
              title="Admin Dashboard"
              description="Kelola konten undangan, analitik, dan konfigurasi portal secara efisien."
              icon={AdminIcon}
              gradient="from-indigo-600 to-blue-600"
              onClick={() => handlePortalSwitch(PortalView.ADMIN)}
              primary
            />
            <PortalCard
              title="UNDANGAN"
              description="Akses undangan eksklusif dan konfirmasi kehadiran tamu secara digital."
              icon={InvitationIcon}
              gradient="from-rose-600 to-orange-600"
              onClick={() => handlePortalSwitch(PortalView.INVITATION)}
            />
          </div>
        )}

        {view === PortalView.ADMIN && (
          authLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <svg className="animate-spin h-8 w-8 text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm text-slate-400 font-medium animate-pulse">Memverifikasi Sesi...</p>
            </div>
          ) : !user ? (
            <AdminLogin 
              onBack={() => handlePortalSwitch(PortalView.LANDING)} 
              onSuccess={() => {}} 
            />
          ) : (
            <AdminDashboard 
              config={invitationConfig} 
              onUpdate={setInvitationConfig} 
              onBack={() => handlePortalSwitch(PortalView.LANDING)}
              onCreateNew={handleCreateNew}
            />
          )
        )}

        {view === PortalView.INVITATION && (
          <div className="flex flex-col items-center w-full animate-in fade-in duration-1000">
            <button 
              onClick={() => handlePortalSwitch(PortalView.LANDING)}
              className="mb-8 px-6 py-2 rounded-full glass-panel border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white transition-all text-sm font-bold flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              KEMBALI KE PORTAL
            </button>
            <InvitationPortal config={invitationConfig} />
          </div>
        )}
      </main>

      <footer className="relative z-10 p-8 text-center border-t border-white/5">
        <p className="text-slate-500 text-sm font-medium">
          &copy; 2025 Darul Huda Digital Solutions • <span className="text-indigo-400/80">Vercel Ready</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
