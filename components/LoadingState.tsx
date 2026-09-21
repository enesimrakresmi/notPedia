"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STAGES = [
  "Wikipedia içeriği getiriliyor...",
  "Yapay zekâ analizi yapılıyor (GLM-4.7-Flash)...",
  "Markdown notları derleniyor...",
];

export const LoadingState: React.FC = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1800);
    const t2 = setTimeout(() => setStage(2), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-xs">
      <div className="flex items-center gap-2.5 text-neutral-300">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
        <span>{STAGES[stage]}</span>
      </div>

      <div className="mt-3 w-full h-1 bg-neutral-900 rounded overflow-hidden">
        <div
          className="h-full bg-neutral-400 transition-all duration-700 ease-out"
          style={{ width: stage === 0 ? "35%" : stage === 1 ? "75%" : "95%" }}
        />
      </div>
    </div>
  );
};
