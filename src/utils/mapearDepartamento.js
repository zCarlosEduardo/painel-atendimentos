import { normalizar } from "./normalizar";

export function mapearDepartamento(departamento) {
    const texto = normalizar(departamento);

    if (texto.includes("cobran") || texto.includes("cancelamento") || texto.includes("retenc")) return "Cobrança";
    if (texto.includes("evento") || texto.includes("abertura") || texto.includes("perifericos")) return "Abertura Eventos";
    if (texto.includes("central de relacionamento")) return "Central";


    return departamento;
}