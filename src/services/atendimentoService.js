export async function fetchAtendimentos() {
  const response = await fetch("/api/atendimentos");
  const data = await response.json();
  return data;
}
