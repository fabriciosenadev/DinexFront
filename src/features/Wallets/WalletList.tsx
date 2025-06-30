import { useEffect, useState } from 'react';
import { getWallets, deleteWallet, type WalletDTO } from './wallet.service';
import { notification } from '../../shared/services/notification'; // Supondo que já tenha um toast

export default function WalletList() {
  const [wallets, setWallets] = useState<WalletDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const data = await getWallets();
      setWallets(data);
    } catch {
      notification.error('Erro ao carregar carteiras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta carteira?')) return;
    try {
      await deleteWallet(id);
      notification.success('Carteira excluída!');
      fetchWallets();
    } catch {
      notification.error('Erro ao excluir carteira');
    }
  };

  return (
    <div>
      <h2>Carteiras</h2>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Moeda</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((w) => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>{w.defaultCurrency}</td>
                <td>{w.description ?? '-'}</td>
                <td>
                  {/* Adicione aqui os botões de editar e excluir */}
                  <button /*onClick={handleEdit}*/>Editar</button>
                  <button onClick={() => handleDelete(w.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {wallets.length === 0 && (
              <tr>
                <td colSpan={4}>Nenhuma carteira cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
