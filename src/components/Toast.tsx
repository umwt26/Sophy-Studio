import { AlertCircleIcon, CheckCircleIcon } from "./icons";

export type ToastKind = "success" | "error";

interface ToastProps {
  message: string;
  kind?: ToastKind;
}

export function Toast({ message, kind = "success" }: ToastProps) {
  const isError = kind === "error";
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-in max-w-[min(640px,calc(100vw-32px))]">
      <div
        role={isError ? "alert" : "status"}
        className={`toast flex items-start gap-2.5 rounded-md border bg-[var(--color-app-surface)] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${
          isError ? "border-[var(--color-danger)]/40" : "border-[var(--color-app-border)]"
        }`}
      >
        {isError ? (
          <AlertCircleIcon className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[var(--color-danger)]" />
        ) : (
          <CheckCircleIcon className="h-4.5 w-4.5 shrink-0 mt-0.5 text-[var(--color-accent)]" />
        )}
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{message}</p>
      </div>
    </div>
  );
}
