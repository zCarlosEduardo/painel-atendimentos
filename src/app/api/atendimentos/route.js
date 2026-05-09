import { atendimentos } from "@/mocks/atendimentos";

export async function GET() {
    return Response.json(atendimentos);
}