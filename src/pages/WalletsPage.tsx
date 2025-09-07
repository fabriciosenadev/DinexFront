import { useEffect, useState } from "react";
import { getWallets, deleteWallet, type WalletDTO } from "../features/Wallet/wallet.service";
import WalletForm from "../features/Wallet/WalletForm";
import { notification } from "../shared/services/notification";
import { Pencil, Trash2 } from "lucide-react";
import PageLayout from "../shared/components/layout/PageLayout";
import PageHeader from "../shared/components/layout/PageHeader";
import TableWrapper from "../shared/components/layout/TableWrapper";
import { useAuth } from "../shared/hooks/useAuth";

export default function WalletsPage() {
    const [wallets, setWallets] = useState<WalletDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editWallet, setEditWallet] = useState<WalletDTO | null>(null);
    const { user } = useAuth();
    const userId = user?.id;

    const fetchWallets = async () => {
        setLoading(true);
        try {
            const data = await getWallets();
            setWallets(data);
        } catch {
            notification.error("Erro ao carregar carteiras");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const handleEdit = (wallet: WalletDTO) => {
        setEditWallet(wallet);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditWallet(null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta carteira?")) return;
        try {
            await deleteWallet(id);
            notification.success("Carteira excluída!");
            fetchWallets();
        } catch {
            notification.error("Erro ao excluir carteira");
        }
    };

    const handleFormSuccess = () => {
        fetchWallets();
        setShowForm(false);
        setEditWallet(null);
    };

    return (
        <PageLayout variant="default">
            <PageHeader
                title="Carteiras"
                actions={
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                    >
                        Nova carteira
                    </button>
                }
            />

            <div className="w-full bg-slate-900 shadow-lg rounded-2xl p-4 sm:p-6">
                {showForm && (
                    <WalletForm
                        wallet={editWallet}
                        userId={userId}
                        onSuccess={handleFormSuccess}
                        onCancel={() => setShowForm(false)}
                    />
                )}

                {loading ? (
                    <div className="text-center mt-8 text-white/80">Carregando...</div>
                ) : wallets.length === 0 ? (
                    <div className="text-center text-white/60 py-6 bg-slate-800 rounded-xl">
                        Nenhuma carteira cadastrada.
                    </div>
                ) : (
                    <>
                        {/* MOBILE: cards, sem overflow lateral */}
                        <ul className="sm:hidden space-y-3">
                            {wallets.map((w) => (
                                <li
                                    key={w.id}
                                    className="rounded-xl bg-slate-800 p-3 shadow border border-slate-700/50"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="text-white font-semibold">{w.name}</div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(w)}
                                                className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-white"
                                                aria-label="Editar carteira"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(w.id)}
                                                className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                                                aria-label="Excluir carteira"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                                        <div className="rounded-lg bg-slate-900 px-3 py-2">
                                            <div className="text-white/50 text-xs">Moeda</div>
                                            <div className="text-white">{w.defaultCurrency}</div>
                                        </div>
                                        <div className="rounded-lg bg-slate-900 px-3 py-2">
                                            <div className="text-white/50 text-xs">Descrição</div>
                                            <div className="text-white">{w.description || "-"}</div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* DESKTOP: tabela dentro do wrapper; sem scroll do body */}
                        <div className="hidden sm:block">
                            <TableWrapper>
                                <table className="min-w-[720px] w-full text-sm text-white">
                                    <thead>
                                        <tr>
                                            <th className="p-3 text-left whitespace-nowrap">Nome</th>
                                            <th className="p-3 text-left whitespace-nowrap">Moeda</th>
                                            <th className="p-3 text-left">Descrição</th>
                                            <th className="p-3 text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wallets.map((w) => (
                                            <tr key={w.id} className="border-t border-slate-700 hover:bg-slate-700/40">
                                                <td className="p-3 whitespace-nowrap">{w.name}</td>
                                                <td className="p-3 whitespace-nowrap">{w.defaultCurrency}</td>
                                                <td className="p-3">{w.description || "-"}</td>
                                                <td className="p-3">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(w)}
                                                            className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-white font-medium"
                                                            aria-label="Editar carteira"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(w.id)}
                                                            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white font-medium"
                                                            aria-label="Excluir carteira"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </TableWrapper>
                        </div>
                    </>
                )}
            </div>
        </PageLayout>
    );
}
