import { useEffect, useState } from "react";
import { getWallets, deleteWallet, type WalletDTO } from "../features/Wallet/wallet.service";
import WalletForm from "../features/Wallet/WalletForm";
import { notification } from "../shared/services/notification";
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
            const data = await getWallets(); // Se seu service retorna .data
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
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)] pt-16 px-2">
            <div className="w-full max-w-md sm:max-w-3xl bg-slate-900 shadow-lg rounded-2xl p-4 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">Carteiras</h2>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
                    >
                        Nova carteira
                    </button>
                </div>

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
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm bg-slate-800 text-white rounded shadow">
                            <thead>
                                <tr>
                                    <th className="p-3 text-left whitespace-nowrap">Nome</th>
                                    <th className="p-3 text-left whitespace-nowrap">Moeda</th>
                                    <th className="p-3 text-left">Descrição</th>
                                    <th className="p-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wallets.map((w) => (
                                    <tr key={w.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                                        <td className="p-3 whitespace-nowrap">{w.name}</td>
                                        <td className="p-3 whitespace-nowrap">{w.defaultCurrency}</td>
                                        <td className="p-3">{w.description || "-"}</td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(w)}
                                                className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-white font-medium"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(w.id)}
                                                className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white font-medium"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {wallets.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center text-white/60 py-6">
                                            Nenhuma carteira cadastrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
