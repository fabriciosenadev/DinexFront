import type { JSX } from "react";
import { 
  LineChart, 
  ListOrdered, 
  Home, 
  Wallet, 
  BarChart, 
  Settings, 
  Upload } from "lucide-react";

export interface MenuItem {
  label: string;
  to: string;
  icon: JSX.Element;
}

export const MENU: MenuItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <Home className="w-5 h-5 mr-2" />,
  },
  {
    label: "Ativos",
    to: "/assets",
    icon: <LineChart className="w-5 h-5 mr-2" />,
  },
  {
    label: "Operações",
    to: "/operations",
    icon: <ListOrdered className="w-5 h-5 mr-2" />,
  },
  {
    label: "Importação",
    to: "/import",
    icon: <Upload className="w-5 h-5 mr-2" />,   // AQUI: Importação entre operações e carteiras
  },
  {
    label: "Carteiras",
    to: "/wallets",
    icon: <Wallet className="w-5 h-5 mr-2" />,
  },
  {
    label: "Relatórios",
    to: "/reports",
    icon: <BarChart className="w-5 h-5 mr-2" />,
  },
  {
    label: "Configurações",
    to: "/settings",
    icon: <Settings className="w-5 h-5 mr-2" />,
  },
];
