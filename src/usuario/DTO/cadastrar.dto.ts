export class CadUsuarioDTO {
  nome: string;
  email: string;
  matricula: string;
  senha: string;
  nivel_acesso: 'admin' | 'member';
}
