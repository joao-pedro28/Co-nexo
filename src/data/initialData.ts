import { 
  Aluno, Consultor, Agendamento, EntradaDiarioDeBordo, 
  DuvidaMentorado, MaterialApoio, UsuarioSistema, BloqueioAgenda, RegistroAuditoria 
} from '../types';

export const INITIAL_USUARIOS: UsuarioSistema[] = [
  {
    id: 'u_super',
    nome: 'Diretoria / Admin Supremo',
    email: 'admin@conexo.senac.br',
    senha: 'admin',
    role: 'superadmin',
    cargo: 'Administrador Supremo do Sistema',
    ativo: true,
    ultimoAcesso: 'Hoje às 15:30'
  },
  {
    id: 'u_regis',
    nome: 'Regis Santos',
    email: 'regis@conexo.senac.br',
    senha: 'regis',
    role: 'regis',
    cargo: 'Administrador do Programa Co.Nexo (Gestão)',
    ativo: true,
    ultimoAcesso: 'Hoje às 14:15'
  },
  {
    id: 'u_max',
    nome: 'Max Silva',
    email: 'max@conexo.senac.br',
    senha: 'max',
    role: 'max',
    cargo: 'Atendimento & Recepção (SAJ)',
    ativo: true,
    ultimoAcesso: 'Hoje às 15:10'
  },
  {
    id: 'u_aline',
    nome: 'Aline Silva',
    email: 'mentoria@conexo.senac.br',
    senha: 'mentoria',
    role: 'aline',
    cargo: 'Consultora de Negócios (Manhã e Tarde)',
    ativo: true,
    ultimoAcesso: 'Ontem às 17:00'
  },
  {
    id: 'u_arthur',
    nome: 'Arthur Santana',
    email: 'arthur@marmitaria.com',
    senha: 'arthur',
    role: 'arthur',
    cargo: 'Empreendedor Mentorado (Marmitaria do Arthur)',
    ativo: true,
    ultimoAcesso: 'Hoje às 11:20'
  }
];

export const INITIAL_CONSULTORES: Consultor[] = [
  {
    id: 'c1',
    nome: 'Aline Silva',
    email: 'aline.consultora@senac.br',
    turnoPadrao: 'Tarde (13h-17h)',
    salaPadrao: 'Sala 204 - Bloco Empreendedorismo',
    especialidade: 'Finanças, Custos e Precificação de Produtos'
  },
  {
    id: 'c2',
    nome: 'Laiza Oliveira',
    email: 'laiza.consultora@senac.br',
    turnoPadrao: 'Noite (18h-22h)',
    salaPadrao: 'Sala 205 - Bloco Inovação',
    especialidade: 'Modelo de Negócios, Validação e Vendas'
  },
  {
    id: 'c3',
    nome: 'Regis Santos',
    email: 'regis.coordenacao@senac.br',
    turnoPadrao: 'Manhã (08h-12h)',
    salaPadrao: 'Coordenação Co.Nexo - Sala 101',
    especialidade: 'Estratégia, Parcerias e Gestão do Programa'
  }
];

export const INITIAL_BLOQUEIOS: BloqueioAgenda[] = [
  {
    id: 'bl1',
    consultorId: 'c1', // Aline
    tipo: 'ferias',
    dataInicio: '2026-12-01',
    dataFim: '2026-12-07',
    motivo: 'Recesso programado da consultora Aline',
    ativo: true
  },
  {
    id: 'bl2',
    consultorId: 'c2', // Laiza
    tipo: 'acao_educacional',
    dataInicio: '2026-11-20',
    dataFim: '2026-11-21',
    motivo: 'Ação Educacional Externa Senac',
    ativo: true
  },
  {
    id: 'bl3',
    tipo: 'feriado_recesso',
    dataInicio: '2026-12-24',
    dataFim: '2027-01-02',
    motivo: 'Recesso Institucional de Fim de Ano Senac Bahia',
    ativo: true
  }
];

