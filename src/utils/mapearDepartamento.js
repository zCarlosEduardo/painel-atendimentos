import { normalizar } from "./normalizar";

export function mapearDepartamento(departamento) {
    const texto = normalizar(departamento);

    if (texto.includes("cobran")) return "Cobrança";
    if (texto.includes("financ")) return "Financeiro";
    if (texto.includes("suport")) return "Suporte";
    if (texto.includes("rh") || texto.includes("recursos humanos")) return "Recursos Humanos";

    return departamento;
}