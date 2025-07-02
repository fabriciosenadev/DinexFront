import { useEffect, useState } from "react";
import { createWallet, updateWallet, type WalletDTO, type CreateWalletCommand, type UpdateWalletCommand } from "./wallet.service";
import { notification } from "../../shared/services/notification";

type WalletFormProps = {
  wallet?: WalletDTO | null; // se null/criação, se objeto/edição
  onSuccess: () => void;
  onCancel?: () => void;
  userId: string | undefined;
};

const DEFAULT_CURRENCIES = [
  { value: "BRL", label: "Real (BRL)" },
  { value: "USD", label: "Dólar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  // Adicione outras moedas se necessário
];

export default function WalletForm({ wallet, onSuccess, onCancel, userId }: WalletFormProps) {
  const [name, setName] = useState("");
  const [defaultCurrency, setDefaultCurrency] = useState("BRL");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setDefaultCurrency(wallet.defaultCurrency);
      setDescription(wallet.description ?? "");
    } else {
      setName("");
      setDefaultCurrency("BRL");
      setDescription("");
    }
  }, [wallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      notification.error("Nome da carteira é obrigatório");
      return;
    }
    if (!defaultCurrency) {
      notification.error("Selecione a moeda padrão");
      return;
    }

    setSubmitting(true);
    try {
      if (wallet) {
        const payload: UpdateWalletCommand = {
          id: wallet.id,
          userId: wallet.userId,
          name: name.trim(),
          defaultCurrency,
          description: description.trim() || undefined,
        };
        await updateWallet(payload);
        notification.success("Carteira atualizada com sucesso!");
      } else {
        if(userId) {
            const payload: CreateWalletCommand = {
                userId,
                name: name.trim(),
                defaultCurrency,
                description: description.trim() || undefined,
            };
            await createWallet(payload);
            notification.success("Carteira criada com sucesso!");
        }
      }
      onSuccess();
      if (onCancel) onCancel();
    } catch {
      notification.error("Erro ao salvar carteira");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-slate-900 p-4 rounded-2xl shadow mb-8">
      <div>
        <label className="block text-white font-semibold mb-1">Nome*</label>
        <input
          className="w-full px-3 py-2 rounded bg-slate-800 text-white"
          type="text"
          value={name}
          maxLength={80}
          onChange={e => setName(e.target.value)}
          required
          disabled={submitting}
          autoFocus
        />
      </div>
      <div>
        <label className="block text-white font-semibold mb-1">Moeda*</label>
        <select
          className="w-full px-3 py-2 rounded bg-slate-800 text-white"
          value={defaultCurrency}
          onChange={e => setDefaultCurrency(e.target.value)}
          required
          disabled={submitting}
        >
          {DEFAULT_CURRENCIES.map(c => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-white font-semibold mb-1">Descrição</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-slate-800 text-white"
          value={description}
          maxLength={200}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          disabled={submitting}
        />
      </div>
      <div className="flex gap-2 justify-end mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white"
            disabled={submitting}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold"
          disabled={submitting}
        >
          {wallet ? "Salvar alterações" : "Criar carteira"}
        </button>
      </div>
    </form>
  );
}
