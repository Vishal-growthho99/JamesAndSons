'use client'

import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[400px] bg-background">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
        <div className="absolute inset-2 border border-primary/20 rounded-full animate-pulse flex items-center justify-center">
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <h2 className="text-primary font-mono text-xs tracking-[0.2em] uppercase animate-pulse">
          Synchronizing Data
        </h2>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
