import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-neutral-900 bg-black/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white hover:opacity-80 transition-opacity">
          {/* Minimalist geometrik logo */}
          <span>WikiNot</span>
        </a>
      </div>
    </header>
  );
};
