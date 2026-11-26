export type Role = 'superadmin' | 'regis' | 'max' | 'aline' | 'arthur' | null;

export type Trilha = 
  | 'Trilha 1 (Ideação)'
  | 'Trilha 2 (Operação)'
  | 'Trilha 3 (Tração)';

export type StatusSincronizacaoSIG = 
  | 'pendente_abertura'
  | 'sincronizado'
  | 'pendente_ajuste_data'
  | 'pendente_encerramento';

export type StatusPrograma = 
  | 'Inscrito'
  | 'Triagem Agendada'
  | 'Triagem / Entrevista Agendada'
  | 'Diagnóstico Agendado'
  | 'Em Trilha (Encontro 1)'
  | 'Em Trilha (Encontro 2)'
  | 'Em Trilha (Encontro 3)'
  | 'Em Trilha (Encontro 4)'
  | 'Em Trilha (Encontro 5)'
  | 'Em Trilha (Encontro 6)'
  | 'Concluído'
  | 'MEI Formalizado'
  | 'Desligado';

export type StatusMEI = 
  | 'Informal / Sem CNPJ'
  | 'Em Análise / Documentação'
  | 'MEI Aberto e Ativo'
  | 'Desistência / Sem Interesse';

export type TipoSessao = 
  | 'triagem'
  | 'entrevista_triagem' 
  | 'diagnostico_1h' 
  | 'mentoria_2h';

export type StatusAgendamento = 
  | 'agendado'
  | 'confirmado'
  | 'realizado'
  | 'falta_injustificada'
  | 'cancelado_menos_24h'
  | 'cancelado'
  | 'reagendado';

export interface UsuarioSistema {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  role: Role;
  cargo: string;
  ativo: boolean;
  ultimoAcesso?: string;
}

export interface Aluno {
  id: string;
  nome: string;
  whatsapp: string;
  email: string;
  negocio: string;
  ramo: string;
  trilha?: Trilha;
  statusPrograma: StatusPrograma;
  statusMei: StatusMEI;
  totalFaltas: number;
  totalReagendamentos: number;
  totalCancelamentos: number;
  dataCadastro: string;
  dataConclusao?: string;
  dataFollowUp30d?: string;
  dataFollowUp60d?: string;
  encontrosRealizados: number;
  historicoNotas?: string;
  // Campos SIG e Integração
  codigoTurmaSIG?: string;
  statusSincronizacaoSIG?: StatusSincronizacaoSIG;
  cadastradoRD?: boolean;
  // Diagnóstico em PDF anexado
  diagnosticoPdf?: {
    nome: string;
    url: string;
    dataUpload: string;
    tamanho?: string;
  };
  diagnosticoPdfNome?: string;
  diagnosticoPdfUrl?: string;
  // Métricas de Saída
  conseguiuVender?: boolean;
  lancouProduto?: boolean;
  faturamentoAtual?: number;
}

export interface Consultor {
  id: string;
  nome: string;
  email: string;
  turnoPadrao: 'Manhã (08h-12h)' | 'Tarde (13h-17h)' | 'Noite (18h-22h)';
  salaPadrao: string;
  especialidade: string;
}

export interface Agendamento {
  id: string;
  alunoId: string;
  consultorId: string;
  tipo: TipoSessao;
  numeroEncontro?: number; // 0 = triagem, 1..6 = encontros do ciclo
  data: string; // YYYY-MM-DD
  horarioInicio: string; // HH:mm
  horarioFim: string; // HH:mm
  sala: string;
  status: StatusAgendamento;
  lembreteEnviado24h: boolean;
  dataEnvioLembrete?: string;
  observacoes?: string;
  sincronizadoSIG?: boolean;
}

export interface MetricasSaidaTrilha {
  faturamentoInicial?: string;
  faturamentoFinal?: string;
  meiFormalizado?: boolean;
  lucroOrganizado?: string;
}

export interface EntradaDiarioDeBordo {
  id: string;
  alunoId: string;
  consultorId: string;
  agendamentoId: string;
  numeroEncontro: number; // 0 = diagnostico/triagem, 1..6 = mentorias
  data: string;
  diagnosticoResumo: string;
  orientacoesPrestadas: string;
  tarefaProximoEncontro: string;
  tarefaStatusAnterior: 'pendente' | 'em_andamento' | 'cumprida';
  statusFormalizacaoMei: StatusMEI;
  proximosPassos: string;
  criadoEm: string;
  // Anexo de PDF do diagnóstico
  diagnosticoPdf?: {
    nome: string;
    url: string;
    dataUpload: string;
    tamanho?: string;
  };
  diagnosticoPdfNome?: string;
  diagnosticoPdfUrl?: string;
  // Métricas do Encontro 6
  metricasSaida?: MetricasSaidaTrilha;
  lancouProduto?: boolean;
  conseguiuVender?: boolean;
  faturamentoInformado?: number;
}

export interface DuvidaMentorado {
  id: string;
  alunoId: string;
  consultorId: string;
  pergunta: string;
  resposta?: string;
  status: 'aberta' | 'respondida';
  criadaEm: string;
  respondidaEm?: string;
}

export interface MaterialApoio {
  id: string;
  titulo: string;
  categoria: 'Gestão Financeira' | 'Vendas & Clientes' | 'Formalização MEI' | 'Controles Diários';
  descricao: string;
  linkOuTexto: string;
  adicionadoPor: string;
  criadoEm: string;
}

export interface BloqueioAgenda {
  id: string;
  consultorId?: string; // se não preenchido ou 'todos', bloqueio geral da unidade
  tipo: 'ferias' | 'licenca' | 'feriado' | 'recesso' | 'manutencao' | 'acao_educacional' | 'feriado_recesso';
  dataInicio: string;
  dataFim: string;
  motivo: string;
  ativo?: boolean;
}

export interface RegistroAuditoria {
  id: string;
  usuarioNome: string;
  role?: Role;
  acao: string;
  detalhes: string;
  dataHora: string;
  tipo?: 'info' | 'alerta' | 'critico';
  ip?: string;
}
