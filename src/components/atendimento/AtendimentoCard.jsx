"use client";

import { calcularTempoSemResposta } from "@/utils/tempo";
import { calcularStatus } from "@/utils/status";
import { mapearDepartamento } from "@/utils/mapearDepartamento";

const cores = {
  ok: "bg-green-500/85",
  alerta: "bg-orange-400/85",
  critico: "bg-red-500/85",
};

export function AtendimentoCard({ atendimento, now, aguardandoAssociado }) {
  const { formatado, totalMinutos } = calcularTempoSemResposta(
    atendimento.dataUltimaMensagem,
    now,
  );
  const status = calcularStatus(totalMinutos);
  const departamento = mapearDepartamento(atendimento.departamento);

  if (aguardandoAssociado) {
    return (
      <div className="bg-white rounded-lg p-3 flex flex-col gap-1 text-sm">
        <div className="font-bold text-black text-lg">
          {atendimento.associado}
        </div>
        <div className="text-gray-700">
          <span className="text-gray-700 text-base">Telefone: </span>
          {atendimento.telefone}
        </div>
        <div className="text-gray-700">
          <span className="text-gray-700 text-base">Agente: </span>
          {atendimento.agente}
        </div>
        <div className="text-gray-700">
          <span className="text-gray-700 text-base">Departamento: </span>
          {departamento}
        </div>
        <div className="text-gray-700">
          <span className="text-gray-700 text-base">Última msg: </span>
          {atendimento.ultimaMensagem}
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10">
          <span className="text-gray-800 text-2xl font-bold">
            {atendimento.empresa}
          </span>
          <span className="font-mono font-bold text-black text-2xl tracking-widest">
            {formatado}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${cores[status]} rounded-lg p-3 flex flex-col gap-1 transition-colors duration-500 text-sm`}
    >
      <div className="font-bold text-white text-lg">
        {atendimento.associado}
      </div>
      <div className="text-gray-200">
        <span className="text-gray-300 text-base">Telefone: </span>
        {atendimento.telefone}
      </div>
      <div className="text-gray-200">
        <span className="text-gray-300 text-base">Agente: </span>
        {atendimento.agente}
      </div>
      <div className="text-gray-200">
        <span className="text-gray-300 text-base">Departamento: </span>
        {departamento}
      </div>
      <div className="text-gray-200">
        <span className="text-gray-300 text-base">Última msg: </span>
        {atendimento.ultimaMensagem}
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
        <span className="text-gray-300 text-2xl">{atendimento.empresa}</span>
        <span className="font-mono font-bold text-white text-2xl tracking-widest">
          {formatado}
        </span>
      </div>
    </div>
  );
}
