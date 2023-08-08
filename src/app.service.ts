import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private readonly db: FirebaseFirestore.Firestore;

  constructor() {
    try {
      this.db = admin.firestore();
      console.log('Conexão com o Firebase estabelecida com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar ao Firebase:', error);
    }
  }
}
