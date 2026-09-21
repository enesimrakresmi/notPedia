"use client";

import React, { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { LoadingState } from "@/components/LoadingState";
import { ResultCard } from "@/components/ResultCard";
import { ErrorAlert } from "@/components/ErrorAlert";
import { SummarizeResponse } from "@/lib/types";

export default function HomePage() {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SummarizeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data: SummarizeResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "İşlem sırasında beklenmeyen bir hata oluştu."
        );
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Ağ bağlantı hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setError(null);
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setError(null);
  };

  const hasResult = !!result;

  return (
    <div className="w-full flex-1 flex flex-col justify-between px-4 sm:px-6 py-12 max-w-4xl mx-auto overflow-hidden">
      {/* Ana Çerçeve */}
      <div className="w-full flex flex-col items-center">
        {/* Next.js Tarzı Geometrik Çizim / Blueprint Çerçevesi (Sonuç yokken tam görünüm) */}
        <div className="relative w-full max-w-3xl mx-auto my-6 sm:my-10 px-6 py-10 sm:px-12 sm:py-16">
          {/* Geometrik Çizim Çizgileri ve Pusula Yayları */}
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Üst Yatay Çizgi (İki yana taşar) */}
            <div className="absolute top-0 -left-12 -right-12 h-px border-t border-dashed border-neutral-800" />

            {/* Orta Kılavuz Çizgi */}
            {!hasResult && (
              <div className="absolute top-[46%] -left-6 -right-6 h-px border-t border-dashed border-neutral-900" />
            )}

            {/* Alt Yatay Çizgi (İki yana taşar) */}
            <div className="absolute bottom-0 -left-12 -right-12 h-px border-b border-dashed border-neutral-800" />

            {/* Sol Dikey Çizgi (Yukarı ve aşağı taşar) */}
            <div className="absolute left-0 -top-12 -bottom-12 w-px border-l border-dashed border-neutral-800" />

            {/* Sağ Dikey Çizgi (Yukarı ve aşağı taşar) */}
            <div className="absolute right-0 -top-12 -bottom-12 w-px border-r border-dashed border-neutral-800" />

            {/* Sol Üst Geometrik Pusula Yayı / Dairesi */}
            <div className="absolute -top-7 -left-7 w-14 h-14 rounded-full border border-dashed border-neutral-700/60" />

            {/* Sağ Alt Geometrik Pusula Yayı / Dairesi */}
            <div className="absolute -bottom-9 -right-9 w-18 h-18 rounded-full border border-dashed border-neutral-700/60" />

            {/* Kesişim Artı İşaretleri (+) */}
            <span className="absolute -top-2 -left-1 text-neutral-600 text-xs font-mono select-none">+</span>
            <span className="absolute -top-2 -right-1 text-neutral-600 text-xs font-mono select-none">+</span>
            <span className="absolute -bottom-2 -left-1 text-neutral-600 text-xs font-mono select-none">+</span>
            <span className="absolute -bottom-2 -right-1 text-neutral-600 text-xs font-mono select-none">+</span>
          </div>

          {/* Çerçeve İçi İçerik */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Başlık ve Açıklama */}
            {!hasResult && (
              <div className="text-center mb-8 space-y-3">
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
                  WikiNot
                </h1>
                <p className="text-sm sm:text-base text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Wikipedia makalelerinden yapay zekâ ile araştırma notları çıkarın.
                </p>
              </div>
            )}

            {/* Arama / URL Giriş Çubuğu */}
            <div className="w-full">
              <SearchBar
                url={url}
                setUrl={setUrl}
                onSubmit={handleSummarize}
                isLoading={isLoading}
                onClear={handleClear}
              />
            </div>
          </div>
        </div>

        {/* Hata Durumu */}
        {error && (
          <ErrorAlert
            message={error}
            onRetry={handleSummarize}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Yükleniyor Durumu */}
        {isLoading && <LoadingState />}

        {/* Sonuç Kartı */}
        {hasResult && !isLoading && (
          <ResultCard data={result} onReset={handleReset} />
        )}

        {/* Geometrik Next.js Tarzı 3 Özellik Kartı (Sonuç yokken) */}
        {!hasResult && !isLoading && !error && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-12 pt-8 border-t border-neutral-900 text-xs">
            <div className="p-4 rounded-lg border border-neutral-800/80 bg-neutral-950/40 hover:border-neutral-700 transition-colors">
              <h3 className="font-medium text-white mb-1">
                Metin Çıkarımı
              </h3>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                MediaWiki API üzerinden reklamsız saf ve temiz metin ayrıştırma.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-neutral-800/80 bg-neutral-950/40 hover:border-neutral-700 transition-colors">
              <h3 className="font-medium text-white mb-1">
                Yapay Zekâ Özeti
              </h3>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                GLM-4.7-Flash ile özet, kritik maddeler ve anahtar kavramlar.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-neutral-800/80 bg-neutral-950/40 hover:border-neutral-700 transition-colors">
              <h3 className="font-medium text-white mb-1">
                Markdown Dışa Aktarma
              </h3>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Obsidian ve Notion uyumlu .md çıktısı ve tek tıkla indirme.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sade Footer */}
      <footer className="w-full pt-12 pb-4 text-center text-xs text-neutral-600 border-t border-neutral-900 mt-12">
        <span>WikiNot</span>
      </footer>
    </div>
  );
}
