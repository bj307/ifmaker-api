import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AgendaDTO } from './DTO/agenda.dto';
import { EditarAgendadoDTO } from './DTO/atualizaragenda.dto';

@Injectable()
export class AgendaService {
  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }
  private readonly collection = 'Agenda';

  async agendar(a: AgendaDTO): Promise<AgendaDTO> {
    try {
      const agenda = await this.db.collection(this.collection).add(a);
      return await this.buscarID(agenda.id);
    } catch (error) {
      throw new Error('Erro ao criar: ' + error.message);
    }
  }

  async buscarID(id: string): Promise<AgendaDTO> {
    try {
      const agendaRef = this.db.collection(this.collection).doc(id);
      const snapshot = (await agendaRef.get()).data();
      const data = await agendaRef.get();
      if (!snapshot) {
        return;
      }
      const agenda: AgendaDTO = {
        id: data.id,
        titulo: snapshot.titulo,
        descricao: snapshot.descricao,
        dia: snapshot.dia,
        mes: snapshot.mes,
        ano: snapshot.ano,
      };
      return agenda;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async buscarMes(mes: number): Promise<AgendaDTO[]> {
    try {
      const collectionRef = this.db.collection(this.collection);
      const snapshot = await collectionRef.where('mes', '==', mes).get();
      if (snapshot.empty) {
        return;
      }
      const agendados: AgendaDTO[] = [];

      snapshot.docs.forEach(async (data) => {
        const agendado = await this.buscarID(data.id);
        agendados.push(agendado);
      });

      return agendados;
    } catch (error) {
      throw new Error('Erro ao buscar: ' + error.message);
    }
  }

  async atualizar(id: string, a: EditarAgendadoDTO): Promise<AgendaDTO> {
    try {
      const agenda = await this.db.collection(this.collection).doc(id);
      await agenda.update({ ...a });
      return await this.buscarID(id);
    } catch (error) {
      throw new Error('Erro ao atualizar: ' + error.message);
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
