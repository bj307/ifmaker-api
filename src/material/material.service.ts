import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MaterialDTO } from './DTO/material.dto';

@Injectable()
export class MaterialService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }
  private readonly collection = 'Materiais';

  async cadastrar(m: MaterialDTO): Promise<MaterialDTO> {
    try {
      const newMaterial = await this.db.collection(this.collection).add(m);
      return await this.buscarID(newMaterial.id);
    } catch (error) {
      throw new Error('Erro ao criar: ' + error.message);
    }
  }

  async buscarID(id: string): Promise<MaterialDTO> {
    try {
      const materialRef = this.db.collection(this.collection).doc(id);
      const snapshot = (await materialRef.get()).data();
      const data = await materialRef.get();
      if (!snapshot) {
        return;
      }

      const material: MaterialDTO = {
        id: data.id,
        nome: snapshot.nome,
        detalhes: snapshot.detalhes,
        quantidade: snapshot.quantidade,
      };
      return material;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async atualizar(id: string, m: MaterialDTO): Promise<MaterialDTO> {
    try {
      const material = this.db.collection(this.collection).doc(id);
      const updateData = { ...m };
      await material.update(updateData);
      return await this.buscarID(material.id);
    } catch (error) {
      throw new Error('Erro ao atualizar: ' + error.message);
    }
  }
}