export const INITIAL_ALUNOS: Aluno[] = [
  {
    id: 'a1',
    nome: 'Arthur Santana',
    whatsapp: '11987654321',
    email: 'arthur.quentinhas@email.com',
    negocio: 'Marmitaria do Arthur (Venda de Quentinhas)',
    ramo: 'Alimentação / Gastronomia',
    trilha: 'Trilha 1 (Ideação)',
    statusPrograma: 'Em Trilha (Encontro 1)',
    statusMei: 'Informal / Sem CNPJ',
    totalFaltas: 0,
    totalReagendamentos: 0,
    totalCancelamentos: 0,
    dataCadastro: '2026-10-01',
    encontrosRealizados: 1,
    codigoTurmaSIG: 'TURMA-CONEXO-55',
    statusSincronizacaoSIG: 'sincronizado',
    cadastradoRD: true,
    diagnosticoPdfNome: 'Diagnostico_Inicial_Arthur_Santana.pdf',
    diagnosticoPdfUrl: '#diagnostico-arthur',
    historicoNotas: 'Entrevista de triagem e diagnóstico realizada com Aline. Negócio informal, anotações de fiado em papelão, mistura despesas pessoais com o caixa do almoço.'
  },
  {
    id: 'a2',
    nome: 'Juliana Costa',
    whatsapp: '11977778888',
    email: 'juliana.doces@email.com',
    negocio: 'Ju Doces Artesanais (Bolo de Pote)',
    ramo: 'Confeitaria',
    trilha: 'Trilha 2 (Operação)',
    statusPrograma: 'Em Trilha (Encontro 3)',
    statusMei: 'Em Análise / Documentação',
    totalFaltas: 0,
    totalReagendamentos: 1,
    totalCancelamentos: 0,
    dataCadastro: '2026-09-15',
    encontrosRealizados: 3,
    codigoTurmaSIG: 'TURMA-CONEXO-48',
    statusSincronizacaoSIG: 'sincronizado',
    cadastradoRD: true,
    diagnosticoPdfNome: 'Diagnostico_Ju_Doces_Trilha2.pdf',
    diagnosticoPdfUrl: '#diagnostico-juliana',
    historicoNotas: 'Precificação ajustada no Encontro 2. Já abriu conta jurídica digital e está reunindo documentos para o MEI.'
  },
  {
    id: 'a3',
    nome: 'Carlos Eduardo Santos',
    whatsapp: '11966665555',
    email: 'cadu.barber@email.com',
    negocio: 'Cadu Cortes Masculinos',
    ramo: 'Beleza & Estética',
    trilha: 'Trilha 2 (Operação)',
    statusPrograma: 'Concluído',
    statusMei: 'Informal / Sem CNPJ',
    totalFaltas: 1,
    totalReagendamentos: 1,
    totalCancelamentos: 1,
    dataCadastro: '2026-08-10',
    dataConclusao: '2026-09-20',
    dataFollowUp30d: '2026-10-20',
    dataFollowUp60d: '2026-11-20',
    encontrosRealizados: 6,
    codigoTurmaSIG: 'TURMA-CONEXO-32',
    statusSincronizacaoSIG: 'pendente_encerramento',
    cadastradoRD: true,
    conseguiuVender: true,
    lancouProduto: true,
    faturamentoAtual: 3400,
    historicoNotas: 'Ciclo completo de 6 encontros finalizado! Necessita contato de follow-up e encerramento oficial no SIG até dia 30.'
  },
  {
    id: 'a4',
    nome: 'Vanessa Souza',
    whatsapp: '11955554444',
    email: 'vanessa.atelie@email.com',
    negocio: 'Ateliê Costura Fina',
    ramo: 'Moda / Confecção',
    trilha: 'Trilha 1 (Ideação)',
    statusPrograma: 'Em Trilha (Encontro 2)',
    statusMei: 'Informal / Sem CNPJ',
    totalFaltas: 1,
    totalReagendamentos: 2,
    totalCancelamentos: 0,
    dataCadastro: '2026-09-01',
    encontrosRealizados: 2,
    codigoTurmaSIG: 'TURMA-CONEXO-50',
    statusSincronizacaoSIG: 'pendente_ajuste_data',
    cadastradoRD: true,
    historicoNotas: 'ALERTA DE DESLIGAMENTO: Aluna já acumula 1 falta e 2 reagendamentos. Mais 1 falta causará desligamento automático.'
  },
  {
    id: 'a5',
    nome: 'Roberto Lima',
    whatsapp: '11944443333',
    email: 'roberto.marcenaria@email.com',
    negocio: 'Móveis Planejados Lima',
    ramo: 'Marcenaria / Artesanato',
    trilha: 'Trilha 1 (Ideação)',
    statusPrograma: 'Desligado',
    statusMei: 'Informal / Sem CNPJ',
    totalFaltas: 2,
    totalReagendamentos: 1,
    totalCancelamentos: 1,
    dataCadastro: '2026-08-25',
    encontrosRealizados: 1,
    codigoTurmaSIG: 'TURMA-CONEXO-41',
    statusSincronizacaoSIG: 'pendente_encerramento',
    cadastradoRD: true,
    historicoNotas: 'Desligado automaticamente pelo sistema após registrar a segunda falta injustificada sem aviso prévio de 24h.'
  },
  {
    id: 'a6',
    nome: 'Mariana Dias',
    whatsapp: '11933332222',
    email: 'mariana.design@email.com',
    negocio: 'Dias Comunicação Visual',
    ramo: 'Serviços / Gráfica Rápida',
    trilha: 'Trilha 2 (Operação)',
    statusPrograma: 'MEI Formalizado',
    statusMei: 'MEI Aberto e Ativo',
    totalFaltas: 0,
    totalReagendamentos: 0,
    totalCancelamentos: 0,
    dataCadastro: '2026-07-20',
    dataConclusao: '2026-09-05',
    encontrosRealizados: 6,
    codigoTurmaSIG: 'TURMA-CONEXO-29',
    statusSincronizacaoSIG: 'sincronizado',
    cadastradoRD: true,
    conseguiuVender: true,
    lancouProduto: true,
    faturamentoAtual: 5200,
    historicoNotas: 'Caso de Sucesso! Formalizou MEI após o acompanhamento com suporte da equipe Co.Nexo.'
  },
  {
    id: 'a7',
    nome: 'Rafael Santa Cruz',
    whatsapp: '11922221111',
    email: 'rafael.tecnologia@email.com',
    negocio: 'Santa Cruz Assistência Técnica',
    ramo: 'Eletrônicos & TI',
    trilha: 'Trilha 2 (Operação)',
    statusPrograma: 'Em Trilha (Encontro 3)',
    statusMei: 'Informal / Sem CNPJ',
    totalFaltas: 1,
    totalReagendamentos: 1,
    totalCancelamentos: 0,
    dataCadastro: '2026-10-10',
    encontrosRealizados: 3,
    codigoTurmaSIG: 'TURMA-CONEXO-59',
    statusSincronizacaoSIG: 'pendente_ajuste_data',
    cadastradoRD: true,
    historicoNotas: 'PASSIVO NO LIMBO: Aluno faltou no dia 15/10 e está há mais de 20 dias sem reagendamento marcado. Necessita contato urgente de Max.'
  }
];

