'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleWindowChunkError);
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
  }

  public componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('error', this.handleWindowChunkError);
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    }
  }

  private handleWindowChunkError = (event: ErrorEvent) => {
    const msg = event?.message || '';
    if (msg.includes('ChunkLoadError') || msg.includes('Loading chunk')) {
      this.tryAutoReloadOnChunkError();
    }
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const reason = event?.reason?.message || String(event?.reason || '');
    if (reason.includes('ChunkLoadError') || reason.includes('Loading chunk')) {
      this.tryAutoReloadOnChunkError();
    }
  };

  private tryAutoReloadOnChunkError = () => {
    if (typeof window !== 'undefined') {
      const reloaded = sessionStorage.getItem('auto_chunk_reload');
      if (!reloaded) {
        sessionStorage.setItem('auto_chunk_reload', '1');
        window.location.reload();
      }
    }
  };

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
    const msg = error?.message || '';
    if (msg.includes('ChunkLoadError') || msg.includes('Loading chunk')) {
      this.tryAutoReloadOnChunkError();
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auto_chunk_reload');
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0d0e11] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#181a20] border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Сталася тимчасова помилка</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Виникла проблема під час завантаження інтерфейсу. Ваш стан збережено локально.
            </p>
            {this.state.error && (
              <div className="bg-[#121317] p-3 rounded-xl border border-neutral-800/80 text-[11px] text-neutral-400 font-mono text-left overflow-auto max-h-28">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <RefreshCw size={16} /> Перезавантажити сторінку
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
