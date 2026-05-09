"use client";

import { useState, useRef, useEffect } from "react";
import { useAtendimentosStore } from "@/store/atendimentosStore";
import { mapearDepartamento } from "@/utils/mapearDepartamento";

function Dropdown({ label, opcoes, selecionados, onToggle }) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickFora(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setAberto(!aberto)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-base font-medium transition-all duration-200 ${
          aberto ? "bg-gray-600" : "bg-gray-700/30 border-gray-500/30 hover:bg-gray-600/50"
        }`}
      >
        <span>{label}</span>
        <span
          className={`overflow-hidden transition-all duration-300 ${
            selecionados.length > 0
              ? "max-w-8 opacity-100"
              : "max-w-0 opacity-0"
          }`}
        >
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
            {selecionados.length}
          </span>
        </span>
        <span
          className={`text-gray-400 transition-transform duration-200 ${aberto ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      <div
        className={`absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-xl z-50 min-w-48 overflow-hidden transition-all duration-200 ${
          aberto
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        {opcoes.map((opcao) => (
          <button
            key={opcao}
            onClick={() => onToggle(opcao)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left"
          >
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                selecionados.length === 0 || selecionados.includes(opcao)
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-500"
              }`}
            >
              <span
                className={`text-white text-xs transition-all duration-150 ${
                  selecionados.length === 0 || selecionados.includes(opcao)
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-0"
                }`}
              >
                ✓
              </span>
            </div>
            <span className="text-white text-sm">{opcao}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [aberto, setAberto] = useState(false);

  const {
    atendimentos,
    filtroEmpresas,
    filtroDepartamentos,
    filtroPlatformas,
    toggleFiltroEmpresa,
    toggleFiltroDepartamento,
    toggleFiltroPlatforma,
    limparFiltros,
  } = useAtendimentosStore((s) => s);

  const empresas = [...new Set(atendimentos.map((a) => a.empresa))];
  const departamentos = [
    ...new Set(atendimentos.map((a) => mapearDepartamento(a.departamento))),
  ];
  const plataformas = [...new Set(atendimentos.map((a) => a.plataforma))];

  const totalFiltrosAtivos =
    filtroEmpresas.length +
    filtroDepartamentos.length +
    filtroPlatformas.length;

  return (
    <header className="text-white">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold tracking-wide">
          Painel de Atendimentos
        </h1>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${
              aberto
                ? "opacity-100 visible"
                : "opacity-0 invisible w-0 overflow-hidden"
            }`}
          >
            <Dropdown
              label="Empresa"
              opcoes={empresas}
              selecionados={filtroEmpresas}
              onToggle={toggleFiltroEmpresa}
            />
            <Dropdown
              label="Departamento"
              opcoes={departamentos}
              selecionados={filtroDepartamentos}
              onToggle={toggleFiltroDepartamento}
            />
            <Dropdown
              label="Plataforma"
              opcoes={plataformas}
              selecionados={filtroPlatformas}
              onToggle={toggleFiltroPlatforma}
            />
            <div
              className={`transition-all duration-200 overflow-hidden ${
                totalFiltrosAtivos > 0
                  ? "max-w-32 opacity-100"
                  : "max-w-0 opacity-0"
              }`}
            >
              <button
                onClick={limparFiltros}
                className="bg-red-600/10 border-2 border-red-500/80 hover:bg-red-600/50 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
              >
                Limpar ({totalFiltrosAtivos})
              </button>
            </div>
          </div>

          <button
            onClick={() => setAberto(!aberto)}
            className="bg-gray-700/30 border-2 border-gray-500/30 hover:bg-gray-600/50 px-3 py-1 rounded-md text-lg font-medium transition-all duration-200"
          >
            
            <span
              className={`inline-block transition-transform duration-200 ${aberto ? "rotate-180" : ""}`}
            >
              ▼
            </span>{" "}
            {aberto ? "" : ""}
          </button>
        </div>
      </div>
    </header>
  );
}
