export function calcularStatus(totalMinutos) {
    if (totalMinutos < 5 ) return "ok";
    if (totalMinutos < 10 ) return "alerta";
    return "critico"
}