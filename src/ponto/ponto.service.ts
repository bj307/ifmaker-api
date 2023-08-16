import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PontoDTO } from './DTO/ponto.dto';
import { sign } from 'jsonwebtoken';
import { AtualizarPontoDTO } from './DTO/atualizaponto.dto';

@Injectable()
export class PontoService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  private readonly collection = 'Ponto';

  async entrada(p: PontoDTO) {
    try {
      const ponto = await this.db.collection(this.collection).add(p);
      return this.buscarID(ponto.id);
    } catch (error) {
      throw new Error('Erro ao registrar: ' + error.message);
    }
  }

  async saida(id: string, p: AtualizarPontoDTO) {
    try {
      const ponto = this.db.collection(this.collection).doc(id);
      console.log(ponto);
      await ponto.update({ ...p });
      return await this.buscarID(id);
    } catch (error) {
      throw new Error('Erro ao registrar: ' + error.message);
    }
  }

  async gerarQr(data: string, hora: string): Promise<string> {
    return sign({ data, hora }, process.env.QR_CODE_SECRET, {
      expiresIn: process.env.QR_CODE_EXPIRATION,
    });
  }

  async buscarID(id: string) {
    try {
      const pontoRef = this.db.collection(this.collection).doc(id);
      const ponto = (await pontoRef.get()).data();
      if (ponto.empty) {
        return;
      }
      return ponto;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async buscarUsuario(id: string) {
    try {
      const collectionRef = this.db.collection(this.collection);
      const snapshot = await collectionRef.where('usuario', '==', id).get();
      if (snapshot.empty) {
        return;
      }
      const pontos: any[] = [];

      snapshot.docs.forEach((ponto) => {
        pontos.push(ponto.data());
      });
      return pontos;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async buscarTipo(tipo: string) {
    try {
      const collectionRef = this.db.collection(this.collection);
      const snapshot = await collectionRef.where('tipo', '==', tipo).get();
      if (snapshot.empty) {
        return;
      }
      const pontos: any[] = [];

      snapshot.docs.forEach((ponto) => {
        pontos.push(ponto.data());
      });
      return pontos;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async remover(id: string): Promise<string> {
    try {
      await this.db.collection(this.collection).doc(id).delete();
      return 'successfully deleted';
    } catch (error) {
      throw new Error('Erro ao deletar: ' + error.message);
    }
  }

  async verificarPontoExistente(id: string) {
    try {
      const collectionRef = this.db.collection(this.collection);
      const snapshot = await collectionRef
        .where('usuario', '==', id)
        .where('saida', '==', null)
        .get();
      if (snapshot.empty) {
        return null;
      }
      return snapshot.docs[0].id;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }
}
