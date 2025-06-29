import { useState, useEffect } from "react";
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

    useEffect(() => {
        if (broker) {
            setName(broker.name);
            setCnpj(broker.cnpj);
            setWebsite(broker.website || "");
        } else {
            clearFields();
        }
        // eslint-disable-next-line
    }, [broker]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

    const clearFields = () => {
        setName("");
        setCnpj("");
        setWebsite("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 mb-6 w-full sm:flex-row sm:flex-wrap sm:items-end"
        >
            <div className="flex flex-col w-full sm:w-auto">
                <label className="block text-xs mb-1 text-white/70">Nome</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="px-3 py-2 rounded bg-slate-700 text-white w-full sm:w-32"
                />
            </div>
            <div className="flex flex-col w-full sm:w-auto">
                <label className="block text-xs mb-1 text-white/70">CNPJ</label>
                <input
                    type="text"
                    required
                    value={maskCnpj(cnpj)}
                    onChange={e => setCnpj(unmaskCnpj(e.target.value))}
                    className="px-3 py-2 rounded bg-slate-700 text-white w-full sm:w-32"
                    maxLength={18}
                />
            </div>
            <div className="flex flex-col w-full sm:w-auto">
                <label className="block text-xs mb-1 text-white/70">Website</label>
                <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="px-3 py-2 rounded bg-slate-700 text-white w-full sm:w-40"
                />
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white font-semibold transition-all w-full sm:w-auto"
                >
                    {loading ? "Salvando..." : broker ? "Atualizar" : "Cadastrar"}
                </button>
                {broker && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white font-semibold w-full sm:w-auto"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}
