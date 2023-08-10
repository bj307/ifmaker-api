export class UsuarioDTO {
  id: string;
  nome: string;
  email: string;
  matricula: string;
  senha: string;
  nivel_acesso: string;
  projetos?: string[];
}
