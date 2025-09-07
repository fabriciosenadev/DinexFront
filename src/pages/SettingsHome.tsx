import { Building2, Sliders } from "lucide-react";
import { useEffect, useState } from "react";
import { getBrokers } from "../features/Broker/brokers.service";
import { SettingsCard } from "../shared/components/SettingsCard";
import PageLayout from "../shared/components/layout/PageLayout";
import PageHeader from "../shared/components/layout/PageHeader";

export default function SettingsHome() {
    const [brokerCount, setBrokerCount] = useState<number>();

    useEffect(() => {
        getBrokers().then(b => setBrokerCount(b?.length ?? 0)).catch(() => { });
    }, []);

    return (
        <PageLayout className="space-y-6" variant="default">
            <PageHeader title="Configurações" />
            <p className="mt-2 text-sm text-slate-400">
                Ajuste cadastros auxiliares e preferências do sistema.
            </p>

            {/* estica as células para o card ocupar 100% */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                <SettingsCard
                    to="/settings/brokers"
                    title="Corretoras"
                    desc="Gerencie a lista de corretoras utilizadas nas operações."
                    icon={<Building2 className="w-6 h-6 text-slate-300" />}
                    badgeText={brokerCount !== undefined ? `${brokerCount}` : undefined}
                    data-testid="settings-brokers"
                />
                <SettingsCard
                    title="Preferências do sistema"
                    desc="Tema, idioma e outras opções gerais."
                    icon={<Sliders className="w-6 h-6" />}
                    disabled
                    data-testid="settings-preferences"
                />
            </div>
        </PageLayout>
    );
}
