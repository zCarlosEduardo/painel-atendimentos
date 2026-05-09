export function ordenarAtendimentos(atendimentos) {
  return [...atendimentos].sort((a, b) => {
    const diff =
      new Date(a.dataUltimaMensagem) - new Date(b.dataUltimaMensagem)
    return diff
  })
}