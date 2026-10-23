import { Component, type ErrorInfo, type ReactNode } from "react";
import i18n from "../i18n";

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
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by Sophy ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      // Clear potentially corrupt session keys if needed
      this.setState({ hasError: false, error: null });
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0e14] text-[#f1f5f9] p-6 select-none font-sans">
          <div className="max-w-md w-full border border-rose-500/30 bg-[#12161f] rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            
            <h2 className="text-base font-bold text-white mb-1">
              {i18n.t("app.errorTitle", "Bir Arayüz Hatası Oluştu")}
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {i18n.t(
                "app.errorDesc",
                "İstenen arayüz bileşeni yüklenirken beklenmeyen bir durum oluştu. Stüdyoyu güvenle sıfırlayabilirsiniz."
              )}
            </p>

            {this.state.error && (
              <pre className="text-[10px] font-mono text-rose-300/80 bg-black/40 p-2.5 rounded-lg w-full overflow-x-auto text-left mb-4 border border-rose-500/20 max-h-24">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs transition-colors shadow-lg shadow-sky-500/20"
            >
              {i18n.t("app.errorReset", "Stüdyoyu Yeniden Başlat")}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
