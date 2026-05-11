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

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3 bg-gray-800 animate-pulse">
      <div className="h-5 bg-gray-700 rounded w-3/4" />
      <div className="flex flex-col gap-2 mt-1">
        <div className="h-3 bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-700 rounded w-5/6" />
        <div className="h-3 bg-gray-700 rounded w-4/6" />
        <div className="h-3 bg-gray-700 rounded w-5/6" />
      </div>
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-700">
        <div className="h-4 bg-gray-700 rounded w-1/3" />
        <div className="h-6 bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  )
}

export default function HomePage() {
  useAtendimentos()
  const now = useNow()

  const { atendimentos, filtroEmpresas, filtroDepartamentos, filtroPlatformas } = useAtendimentosStore((s) => s)

  const carregando = atendimentos.length === 0

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
    <div className="min-h-screen text-white">
      <Header />
      <main className="p-3 sm:p-6 flex flex-col gap-6 sm:gap-8">
        {carregando ? (
          <section>
            <div className="h-4 bg-gray-800 rounded w-48 mb-3 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {aguardandoAssociado.length > 0 && (
              <section>
                <h2 className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest mb-3">
                  Respondidos ({aguardandoAssociado.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8 gap-3">
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
              <h2 className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest mb-3">
                Aguardando Atendimento ({aguardandoAgente.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8 gap-3">
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
          </>
        )}
      </main>
    </div>
  )
}