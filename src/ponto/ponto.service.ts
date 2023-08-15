import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PontoDTO } from './DTO/ponto.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class PontoService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  private readonly collection = 'Ponto';

  async registrar(p: PontoDTO) {
    try {
      const ponto = await this.db.collection(this.collection).add(p);
      return this.buscarID(ponto.id);
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
      if (!ponto) {
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
      if (!snapshot) {
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
      if (!snapshot) {
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
}
