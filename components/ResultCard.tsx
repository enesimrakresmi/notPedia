"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download, Copy, Check, ExternalLink, RotateCcw } from "lucide-react";
import { SummarizeResponse } from "@/lib/types";

interface ResultCardProps {
  data: SummarizeResponse;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    try {
      const cleanTitle = (data.title || "wikipedia-ozet")
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç]/gi, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      const fileName = `${cleanTitle}-wikinot.md`;

      const fileHeader = `---
baslik: "${data.title}"
kaynak: "${data.originalUrl}"
dil: "${data.language}"
model: "Z.ai GLM-4.7-Flash"
tarih: "${new Date().toISOString().split("T")[0]}"
---

# ${data.title} - Wikipedia Notları

> Kaynak: ${data.originalUrl}  
> Hazırlayan: WikiNot  

---

`;

      const fullContent = fileHeader + data.markdown;
      const blob = new Blob([fullContent], { type: "text/markdown;charset=utf-8" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("İndirme hatası:", err);
      alert("Dosya indirilemedi.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Kopyalama başarısız oldu.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
      {/* Üst Bilgi & Eylemler */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2 text-neutral-400 mb-1">
            <span className="uppercase text-[11px] font-semibold tracking-wider text-neutral-300">
              {data.language || "TR"}
            </span>
            {data.wordCount && (
              <>
                <span>•</span>
                <span>{data.wordCount} kelime</span>
              </>
            )}
            <span>•</span>
            <a
              href={data.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white underline flex items-center gap-1"
            >
              <span>kaynak</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight">
            {data.title}
          </h2>
        </div>

        {/* Eylemler */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-neutral-200 text-black font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>İndir .md</span>
          </button>

          <button
            onClick={onReset}
            title="Yeni not çıkar"
            className="p-1.5 rounded text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Markdown İçerik */}
      <div className="p-6 sm:p-8">
        <article className="prose prose-invert prose-neutral max-w-none prose-headings:font-semibold prose-headings:text-white prose-h1:text-xl prose-h2:text-base prose-h2:border-b prose-h2:border-neutral-800 prose-h2:pb-2 prose-h2:mt-6 prose-p:text-neutral-300 prose-p:leading-relaxed prose-li:text-neutral-300 prose-strong:text-white prose-blockquote:border-l-neutral-700 prose-blockquote:text-neutral-400 prose-code:text-neutral-200 prose-code:bg-neutral-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.markdown}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};
