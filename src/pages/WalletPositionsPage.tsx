// src/pages/WalletPositionsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import type { PositionDTO } from "../features/positions/positions.model";
import { getPositionsByWallet } from "../features/positions/positions.service";

import PageLayout from "../shared/components/layout/PageLayout";
import PageHeader from "../shared/components/layout/PageHeader";

type SortKey = "asset" | "quantity" | "avgPrice" | "invested" | "share";
type SortDir = "asc" | "desc";

export default function WalletPositionsPage() {
    const { walletId } = useParams<{ walletId: string }>();
    const navigate = useNavigate();

    const [positions, setPositions] = useState<PositionDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ default: maior investido primeiro (faz sentido pra posições)
    const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
        key: "invested",
        dir: "desc",
    });

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

    const sortedPositions = useMemo(() => {
        const dirMul = sort.dir === "asc" ? 1 : -1;

        const getAssetLabel = (p: PositionDTO) =>
            (p.assetCode ?? p.assetName ?? p.assetId).toString().toUpperCase();

        const cmpString = (a: string, b: string) => a.localeCompare(b, "pt-BR");
        const cmpNumber = (a: number, b: number) => (a === b ? 0 : a > b ? 1 : -1);

        return [...positions].sort((pa, pb) => {
            switch (sort.key) {
                case "asset":
                    return cmpString(getAssetLabel(pa), getAssetLabel(pb)) * dirMul;
                case "quantity":
                    return cmpNumber(pa.currentQuantity, pb.currentQuantity) * dirMul;
                case "avgPrice":
                    return cmpNumber(pa.averagePrice, pb.averagePrice) * dirMul;
                case "invested":
                    return cmpNumber(pa.investedValue, pb.investedValue) * dirMul;
                case "share":
                    return cmpNumber(pa.walletSharePercent ?? 0, pb.walletSharePercent ?? 0) * dirMul;
                default:
                    return 0;
            }
        });
    }, [positions, sort]);

    const toggleSort = (key: SortKey) => {
        setSort((prev) => {
            if (prev.key !== key) return { key, dir: "asc" }; // novo campo começa asc
            return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
        });
    };

    const SortHeader = (props: { label: string; sortKey: SortKey; className?: string }) => {
        const active = sort.key === props.sortKey;
        const icon = !active ? "↕" : sort.dir === "asc" ? "▲" : "▼";

        return (
            <th className={props.className ?? "p-3 text-left"}>
                <button
                    type="button"
                    onClick={() => toggleSort(props.sortKey)}
                    className={[
                        "inline-flex items-center gap-2",
                        "hover:text-white",
                        "transition-colors",
                        active ? "text-white" : "text-white/80",
                    ].join(" ")}
                    title="Ordenar"
                >
                    <span>{props.label}</span>
                    <span className={active ? "text-white" : "text-white/50"}>{icon}</span>
                </button>
            </th>
        );
    };

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
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <div className="text-white/70 text-sm">Total investido</div>
                    <div className="text-white text-2xl font-bold">
                        {formatCurrency(totalInvested)}
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                    <div className="text-white/70 text-sm">Quantidade de ativos</div>
                    <div className="text-white text-2xl font-bold">{totalAssets}</div>
                </div>

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
                            <SortHeader label="Ativo" sortKey="asset" className="p-3 text-left" />
                            <SortHeader label="Quantidade" sortKey="quantity" className="p-3 text-left" />
                            <SortHeader label="Preço médio" sortKey="avgPrice" className="p-3 text-left" />
                            <SortHeader label="Investido" sortKey="invested" className="p-3 text-left" />
                            <SortHeader label="%" sortKey="share" className="p-3 text-left" />
                        </tr>
                    </thead>

                    <tbody>
                        {sortedPositions.map((p) => (
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
