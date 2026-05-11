export function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

export function toTitleCase(texto) {
  return normalizar(texto)
    .split(/\s+/)
    .map((palavra) => {
      return palavra.charAt(0).toUpperCase() + palavra.slice(1)
    })
    .join(" ")
}