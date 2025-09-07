import { Link, type LinkProps } from "react-router-dom";
import type { ReactNode, HTMLAttributes } from "react";

type BaseProps = {
    title: string;
    desc: string;
    icon: ReactNode;
    badgeText?: string;
    disabled?: boolean;
    className?: string;
    "data-testid"?: string;
};

type ClickableProps = BaseProps & {
    to: LinkProps["to"];
    disabled?: false;
    linkProps?: Omit<LinkProps, "to" | "className" | "children">;
};

type NonClickableProps = BaseProps & {
    divProps?: Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;
};

export type Props = ClickableProps | NonClickableProps;

export function SettingsCard(props: Props) {
    const { title, desc, icon, badgeText, disabled, className } = props;
    const dataTestId = props["data-testid"];

    const classes = [
        "group rounded-2xl border p-4 transition-colors",
        "block h-full",                             // hit-area total no grid
        "bg-slate-900 border-slate-800",           // mesmo tema do dashboard
        "hover:bg-slate-900/90 hover:border-slate-700",
        // foco visível com offset (teclado / a11y)
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-indigo-500",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
        disabled ? "opacity-60 cursor-not-allowed border-slate-800/80" : "cursor-pointer",
        className ?? "",
    ].join(" ");

    const content = (
        <div className="flex items-start gap-3">
            {/* chip do ícone com hover sutil */}
            <div className="rounded-xl p-2 bg-slate-800/70 group-hover:bg-slate-800 transition-colors text-slate-300 group-hover:text-slate-200">
                {icon}
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium text-slate-200">{title}</h2>

                    {badgeText && (
                        <span
                            aria-label={`${badgeText} corretoras`}
                            className="text-xs px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800/50 text-slate-300"
                        >
                            {badgeText}
                        </span>
                    )}
                </div>

                <p className="mt-1 text-xs text-slate-400">{desc}</p>

                {!disabled && (
                    <div className="mt-3 text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-0.5">
                        Abrir →
                    </div>
                )}
            </div>
        </div>
    );

    // variante clicável (Link)
    if ("to" in props && !disabled) {
        const { to, linkProps } = props;
        return (
            <Link to={to} className={classes} data-testid={dataTestId} {...linkProps}>
                {content}
            </Link>
        );
    }

    // variante não clicável (Div)
    const { divProps } = props;
    return (
        <div
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            className={classes}
            data-testid={dataTestId}
            {...divProps}
        >
            {content}
        </div>
    );
}
