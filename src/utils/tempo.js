export function calcularTempoSemResposta (dataUltimaMensagem, now) {
    const diff = now - new Date(dataUltimaMensagem);

    const totalSegundos = Math.floor(diff / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    return {
        horas,
        minutos,
        segundos,
        totalMinutos: Math.floor(totalSegundos / 60),
        formatado: `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`,
    }
}