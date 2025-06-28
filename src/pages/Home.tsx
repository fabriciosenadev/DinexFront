// src/pages/Home.tsx

export default function Home() {
  return (
    <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-xl flex flex-col items-center gap-4">
      <h1 className="text-4xl md:text-5xl font-bold text-white">Bem-vindo ao Dinex!</h1>
      <p className="text-white/80 text-lg text-center max-w-md">
        Sua plataforma para gestão financeira e investimentos, agora em React + Vite + Tailwind.
      </p>
      <a
        href="/login"
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition"
      >
        Acessar minha conta
      </a>
    </div>
  );
}
