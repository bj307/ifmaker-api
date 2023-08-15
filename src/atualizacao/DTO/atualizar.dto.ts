import { AtualizarQuantidadeDTO } from 'src/material/DTO/quantidade.dto';

export class AtualizarDTO {
  projeto: string;
  detalhes: string;
  material: AtualizarQuantidadeDTO[];
}
