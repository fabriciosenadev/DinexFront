import { useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import type { StylesConfig } from "react-select";
import { NumericFormat } from "react-number-format";
import type { NumberFormatValues } from "react-number-format";
import {
    createOperation,
    updateOperation,
} from "./operation.service";
import { notification } from "../../shared/services/notification";
import type {
    OperationDTO,
    CreateOperationCommand,
    UpdateOperationCommand,
    OperationType,
} from "./operation.model";
import { OPERATION_TYPE_OPTIONS } from "./operation.model";
import { labelToOperationType } from "./operation.helpers";
import { getAssets } from "../Asset/asset.service";

// Props para popular selects (você pode ajustar conforme seu projeto)
type Option = { value: string; label: string };
type Wallet = {
    id: string;
    name: string;
    defaultCurrency: string;
    // ...outros campos se houver
};

type OperationFormProps = {
    operation?: OperationDTO | null;
    onSuccess: () => void;
    onCancel?: () => void;
    assets: Option[];
    wallets: Wallet[];
    brokers: Option[];
};

export default function OperationForm({
    operation,
    onSuccess,
    onCancel,
    assets,
    wallets,
    brokers,
}: OperationFormProps) {
    const [walletId, setWalletId] = useState("");
    const [assetId, setAssetId] = useState("");
    const [brokerId, setBrokerId] = useState<string | undefined>(undefined);
    const [type, setType] = useState<OperationType>(1); // 1: Compra, 2: Venda
    const [quantity, setQuantity] = useState<number>(0);
    const [unitPrice, setUnitPrice] = useState<number>(0);
    const [executedAt, setExecutedAt] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    const selectedWallet = wallets.find(w => w.id === walletId);
    const selectedCurrency = selectedWallet?.defaultCurrency ?? "BRL";
    const maskConfig = getCurrencyMaskConfig(selectedCurrency);

    useEffect(() => {
        if (operation) {
            setWalletId(operation.walletId);
            setAssetId(operation.assetId);
            setBrokerId(operation.brokerId);
            setType(labelToOperationType(operation.type));
            setQuantity(operation.quantity);
            setUnitPrice(operation.unitPrice);
            setExecutedAt(operation.executedAt.split("T")[0]);
        } else {
            setWalletId("");
            setAssetId("");
            setBrokerId(undefined);
            setType(1);
            setQuantity(0);
            setUnitPrice(0);
            setExecutedAt("");
        }
    }, [operation]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!walletId || !assetId) {
            notification.error("Carteira e ativo são obrigatórios.");
            return;
        }
        if (!quantity || quantity <= 0) {
            notification.error("Quantidade deve ser maior que zero.");
            return;
        }
        if (!unitPrice || unitPrice <= 0) {
            notification.error("Preço unitário deve ser maior que zero.");
            return;
        }
        if (!executedAt) {
            notification.error("Data de execução obrigatória.");
            return;
        }

        setSubmitting(true);
        try {
            if (operation) {
                const payload: UpdateOperationCommand = {
                    id: operation.id,
                    walletId,
                    assetId,
                    brokerId,
                    type,
                    quantity,
                    unitPrice,
                    executedAt,
                };
                await updateOperation(payload);
                notification.success("Operação atualizada com sucesso!");
            } else {
                const payload: CreateOperationCommand = {
                    walletId,
                    assetId,
                    brokerId,
                    type,
                    quantity,
                    unitPrice,
                    executedAt,
                };
                await createOperation(payload);
                notification.success("Operação criada com sucesso!");
            }
            onSuccess();
            if (onCancel) onCancel();
        } catch {
            notification.error("Erro ao salvar operação");
        } finally {
            setSubmitting(false);
        }
    };

    // Função para buscar assets conforme digitação (ou pode ser local)
    const loadAssetOptions = async (inputValue: string) => {
        // Aqui você pode chamar seu endpoint de busca filtrada se preferir (ex: /v1/Assets/search?q=...)
        const allAssets = await getAssets(); // Ou mantenha um cache/local
        const assetsByCurrency = allAssets.filter(
            a => a.currency === selectedCurrency
        );
        return assetsByCurrency
            .filter(a =>
                `${a.name} ${a.code}`.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map(a => ({
                value: a.id,
                label: `${a.name} (${a.code})`,
            }));
    };

    // Defina o objeto de estilos
    const selectStyles: StylesConfig<Option, false> = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#1e293b", // bg-slate-800
            borderRadius: "0.5rem",
            borderColor: state.isFocused ? "#2563eb" : "#1e293b",
            boxShadow: state.isFocused ? "0 0 0 2px #2563eb55" : undefined,
            color: "#fff",
            minHeight: "2.5rem",
            fontSize: "1rem",
            outline: "none",
            "&:hover": { borderColor: "#2563eb" },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "#1e293b",
            color: "#fff",
            borderRadius: "0.5rem",
            zIndex: 20,
            maxHeight: 260, // cerca de 7-8 opções visíveis
            overflowY: "auto",
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? "#2563eb"
                : "#1e293b",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1rem",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "#fff",
        }),
        input: (provided) => ({
            ...provided,
            color: "#fff",
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#64748b",
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: "#64748b",
            "&:hover": { color: "#2563eb" },
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: "#334155",
        }),
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 bg-slate-900 p-4 rounded-2xl shadow mb-8"
        >
            <div>
                <label className="block text-white font-semibold mb-1">
                    Carteira*
                </label>
                <select
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                    value={walletId}
                    onChange={e => setWalletId(e.target.value)}
                    required
                    disabled={submitting}
                >
                    <option value="">Selecione</option>
                    {wallets.map((w) => (
                        <option key={w.id} value={w.id}>
                            {w.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-white font-semibold mb-1">
                    Ativo*
                </label>
                <AsyncSelect
                    cacheOptions
                    defaultOptions={[]}
                    loadOptions={loadAssetOptions}
                    value={assets.find(opt => opt.value === assetId) || null}
                    onChange={option => setAssetId(option?.value || "")}
                    isClearable
                    isDisabled={submitting}
                    styles={selectStyles}
                    noOptionsMessage={() => "Nenhum ativo encontrado"}
                    placeholder="Selecione ou digite..."
                />
            </div>
            <div>
                <label className="block text-white font-semibold mb-1">
                    Corretora
                </label>
                <select
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                    value={brokerId ?? ""}
                    onChange={(e) => setBrokerId(e.target.value || undefined)}
                    disabled={submitting}
                >
                    <option value="">Nenhuma</option>
                    {brokers.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-white font-semibold mb-1">
                    Tipo*
                </label>
                <select
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                    value={type}
                    onChange={(e) =>
                        setType(Number(e.target.value) as OperationType)
                    }
                    required
                    disabled={submitting}
                >
                    {OPERATION_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-white font-semibold mb-1">
                        Quantidade*
                    </label>
                    <NumericFormat
                        className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                        value={quantity}
                        onValueChange={(values: NumberFormatValues) => setQuantity(Number(values.floatValue) || 0)}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        decimalScale={8} // <- OITO casas decimais!
                        fixedDecimalScale={false}
                        placeholder="0,00000000"
                        inputMode="decimal"
                        required
                        disabled={submitting}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-white font-semibold mb-1">
                        Preço Unitário*
                    </label>
                    <NumericFormat
                        className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                        value={unitPrice}
                        onValueChange={(values: NumberFormatValues) => setUnitPrice(Number(values.floatValue) || 0)}
                        thousandSeparator={maskConfig.thousandSeparator}
                        decimalSeparator={maskConfig.decimalSeparator}
                        prefix={maskConfig.prefix}
                        allowNegative={false}
                        decimalScale={2}
                        fixedDecimalScale
                        placeholder={`${maskConfig.prefix}0,00`}
                        inputMode="decimal"
                        required
                        disabled={submitting}
                    />
                </div>
            </div>
            <div>
                <label className="block text-white font-semibold mb-1">
                    Data de execução*
                </label>
                <input
                    className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                    type="date"
                    value={executedAt}
                    onChange={(e) => setExecutedAt(e.target.value)}
                    required
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
                    {operation ? "Salvar alterações" : "Criar operação"}
                </button>
            </div>
        </form>
    );
}

function getCurrencyMaskConfig(currency: string) {
    switch (currency) {
        case "BRL":
            return { prefix: "R$ ", thousandSeparator: ".", decimalSeparator: "," };
        case "USD":
            return { prefix: "US$ ", thousandSeparator: ",", decimalSeparator: "." };
        case "EUR":
            return { prefix: "€ ", thousandSeparator: ".", decimalSeparator: "," };
        case "GBP":
            return { prefix: "£ ", thousandSeparator: ",", decimalSeparator: "." };
        // adicione outras moedas conforme necessário
        default:
            return { prefix: "", thousandSeparator: ",", decimalSeparator: "." };
    }
}

