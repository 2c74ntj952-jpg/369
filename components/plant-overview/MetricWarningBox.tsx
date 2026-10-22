'use client';

import React from 'react';
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { MetricDiagnostic } from '@/lib/metricDiagnostics';

interface MetricWarningBoxProps {
  diagnostic: MetricDiagnostic | null | undefined;
  className?: string;
  compact?: boolean;
}

export const MetricWarningBox: React.FC<MetricWarningBoxProps> = ({
  diagnostic,
  className = '',
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (!diagnostic || !diagnostic.isAbnormal) return null;

  const isDanger = diagnostic.severity === 'danger';

  if (compact) {
    return (
      <div
        className={`rounded-xl p-3 border border-l-4 text-xs transition-all bg-[#0c0c0e]/95 ${
          isDanger
            ? 'border-rose-500/35 border-l-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.12)]'
            : 'border-[#fad277]/35 border-l-[#fad277] text-amber-100 shadow-[0_0_15px_rgba(250,210,119,0.12)]'
        } ${className}`}
      >
        <div className="flex items-start gap-2.5">
          {isDanger ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[#fad277] shrink-0 mt-0.5" />
          )}
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-black text-[11px] text-white leading-tight">
                {diagnostic.problemTitle}
              </span>
              <span className={`font-mono uppercase tracking-wider text-[9.5px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                isDanger
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                  : 'bg-[#fad277]/15 text-[#fad277] border-[#fad277]/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDanger ? 'bg-rose-400' : 'bg-[#fad277]'}`} />
                <span>{diagnostic.currentValue} (Норма: {diagnostic.optimalRange})</span>
              </span>
            </div>
            <p className="text-[10.5px] leading-snug font-medium text-neutral-300">
              <strong className="font-bold text-white">Наслідок дії:</strong> {diagnostic.consequence}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-l-4 p-3 sm:p-3.5 shadow-md text-xs transition-all bg-[#0c0c0e]/95 ${
        isDanger
          ? 'border-rose-500/40 border-l-rose-500 text-rose-100 shadow-[0_0_16px_rgba(244,63,94,0.14)]'
          : 'border-[#fad277]/40 border-l-[#fad277] text-amber-100 shadow-[0_0_16px_rgba(250,210,119,0.14)]'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
            isDanger
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
              : 'bg-[#fad277]/15 border-[#fad277]/40 text-[#fad277]'
          }`}>
            {isDanger ? (
              <AlertCircle className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-black text-xs sm:text-sm text-white">
                {diagnostic.problemTitle}
              </span>
              <span className={`font-mono uppercase tracking-wider text-[9.5px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                isDanger
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                  : 'bg-[#fad277]/15 text-[#fad277] border-[#fad277]/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDanger ? 'bg-rose-400' : 'bg-[#fad277]'}`} />
                <span>Зараз: {diagnostic.currentValue}</span>
              </span>
            </div>
            <div className="font-mono text-[10px] text-neutral-400 font-medium mt-1">
              Цільова норма: <span className="font-bold text-[#d8f087]">{diagnostic.optimalRange}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          title={isExpanded ? 'Згорнути' : 'Розгорнути'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-2 text-[11px] leading-relaxed">
          <div className={`p-2.5 rounded-lg border ${
            isDanger
              ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
              : 'bg-amber-950/30 border-[#fad277]/30 text-amber-200'
          }`}>
            <span className="font-mono uppercase tracking-wider text-[10px] font-bold text-white flex items-center gap-1.5 mb-1">
              <span>⚠️</span>
              <span>Результат та наслідок для рослини:</span>
            </span>
            <p className="font-medium text-neutral-200">{diagnostic.consequence}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#161618] border border-[#d8f087]/25 text-neutral-200 flex items-start gap-2">
            <span className="text-[#d8f087] text-xs shrink-0 mt-0.5">💡</span>
            <div>
              <span className="font-mono uppercase tracking-wider text-[10px] font-bold text-[#d8f087] block mb-0.5">Рекомендована дія:</span>
              <span>{diagnostic.recommendation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
