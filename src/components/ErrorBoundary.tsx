import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/30">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Something went wrong</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs leading-relaxed">
              The interface encountered a runtime error. This is often caused by missing data or a temporary rendering glitch.
            </p>
            <div className="bg-zinc-900 rounded-2xl p-4 border border-white/5 text-left overflow-auto max-h-40">
              <code className="text-[10px] text-red-400 font-mono break-all">
                {this.state.error?.toString()}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all"
            >
              Reload Application
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              Clear Cache & Reset
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
