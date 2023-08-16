export class PontoDTO {
  id?: string;
  data: string;
  entrada: string | null;
  saida: string | null;
  usuario: string;
  token: string;
  atualizacao?: string[];
}
