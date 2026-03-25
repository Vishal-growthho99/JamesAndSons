import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-transparent">
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-t-2 border-r-2 border-[#D4AF37] rounded-full animate-spin"></div>
        
        {/* Inner Pulsing Circle */}
        <div className="absolute inset-4 border border-[#B8860B]/30 rounded-full animate-pulse flex items-center justify-center">
            <span className="text-[#D4AF37] font-serif text-xl italic font-light tracking-widest ml-1">J&S</span>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-[#D4AF37] font-serif text-2xl tracking-[0.2em] uppercase font-light animate-pulse">
          Illuminating
        </h2>
        <p className="text-secondary/60 font-mono text-[10px] mt-2 tracking-[0.3em] uppercase">
          Curating Your Brilliance
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
