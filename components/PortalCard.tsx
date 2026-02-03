
import React from 'react';

interface PortalCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  onClick: () => void;
  primary?: boolean;
}

export const PortalCard: React.FC<PortalCardProps> = ({ 
  title, 
  description, 
  icon, 
  gradient, 
  onClick,
  primary = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl transition-all duration-500 overflow-hidden ${
        primary 
          ? 'w-full lg:w-80 h-80' 
          : 'w-full lg:w-72 h-72'
      }`}
    >
      {/* Background Layer */}
      <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 glass-panel group-hover:border-white/30 transition-colors duration-500" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
          {icon}
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-slate-400 text-sm mt-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            {description}
          </p>
        </div>

        <div className="pt-4">
          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-white group-hover:bg-white group-hover:text-slate-900 transition-all duration-300`}>
            Enter Portal
          </span>
        </div>
      </div>

      {/* Hover Decoration */}
      <div className={`absolute -bottom-1 -right-1 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br ${gradient}`} />
    </button>
  );
};
