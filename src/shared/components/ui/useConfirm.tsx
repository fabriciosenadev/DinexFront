// src/shared/components/ui/useConfirm.tsx
import { useCallback, useMemo, useRef, useState } from "react";
import ConfirmDialog, { type ConfirmDialogProps } from "./ConfirmDialog";

type Options = Partial<
  Omit<ConfirmDialogProps, "open" | "onConfirm" | "onCancel" | "message">
> & {
  /** Conteúdo do corpo da confirmação (string ou JSX) */
  message?: ConfirmDialogProps["message"];
};

/**
 * Hook para confirmação programática:
 * const { confirm, ConfirmDialogPortal } = useConfirm();
 * const ok = await confirm("Tem certeza?");
 */
export function useConfirm(defaults?: Options) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<Options | undefined>(defaults);
  const [loading, setLoading] = useState(false);

  // Guardamos o resolver da Promise para sinalizar o resultado ao chamador
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback(
    (message: Options["message"], options?: Options) => {
      setOpts({ ...defaults, ...options, message });
      setOpen(true);

      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    [defaults]
  );

  const handleCancel = useCallback(() => {
    if (loading) return;
    setOpen(false);
    resolverRef.current?.(false);
    resolverRef.current = null;
  }, [loading]);

  const handleConfirm = useCallback(async () => {
    try {
      setLoading(true);
      // Caso futuramente queira executar algo assíncrono antes de fechar,
      // este é o local ideal.
      setOpen(false);
      resolverRef.current?.(true);
    } finally {
      setLoading(false);
      resolverRef.current = null;
    }
  }, []);

  const dialog = useMemo(
    () => (
      <ConfirmDialog
        open={open}
        title={opts?.title ?? "Confirmar ação"}
        message={opts?.message ?? ""}
        confirmLabel={opts?.confirmLabel ?? "Confirmar"}
        cancelLabel={opts?.cancelLabel ?? "Cancelar"}
        variant={opts?.variant ?? "default"}
        loading={loading}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    ),
    [open, opts, loading, handleCancel, handleConfirm]
  );

  return {
    /** Abre o diálogo e resolve com true (confirmado) ou false (cancelado). */
    confirm,
    /** Elemento que deve ser renderizado uma única vez no JSX (ex.: no final da página). */
    ConfirmDialogPortal: dialog,
  };
}

export default useConfirm;
