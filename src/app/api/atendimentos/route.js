import { pool } from "@/lib/db";

const AGENTES_BLOQUEADOS = ["Nome Bloqueado 1", "Nome Bloqueado 2"];
const DEPARTAMENTOS_BLOQUEADOS = ["Comercial Exodo Adm", "Monitoramento/Rastreamento", "Rastreamento", "Rastreador", "Comercial"];
const IDS_BLOQUEADOS = [2936716, 2825088, 3];

export async function GET() {
  try {
    const placeholdersAgentes = AGENTES_BLOQUEADOS.map((_, i) => `$${i + 1}`).join(", ");
    const placeholdersDepartamentos = DEPARTAMENTOS_BLOQUEADOS.map((_, i) => `$${AGENTES_BLOQUEADOS.length + i + 1}`).join(", ");
    const placeholdersIds = IDS_BLOQUEADOS.map((_, i) => `$${AGENTES_BLOQUEADOS.length + DEPARTAMENTOS_BLOQUEADOS.length + i + 1}`).join(", ");

    const params = [...AGENTES_BLOQUEADOS, ...DEPARTAMENTOS_BLOQUEADOS, ...IDS_BLOQUEADOS];

    const result = await pool.query(
      `SELECT *,
        TO_CHAR(ultima_mensagem_data, 'YYYY-MM-DD') as ult_msg_data_fmt,
        TO_CHAR(ultima_mensagem_hora, 'HH24:MI:SS')  as ult_msg_hora_fmt,
        TO_CHAR(data_criado, 'YYYY-MM-DD')           as data_criado_fmt,
        TO_CHAR(hora_criado, 'HH24:MI:SS')           as hora_criado_fmt
       FROM historico_atendimentos 
       WHERE nome_agente         NOT IN (${placeholdersAgentes})
         AND departamento_agente NOT IN (${placeholdersDepartamentos})
         AND id                  NOT IN (${placeholdersIds})
         AND status != 'Finalizado'
         AND (ultima_mensagem_data + ultima_mensagem_hora) >= NOW() - INTERVAL '192 hours'
       ORDER BY ultima_mensagem_data ASC, ultima_mensagem_hora ASC`,
      params,
    );

    const atendimentos = result.rows.map((row) => ({
      id: row.id,
      empresa: row.empresa,
      associado: row.nome_cliente,
      telefone: row.numero_cliente,
      agente: row.nome_agente,
      departamento: row.departamento_agente,
      ultimaMensagem: row.ultima_mensagem_nome,
      dataUltimaMensagem:
        row.ult_msg_data_fmt && row.ult_msg_hora_fmt
          ? `${row.ult_msg_data_fmt}T${row.ult_msg_hora_fmt}`
          : null,
      dataCriado:
        row.data_criado_fmt && row.hora_criado_fmt
          ? `${row.data_criado_fmt}T${row.hora_criado_fmt}`
          : null,
      status: row.status,
      emEspera: row.em_espera,
      tempoDeEspera: row.tempo_de_espera,
    }));

    return Response.json(atendimentos, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Erro ao buscar atendimentos:", error.message);
    return Response.json(
      { error: error.message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}