export const INITIAL_AGENDAMENTOS: Agendamento[] = [
  {
    id: 'ag1',
    alunoId: 'a1', // Arthur Santana
    consultorId: 'c1', // Aline
    tipo: 'mentoria_2h',
    numeroEncontro: 1,
    data: '2026-11-09',
    horarioInicio: '15:00',
    horarioFim: '17:00',
    sala: 'Sala 204 - Bloco Empreendedorismo',
    status: 'agendado',
    lembreteEnviado24h: false,
    sincronizadoSIG: true,
    observacoes: 'Encontro 1: Separação de contas física e jurídica e introdução ao controle de compras da feira.'
  },
  {
    id: 'ag2',
    alunoId: 'a2', // Juliana Costa
    consultorId: 'c1', // Aline
    tipo: 'diagnostico_1h',
    numeroEncontro: 0,
    data: '2026-11-09',
    horarioInicio: '13:00',
    horarioFim: '14:00',
    sala: 'Sala 204 - Bloco Empreendedorismo',
    status: 'confirmado',
    lembreteEnviado24h: true,
    dataEnvioLembrete: '2026-11-08 10:00',
    sincronizadoSIG: true,
    observacoes: 'Entrevista de alinhamento financeiro complementar.'
  },
  {
    id: 'ag3',
    alunoId: 'a4', // Vanessa Souza
    consultorId: 'c1', // Aline
    tipo: 'diagnostico_1h',
    numeroEncontro: 0,
    data: '2026-11-09',
    horarioInicio: '14:00',
    horarioFim: '15:00',
    sala: 'Sala 204 - Bloco Empreendedorismo',
    status: 'confirmado',
    lembreteEnviado24h: true,
    dataEnvioLembrete: '2026-11-08 10:30',
    sincronizadoSIG: true,
    observacoes: 'Casamento perfeito de grade: 13h-14h + 14h-15h + 15h-17h preenchendo o turno de 4 horas sem ociosidade.'
  },
  {
    id: 'ag4',
    alunoId: 'a4',
    consultorId: 'c1',
    tipo: 'diagnostico_1h',
    numeroEncontro: 0,
    data: '2026-11-12',
    horarioInicio: '13:00',
    horarioFim: '14:00',
    sala: 'Sala 204 - Bloco Empreendedorismo',
    status: 'agendado',
    lembreteEnviado24h: false,
    sincronizadoSIG: false,
    observacoes: 'ATENÇÃO MAX: Slot isolado de 1h! Necessário casar uma segunda entrevista de 1h das 14h às 15h.'
  },
  {
    id: 'ag5',
    alunoId: 'a3', // Carlos Eduardo
    consultorId: 'c1',
    tipo: 'mentoria_2h',
    numeroEncontro: 2,
    data: '2026-11-13',
    horarioInicio: '14:00',
    horarioFim: '16:00',
    sala: 'Sala 204 - Bloco Empreendedorismo',
    status: 'confirmado',
    lembreteEnviado24h: true,
    sincronizadoSIG: true,
    observacoes: 'Mentoria 2: Validação de fluxo de caixa da barbearia.'
  },
  {
    id: 'ag6',
    alunoId: 'a7', // Rafael (Laiza Noite)
    consultorId: 'c2', // Laiza
    tipo: 'mentoria_2h',
    numeroEncontro: 3,
    data: '2026-11-14',
    horarioInicio: '18:30',
    horarioFim: '20:30',
    sala: 'Sala 205 - Bloco Inovação',
    status: 'agendado',
    lembreteEnviado24h: false,
    sincronizadoSIG: true,
    observacoes: 'Mentoria Noturna com Laiza: Revisão de canais de venda e marketing digital.'
  }
];

