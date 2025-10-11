// src/shared/components/ui/ConfirmDialog.tsx
import { useEffect, useRef } from "react";

type Variant = "default" | "danger";

export type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message: string | React.ReactNode;

  confirmLabel?: string;
  cancelLabel?: string;

  variant?: Variant;          // "danger" pinta o botão principal de vermelho
  loading?: boolean;          // desabilita botões enquanto processa

  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Confirmar ação",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmCls =
    variant === "danger"
      ? "bg-red-600/90 hover:bg-red-600"
      : "bg-blue-600/90 hover:bg-blue-600";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onMouseDown={(e) => {
        // fechar ao clicar fora
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-2xl bg-slate-900 shadow-xl border border-slate-800 p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 id="confirm-title" className="text-lg font-semibold text-white">
            {title}
          </h3>
          <button
            type="button"
            className="text-slate-300 hover:text-white"
            onClick={onCancel}
            aria-label="Fechar"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="mt-3 text-slate-200">
          {typeof message === "string" ? (
            <p className="whitespace-pre-line">{message}</p>
          ) : (
            message
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white disabled:opacity-50 ${confirmCls}`}
          >
            {loading ? "Processando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
