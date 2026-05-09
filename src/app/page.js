"use client"

import { useAtendimentos } from "@/hooks/useAtendimentos"
import { useAtendimentosStore } from "@/store/atendimentosStore"
import { useNow } from "@/hooks/useNow"
import { AtendimentoCard } from "@/components/atendimento/AtendimentoCard"
import { Header } from "@/components/layout/Header"
import { mapearDepartamento } from "@/utils/mapearDepartamento"
import { ordenarAtendimentos } from "@/utils/ordenar"
import { calcularTempoSemResposta } from "@/utils/tempo"
import { calcularStatus } from "@/utils/status"

export default function HomePage() {
  useAtendimentos()
  const now = useNow()

  const { atendimentos, filtroEmpresas, filtroDepartamentos, filtroPlatformas } = useAtendimentosStore((s) => s)

  const atendimentosFiltrados = atendimentos
    .filter((a) => filtroEmpresas.length === 0 || filtroEmpresas.includes(a.empresa))
    .filter((a) => filtroDepartamentos.length === 0 || filtroDepartamentos.includes(mapearDepartamento(a.departamento)))
    .filter((a) => filtroPlatformas.length === 0 || filtroPlatformas.includes(a.plataforma))

  const atendimentosComStatus = atendimentosFiltrados.map((a) => {
    const { totalMinutos } = calcularTempoSemResposta(a.dataUltimaMensagem, now)
    const status = calcularStatus(totalMinutos)
    return { ...a, status }
  })

  const aguardandoAssociado = ordenarAtendimentos(
    atendimentosComStatus.filter((a) => a.ultimaMensagem === a.agente)
  )

  const aguardandoAgente = ordenarAtendimentos(
    atendimentosComStatus.filter((a) => a.ultimaMensagem !== a.agente)
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="p-6 flex flex-col gap-8">

        {aguardandoAssociado.length > 0 && (
          <section>
            <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-3">
              Aguardando Associado ({aguardandoAssociado.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {aguardandoAssociado.map((atendimento) => (
                <AtendimentoCard
                  key={atendimento.id}
                  atendimento={atendimento}
                  now={now}
                  aguardandoAssociado={true}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-gray-400 text-sm uppercase tracking-widest mb-3">
            Aguardando Agente ({aguardandoAgente.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
            {aguardandoAgente.map((atendimento) => (
              <AtendimentoCard
                key={atendimento.id}
                atendimento={atendimento}
                now={now}
                aguardandoAssociado={false}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}