import { useEffect } from "react";
import { fetchAtendimentos } from "@/services/atendimentoService";
import { useAtendimentosStore } from "@/store/atendimentosStore";

export function useAtendimentos() {
  const setAtendimentos = useAtendimentosStore((s) => s.setAtendimentos);

  useEffect(() => {
    function buscar() {
      fetchAtendimentos().then((data) => setAtendimentos(data));
    }

    buscar();
    const interval = setInterval(buscar, 30000);
    return () => clearInterval(interval);
  }, [setAtendimentos]);
}
