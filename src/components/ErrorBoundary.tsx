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
        <div className="min-h-screen w-full flex items-center justify-center bg-[var(--color-app-bg)] text-[var(--color-text-primary)] p-6 select-none font-sans">
          <div className="max-w-md w-full border border-[var(--color-danger)]/30 bg-[var(--color-app-surface)] rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 flex items-center justify-center text-[var(--color-danger)] mb-4">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            
            <h2 className="text-base font-bold text-[var(--color-text-primary)] mb-1">
              {i18n.t("app.errorTitle", "Bir Arayüz Hatası Oluştu")}
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4 leading-relaxed">
              {i18n.t(
                "app.errorDesc",
                "İstenen arayüz bileşeni yüklenirken beklenmeyen bir durum oluştu. Stüdyoyu güvenle sıfırlayabilirsiniz."
              )}
            </p>

            {this.state.error && (
              <pre className="text-[0.625rem] font-mono text-[var(--color-danger)] bg-[var(--color-app-bg)] p-2.5 rounded-lg w-full overflow-x-auto text-left mb-4 border border-[var(--color-danger)]/20 max-h-24">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="btn btn-primary w-full"
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
