// import { atendimentos } from "@/mocks/atendimentos"

// export async function GET() {
//   const agora = new Date()

//   const dados = atendimentos.map((a, index) => ({
//     ...a,
//     dataUltimaMensagem: new Date(agora - index * 60 * 1000).toISOString(),
//   }))

//   return Response.json(dados)
// }

import { atendimentos } from "@/mocks/atendimentos"

export async function GET() {
  return Response.json(atendimentos)
}