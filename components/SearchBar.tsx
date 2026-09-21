"use client";

import React, { useState } from "react";
import { Loader2, X, ClipboardPaste } from "lucide-react";

interface SearchBarProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  url,
  setUrl,
  onSubmit,
  isLoading,
  onClear,
}) => {
  const [pasteNotice, setPasteNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onSubmit(e);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setPasteNotice(true);
        setTimeout(() => setPasteNotice(false), 1500);
      }
    } catch {
      // Pano izni yoksa
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus-within:border-neutral-400 rounded-lg transition-colors p-1.5 shadow-sm">
          {/* Giriş Kutusu */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Wikipedia makale bağlantısı"
            disabled={isLoading}
            className="w-full bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none disabled:opacity-50"
            autoFocus
          />

          {/* Sağ Aksiyonlar */}
          <div className="flex items-center gap-1.5 pr-1">
            {url ? (
              <button
                type="button"
                onClick={onClear}
                disabled={isLoading}
                title="Temizle"
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                title="Panodan Yapıştır"
                className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition-colors"
              >
                <ClipboardPaste className="w-3 h-3" />
                <span>{pasteNotice ? "ok" : "yapıştır"}</span>
              </button>
            )}

            {/* Not Çıkar Butonu */}
            <button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-black font-medium text-xs rounded transition-colors disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-black" />
                  <span>Özetleniyor...</span>
                </>
              ) : (
                <span>Not Çıkar</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
