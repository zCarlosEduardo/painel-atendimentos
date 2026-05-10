import { atendimentos } from "@/mocks/atendimentos"

const AGENTES_BLOQUEADOS = [
  "Carlos Edua",
  "Nome Bloqueado 2",
]

export async function GET() {
  const filtrados = atendimentos.filter(
    (a) => !AGENTES_BLOQUEADOS.includes(a.agente)
  )
  return Response.json(filtrados, {
    headers: { "Cache-Control": "no-store" },
  })
}

/*
import { db } from "@/lib/db"

const AGENTES_BLOQUEADOS = [
  "Nome Bloqueado 1",
  "Nome Bloqueado 2",
]

export async function GET() {
  try {
    const placeholders = AGENTES_BLOQUEADOS.map((_, i) => `$${i + 1}`).join(", ")

    const result = await db.query(
      `SELECT * FROM atendimentos 
       WHERE agente NOT IN (${placeholders})
       ORDER BY data_ultima_mensagem ASC`,
      AGENTES_BLOQUEADOS
    )

    const atendimentos = result.rows.map((row) => ({
      id: row.id_atendimento,
      associado: row.nm_associado,
      telefone: row.nr_telefone,
      empresa: row.nm_empresa,
      departamento: row.nm_departamento,
      agente: row.nm_agente,
      ultimaMensagem: row.nm_ultima_mensagem,
      dataUltimaMensagem: row.dt_ultima_mensagem,
      plataforma: row.nm_plataforma,
    }))

    return Response.json(atendimentos, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("Erro ao buscar atendimentos:", error)
    return Response.json(
      { error: "Erro interno ao buscar atendimentos" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    )
  }
}
*/