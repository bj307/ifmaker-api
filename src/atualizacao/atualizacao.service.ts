import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AtualizarDTO } from './DTO/atualizar.dto';
import { AtualizacaoDTO } from './DTO/atualizacao.dto';
import { ProjetoService } from 'src/projeto/projeto.service';
import { AtualizarProjetoDTO } from 'src/projeto/DTO/atualizarprojeto.dto';

@Injectable()
export class AtualizacaoService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor(private readonly projetoService: ProjetoService) {
    this.db = admin.firestore();
  }
  private readonly collection = 'Atualizacoes';

  async atualizar(a: AtualizarDTO): Promise<AtualizacaoDTO> {
    try {
      const newAtualizacao = await this.db.collection(this.collection).add(a);

      const atProjeto: AtualizarProjetoDTO = {
        atualizacao: [a.projeto],
      };

      await this.projetoService.atualizar(a.projeto, atProjeto);

      const atualizacao = await this.buscarID(newAtualizacao.id);

      return atualizacao;
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
        usuario: snapshot.usuario,
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
      if (snapshot.empty) {
        return;
      }

      const promises = snapshot.docs.map(async (atualizacao) => {
        return await this.buscarID(atualizacao.id);
      });

      const atualizacoes = await Promise.all(promises);
      return atualizacoes;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async deletar(id: string): Promise<string> {
    try {
      await this.db.collection(this.collection).doc(id).delete();
      return 'successfully deleted';
    } catch (error) {
      throw new Error('Erro ao deletar: ' + error.message);
    }
  }
}
