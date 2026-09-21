"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-4 p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">İşlem Tamamlanamadı</span>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-neutral-500 hover:text-neutral-300 text-[11px]"
              >
                Kapat
              </button>
            )}
          </div>

          <p className="text-neutral-400 leading-relaxed">
            {message}
          </p>

          {onRetry && (
            <div className="pt-1">
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Tekrar Dene</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
