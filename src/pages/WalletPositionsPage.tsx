// src/pages/WalletPositionsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type { PositionDTO } from "../features/positions/positions.model";
import { getPositionsByWallet } from "../features/positions/positions.service";

import PageLayout from "../shared/components/layout/PageLayout";
import PageHeader from "../shared/components/layout/PageHeader";

export default function WalletPositionsPage() {
    const { walletId } = useParams<{ walletId: string }>();
    const navigate = useNavigate();

    const [positions, setPositions] = useState<PositionDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!walletId) return;

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getPositionsByWallet(walletId);
                setPositions(data);
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar posições.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [walletId]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 2,
        }).format(value);

    const formatNumber = (value: number) =>
        new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
        }).format(value);

    const formatPercent = (value: number | null | undefined) => {
        if (value == null) return "-";
        return `${value.toFixed(2)}%`;
    };

    const totalInvested = useMemo(
        () => positions.reduce((sum, p) => sum + p.investedValue, 0),
        [positions]
    );

    const totalAssets = positions.length;

    const biggestPosition = useMemo(() => {
        if (!positions.length) return null;
        return positions.reduce((max, p) =>
            p.investedValue > max.investedValue ? p : max
        );
    }, [positions]);


    // ==============================
    // STATES: loading / error / empty
    // ==============================

    if (!walletId) {
        return (
            <PageLayout>
                <PageHeader title="Posições" />
                <div className="text-red-400">WalletId não foi informado.</div>
            </PageLayout>
        );
    }

    if (loading) {
        return (
            <PageLayout>
                <PageHeader title="Posições" />
                <div className="text-white/70">Carregando posições...</div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout>
                <PageHeader title="Posições" />
                <div className="text-red-400">{error}</div>
            </PageLayout>
        );
    }

    if (!positions.length) {
        return (
            <PageLayout>
                <PageHeader
                    title="Posições"
                    actions={
                        <button
                            onClick={() => navigate("/wallets")}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
                        >
                            Voltar
                        </button>
                    }
                />
                <div className="text-white/60">Nenhuma posição encontrada.</div>
            </PageLayout>
        );
    }

    // ==============================
    // RENDER NORMAL
    // ==============================

    return (
        <PageLayout>
            <PageHeader
                title="Posições"
                actions={
                    <button
                        onClick={() => navigate("/wallets")}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
                    >
                        Voltar
                    </button>
                }
            />

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Total Invested */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <div className="text-white/70 text-sm">Total investido</div>
                    <div className="text-white text-2xl font-bold">
                        {formatCurrency(totalInvested)}
                    </div>
                </div>

                {/* Number of assets */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <div className="text-white/70 text-sm">Quantidade de ativos</div>
                    <div className="text-white text-2xl font-bold">{totalAssets}</div>
                </div>

                {/* Largest position */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <div className="text-white/70 text-sm">Maior posição</div>
                    {biggestPosition ? (
                        <>
                            <div className="text-white font-bold">
                                {biggestPosition.assetCode ?? biggestPosition.assetId}
                            </div>
                            <div className="text-white/80">
                                {formatCurrency(biggestPosition.investedValue)}
                            </div>
                        </>
                    ) : (
                        <div className="text-white/60">-</div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 rounded-xl shadow-lg p-4 border border-slate-700 overflow-x-auto">
                <table className="w-full text-sm text-white min-w-[700px]">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="p-3 text-left">Ativo</th>
                            <th className="p-3 text-left">Quantidade</th>
                            <th className="p-3 text-left">Preço médio</th>
                            <th className="p-3 text-left">Investido</th>
                            <th className="p-3 text-left">%</th>
                        </tr>
                    </thead>

                    <tbody>
                        {positions.map((p) => (
                            <tr
                                key={p.id}
                                className="border-b border-slate-800 hover:bg-slate-800/40"
                            >
                                <td className="p-3">
                                    <div className="font-semibold">
                                        {p.assetCode ?? p.assetId}
                                    </div>
                                    {p.assetName && (
                                        <div className="text-white/60 text-xs">
                                            {p.assetName}
                                        </div>
                                    )}
                                </td>

                                <td className="p-3">{formatNumber(p.currentQuantity)}</td>
                                <td className="p-3">{formatCurrency(p.averagePrice)}</td>
                                <td className="p-3">{formatCurrency(p.investedValue)}</td>
                                <td className="p-3">{formatPercent(p.walletSharePercent)}</td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr className="border-t border-slate-700">
                            <th className="p-3">Total</th>
                            <th></th>
                            <th></th>
                            <th className="p-3">{formatCurrency(totalInvested)}</th>
                            <th className="p-3">100%</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </PageLayout>
    );
}
