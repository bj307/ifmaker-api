import { Injectable } from '@nestjs/common';
import { CadUsuarioDTO } from './DTO/cadastrar.dto';
import { ShowUsuarioDTO } from './DTO/mostrar.dto';
import { AtUsuarioDTO } from './DTO/atualizar.dto';
import * as admin from 'firebase-admin';
import { AcessoDTO } from './DTO/nivelacesso.dto';
// import * as bcrypt from 'bcrypt';

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
      const snapshot = (await usuarioRef.get()).data();
      const data = await usuarioRef.get();
      if (!snapshot) {
        return;
      }
      const showUsuario: ShowUsuarioDTO = {
        id: data.id,
        nome: snapshot.nome,
        email: snapshot.email,
        matricula: snapshot.matricula,
        nivel_acesso: snapshot.nivel_acesso,
        projetos: snapshot.projetos,
      };
      return showUsuario;
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
      const showUsuario: ShowUsuarioDTO = {
        id: snapshot.docs[0].id,
        nome: snapshot.docs[0].data().nome,
        email: snapshot.docs[0].data().email,
        matricula: snapshot.docs[0].data().matricula,
        nivel_acesso: snapshot.docs[0].data().nivel_acesso,
        projetos: snapshot.docs[0].data().projetos,
      };
      return showUsuario;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async atualizar(id: string, u: AtUsuarioDTO): Promise<ShowUsuarioDTO> {
    try {
      const usuario = this.db.collection(this.collection).doc(id);
      await usuario.update({ ...u });
      return await this.buscarID(usuario.id);
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

  async checkPassword(senha: string, email: string): Promise<boolean> {
    try {
      const collectionRef = this.db.collection(this.collection);
      const snapshot = await collectionRef.where('email', '==', email).get();

      const usuario = snapshot.docs[0].data();

      if (usuario.senha === senha) {
        return true;
      }

      // const valid = await bcrypt.compare(senha, usuario.senha);
      // if (!valid) {
      //   throw new NotFoundException('Senha inválida.');
      // }

      return false;
    } catch (error) {
      throw new Error('Erro ao validar: ' + error.message);
    }
  }

  async alterarNivelAcesso(id: string, acesso: AcessoDTO) {
    try {
      const usuario = this.db.collection(this.collection).doc(id);
      await usuario.update({ ...acesso });
      return await this.buscarID(id);
    } catch (error) {
      throw new Error('Erro ao atualizar: ' + error.message);
    }
  }
}
