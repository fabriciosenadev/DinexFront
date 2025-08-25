import { useState } from "react";
import { uploadB3Statement } from "./import.service";
import { Upload } from "lucide-react";

export default function ImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const result = await uploadB3Statement(file);
      setSuccess("Arquivo enviado com sucesso! ID: " + result.data);
      setFile(null);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Erro ao enviar arquivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-900 shadow-md rounded-xl px-4 py-8 mt-2 sm:px-8 sm:mt-4 sm:ml-0 mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Upload className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Importar Extrato B3</h1>
      </div>
      <p className="text-slate-400 mb-6 text-sm">
        Selecione o arquivo <span className="font-semibold">.xlsx</span> exportado do extrato de negociações da B3 para importar suas operações.
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label
          className="block text-white font-medium mb-1"
          htmlFor="file-upload"
        >
          Arquivo do extrato (.xlsx)
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          disabled={loading}
          required
          className="block w-full file:bg-blue-600 file:hover:bg-blue-700 file:text-white file:font-semibold file:border-0 file:rounded file:py-2 file:px-4 bg-slate-800 text-white rounded cursor-pointer"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-lg mt-2 transition disabled:opacity-70"
          disabled={!file || loading}
        >
          {loading ? "Enviando..." : "Enviar Arquivo"}
        </button>
        {success && (
          <div className="text-green-400 font-medium text-center">{success}</div>
        )}
        {error && (
          <div className="text-red-400 font-medium text-center">{error}</div>
        )}
      </form>
    </div>
  );
}