export const INITIAL_DIARIOS: EntradaDiarioDeBordo[] = [
  {
    id: 'd1',
    alunoId: 'a1',
    consultorId: 'c1',
    agendamentoId: 'ag0_prev',
    numeroEncontro: 0, // Triagem / Diagnóstico
    data: '2026-11-02',
    diagnosticoResumo: 'Arthur vende quentinhas de rua sozinho. Não sabe o lucro líquido real porque usa o dinheiro das vendas para pagar o mercado no mesmo dia. Tem R$ 400 em fiados anotados em pedaços de papelão.',
    orientacoesPrestadas: 'Explicado o conceito de pró-labore e separação de caixas. Mostrado como o fiado sem controle consome o capital de giro.',
    tarefaProximoEncontro: '1. Guardar todos os comprovantes de compras da feira durante 7 dias em um envelope. 2. Parar de anotar fiado em papelão e listar clientes devedores numa folha pautada.',
    tarefaStatusAnterior: 'pendente',
    statusFormalizacaoMei: 'Informal / Sem CNPJ',
    proximosPassos: 'Iniciar o Encontro 1 de Mentoria com a montagem da planilha simples de custos dos ingredientes das marmitas.',
    criadoEm: '2026-11-02 11:30',
    diagnosticoPdfNome: 'Diagnostico_Inicial_Arthur_Santana.pdf',
    diagnosticoPdfUrl: '#diagnostico-arthur'
  }
];

