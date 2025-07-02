import { useEffect, useState } from "react";
import {
    createAsset,
    updateAsset
} from "./asset.service";
import { notification } from "../../shared/services/notification";
import type { AssetDTO, CreateAssetCommand, UpdateAssetCommand } from "./asset.model";
import { maskCnpj, unmaskCnpj } from "../../shared/utils/cnpjMask";
import { EXCHANGE_OPTIONS, CURRENCY_OPTIONS, ASSET_TYPE_OPTIONS } from "./asset.enums"
import type { Exchange, Currency, AssetType } from "./asset.enums";

// const EXCHANGE_OPTIONS = [
//     { value: 0, label: "B3" },
//     { value: 1, label: "NYSE" },
//     { value: 2, label: "NASDAQ" },
//     { value: 3, label: "AMEX" },
//     { value: 4, label: "LSE" },
//     { value: 5, label: "TSE" },
//     { value: 6, label: "Outra" },
// ] as const;

// const CURRENCY_OPTIONS = [
//     { value: 0, label: "BRL" },
//     { value: 1, label: "USD" },
//     { value: 2, label: "EUR" },
//     { value: 3, label: "GBP" },
//     { value: 4, label: "JPY" },
//     { value: 5, label: "CHF" },
//     { value: 6, label: "Outra" },
// ] as const;

// const ASSET_TYPE_OPTIONS = [
//     { value: 0, label: "Acao" },
//     { value: 1, label: "FII" },
//     { value: 2, label: "ETF" },
//     { value: 3, label: "BDR" },
//     { value: 4, label: "RendaFixa" },
//     { value: 5, label: "Cripto" },
//     { value: 6, label: "Outro" },
// ] as const;

type AssetFormProps = {
    asset?: AssetDTO | null;
    onSuccess: () => void;
    onCancel?: () => void;
};

export default function AssetForm({ asset, onSuccess, onCancel }: AssetFormProps) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [exchange, setExchange] = useState<Exchange>(0);
    const [currency, setCurrency] = useState<Currency>(0);
    const [type, setType] = useState<AssetType>(0);
    const [sector, setSector] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (asset) {
            setName(asset.name);
            setCode(asset.code);
            setCnpj(asset.cnpj ?? "");
            setExchange(EXCHANGE_OPTIONS.find(opt => opt.label === asset.exchange)?.value ?? 0);
            setCurrency(CURRENCY_OPTIONS.find(opt => opt.label === asset.currency)?.value ?? 0);
            setType(ASSET_TYPE_OPTIONS.find(opt => opt.label === asset.type)?.value ?? 0);
            setSector(asset.sector ?? "");
        } else {
            setName("");
            setCode("");
            setCnpj("");
            setExchange(0);
            setCurrency(0);
            setType(0);
            setSector("");
        }
    }, [asset]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            notification.error("O nome do ativo é obrigatório.");
            return;
        }
        if (!code.trim()) {
            notification.error("O código do ativo é obrigatório.");
            return;
        }
        setSubmitting(true);
        try {
            if (asset) {
                const payload: UpdateAssetCommand = {
                    id: asset.id,
                    name: name.trim(),
                    code: code.trim(),
                    cnpj: cnpj.trim() || undefined,
                    exchange,
                    currency,
                    type,
                    sector: sector.trim() || undefined,
                };
                await updateAsset(payload);
                notification.success("Ativo atualizado com sucesso!");
            } else {
                const payload: CreateAssetCommand = {
                    name: name.trim(),
                    code: code.trim(),
                    cnpj: cnpj.trim() || undefined,
                    exchange,
                    currency,
                    type,
                    sector: sector.trim() || undefined,
                };
                await createAsset(payload);
                notification.success("Ativo criado com sucesso!");
            }
            onSuccess();
            if (onCancel) onCancel();
        } catch {
            notification.error("Erro ao salvar ativo");
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
                    maxLength={100}
                    onChange={e => setName(e.target.value)}
                    required
                    disabled={submitting}
                />
            </div>
            <div>
                <label className="block text-white font-semibold mb-1">Código*</label>
                <input
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                    type="text"
                    value={code}
                    maxLength={20}
                    onChange={e => setCode(e.target.value)}
                    required
                    disabled={submitting}
                />
            </div>
            <div>
                <label className="block text-white font-semibold mb-1">CNPJ</label>
                <input
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                    type="text"
                    value={maskCnpj(cnpj)}
                    maxLength={18}
                    onChange={e => setCnpj(unmaskCnpj(e.target.value))}
                    disabled={submitting}
                />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-white font-semibold mb-1">Bolsa*</label>
                    <select
                        className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                        value={exchange}
                        onChange={e => setExchange(Number(e.target.value) as Exchange)}
                        required
                        disabled={submitting}
                    >
                        {EXCHANGE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-white font-semibold mb-1">Moeda*</label>
                    <select
                        className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                        value={currency}
                        onChange={e => setCurrency(Number(e.target.value) as Currency)}
                        required
                        disabled={submitting}
                    >
                        {CURRENCY_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-white font-semibold mb-1">Tipo de Ativo*</label>
                <select
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                    value={type}
                    onChange={e => setType(Number(e.target.value) as AssetType)}
                    required
                    disabled={submitting}
                >
                    {ASSET_TYPE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-white font-semibold mb-1">Setor</label>
                <input
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                    type="text"
                    value={sector}
                    maxLength={50}
                    onChange={e => setSector(e.target.value)}
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
                    {asset ? "Salvar alterações" : "Criar ativo"}
                </button>
            </div>
        </form>
    );
}
