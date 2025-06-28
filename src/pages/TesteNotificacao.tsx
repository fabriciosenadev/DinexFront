import { notification } from "../shared/services/notification";
import { Toaster } from "sonner";

export default function TesteNotificacao() {
  return (
    <div>
      <Toaster position="top-right" offset={64} />
      <button onClick={() => notification.success("Testando em page simples!")}>
        Testar notification
      </button>
    </div>
  );
}