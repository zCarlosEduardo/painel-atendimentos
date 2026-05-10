"use client";

import { calcularTempoSemResposta } from "@/utils/tempo";
import { calcularStatus } from "@/utils/status";
import { mapearDepartamento } from "@/utils/mapearDepartamento";
import { Phone, User, Building2, MessageSquare, Clock, Hourglass } from "lucide-react";

const styles = {
  ok: {
    bg: "bg-emerald-600",
    pulse: false,
  },
  alerta: {
    bg: "bg-orange-500",
    pulse: false,
  },
  critico: {
    bg: "bg-red-600",
    pulse: true,
  },
};

function Row({ icon: Icon, label, value, muted }) {
  return (
    <div className="flex items-start gap-2 text-md">
      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${muted}`} />
      <div className="min-w-0 flex-1">
        <span className={`${muted} text-md tracking-wider mr-1`}>
          {label}
        </span>
        <span className="font-medium wrap-break-word">{value}</span>
      </div>
    </div>
  );
}

export function AtendimentoCard({ atendimento, now, aguardandoAssociado }) {
  const { formatado, totalMinutos } = calcularTempoSemResposta(
    atendimento.dataUltimaMensagem,
    now
  );
  const status = calcularStatus(totalMinutos);
  const departamento = mapearDepartamento(atendimento.departamento);

  if (aguardandoAssociado) {
    return (
      <div className="group relative rounded-2xl p-4 flex flex-col gap-2.5 bg-white text-slate-900 ring-1 ring-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-2xl leading-tight truncate">
            {atendimento.associado}
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 px-2.5 py-1 text-xs font-medium whitespace-nowrap">
            <Hourglass className="h-3 w-3" />
            Aguardando
          </span>
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <Row icon={Phone} label="Telefone:" value={atendimento.telefone} muted="text-slate-500" />
          <Row icon={User} label="Agente:" value={atendimento.agente} muted="text-slate-500" />
          <Row icon={Building2} label="Depto:" value={departamento} muted="text-slate-500" />
          <Row icon={MessageSquare} label="Última msg:" value={atendimento.ultimaMensagem} muted="text-slate-500" />
        </div>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-200">
          <span className="text-2xl font-semibold text-slate-700 truncate">
            {atendimento.empresa}
          </span>
          <span className="font-mono font-bold text-slate-900 text-2xl tracking-widest tabular-nums">
            {formatado}
          </span>
        </div>
      </div>
    );
  }

  const s = styles[status];

  return (
    <div className={`group relative rounded-2xl p-4 flex flex-col gap-2.5 text-white overflow-hidden ${s.bg} transition-colors duration-700`}>
      <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-white/5" />

      <div className="relative">
        <h3 className="font-bold text-2xl leading-tight truncate drop-shadow-sm">
          {atendimento.associado}
        </h3>
      </div>

      <div className="relative flex flex-col gap-1.5 mt-1">
        <Row icon={Phone} label="Telefone:" value={atendimento.telefone} muted="text-white" />
        <Row icon={User} label="Agente:" value={atendimento.agente} muted="text-white" />
        <Row icon={Building2} label="Depto:" value={departamento} muted="text-white" />
        <Row icon={MessageSquare} label="Última msg:" value={atendimento.ultimaMensagem} muted="text-white" />
      </div>

      <div className="relative flex items-center justify-between mt-2 pt-3 border-t border-white/25">
        <span className="text-2xl font-semibold text-white/90 truncate">
          {atendimento.empresa}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono font-bold text-white text-2xl tracking-widest tabular-nums drop-shadow">
          {formatado}
        </span>
      </div>
    </div>
  );
}