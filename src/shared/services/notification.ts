// src/shared/services/notification.ts
import { toast } from "sonner";

// Sonner aceita opções globais por toast, e as principais são duration e position.
// O offset para o Toaster é colocado no componente, não no serviço.
// Portanto, aqui mantemos só o essencial.
const defaultOptions = {
  duration: 5000,
};

export const notification = {
  success: (message: string, title = "Sucesso") =>
    toast.success(`${title}: ${message}`, defaultOptions),
  error: (message: string, title = "Erro") =>
    toast.error(`${title}: ${message}`, defaultOptions),
  info: (message: string, title = "Informação") =>
    toast.info(`${title}: ${message}`, defaultOptions),
  warning: (message: string, title = "Atenção") =>
    toast.warning(`${title}: ${message}`, defaultOptions),
};
