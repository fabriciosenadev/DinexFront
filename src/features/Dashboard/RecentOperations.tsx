import TableWrapper from "../../shared/components/layout/TableWrapper";

export type RecentOperation = {
  id: string;
  wallet: string;
  asset: string;
  type: string;
  qty: number;
  unitPrice: number;
  executedAt: string; // ISO
};

export default function RecentOperations({ items = [] as RecentOperation[] }) {
  const ops = items.length
    ? items
    : [
        {
          id: "1",
          wallet: "Geral",
          asset: "BBAS3",
          type: "Compra",
          qty: 10,
          unitPrice: 28.5,
          executedAt: new Date().toISOString(),
        },
      ];

  return (
    <div className="bg-slate-900 rounded-2xl p-4">
      <p className="text-slate-200 font-semibold">Últimas operações</p>
      <div className="mt-3">
        <TableWrapper>
          <table className="w-full text-sm bg-slate-800 text-white rounded">
            <thead>
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Carteira</th>
                <th className="p-3 text-left whitespace-nowrap">Ativo</th>
                <th className="p-3 text-left whitespace-nowrap">Tipo</th>
                <th className="p-3 text-left whitespace-nowrap">Qtd</th>
                <th className="p-3 text-left whitespace-nowrap">Preço</th>
                <th className="p-3 text-left whitespace-nowrap">Data</th>
              </tr>
            </thead>
            <tbody>
              {ops.map((op) => (
                <tr key={op.id} className="border-t border-slate-700">
                  <td className="p-3 whitespace-nowrap">{op.wallet}</td>
                  <td className="p-3 whitespace-nowrap">{op.asset}</td>
                  <td className="p-3 whitespace-nowrap">{op.type}</td>
                  <td className="p-3 whitespace-nowrap">{op.qty}</td>
                  <td className="p-3 whitespace-nowrap">
                    {op.unitPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(op.executedAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </div>
    </div>
  );
}
