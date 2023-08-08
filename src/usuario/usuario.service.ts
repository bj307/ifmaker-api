import { Injectable } from '@nestjs/common';
import { CadUsuarioDTO } from './DTO/cadastrar.dto';
import { ShowUsuarioDTO } from './DTO/mostrar.dto';
import { AtUsuarioDTO } from './DTO/atualizar.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class UsuarioService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }
  private readonly collection = 'Usuario';

  async cadastrar(u: CadUsuarioDTO): Promise<ShowUsuarioDTO> {
    try {
      const newUsuario = await this.db.collection(this.collection).add(u);

      const showUsuario: ShowUsuarioDTO = await this.buscarID(newUsuario.id);
      return showUsuario;
    } catch (error) {
      throw new Error('Erro ao criar: ' + error.message);
    }
  }

  async buscarID(id: string): Promise<ShowUsuarioDTO> {
    try {
      const usuarioRef = this.db.collection(this.collection).doc(id);
      const usuario: ShowUsuarioDTO = (await usuarioRef.get()).data();
      if (!usuario) {
        return;
      }
      return usuario;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async buscarEmail(email: string): Promise<ShowUsuarioDTO> {
    try {
      const collectionRef = this.db.collection(this.collection);
      const snapshot = await collectionRef.where('email', '==', email).get();
      if (!snapshot) {
        return;
      }
      const showUsuario: ShowUsuarioDTO = snapshot.docs[0].data();
      return showUsuario;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async atualizar(id: string, u: AtUsuarioDTO): Promise<ShowUsuarioDTO> {
    try {
      const usuario = this.db.collection(this.collection).doc(id);
      await usuario.set({ u }, { merge: true });
      return await this.buscarID(id);
    } catch (error) {
      throw new Error('Erro ao atualizar: ' + error.message);
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
