import { AtualizarQuantidadeDTO } from 'src/material/DTO/quantidade.dto';

export class AtualizacaoDTO {
  id: string;
  projeto: string;
  detalhes: string;
  material: AtualizarQuantidadeDTO[];
  data: string;
  hora: string;
}
