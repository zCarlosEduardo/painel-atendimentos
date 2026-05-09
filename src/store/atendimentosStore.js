import { create } from "zustand"

export const useAtendimentosStore = create((set) => ({
  atendimentos: [],
  filtroEmpresas: [],
  filtroDepartamentos: [],
  filtroPlatformas: [],

  setAtendimentos: (atendimentos) => set({ atendimentos }),

  toggleFiltroEmpresa: (empresa) =>
    set((state) => ({
      filtroEmpresas: state.filtroEmpresas.includes(empresa)
        ? state.filtroEmpresas.filter((e) => e !== empresa)
        : [...state.filtroEmpresas, empresa],
    })),

  toggleFiltroDepartamento: (departamento) =>
    set((state) => ({
      filtroDepartamentos: state.filtroDepartamentos.includes(departamento)
        ? state.filtroDepartamentos.filter((d) => d !== departamento)
        : [...state.filtroDepartamentos, departamento],
    })),

  toggleFiltroPlatforma: (plataforma) =>
    set((state) => ({
      filtroPlatformas: state.filtroPlatformas.includes(plataforma)
        ? state.filtroPlatformas.filter((p) => p !== plataforma)
        : [...state.filtroPlatformas, plataforma],
    })),

  limparFiltros: () => set({ filtroEmpresas: [], filtroDepartamentos: [], filtroPlatformas: [] }),
}))