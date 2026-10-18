import { CheckCircleIcon } from "./icons";

interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-in">
      <div className="flex items-center gap-2.5 rounded-md border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
        <CheckCircleIcon className="h-4.5 w-4.5 shrink-0 text-[var(--color-accent)]" />
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{message}</p>
      </div>
    </div>
  );
}
