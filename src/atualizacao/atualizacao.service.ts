import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AtualizarDTO } from './DTO/atualizar.dto';
import { AtualizacaoDTO } from './DTO/atualizacao.dto';
import { ProjetoService } from 'src/projeto/projeto.service';

@Injectable()
export class AtualizacaoService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor(private readonly projetoService: ProjetoService) {
    this.db = admin.firestore();
  }
  private readonly collection = 'Atualizacoes';

  async atualizar(a: AtualizarDTO[]): Promise<AtualizacaoDTO[]> {
    try {
      const atualizacoes: AtualizacaoDTO[] = [];
      for (const atual of a) {
        const newAtualizacao = await this.db
          .collection(this.collection)
          .add(atual);
        atualizacoes.push(await this.buscarID(newAtualizacao.id));

        await this.projetoService.atualizar(atual.projeto, {
          atualizacao: [`${atual.projeto}`],
        });
      }

      return atualizacoes;
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
      if (snapshot.empty) {
        return;
      }
      const atualizacoes: AtualizacaoDTO[] = [];

      snapshot.docs.forEach(async (atualizacao) => {
        const at = await this.buscarID(atualizacao.id);
        atualizacoes.push(at);
      });
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
