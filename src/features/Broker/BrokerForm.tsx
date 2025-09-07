import { useCallback, useEffect, useState } from "react";
import { createBroker, updateBroker, type BrokerDTO } from "./brokers.service";
import { notification } from "../../shared/services/notification";
import { maskCnpj, unmaskCnpj } from "../../shared/utils/cnpjMask";

interface Props {
    broker?: BrokerDTO | null;
    onSuccess: () => void;
    onCancel?: () => void;
}

export default function BrokerForm({ broker, onSuccess, onCancel }: Props) {
    const [name, setName] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [website, setWebsite] = useState("");
    const [loading, setLoading] = useState(false);

    const clearFields = useCallback(() => {
        setName("");
        setCnpj("");
        setWebsite("");
    }, []);

    useEffect(() => {
        if (broker) {
            setName(broker.name);
            setCnpj(broker.cnpj);
            setWebsite(broker.website || "");
        } else {
            clearFields();
        }
    }, [broker, clearFields]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // opcional: valida CNPJ desmascarado com 14 dígitos
        const cnpjDigits = unmaskCnpj(cnpj);
        if (cnpjDigits.length !== 14) {
            notification.error("CNPJ inválido.");
            return;
        }

        setLoading(true);
        try {
            if (broker) {
                await updateBroker({ id: broker.id, name, cnpj, website: website || undefined });
                notification.success("Corretora atualizada!");
            } else {
                await createBroker({ name, cnpj, website: website || undefined });
                notification.success("Corretora cadastrada!");
            }
            onSuccess();
            clearFields();
            if (onCancel) onCancel();
        } catch {
            notification.error("Erro ao salvar corretora");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6 items-end"
            aria-busy={loading}
        >
            {/* Nome (ocupa mais colunas no sm+) */}
            <div className="sm:col-span-5">
                <label className="block text-sm mb-1 text-white/80">Nome*</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="organization"
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                />
            </div>

            {/* CNPJ */}
            <div className="sm:col-span-3">
                <label className="block text-sm mb-1 text-white/80">CNPJ*</label>
                <input
                    type="text"
                    required
                    value={maskCnpj(cnpj)}
                    onChange={(e) => setCnpj(unmaskCnpj(e.target.value))}
                    inputMode="numeric"
                    maxLength={18}
                    autoComplete="off"
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                />
            </div>

            {/* Website (opcional) */}
            <div className="sm:col-span-4">
                <label className="block text-sm mb-1 text-white/80">Website</label>
                <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://exemplo.com.br"
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                />
            </div>

            {/* Ações */}
            <div className="sm:col-span-12 flex gap-2 justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-5 py-2 rounded text-white font-semibold transition-all"
                >
                    {loading ? "Salvando..." : broker ? "Atualizar" : "Cadastrar"}
                </button>
                {broker && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white font-semibold"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}
