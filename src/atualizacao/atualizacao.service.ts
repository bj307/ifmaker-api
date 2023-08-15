import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AtualizarDTO } from './DTO/atualizar.dto';
import { AtualizacaoDTO } from './DTO/atualizacao.dto';
import { MaterialService } from 'src/material/material.service';
import { AtualizarMaterialDTO } from 'src/material/DTO/atualizar.dto';

@Injectable()
export class AtualizacaoService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor(private readonly materialService: MaterialService) {
    this.db = admin.firestore();
  }
  private readonly collection = 'Atualizacoes';

  async atualizar(a: AtualizarDTO): Promise<AtualizacaoDTO> {
    try {
      const newAtualizacao = await this.db.collection(this.collection).add(a);
      for (const mat of a.material) {
        const material: AtualizarMaterialDTO = {
          quantidade: mat.quantidade,
        };
        await this.materialService.atualizar(mat.id, material);
      }
      return await this.buscarID(newAtualizacao.id);
    } catch (error) {
      throw new Error('Erro ao criar: ' + error.message);
    }
  }

  async buscarID(id: string): Promise<AtualizacaoDTO> {
    try {
      const atualizacaoRef = this.db.collection(this.collection).doc(id);
      const snapshot = (await atualizacaoRef.get()).data();
      const data = await atualizacaoRef.get();
      if (!snapshot) {
        return;
      }

      const atualizacao: AtualizacaoDTO = {
        id: data.id,
        projeto: snapshot.projeto,
        detalhes: snapshot.detalhes,
        material: snapshot.material,
        data: snapshot.data,
        hora: snapshot.hora,
      };

      return atualizacao;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async buscarPorProjeto(id: string): Promise<AtualizacaoDTO[]> {
    try {
      const collectionRef = this.db.collection(this.collection);
      const snapshot = await collectionRef.where('projeto', '==', id).get();
      if (!snapshot) {
        return;
      }
      const atualizacoes: any[] = [];

      snapshot.docs.forEach((atualizacao) => {
        atualizacoes.push(atualizacao.data());
      });
      return atualizacoes;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }
}
