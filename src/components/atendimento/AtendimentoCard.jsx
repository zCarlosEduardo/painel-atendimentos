"use client";

import { calcularTempoSemResposta } from "@/utils/tempo";
import { calcularStatus } from "@/utils/status";
import { mapearDepartamento } from "@/utils/mapearDepartamento";
import { Phone, User, Building2, MessageSquare, Clock } from "lucide-react";

const styles = {
  ok: {
    bg: "bg-lime-600",
  },
  alerta: {
    bg: "bg-amber-500",
  },
  critico: {
    bg: "bg-red-600",
  },
};

function Row({ icon: Icon, label, value, muted }) {
  return (
    <div className="flex items-center gap-2 text-sm overflow-hidden">
      <Icon className={`h-3.5 w-3.5 shrink-0 ${muted} opacity-90`} />
      <div className="min-w-0 flex flex-wrap items-baseline gap-x-1">
        <span
          className={`${muted} text-[12px] uppercase font-semibold tracking-wider`}
        >
          {label}
        </span>
        <span className="font-medium truncate text-sm">{value}</span>
      </div>
    </div>
  );
}

export function AtendimentoCard({ atendimento, now, aguardandoAssociado }) {
  const { formatado, totalMinutos } = calcularTempoSemResposta(
    atendimento.dataUltimaMensagem,
    now,
  );
  const status = calcularStatus(totalMinutos);
  const departamento = mapearDepartamento(atendimento.departamento);

  // Card para quando o agente já respondeu e aguarda o cliente
  if (aguardandoAssociado) {
    return (
      <div className="group relative rounded-xl p-4 flex flex-col gap-3 bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-lg leading-tight truncate">
              {atendimento.associado}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-500 px-2 py-0.5 text-[10px] font-bold uppercase whitespace-nowrap border border-slate-200">
            <Clock className="h-3 w-3" />
          </span>
        </div>

        <div className="grid grid-cols-1 gap-y-1.5 py-1">
          <Row
            icon={Phone}
            label="Tel:"
            value={atendimento.telefone}
            muted="text-slate-500"
          />
          <Row
            icon={User}
            label="Agente:"
            value={atendimento.agente}
            muted="text-slate-500"
          />
          <Row
            icon={Building2}
            label="Depto:"
            value={departamento}
            muted="text-slate-500"
          />
          <Row
            icon={MessageSquare}
            label="Msg:"
            value={atendimento.ultimaMensagem}
            muted="text-slate-500"
          />
        </div>

        <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100">
          <span className="text-lg font-bold text-slate-400 uppercase tracking-widest truncate max-w-[100px]">
            {atendimento.empresa}
          </span>
          <span className="font-mono font-black text-xl text-slate-700 tabular-nums">
            {formatado}
          </span>
        </div>
      </div>
    );
  }

  const s = styles[status];

  // Card para quando o cliente enviou mensagem e aguarda o agente (CRÍTICO/ALERTA)
  return (
    <div
      className={`group relative rounded-xl p-4 flex flex-col gap-3 text-white overflow-hidden shadow-lg ${s.bg} transition-all duration-500`}
    >
      {/* Background Decorativo */}
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-xl pointer-events-none" />

      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-black text-lg leading-tight truncate drop-shadow-md">
            {atendimento.associado}
          </h3>
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-y-1.5 py-1">
        <Row
          icon={Phone}
          label="Tel:"
          value={atendimento.telefone}
          muted="text-white/90"
        />
        <Row
          icon={User}
          label="Agente:"
          value={atendimento.agente}
          muted="text-white/90"
        />
        <Row
          icon={Building2}
          label="Depto:"
          value={departamento}
          muted="text-white/90"
        />
        <Row
          icon={MessageSquare}
          label="Msg:"
          value={atendimento.ultimaMensagem}
          muted="text-white/90"
        />
      </div>

      <div className="relative flex items-center justify-between mt-1 pt-3 border-t border-white/20">
        <span className="text-lg font-bold text-white/90 uppercase tracking-widest truncate max-w-[100px]">
          {atendimento.empresa}
        </span>
        <div className="flex flex-col items-end">
          <span className="font-mono font-black text-2xl tracking-tighter tabular-nums drop-shadow-lg">
            {formatado}
          </span>
        </div>
      </div>
    </div>
  );
}
