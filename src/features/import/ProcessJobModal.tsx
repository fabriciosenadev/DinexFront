// src/features/import/ProcessJobModal.tsx
import { useEffect, useMemo, useState } from "react";
import { X, PlayCircle, Info } from "lucide-react";
import { notification } from "../../shared/services/notification";
import {
  BrokerResolutionMode,
  type BrokerResolutionMode as BrokerResolutionModeType,
  type WalletDTO,
  type BrokerDTO,
  type ProcessImportJobRequest,
} from "./import.model";

type Stats = { total: number; imported: number; errors: number };

export function ProcessJobModal(props: {
  open: boolean;
  jobId: string | null;
  onClose: () => void;
  onSubmit: (jobId: string, body: ProcessImportJobRequest) => Promise<void>;
  loadWallets: () => Promise<WalletDTO[]>;
  loadBrokers: () => Promise<BrokerDTO[]>;
  /** opcional: mostra resumo (melhora muito a clareza) */
  stats?: Stats;
}) {
  const { open, jobId, onClose, onSubmit, loadWallets, loadBrokers, stats } = props;

  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<WalletDTO[]>([]);
  const [brokers, setBrokers] = useState<BrokerDTO[]>([]);

  // Carteira (obrigatório)
  const [walletId, setWalletId] = useState<string>("");
  const [walletTouched, setWalletTouched] = useState(false);

  // Corretora
  const [brokerMode, setBrokerMode] =
    useState<BrokerResolutionModeType>(BrokerResolutionMode.FromFile);
  const [brokerId, setBrokerId] = useState<string>("");
  const [brokerTouched, setBrokerTouched] = useState(false);

  const needsBrokerId = brokerMode === BrokerResolutionMode.FromScreen;

  useEffect(() => {
    if (!open) return;

    // reset ao abrir
    setWalletId("");
    setWalletTouched(false);
    setBrokerMode(BrokerResolutionMode.FromFile);
    setBrokerId("");
    setBrokerTouched(false);

    (async () => {
      try {
        setLoading(true);
        const [w, b] = await Promise.all([loadWallets(), loadBrokers()]);
        setWallets(w ?? []);
        setBrokers(b ?? []);
        if (w?.length === 1) setWalletId(w[0].id);
      } catch {
        notification.error("Falha ao carregar carteiras/corretoras.");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, loadWallets, loadBrokers]);

  // Resumo opcional de linhas (usa a mesma regra que você já usou)
  const remainingValid = useMemo(() => {
    if (!stats) return undefined;
    const total = stats.total ?? 0;
    const imported = stats.imported ?? 0;
    const errors = stats.errors ?? 0;

    return total === imported
      ? Math.max(0, total - errors)
      : Math.max(0, total - imported - errors);
  }, [stats]);

  const valid = useMemo(() => {
    if (!jobId) return false;
    if (!walletId) return false;
    if (needsBrokerId && !brokerId) return false;
    return true;
  }, [jobId, walletId, needsBrokerId, brokerId]);

  async function handleSubmit() {
    if (!valid || !jobId) return;

    const carteiraNome = wallets.find(w => w.id === walletId)?.name ?? "(não encontrada)";
    const corretoraNome =
      brokerMode === BrokerResolutionMode.FromScreen
        ? brokers.find(b => b.id === brokerId)?.name ?? "(selecionar)"
        : "Ler do arquivo (nome da corretora no extrato)";

    const resumo = [
      `Carteira: ${carteiraNome}`,
      `Corretora: ${corretoraNome}`,
      remainingValid !== undefined
        ? `Linhas estimadas a processar: ${remainingValid}`
        : undefined,
    ]
      .filter(Boolean)
      .join("\n");

    const ok = window.confirm(`Confirmar processamento?\n\n${resumo}`);
    if (!ok) return;

    const body: ProcessImportJobRequest = {
      walletId,
      brokerMode,
      brokerId: needsBrokerId ? brokerId : null,
    };

    await onSubmit(jobId, body);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-[61] w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex flex-col gap-1">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-green-400" />
              Processar importação
            </h3>
            <p className="text-slate-400 text-sm">
              Escolha a carteira e como será definida a corretora para as operações.
            </p>
          </div>
          <button aria-label="Fechar" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Resumo (se disponível) */}
        {typeof remainingValid === "number" && (
          <div className="px-5 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                Total: {stats!.total}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                Importadas: {stats!.imported}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                Erros: {stats!.errors}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-900/40 text-emerald-300 border border-emerald-700">
                Estimativa a processar: {remainingValid} linhas válidas
              </span>
            </div>
          </div>
        )}

        {/* Corpo */}
        <div className="px-5 py-4 space-y-5">
          {/* Passo 1 — Carteira */}
          <div className="rounded-xl border border-slate-700 p-3">
            <div className="text-sm text-slate-200 font-semibold mb-2">1. Escolha a carteira</div>

            <label className="block text-sm text-slate-300 mb-1">Carteira (obrigatória)</label>
            <select
              disabled={loading}
              value={walletId}
              onChange={(e) => { setWalletId(e.target.value); setWalletTouched(true); }}
              onBlur={() => setWalletTouched(true)}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
            >
              <option value="">Selecione…</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            {!walletId && walletTouched && (
              <div className="text-xs text-red-300 mt-1">Selecione uma carteira para continuar.</div>
            )}
            <p className="text-xs text-slate-400 mt-1">
              Todas as operações geradas ficarão nessa carteira.
            </p>
          </div>

          {/* Passo 2 — Corretora */}
          <div className="rounded-xl border border-slate-700 p-3">
            <div className="text-sm text-slate-200 font-semibold mb-2">2. Como identificar a corretora?</div>

            <div className="flex flex-col gap-2">
              <label className="inline-flex items-center gap-2 text-slate-200">
                <input
                  type="radio"
                  name="brokerMode"
                  value="FromFile"
                  checked={brokerMode === BrokerResolutionMode.FromFile}
                  onChange={() => setBrokerMode(BrokerResolutionMode.FromFile)}
                />
                Ler do arquivo (tentar mapear pelo nome da corretora no extrato)
              </label>
              <label className="inline-flex items-center gap-2 text-slate-200">
                <input
                  type="radio"
                  name="brokerMode"
                  value="FromScreen"
                  checked={brokerMode === BrokerResolutionMode.FromScreen}
                  onChange={() => setBrokerMode(BrokerResolutionMode.FromScreen)}
                />
                Definir aqui (usar a mesma corretora para todas as linhas)
              </label>
            </div>

            {needsBrokerId ? (
              <div className="mt-2">
                <label className="block text-sm text-slate-300 mb-1">Corretora (obrigatória)</label>
                <select
                  disabled={loading}
                  value={brokerId}
                  onChange={(e) => { setBrokerId(e.target.value); setBrokerTouched(true); }}
                  onBlur={() => setBrokerTouched(true)}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-slate-100"
                >
                  <option value="">Selecione…</option>
                  {brokers.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {!brokerId && brokerTouched && (
                  <div className="text-xs text-red-300 mt-1">Selecione uma corretora.</div>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  Esta corretora será aplicada a todas as linhas processadas.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                O sistema tentará mapear automaticamente pela coluna de corretora no arquivo.
              </p>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700">
            Cancelar
          </button>
          <button
            disabled={!valid}
            onClick={() => void handleSubmit()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title={valid ? "Iniciar processamento" : "Preencha os campos obrigatórios"}
          >
            <PlayCircle className="w-4 h-4" />
            Processar
          </button>
        </div>
      </div>
    </div>
  );
}
