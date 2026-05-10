export async function fetchAtendimentos() {
  try {
    const response = await fetch("/api/atendimentos", {
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Erro na API:", response.status)
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao buscar atendimentos:", error)
    return []
  }
}