import { useEffect, useState, useCallback } from "react";
import {
    getOperationsByWallet,
    deleteOperation,
} from "../features/Operation/operation.service";
import OperationForm from "../features/Operation/OperationForm";
import { notification } from "../shared/services/notification";
import type { OperationDTO } from "../features/Operation/operation.model";
import { operationTypeToLabel } from "../features/Operation/operation.helpers";
import { getWallets, type WalletDTO } from "../features/Wallet/wallet.service";
import { getAssets } from "../features/Asset/asset.service";
import { getBrokers } from "../features/Broker/brokers.service";
import { Pencil, Trash2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OperationsPage() {
    const [wallets, setWallets] = useState<WalletDTO[]>([]);
    const [assets, setAssets] = useState<{ value: string; label: string }[]>([]);
    const [brokers, setBrokers] = useState<{ value: string; label: string }[]>([]);
    const [walletId, setWalletId] = useState<string>("");
    const [operations, setOperations] = useState<OperationDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editOperation, setEditOperation] = useState<OperationDTO | null>(null);

    // Adicione estados para paginação:
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Buscar entidades reais ao montar
    useEffect(() => {
        getWallets().then(walletList => {
            setWallets(walletList);
            if (walletList.length > 0) setWalletId(walletList[0].id);
        });

        getAssets().then(assetPaged => {
            setAssets(assetPaged.items.map(a => ({
                value: a.id,
                label: `${a.name} (${a.code})`,
            })));
        });

        getBrokers().then(brokerList => {
            setBrokers(brokerList.map(b => ({
                value: b.id,
                label: b.name,
            })));
        });
    }, []);

    // Buscar operações da carteira selecionada e paginada
    const fetchOperations = useCallback(() => {
        if (!walletId) return;
        setLoading(true);
        getOperationsByWallet(walletId, { page, pageSize })
            .then(result => {
                setOperations(result.items);
                setTotal(result.totalCount);
            })
            .catch(() => notification.error("Erro ao carregar operações"))
            .finally(() => setLoading(false));
    }, [walletId, page, pageSize]);

    useEffect(() => {
        fetchOperations();
    }, [fetchOperations]);

    const handleEdit = (operation: OperationDTO) => {
        setEditOperation(operation);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditOperation(null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta operação?")) return;
        try {
            await deleteOperation(id);
            notification.success("Operação excluída!");
            fetchOperations();
        } catch {
            notification.error("Erro ao excluir operação");
        }
    };

    const handleFormSuccess = () => {
        fetchOperations();
        setShowForm(false);
        setEditOperation(null);
    };

    const navigate = useNavigate();

    // O resto do JSX permanece igual, só adiciona o bloco de paginação
    return (
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)] pt-16 px-2">
            <div className="w-full max-w-md sm:max-w-4xl bg-slate-900 shadow-lg rounded-2xl p-4 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">Operações</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/import")}
                            className="bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500 flex items-center px-3 py-2 rounded font-semibold transition"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Importar Extrato B3
                        </button>
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                        >
                            Nova operação
                        </button>
                    </div>
                </div>
                {showForm && (
                    <OperationForm
                        operation={editOperation}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setShowForm(false)}
                        assets={assets}
                        wallets={wallets}
                        brokers={brokers}
                    />
                )}
                {/* Select de carteira */}
                <div className="mb-6">
                    <label className="block text-white font-semibold mb-1">Carteira</label>
                    <select
                        className="w-full px-3 py-2 rounded bg-slate-800 text-white"
                        value={walletId}
                        onChange={e => {
                            setWalletId(e.target.value);
                            setPage(1); // volta pra página 1 se trocar carteira!
                        }}
                        disabled={loading}
                    >
                        {wallets.map(wallet => (
                            <option key={wallet.id} value={wallet.id}>
                                {wallet.name}
                            </option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <div className="text-center mt-8 text-white/80">Carregando...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm bg-slate-800 text-white rounded shadow">
                                <thead>
                                    <tr>
                                        <th className="p-3 text-left whitespace-nowrap">Carteira</th>
                                        <th className="p-3 text-left whitespace-nowrap">Ativo</th>
                                        <th className="p-3 text-left whitespace-nowrap">Tipo</th>
                                        <th className="p-3 text-left whitespace-nowrap">Quantidade</th>
                                        <th className="p-3 text-left whitespace-nowrap">Preço Unitário</th>
                                        <th className="p-3 text-left whitespace-nowrap">Valor Total</th>
                                        <th className="p-3 text-left whitespace-nowrap">Corretora</th>
                                        <th className="p-3 text-left whitespace-nowrap">Data</th>
                                        <th className="p-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operations.map((op) => (
                                        <tr key={op.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                                            <td className="p-3 whitespace-nowrap">{wallets.find(w => w.id === op.walletId)?.name || "-"}</td>
                                            <td className="p-3 whitespace-nowrap">{assets.find(a => a.value === op.assetId)?.label || "-"}</td>
                                            <td className="p-3 whitespace-nowrap">{operationTypeToLabel(op.type)}</td>
                                            <td className="p-3 whitespace-nowrap">{op.quantity}</td>
                                            <td className="p-3 whitespace-nowrap">{op.unitPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                                            <td className="p-3 whitespace-nowrap">{op.totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                                            <td className="p-3 whitespace-nowrap">{brokers.find(b => b.value === op.brokerId)?.label || "-"}</td>
                                            <td className="p-3 whitespace-nowrap">{new Date(op.executedAt).toLocaleDateString()}</td>
                                            <td className="p-3 flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(op)}
                                                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-white font-medium"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(op.id)}
                                                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white font-medium"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {operations.length === 0 && (
                                        <tr>
                                            <td colSpan={9} className="text-center text-white/60 py-6">
                                                Nenhuma operação cadastrada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Paginação */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                            <div className="flex justify-center sm:justify-start">
                                <select
                                    value={pageSize}
                                    onChange={e => {
                                        setPageSize(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="bg-slate-700 text-white px-2 py-1 rounded"
                                >
                                    {[10, 20, 50].map(size => (
                                        <option key={size} value={size}>
                                            {size} por página
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-center sm:justify-end items-center gap-2 flex-wrap">
                                <button
                                    className="px-3 py-1 bg-slate-700 rounded text-white disabled:opacity-50"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Anterior
                                </button>
                                <span className="px-2 py-1 text-white font-semibold">{page}</span>
                                <button
                                    className="px-3 py-1 bg-slate-700 rounded text-white disabled:opacity-50"
                                    disabled={page * pageSize >= total}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Próxima
                                </button>
                                <span className="text-white/80 ml-2 whitespace-nowrap">
                                    {`Exibindo ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, total)} de ${total}`}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
