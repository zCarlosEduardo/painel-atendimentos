export function ordenarAtendimentos(atendimentos) {
    const prioridade = {critico: 0, alerta: 1, ok: 2};

    return [...atendimentos].sort((a, b ) => {
        return prioridade[a.status] - prioridade[b.status]
    })
}