export const INITIAL_DUVIDAS: DuvidaMentorado[] = [
  {
    id: 'duv1',
    alunoId: 'a1',
    consultorId: 'c1',
    pergunta: 'Professora Aline, o dinheiro que uso para colocar gasolina na moto da entrega deve entrar no custo da marmita ou no meu gasto pessoal?',
    resposta: 'Olá Arthur! Esse custo é 100% operacional do seu negócio (logística/entrega). Guarde os comprovantes do posto no mesmo envelope das compras da feira que combinamos!',
    status: 'respondida',
    criadaEm: '2026-10-10 14:20',
    respondidaEm: '2026-10-10 16:45'
  }
];

export const INITIAL_MATERIAIS: MaterialApoio[] = [
  {
    id: 'm1',
    titulo: 'Modelo de Controle de Caixa Diário Simplificado',
    categoria: 'Gestão Financeira',
    descricao: 'Modelo prático para registrar entradas do dia e saídas de compras sem misturar com o dinheiro de casa.',
    linkOuTexto: 'https://senac.br/recursos/co-nexo/fluxo-de-caixa-iniciante.pdf',
    adicionadoPor: 'Aline Silva',
    criadoEm: '2026-10-02'
  },
  {
    id: 'm2',
    titulo: 'Guia do Passo a Passo para Abertura Gratuita do MEI',
    categoria: 'Formalização MEI',
    descricao: 'Como emitir o CNPJ pelo Portal do Empreendedor oficial do Governo Federal sem cair em golpes pagos.',
    linkOuTexto: 'https://gov.br/empresas-e-negocios/pt-br/empreendedor',
    adicionadoPor: 'Regis Santos',
    criadoEm: '2026-09-28'
  },
  {
    id: 'm3',
    titulo: 'Calculadora de Preço de Venda para Refeições e Quentinhas',
    categoria: 'Gestão Financeira',
    descricao: 'Descubra quanto custa a embalagem, arroz, feijão, proteína e seu lucro por marmita.',
    linkOuTexto: 'https://senac.br/recursos/co-nexo/calculadora-marmita.xlsx',
    adicionadoPor: 'Aline Silva',
    criadoEm: '2026-10-05'
  }
];

export const INITIAL_AUDITORIA: RegistroAuditoria[] = [
  {
    id: 'aud1',
    usuarioNome: 'Max Silva',
    acao: 'Reagendamento em Cascata',
    detalhes: 'Sessão 3 de Vanessa Souza adiada; pendência de ajuste gerada para o SIG.',
    dataHora: '2026-11-25 14:32',
    tipo: 'alerta'
  },
  {
    id: 'aud2',
    usuarioNome: 'Sistema Automático',
    acao: 'Identificação de Passivo',
    detalhes: 'Rafael Santa Cruz sinalizado como passivo (>20 dias sem sessão).',
    dataHora: '2026-11-26 08:00',
    tipo: 'alerta'
  },
  {
    id: 'aud3',
    usuarioNome: 'Regis Santos',
    acao: 'Abertura de Janela de Agenda',
    detalhes: 'Janela de agendamento de Dezembro/2026 aberta para consultas.',
    dataHora: '2026-11-26 10:15',
    tipo: 'info'
  }
];
