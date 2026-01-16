
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = "", disabled = false }) => {
  const base = "relative px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 overflow-hidden group";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};
