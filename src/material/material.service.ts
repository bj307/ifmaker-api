import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { MaterialDTO } from './DTO/material.dto';
import { NovoMaterialDTO } from './DTO/novo.dto';
import { AtualizarMaterialDTO } from './DTO/atualizar.dto';

@Injectable()
export class MaterialService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }
  private readonly collection = 'Materiais';

  async cadastrar(m: NovoMaterialDTO): Promise<MaterialDTO> {
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

  async atualizar(id: string, m: AtualizarMaterialDTO): Promise<MaterialDTO> {
    try {
      const materialRef = this.db.collection(this.collection).doc(id);
      const material = this.buscarID(materialRef.id);
      const updateData = { ...m };

      if (updateData.quantidade) {
        updateData.quantidade =
          (await material).quantidade - updateData.quantidade;
      }
      await materialRef.update(updateData);
      return await this.buscarID(materialRef.id);
    } catch (error) {
      throw new Error('Erro ao atualizar: ' + error.message);
    }
  }
}
