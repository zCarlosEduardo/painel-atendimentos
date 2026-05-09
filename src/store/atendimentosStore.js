import { atendimentos } from "@/mocks/atendimentos";
import { create } from "zustand";

export const useAtendimentosStore = create((set) => ({
  atendimentos: [],
  filtroEmpresa: null,
  filtroDepartamento: null,
  filtroPlataforma: null,

  setAtendimentos: (atendimentos) => set({ atendimentos }),
  setFiltroEmpresa: (empresa) => set({ filtroEmpresa: empresa }),
  setFiltroDepartamento: (departamento) =>
    set({ filtroDepartamento: departamento }),
  setFiltroPlatforma: (plataforma) => set({ filtroPlatforma: plataforma }),
  limparFiltros: () =>
    set({
      filtroEmpresa: null,
      filtroDepartamento: null,
      filtroPlatforma: null,
    }),
}));
