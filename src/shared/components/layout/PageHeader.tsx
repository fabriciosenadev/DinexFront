import type { ReactNode } from "react";

type Props = {
    title: string;
    actions?: ReactNode;
    subtitle?: ReactNode;
    className?: string;
};

export default function PageHeader({ title, actions, subtitle, className }: Props) {
    return (
        <div className={className ?? ""}>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
                    {subtitle ? <p className="text-slate-400 text-sm sm:text-base mt-1">{subtitle}</p> : null}
                </div>
                {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
            </div>
            {/* espaço consistente entre header e conteúdo */}
            <div className="mt-4" />
        </div>
    );
}
