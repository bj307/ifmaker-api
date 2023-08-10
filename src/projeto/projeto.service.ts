import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ProjetoDTO } from './DTO/projeto.dto';

@Injectable()
export class ProjetoService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }
  private readonly collection = 'Projetos';

  async cadastrar(p: ProjetoDTO): Promise<ProjetoDTO> {
    try {
      const cadastro = await this.db.collection(this.collection).add(p);
      const projeto: ProjetoDTO = await this.buscarID(cadastro.id);
      return projeto;
    } catch (error) {
      throw new Error('Erro ao criar: ' + error.message);
    }
  }

  async buscarID(id: string): Promise<ProjetoDTO> {
    try {
      const projetoRef = this.db.collection(this.collection).doc(id);
      const snapshot = (await projetoRef.get()).data();
      const data = await projetoRef.get();
      if (!snapshot) {
        return;
      }
      const projeto: ProjetoDTO = {
        id: data.id,
        nome: snapshot.nome,
        descricao: snapshot.descricao,
        tipo: snapshot.tipo,
        usuarios: snapshot.usuarios,
        atualizacao: snapshot.atualizacao,
      };
      return projeto;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async atualizar(id: string, p: ProjetoDTO): Promise<ProjetoDTO> {
    try {
      const projeto = this.db.collection(this.collection).doc(id);
      const updateData = { ...p };
      await projeto.update(updateData);
      return await this.buscarID(projeto.id);
    } catch (error) {
      throw new Error('Erro ao atualizar: ' + error.message);
    }
  }
}
