import React, { useState, useEffect } from 'react';
import { PortalView, InvitationConfig } from './types';
import { PortalCard } from './components/PortalCard';
import { InvitationPortal } from './components/InvitationPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { generatePortalGreeting } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<PortalView>(PortalView.LANDING);
  const [greeting, setGreeting] = useState<string>("Welcome back to Ali Maksum Portal");
  const [isLoadingGreeting, setIsLoadingGreeting] = useState(false);

  // Invitation Configuration State
  const [invitationConfig, setInvitationConfig] = useState<InvitationConfig>({
    groomName: "Arman",
    brideName: "Sinta",
    eventDateIso: "2025-02-15T10:00",
    eventDateDisplay: "Sabtu, 15 Februari 2025",
    eventTime: "10:00 WIB - Selesai",
    venueName: "Grand Ballroom Hotel Mulia",
    venueAddress: "Jl. Asia Afrika No. 8, Jakarta Selatan",
    message: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu."
  });

  // Handle direct link navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    
    if (viewParam === 'invitation') {
      setView(PortalView.INVITATION);
    }
  }, []);

  const handleCreateNew = () => {
    if (confirm('Mulai buat undangan baru? Data yang belum disimpan mungkin akan hilang.')) {
      setInvitationConfig({
        groomName: "",
        brideName: "",
        eventDateIso: "",
        eventDateDisplay: "",
        eventTime: "",
        venueName: "",
        venueAddress: "",
        message: ""
      });
    }
  };

  // Decorative SVG Icons
  const AdminIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  );

  const InvitationIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );

  const handlePortalSwitch = async (targetView: PortalView) => {
    if (targetView === PortalView.LANDING) {
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      window.history.replaceState({}, '', url.toString());
      
      setView(targetView);
      setGreeting("Welcome back to Ali Maksum Portal");
      return;
    }

    setIsLoadingGreeting(true);
    setView(targetView);
    
    const role = targetView === PortalView.ADMIN ? 'admin' : 'guest';
    const newGreeting = await generatePortalGreeting(role);
    setGreeting(newGreeting);
    setIsLoadingGreeting(false);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col bg-slate-950 text-slate-200">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-rose-600/10 blur-[120px]" />
      </div>

      {/* Main Container */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 overflow-y-auto">
        
        {/* Header Section */}
        {view === PortalView.LANDING && (
          <div className="text-center mb-16 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">System Online</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              ALI MAKSUM <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 animate-gradient">PORTAL</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed min-h-[3rem]">
              {isLoadingGreeting ? (
                <span className="inline-flex space-x-1">
                  <span className="animate-bounce delay-75">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </span>
              ) : greeting}
            </p>
          </div>
        )}

        {/* Portal Selection View */}
        {view === PortalView.LANDING && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl items-center animate-in zoom-in-95 duration-500">
            <PortalCard
              title="Admin Dashboard"
              description="Kelola konten undangan, analitik, dan konfigurasi portal."
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

        {/* Admin View */}
        {view === PortalView.ADMIN && (
          <AdminDashboard 
            config={invitationConfig} 
            onUpdate={setInvitationConfig} 
            onBack={() => handlePortalSwitch(PortalView.LANDING)}
            onCreateNew={handleCreateNew}
          />
        )}

        {/* Invitation View */}
        {view === PortalView.INVITATION && (
          <div className="flex flex-col items-center w-full animate-in fade-in duration-1000">
            {!(new URLSearchParams(window.location.search).get('view') === 'invitation') && (
              <button 
                onClick={() => handlePortalSwitch(PortalView.LANDING)}
                className="mb-8 px-6 py-2 rounded-full glass-panel border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white transition-all text-sm font-bold flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                BACK TO PORTAL
              </button>
            )}
            <InvitationPortal config={invitationConfig} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-8 text-center border-t border-white/5">
        <p className="text-slate-500 text-sm font-medium">
          &copy; 2025 Ali Maksum Digital Solutions • <span className="text-indigo-400/80">Premium Experience</span>
        </p>
      </footer>
    </div>
  );
};

export default App;