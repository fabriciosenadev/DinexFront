// src/pages/AssetsPage.tsx
import { useEffect, useState, useCallback } from "react";
import { getAssets, deleteAsset } from "../features/Asset/asset.service";
import AssetForm from "../features/Asset/AssetForm";
import { notification } from "../shared/services/notification";
import type { AssetDTO } from "../features/Asset/asset.model";
import { Pencil, Trash2 } from "lucide-react";
import PageLayout from "../shared/components/layout/PageLayout";
import PageHeader from "../shared/components/layout/PageHeader";
import TableWrapper from "../shared/components/layout/TableWrapper";

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
    [page, pageSize]
  );

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const handleEdit = (asset: AssetDTO) => { setEditAsset(asset); setShowForm(true); };
  const handleCreate = () => { setEditAsset(null); setShowForm(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este ativo?")) return;
    try {
      await deleteAsset(id);
      notification.success("Ativo excluído!");
      fetchAssets();
    } catch { notification.error("Erro ao excluir ativo"); }
  };
  const handleFormSuccess = () => { fetchAssets(); setShowForm(false); setEditAsset(null); };

  return (
    <PageLayout variant="default">
      <PageHeader
        title="Ativos"
        actions={
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Novo ativo
          </button>
        }
      />

      {/* bloco de conteúdo */}
      <div className="w-full bg-slate-900 shadow-lg rounded-2xl p-4 sm:p-6">
        {showForm && (
          <AssetForm
            asset={editAsset}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        )}

        {loading ? (
          <div className="text-center mt-8 text-white/80">Carregando...</div>
        ) : assets.length === 0 ? (
          <div className="text-center text-white/60 py-6 bg-slate-800 rounded-xl">
            Nenhum ativo cadastrado.
          </div>
        ) : (
          <>
            {/* MOBILE: cards */}
            <ul className="sm:hidden space-y-3">
              {assets.map((a) => (
                <li key={a.id} className="rounded-xl bg-slate-800 p-3 shadow border border-slate-700/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-white font-semibold">{a.name}</div>
                      <div className="text-white/60 text-sm">{a.sector || "-"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(a)}
                        className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-white"
                        aria-label="Editar ativo"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                        aria-label="Excluir ativo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <Info label="Código" value={a.code} />
                    <Info label="Bolsa" value={a.exchange} />
                    <Info label="Moeda" value={a.currency} />
                    <Info label="Tipo" value={a.type} />
                  </div>
                </li>
              ))}
            </ul>

            {/* DESKTOP: tabela */}
            <div className="hidden sm:block">
              <TableWrapper>
                <table className="w-full text-sm text-white">
                  <thead>
                    <tr>
                      <Th>Nome</Th>
                      <Th>Código</Th>
                      <Th>Bolsa</Th>
                      <Th>Moeda</Th>
                      <Th>Tipo</Th>
                      <Th className="text-left">Setor</Th>
                      <Th className="text-center">Ações</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((a) => (
                      <tr key={a.id} className="border-t border-slate-700 hover:bg-slate-700/40">
                        <Td>{a.name}</Td>
                        <Td>{a.code}</Td>
                        <Td>{a.exchange}</Td>
                        <Td>{a.currency}</Td>
                        <Td>{a.type}</Td>
                        <Td>{a.sector || "-"}</Td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(a)}
                              className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-white"
                              aria-label="Editar ativo"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                              aria-label="Excluir ativo"
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

            {/* paginação */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
              <div className="flex justify-center sm:justify-start">
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="bg-slate-700 text-white px-2 py-1 rounded"
                >
                  {[10, 20, 50].map((size) => (
                    <option key={size} value={size}>{size} por página</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center sm:justify-end items-center gap-2 flex-wrap">
                <button
                  className="px-3 py-1 bg-slate-700 rounded text-white disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </button>
                <span className="px-2 py-1 text-white font-semibold">{page}</span>
                <button
                  className="px-3 py-1 bg-slate-700 rounded text-white disabled:opacity-50"
                  disabled={page * pageSize >= total}
                  onClick={() => setPage((p) => p + 1)}
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
    </PageLayout>
  );
}

/* --- helpers UI locais --- */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`p-3 text-left whitespace-nowrap ${className}`}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="p-3 whitespace-nowrap">{children}</td>;
}
function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg bg-slate-900 px-3 py-2">
      <div className="text-white/50 text-xs">{label}</div>
      <div className="text-white">{value || "-"}</div>
    </div>
  );
}
