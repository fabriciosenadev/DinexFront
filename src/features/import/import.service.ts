// import { api } from "../../shared/services/api";

export async function uploadB3Statement(file: File): Promise<{ data: string }> {
    // Se usar auth, pegue o token conforme seu padrão
    const userData = localStorage.getItem("dinex:user-data"); // ou getUserToken()
    const token = userData ? JSON.parse(userData).token : null;
    const userId = userData ? JSON.parse(userData).id : null;

    const formData = new FormData();
    formData.append("file", file);
    if (userId) formData.append("userId", userId);

    const response = await fetch("https://localhost:5001/v1/import/b3/upload", {
        method: "POST",
        body: formData,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // Não envie Content-Type! O browser resolve
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.Errors?.[0] || response.statusText || "Erro ao importar extrato");
    }

    // Backend retorna { data: importJobId }
    return response.json();
}

