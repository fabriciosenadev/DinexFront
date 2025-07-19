import { useEffect, useState, useCallback } from "react";
import { getAssets, deleteAsset } from "../features/Asset/asset.service";
import AssetForm from "../features/Asset/AssetForm";
import { notification } from "../shared/services/notification";
import type { AssetDTO } from "../features/Asset/asset.model";
import { Pencil, Trash2 } from "lucide-react";

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAsset, setEditAsset] = useState<AssetDTO | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAssets = useCallback(
    async (params?: Record<string, string | number | undefined>) => {
      setLoading(true);
      try {
        const response = await getAssets({ page, pageSize, ...params });
        setAssets(response.items);
        setTotal(response.totalCount);
      } catch {
        notification.error("Erro ao carregar ativos");
        setAssets([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize] // Dependências REAIS!
  );

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);


  const handleEdit = (asset: AssetDTO) => {
    setEditAsset(asset);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditAsset(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este ativo?")) return;
    try {
      await deleteAsset(id);
      notification.success("Ativo excluído!");
      fetchAssets();
    } catch {
      notification.error("Erro ao excluir ativo");
    }
  };

  const handleFormSuccess = () => {
    fetchAssets();
    setShowForm(false);
    setEditAsset(null);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-64px)] pt-16 px-2">
      <div className="w-full max-w-md sm:max-w-4xl bg-slate-900 shadow-lg rounded-2xl p-4 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Ativos</h2>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Novo ativo
          </button>
        </div>
        {showForm && (
          <AssetForm
            asset={editAsset}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        )}
        {loading ? (
          <div className="text-center mt-8 text-white/80">Carregando...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm bg-slate-800 text-white rounded shadow">
                <thead>
                  <tr>
                    <th className="p-3 text-left whitespace-nowrap">Nome</th>
                    <th className="p-3 text-left whitespace-nowrap">Código</th>
                    <th className="p-3 text-left whitespace-nowrap">Bolsa</th>
                    <th className="p-3 text-left whitespace-nowrap">Moeda</th>
                    <th className="p-3 text-left whitespace-nowrap">Tipo</th>
                    <th className="p-3 text-left">Setor</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a) => (
                    <tr key={a.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                      <td className="p-3 whitespace-nowrap">{a.name}</td>
                      <td className="p-3 whitespace-nowrap">{a.code}</td>
                      <td className="p-3 whitespace-nowrap">{a.exchange}</td>
                      <td className="p-3 whitespace-nowrap">{a.currency}</td>
                      <td className="p-3 whitespace-nowrap">{a.type}</td>
                      <td className="p-3">{a.sector || "-"}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(a)}
                          className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-white font-medium"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {assets.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-white/60 py-6">
                        Nenhum ativo cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
              {/* Select de página */}
              <div className="flex justify-center sm:justify-start">
                <select
                  value={pageSize}
                  onChange={(e) => {
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
              {/* Bloco de botões + info */}
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
