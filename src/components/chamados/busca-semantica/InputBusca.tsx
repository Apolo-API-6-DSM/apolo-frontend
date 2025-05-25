"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function InputBusca() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    const prompt = inputRef.current?.value.trim();
    if (prompt) {
      router.push(`/chamados/busca-semantica?query=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Faça sua busca semântica"
        className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="h-11 whitespace-nowrap rounded-lg bg-[#00163B] px-4 text-sm font-medium text-white hover:bg-[#001e4f]"
      >
        Buscar
      </button>
    </form>
  );
}
