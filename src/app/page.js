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
import { useRef, useEffect, useState, useCallback } from "react"

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

function CarrosselRespondidos({ atendimentos, now }) {
  const [offset, setOffset] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const dragStartX = useRef(0)
  const dragStartOffset = useRef(0)
  const intervalRef = useRef(null)
  const offsetRef = useRef(0)

  // Mantém offsetRef sincronizado com offset
  useEffect(() => {
    offsetRef.current = offset
  }, [offset])

  // Mede o card assim que renderiza
  useEffect(() => {
    if (!cardRef.current) return
    const observer = new ResizeObserver(() => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth + 12)
      }
    })
    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [atendimentos])

  const getMaxOffset = useCallback(() => {
    if (!containerRef.current || cardWidth === 0) return 0
    const visibleCards = Math.floor(containerRef.current.offsetWidth / cardWidth)
    return Math.max(0, (atendimentos.length - visibleCards) * cardWidth)
  }, [cardWidth, atendimentos.length])

  const avancar = useCallback(() => {
    const max = getMaxOffset()
    if (max === 0) return
    setOffset((prev) => (prev >= max ? 0 : prev + cardWidth))
  }, [cardWidth, getMaxOffset])

  // Autoplay
  useEffect(() => {
    if (cardWidth === 0 || atendimentos.length === 0) return
    intervalRef.current = setInterval(avancar, 5000)
    return () => clearInterval(intervalRef.current)
  }, [avancar, cardWidth, atendimentos.length])

  // Pausa autoplay enquanto arrasta
  const pausar = () => clearInterval(intervalRef.current)
  const retomar = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(avancar, 5000)
  }, [avancar])

  // Mouse drag
  const onMouseDown = (e) => {
    pausar()
    setIsDragging(true)
    dragStartX.current = e.clientX
    dragStartOffset.current = offsetRef.current
  }

  const onMouseMove = (e) => {
    if (!isDragging) return
    const diff = dragStartX.current - e.clientX
    const max = getMaxOffset()
    setOffset(Math.min(Math.max(0, dragStartOffset.current + diff), max))
  }

  const onMouseUp = (e) => {
    if (!isDragging) return
    setIsDragging(false)
    const diff = dragStartX.current - e.clientX
    // Snap para o card mais próximo
    if (Math.abs(diff) > 50 && cardWidth > 0) {
      const max = getMaxOffset()
      setOffset((prev) => {
        const snapped = Math.round(prev / cardWidth) * cardWidth
        return Math.min(Math.max(0, snapped), max)
      })
    }
    retomar()
  }

  return (
    <div
      ref={containerRef}
      className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={(e) => { if (isDragging) onMouseUp(e) }}
    >
      <div
        className="flex gap-3"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: isDragging ? "none" : "transform 700ms ease-in-out",
        }}
      >
        {atendimentos.map((atendimento, i) => (
          <div
            key={atendimento.id}
            ref={i === 0 ? cardRef : null}
            className="flex-none w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)] xl:w-[calc(25%-9px)] 2xl:w-[calc(16.666%-11px)]"
          >
            <AtendimentoCard
              atendimento={atendimento}
              now={now}
              aguardandoAssociado={true}
            />
          </div>
        ))}
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
      <main className="p-3 sm:p-6 flex flex-col gap-6">
        {carregando ? (
          <section>
            <div className="h-4 bg-gray-800 rounded w-48 mb-3 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
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
                <CarrosselRespondidos atendimentos={aguardandoAssociado} now={now} />
              </section>
            )}
            <section>
              <h2 className="text-gray-400 text-xs sm:text-sm uppercase tracking-widest mb-3">
                Aguardando Atendimento ({aguardandoAgente.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
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