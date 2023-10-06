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
      const updateData = {};
      for (const key in p) {
        if (key === 'atualizacao') {
          if (p[key] !== undefined) {
            updateData[key] = p[key];
          }
        } else {
          updateData[key] = p[key];
        }
      }
      await ponto.update(updateData);
      return await this.buscarID(id);
    } catch (error) {
      throw new Error('Erro ao registrar: ' + error.message);
    }
  }

  async gerarCode(): Promise<string> {
    const codeLength = 6;
    const characters = '0123456789';
    let code = '';

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    const dataCode = {
      codigo: code,
      expiresAt: new Date(Date.now() + 180000)
    }

    await this.db.collection("Code").add(dataCode);

    return code;
  }

  async validarCode(code: string): Promise<boolean> {
    try {
      const collectionRef = this.db.collection("Code");
      const snapshot = await collectionRef.where('codigo', '==', code).get();
      if (snapshot.empty) {
        return;
      }

      const codigo = snapshot.docs[0].data();
      const expiresAtTimestamp = codigo.expiresAt._seconds * 1000;

      const expiresAtDate = new Date(expiresAtTimestamp);

      if (expiresAtDate > new Date()) {
        await this.removerCode(snapshot.docs[0].id);
        return true;
      }
      return false;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async removerCode(id: string) {
    try {
      await this.db.collection("Code").doc(id).delete();
    } catch (error) {
      throw new Error('Erro ao deletar: ' + error.message);
    }
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
