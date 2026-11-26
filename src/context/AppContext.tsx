import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Aluno, Consultor, Agendamento, EntradaDiarioDeBordo, 
  DuvidaMentorado, MaterialApoio, Role, StatusMEI, TipoSessao,
  UsuarioSistema, BloqueioAgenda, RegistroAuditoria, StatusSincronizacaoSIG 
} from '../types';
import { 
  INITIAL_ALUNOS, INITIAL_CONSULTORES, INITIAL_AGENDAMENTOS, 
  INITIAL_DIARIOS, INITIAL_DUVIDAS, INITIAL_MATERIAIS,
  INITIAL_USUARIOS, INITIAL_BLOQUEIOS, INITIAL_AUDITORIA 
} from '../data/initialData';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: UsuarioSistema | null;
  setCurrentUser: (u: UsuarioSistema | null) => void;
  usuarios: UsuarioSistema[];
  bloqueios: BloqueioAgenda[];
  auditoria: RegistroAuditoria[];
  
  alunos: Aluno[];
  consultores: Consultor[];
  agendamentos: Agendamento[];
  diarios: EntradaDiarioDeBordo[];
  duvidas: DuvidaMentorado[];
  materiais: MaterialApoio[];
  selectedAlunoId: string;
  setSelectedAlunoId: (id: string) => void;
  alertaGlobal: string | null;
  setAlertaGlobal: (msg: string | null) => void;
  
  // Interface e Temas
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  consultoraAtiva: 'c_aline' | 'c_laiza';
  setConsultoraAtiva: (id: 'c_aline' | 'c_laiza') => void;

  // Autenticação & Gestão de Usuários
  login: (email: string, senha: string, lembrar?: boolean) => { success: boolean; message?: string };
  logout: () => void;
  simularRole: (targetRole: Role) => void;
  adicionarUsuario: (novo: Omit<UsuarioSistema, 'id'>) => void;
  alternarStatusUsuario: (usuarioId: string) => void;
  adicionarLogAuditoria: (acao: string, detalhes: string) => void;

  // Operações de Negócio & Agendamento
  cadastrarAluno: (novo: Omit<Aluno, 'id' | 'totalFaltas' | 'totalReagendamentos' | 'totalCancelamentos' | 'dataCadastro' | 'encontrosRealizados'>) => Aluno;
  agendarSessao: (dados: { alunoId: string; consultorId: string; tipo: TipoSessao; data: string; horarioInicio: string; horarioFim: string; sala: string; observacoes?: string }) => { success: boolean; message: string };
  marcarPresenca: (agendamentoId: string, acao: 'realizado' | 'falta_injustificada' | 'cancelado_menos_24h' | 'confirmado') => void;
  reagendarSessao: (agendamentoId: string, novaData: string, novoInicio: string, novoFim: string) => { success: boolean; message: string };
  reagendarEmCascata: (alunoId: string, agendamentoBaseId: string, novaDataBase: string) => { success: boolean; message: string; alterados: number };
  cancelarSessao: (agendamentoId: string, motivo?: string, forcarMenos24h?: boolean) => { success: boolean; menos24h: boolean; desligado?: boolean; message: string };
  enviarLembreteWhatsApp: (agendamentoId: string) => { link: string; texto: string };
  
  // Gestão de Bloqueios e SIG
  adicionarBloqueioAgenda: (bloqueio: Omit<BloqueioAgenda, 'id'>) => void;
  removerBloqueioAgenda: (bloqueioId: string) => void;
  atualizarStatusSIG: (alunoId: string, statusSIG: StatusSincronizacaoSIG, codigoTurma?: string) => void;
  getAlunosPassivos: () => Aluno[];

  // Diário de Bordo & Diagnóstico
  salvarDiarioDeBordo: (entrada: Omit<EntradaDiarioDeBordo, 'id' | 'criadoEm'>) => void;
  anexarPdfDiagnostico: (alunoId: string, arquivo: { nome: string; url: string; dataUpload: string; tamanho?: string }) => void;
  
  // Dúvidas e Materiais
  enviarDuvida: (pergunta: string, alunoId: string, consultorId: string) => void;
  responderDuvida: (duvidaId: string, resposta: string) => void;
  adicionarMaterial: (material: Omit<MaterialApoio, 'id' | 'criadoEm'>) => void;
  atualizarStatusMei: (alunoId: string, statusMei: StatusMEI) => void;
  
  // Segurança de Dados & Backup
  exportarBackupCloud: () => void;
  restaurarBackupCloud: (jsonString: string) => boolean;
  resetarDadosDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'conex_hub_database_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UsuarioSistema | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentUser`);
    return saved ? JSON.parse(saved) : null;
  });

  const [role, setRoleState] = useState<Role>(() => {
    return currentUser ? currentUser.role : null;
  });

  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_usuarios`);
    return saved ? JSON.parse(saved) : INITIAL_USUARIOS;
  });

  const [bloqueios, setBloqueios] = useState<BloqueioAgenda[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bloqueios`);
    return saved ? JSON.parse(saved) : INITIAL_BLOQUEIOS;
  });

  const [auditoria, setAuditoria] = useState<RegistroAuditoria[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_auditoria`);
    return saved ? JSON.parse(saved) : INITIAL_AUDITORIA;
  });

  const [selectedAlunoId, setSelectedAlunoId] = useState<string>('a1');
  const [alertaGlobal, setAlertaGlobal] = useState<string | null>(null);
  const [consultoraAtiva, setConsultoraAtiva] = useState<'c_aline' | 'c_laiza'>('c_aline');

  // Tema Claro / Escuro
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('conex_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('conex_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Barra lateral retrátil
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('conex_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('conex_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Aba ativa compartilhada
  const [activeTab, setActiveTab] = useState<string>('agenda');

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole) {
      const match = usuarios.find(u => u.role === newRole);
      if (match) {
        setCurrentUser(match);
        localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(match));
      }
    } else {
      setCurrentUser(null);
      localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
    }
  };

  // Ajusta automaticamente a primeira aba de cada perfil ao trocar de perfil
  useEffect(() => {
    if (role === 'superadmin') setActiveTab('operadores');
    else if (role === 'regis') setActiveTab('kpis');
    else if (role === 'max') setActiveTab('agenda');
    else if (role === 'aline') setActiveTab('prontuario');
    else if (role === 'arthur') setActiveTab('proximo');
  }, [role]);

  // Inicialização de dados
  const [alunos, setAlunos] = useState<Aluno[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_alunos`);
    return saved ? JSON.parse(saved) : INITIAL_ALUNOS;
  });

  const [consultores] = useState<Consultor[]>(INITIAL_CONSULTORES);

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_agendamentos`);
    return saved ? JSON.parse(saved) : INITIAL_AGENDAMENTOS;
  });

  const [diarios, setDiarios] = useState<EntradaDiarioDeBordo[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_diarios`);
    return saved ? JSON.parse(saved) : INITIAL_DIARIOS;
  });

  const [duvidas, setDuvidas] = useState<DuvidaMentorado[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_duvidas`);
    return saved ? JSON.parse(saved) : INITIAL_DUVIDAS;
  });

  const [materiais, setMateriais] = useState<MaterialApoio[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_materiais`);
    return saved ? JSON.parse(saved) : INITIAL_MATERIAIS;
  });

  // Efeitos para persistência contínua
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_alunos`, JSON.stringify(alunos));
  }, [alunos]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_agendamentos`, JSON.stringify(agendamentos));
  }, [agendamentos]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_diarios`, JSON.stringify(diarios));
  }, [diarios]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_duvidas`, JSON.stringify(duvidas));
  }, [duvidas]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_materiais`, JSON.stringify(materiais));
  }, [materiais]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_usuarios`, JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bloqueios`, JSON.stringify(bloqueios));
  }, [bloqueios]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_auditoria`, JSON.stringify(auditoria));
  }, [auditoria]);

  // SISTEMA DE AUDITORIA
  const adicionarLogAuditoria = (acao: string, detalhes: string) => {
    const novoLog: RegistroAuditoria = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      dataHora: new Date().toLocaleString('pt-BR'),
      usuarioNome: currentUser?.nome || 'Sistema Co.Nexo',
      role: role || 'max',
      acao,
      detalhes,
      ip: '10.22.45.18 (Rede Interna Senac SAJ)'
    };
    setAuditoria(prev => [novoLog, ...prev]);
  };

  // AUTENTICAÇÃO
  const login = (email: string, senha: string, lembrar: boolean = false) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = usuarios.find(u => u.email.toLowerCase() === cleanEmail && u.senha === senha);
    
    if (!user) {
      return { success: false, message: 'E-mail ou senha incorretos. Verifique suas credenciais.' };
    }

    if (!user.ativo) {
      return { success: false, message: 'Este usuário está inativo no sistema. Contate a Diretoria.' };
    }

    const updatedUser = {
      ...user,
      ultimoAcesso: `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    };

    setUsuarios(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setRoleState(updatedUser.role);

    if (lembrar) {
      localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(updatedUser));
    }

    adicionarLogAuditoria('Login Realizado', `Usuário ${user.nome} autenticado com sucesso no perfil ${user.role.toUpperCase()}`);
    setAlertaGlobal(`Bem-vindo(a) ao Co.Nexo Senac SAJ, ${user.nome}!`);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      adicionarLogAuditoria('Logout Efetuado', `Sessão encerrada por ${currentUser.nome}`);
    }
    setCurrentUser(null);
    setRoleState(null);
    localStorage.removeItem(`${STORAGE_KEY}_currentUser`);
  };

  const simularRole = (targetRole: Role) => {
    if (!targetRole) {
      logout();
      return;
    }
    const match = usuarios.find(u => u.role === targetRole);
    if (match) {
      setCurrentUser(match);
      setRoleState(targetRole);
      adicionarLogAuditoria('Simulação de Visão', `Super Admin simulando acesso com a visão de ${match.nome} (${targetRole})`);
      setAlertaGlobal(`Visualizando interface como: ${match.nome} (${match.cargo})`);
    } else {
      setRoleState(targetRole);
    }
  };

  const adicionarUsuario = (novo: Omit<UsuarioSistema, 'id'>) => {
    const novoUsuario: UsuarioSistema = {
      ...novo,
      id: `u_${Date.now()}`,
      ultimoAcesso: 'Nunca'
    };
    setUsuarios(prev => [...prev, novoUsuario]);
    adicionarLogAuditoria('Novo Usuário Criado', `Criado acesso para ${novo.nome} (${novo.role})`);
    setAlertaGlobal(`Usuário ${novo.nome} criado com sucesso!`);
  };

  const alternarStatusUsuario = (usuarioId: string) => {
    setUsuarios(prev => prev.map(u => {
      if (u.id === usuarioId) {
        const novoStatus = !u.ativo;
        adicionarLogAuditoria('Alteração de Status de Usuário', `${u.nome} foi ${novoStatus ? 'ativado' : 'desativado'}`);
        return { ...u, ativo: novoStatus };
      }
      return u;
    }));
  };

  // CADASTRO DE ALUNO
  const cadastrarAluno = (novo: Omit<Aluno, 'id' | 'totalFaltas' | 'totalReagendamentos' | 'totalCancelamentos' | 'dataCadastro' | 'encontrosRealizados'>): Aluno => {
    const id = `a_${Date.now()}`;
    const novoAluno: Aluno = {
      ...novo,
      id,
      totalFaltas: 0,
      totalReagendamentos: 0,
      totalCancelamentos: 0,
      encontrosRealizados: 0,
      dataCadastro: new Date().toISOString().split('T')[0],
      statusSincronizacaoSIG: 'pendente_abertura',
      codigoTurmaSIG: `SIG-SAJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    };
    setAlunos(prev => [novoAluno, ...prev]);
    setSelectedAlunoId(id);
    adicionarLogAuditoria('Novo Aluno Cadastrado', `Aluno(a) ${novo.nome} (${novo.negocio}) cadastrado(a)`);
    return novoAluno;
  };

  // AGENDAMENTO INTELIGENTE COM REGRAS DE NEGÓCIO E BLOQUEIOS
  const agendarSessao = (dados: {
    alunoId: string;
    consultorId: string;
    tipo: TipoSessao;
    data: string;
    horarioInicio: string;
    horarioFim: string;
    sala: string;
    observacoes?: string;
  }) => {
    const aluno = alunos.find(a => a.id === dados.alunoId);
    if (!aluno) return { success: false, message: 'Empreendedor não encontrado.' };

    // REGRA: Bloqueio de Desligamento Automático
    if (aluno.totalFaltas >= 2 || aluno.totalReagendamentos >= 3 || aluno.statusPrograma === 'Desligado') {
      return { 
        success: false, 
        message: `🚫 BLOQUEIO DO SISTEMA: ${aluno.nome} está DESLIGADO(A) do programa (${aluno.totalFaltas}/2 faltas, ${aluno.totalReagendamentos}/3 reagendamentos).` 
      };
    }

    // REGRA: Checagem de Férias / Recesso / Bloqueio de Agenda
    const bloqueado = bloqueios.find(b => 
      (b.consultorId === 'todos' || b.consultorId === dados.consultorId) &&
      dados.data >= b.dataInicio &&
      dados.data <= b.dataFim
    );

    if (bloqueado) {
      return {
        success: false,
        message: `🚫 AGENDA BLOQUEADA: ${bloqueado.tipo.toUpperCase()} (${bloqueado.motivo}) de ${bloqueado.dataInicio} a ${bloqueado.dataFim}. Não é possível agendar.`
      };
    }

    // REGRA: Conflito direto de horário com a consultora
    const conflito = agendamentos.find(ag => 
      ag.consultorId === dados.consultorId &&
      ag.data === dados.data &&
      ag.status !== 'reagendado' &&
      ag.status !== 'cancelado_menos_24h' &&
      ag.status !== 'cancelado' &&
      ((dados.horarioInicio >= ag.horarioInicio && dados.horarioInicio < ag.horarioFim) ||
       (dados.horarioFim > ag.horarioInicio && dados.horarioFim <= ag.horarioFim))
    );

    if (conflito) {
      return { 
        success: false, 
        message: `Conflito de agenda: A consultora já possui compromisso das ${conflito.horarioInicio} às ${conflito.horarioFim} nesta data.` 
      };
    }

    const novoAg: Agendamento = {
      id: `ag_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      alunoId: dados.alunoId,
      consultorId: dados.consultorId,
      tipo: dados.tipo,
      data: dados.data,
      horarioInicio: dados.horarioInicio,
      horarioFim: dados.horarioFim,
      sala: dados.sala,
      status: 'agendado',
      lembreteEnviado24h: false,
      observacoes: dados.observacoes
    };

    setAgendamentos(prev => [...prev, novoAg]);

    // Atualiza status do aluno se estava inscrito ou passivo
    setAlunos(prev => prev.map(a => {
      if (a.id === dados.alunoId) {
        let novoStatus = a.statusPrograma;
        if (a.statusPrograma === 'Inscrito') {
          novoStatus = dados.tipo === 'triagem' ? 'Triagem Agendada' : 'Diagnóstico Agendado';
        }
        return { 
          ...a, 
          statusPrograma: novoStatus,
          statusSincronizacaoSIG: a.statusSincronizacaoSIG === 'pendente_abertura' ? 'sincronizado' : a.statusSincronizacaoSIG 
        };
      }
      return a;
    }));

    adicionarLogAuditoria('Sessão Agendada', `${dados.tipo} agendado para ${aluno.nome} em ${dados.data} às ${dados.horarioInicio}`);
    return { 
      success: true, 
      message: `Agendamento criado com sucesso para ${aluno.nome}!` 
    };
  };

  // MARCAR PRESENÇA & ASSIDUIDADE
  const marcarPresenca = (agendamentoId: string, acao: 'realizado' | 'falta_injustificada' | 'cancelado_menos_24h' | 'confirmado') => {
    const ag = agendamentos.find(a => a.id === agendamentoId);
    if (!ag) return;

    setAgendamentos(prev => prev.map(item => {
      if (item.id === agendamentoId) {
        return { ...item, status: acao };
      }
      return item;
    }));

    if (acao === 'confirmado') {
      setAlertaGlobal(`✅ Presença confirmada para o agendamento de ${ag.data} às ${ag.horarioInicio}!`);
      return;
    }

    if (acao === 'falta_injustificada' || acao === 'cancelado_menos_24h') {
      setAlunos(prev => prev.map(aluno => {
        if (aluno.id === ag.alunoId) {
          const novasFaltas = aluno.totalFaltas + 1;
          const desligar = novasFaltas >= 2;
          
          if (desligar) {
            setAlertaGlobal(`🚨 ALERTA: ${aluno.nome} atingiu 2 faltas e foi DESLIGADO AUTOMATICAMENTE do programa.`);
            adicionarLogAuditoria('Desligamento Automático', `Aluno(a) ${aluno.nome} desligado(a) por atingir 2 faltas`);
          } else {
            setAlertaGlobal(`⚠️ Falta registrada para ${aluno.nome}. Alerta: 1 de 2 faltas atingidas.`);
            adicionarLogAuditoria('Falta Registrada', `Falta computada para ${aluno.nome} (${novasFaltas}/2)`);
          }

          return {
            ...aluno,
            totalFaltas: novasFaltas,
            statusPrograma: desligar ? 'Desligado' : aluno.statusPrograma,
            statusSincronizacaoSIG: desligar ? 'pendente_encerramento' : aluno.statusSincronizacaoSIG
          };
        }
        return aluno;
      }));
    }

    if (acao === 'realizado') {
      setAlunos(prev => prev.map(aluno => {
        if (aluno.id === ag.alunoId) {
          const novosEncontros = aluno.encontrosRealizados + 1;
          let novoStatus = aluno.statusPrograma;
          
          if (ag.tipo === 'triagem') {
            novoStatus = 'Diagnóstico Agendado';
          } else if (ag.tipo === 'diagnostico_1h') {
            novoStatus = 'Em Trilha (Encontro 1)';
          } else {
            if (novosEncontros >= 6) {
              novoStatus = 'Concluído';
            } else {
              novoStatus = `Em Trilha (Encontro ${Math.min(novosEncontros, 6)})` as any;
            }
          }

          const hoje = new Date();
          const d30 = new Date(hoje);
          d30.setDate(d30.getDate() + 30);
          const d60 = new Date(hoje);
          d60.setDate(d60.getDate() + 60);

          return {
            ...aluno,
            encontrosRealizados: novosEncontros,
            statusPrograma: novoStatus,
            dataConclusao: novosEncontros >= 6 ? hoje.toISOString().split('T')[0] : aluno.dataConclusao,
            dataFollowUp30d: novosEncontros >= 6 ? d30.toISOString().split('T')[0] : aluno.dataFollowUp30d,
            dataFollowUp60d: novosEncontros >= 6 ? d60.toISOString().split('T')[0] : aluno.dataFollowUp60d
          };
        }
        return aluno;
      }));
      adicionarLogAuditoria('Presença Realizada', `Sessão concluída para o aluno ID ${ag.alunoId}`);
    }
  };

  // REAGENDAMENTO INDIVIDUAL
  const reagendarSessao = (agendamentoId: string, novaData: string, novoInicio: string, novoFim: string) => {
    const ag = agendamentos.find(a => a.id === agendamentoId);
    if (!ag) return { success: false, message: 'Agendamento não encontrado.' };

    const aluno = alunos.find(a => a.id === ag.alunoId);
    if (!aluno) return { success: false, message: 'Aluno não encontrado.' };

    const novosReagendamentos = aluno.totalReagendamentos + 1;
    const atingiuLimite = novosReagendamentos >= 3;

    setAgendamentos(prev => prev.map(item => {
      if (item.id === agendamentoId) {
        return { ...item, status: 'reagendado' };
      }
      return item;
    }));

    if (atingiuLimite) {
      setAlunos(prev => prev.map(a => a.id === aluno.id ? { 
        ...a, 
        totalReagendamentos: novosReagendamentos, 
        statusPrograma: 'Desligado',
        statusSincronizacaoSIG: 'pendente_encerramento'
      } : a));
      
      adicionarLogAuditoria('Desligamento por Reagendamentos', `${aluno.nome} excedeu 3 reagendamentos e foi desligado`);
      return {
        success: false,
        message: `🚫 LIMITE EXCEDIDO: ${aluno.nome} atingiu o limite rígido de 3 reagendamentos e foi DESLIGADO do programa.`
      };
    }

    const novoAg: Agendamento = {
      id: `ag_${Date.now()}`,
      alunoId: ag.alunoId,
      consultorId: ag.consultorId,
      tipo: ag.tipo,
      data: novaData,
      horarioInicio: novoInicio,
      horarioFim: novoFim,
      sala: ag.sala,
      status: 'agendado',
      lembreteEnviado24h: false,
      observacoes: `Reagendado do dia ${ag.data} às ${ag.horarioInicio}.`
    };

    setAgendamentos(prev => [...prev, novoAg]);
    
    // Atualiza status do aluno e flag para o SIG avisar a coordenação da alteração de data
    setAlunos(prev => prev.map(a => a.id === aluno.id ? { 
      ...a, 
      totalReagendamentos: novosReagendamentos,
      statusSincronizacaoSIG: 'pendente_ajuste_data'
    } : a));

    adicionarLogAuditoria('Sessão Reagendada', `Reagendamento de ${ag.data} para ${novaData} para ${aluno.nome} (SIG sinalizado)`);

    return {
      success: true,
      message: `Reagendado com sucesso para ${novaData} às ${novoInicio}. Aluno acumula ${novosReagendamentos}/3 reagendamentos. Marcado como pendente de ajuste de data no SIG.`
    };
  };

  // REAGENDAMENTO EM CASCATA (DESLOCA TODAS AS SESSÕES FUTURAS DO BLOCO DE 6 SESSÕES)
  const reagendarEmCascata = (alunoId: string, agendamentoBaseId: string, novaDataBase: string) => {
    const agBase = agendamentos.find(a => a.id === agendamentoBaseId);
    if (!agBase) return { success: false, message: 'Agendamento base não encontrado.', alterados: 0 };

    const aluno = alunos.find(a => a.id === alunoId);
    if (!aluno) return { success: false, message: 'Aluno não encontrado.', alterados: 0 };

    const dataAntigaBase = new Date(agBase.data + 'T12:00:00');
    const dataNovaBase = new Date(novaDataBase + 'T12:00:00');
    const diferencaDias = Math.round((dataNovaBase.getTime() - dataAntigaBase.getTime()) / (1000 * 60 * 60 * 24));

    if (diferencaDias === 0) {
      return { success: false, message: 'A nova data é igual à data original.', alterados: 0 };
    }

    // Busca todos os agendamentos futuros do aluno a partir da data base
    let alteradosCount = 0;
    setAgendamentos(prev => prev.map(ag => {
      if (ag.alunoId === alunoId && ag.status === 'agendado' && ag.data >= agBase.data) {
        const dOriginal = new Date(ag.data + 'T12:00:00');
        dOriginal.setDate(dOriginal.getDate() + diferencaDias);
        const novaDataStr = dOriginal.toISOString().split('T')[0];
        alteradosCount++;
        return {
          ...ag,
          data: novaDataStr,
          observacoes: `${ag.observacoes || ''} [Reagendado em cascata em ${new Date().toLocaleDateString('pt-BR')}]`
        };
      }
      return ag;
    }));

    // Sinaliza no SIG que houve alteração de calendário
    setAlunos(prev => prev.map(a => a.id === alunoId ? {
      ...a,
      statusSincronizacaoSIG: 'pendente_ajuste_data'
    } : a));

    adicionarLogAuditoria('Reagendamento em Cascata', `Deslocamento de ${diferencaDias} dias para ${alteradosCount} encontros de ${aluno.nome}`);
    setAlertaGlobal(`🔄 Reagendamento em cascata concluído: ${alteradosCount} encontros futuros foram deslocados em ${diferencaDias} dias.`);

    return {
      success: true,
      message: `${alteradosCount} sessões futuras de ${aluno.nome} foram reagendadas em cascata!`,
      alterados: alteradosCount
    };
  };

  // CANCELAMENTO DE SESSÃO
  const cancelarSessao = (agendamentoId: string, motivo?: string, forcarMenos24h?: boolean) => {
    const ag = agendamentos.find(a => a.id === agendamentoId);
    if (!ag) return { success: false, menos24h: false, message: 'Agendamento não encontrado.' };

    const aluno = alunos.find(a => a.id === ag.alunoId);
    if (!aluno) return { success: false, menos24h: false, message: 'Aluno não encontrado.' };

    const cancelamentosAtuais = aluno.totalCancelamentos || 0;
    if (cancelamentosAtuais >= 2) {
      return { 
        success: false, 
        menos24h: false, 
        message: `🚫 LIMITE EXCEDIDO: ${aluno.nome} já atingiu o limite de 2 cancelamentos permitidos no programa.` 
      };
    }

    const novosCancelamentos = cancelamentosAtuais + 1;

    let isMenos24h = forcarMenos24h;
    if (isMenos24h === undefined) {
      const dataAg = new Date(`${ag.data}T${ag.horarioInicio}:00`);
      const agora = new Date();
      const diffMs = dataAg.getTime() - agora.getTime();
      const diffHoras = diffMs / (1000 * 60 * 60);
      isMenos24h = diffHoras < 24 && diffHoras > -24;
    }

    if (isMenos24h) {
      const novasFaltas = aluno.totalFaltas + 1;
      const desligar = novasFaltas >= 2;

      setAgendamentos(prev => prev.map(item => {
        if (item.id === agendamentoId) {
          return {
            ...item,
            status: 'cancelado_menos_24h' as const,
            observacoes: motivo 
              ? `${item.observacoes ? item.observacoes + ' | ' : ''}Cancelado pelo aluno (<24h): ${motivo}` 
              : `${item.observacoes ? item.observacoes + ' | ' : ''}Cancelado pelo aluno com menos de 24h.`
          };
        }
        return item;
      }));

      setAlunos(prev => prev.map(a => {
        if (a.id === aluno.id) {
          return {
            ...a,
            totalCancelamentos: novosCancelamentos,
            totalFaltas: novasFaltas,
            statusPrograma: desligar ? 'Desligado' : a.statusPrograma,
            statusSincronizacaoSIG: desligar ? 'pendente_encerramento' : a.statusSincronizacaoSIG
          };
        }
        return a;
      }));

      adicionarLogAuditoria('Cancelamento < 24h', `Cancelamento tardio registrado para ${aluno.nome} (1 falta gerada)`);

      return {
        success: true,
        menos24h: true,
        desligado: desligar,
        message: desligar 
          ? 'Encontro cancelado com menos de 24h. Limite de 2 faltas atingido (aluno desligado do programa).' 
          : `Encontro cancelado com menos de 24h. Foi registrada 1 falta no seu histórico (${novasFaltas}/2).`
      };
    } else {
      setAgendamentos(prev => prev.map(item => {
        if (item.id === agendamentoId) {
          return {
            ...item,
            status: 'cancelado' as const,
            observacoes: motivo 
              ? `${item.observacoes ? item.observacoes + ' | ' : ''}Cancelado pelo aluno (>24h): ${motivo}` 
              : `${item.observacoes ? item.observacoes + ' | ' : ''}Cancelado pelo aluno com antecedência (>24h).`
          };
        }
        return item;
      }));

      setAlunos(prev => prev.map(a => {
        if (a.id === aluno.id) {
          return {
            ...a,
            totalCancelamentos: novosCancelamentos
          };
        }
        return a;
      }));

      adicionarLogAuditoria('Cancelamento Antecipado', `Cancelamento regular (>24h) por ${aluno.nome}`);

      return {
        success: true,
        menos24h: false,
        desligado: false,
        message: `Encontro cancelado com antecedência (>24h). Horário liberado sem falta.`
      };
    }
  };

  // ENVIO DE LEMBRETE WHATSAPP
  const enviarLembreteWhatsApp = (agendamentoId: string) => {
    const ag = agendamentos.find(a => a.id === agendamentoId);
    const aluno = alunos.find(a => a.id === ag?.alunoId);
    const consultor = consultores.find(c => c.id === ag?.consultorId);

    const dataFormatada = ag?.data ? new Date(ag.data + 'T12:00:00').toLocaleDateString('pt-BR') : '';
    const texto = `Olá, ${aluno?.nome || 'Empreendedor'}! Aqui é do Co.Nexo SENAC Santo Antônio de Jesus (SAJ). Lembramos que seu encontro de ${ag?.tipo === 'triagem' ? 'Entrevista de Triagem (45min)' : ag?.tipo === 'diagnostico_1h' ? 'Diagnóstico Inicial (1h)' : 'Mentoria de Negócios (2h)'} com ${consultor?.nome} está confirmado para amanhã, dia ${dataFormatada}, às ${ag?.horarioInicio} na ${ag?.sala}. Responda com 1 para confirmar ou 2 se precisar de apoio. Esperamos por você!`;

    const encoded = encodeURIComponent(texto);
    const link = `https://wa.me/55${aluno?.whatsapp}?text=${encoded}`;

    setAgendamentos(prev => prev.map(item => {
      if (item.id === agendamentoId) {
        return { 
          ...item, 
          lembreteEnviado24h: true, 
          dataEnvioLembrete: new Date().toLocaleString('pt-BR') 
        };
      }
      return item;
    }));

    adicionarLogAuditoria('Lembrete WhatsApp Enviado', `Lembrete de sessão enviado para ${aluno?.nome}`);
    return { link, texto };
  };

  // DIÁRIO DE BORDO
  const salvarDiarioDeBordo = (entrada: Omit<EntradaDiarioDeBordo, 'id' | 'criadoEm'>) => {
    const novoDiario: EntradaDiarioDeBordo = {
      ...entrada,
      id: `d_${Date.now()}`,
      criadoEm: new Date().toLocaleString('pt-BR')
    };

    setDiarios(prev => [novoDiario, ...prev]);

    setAlunos(prev => prev.map(a => {
      if (a.id === entrada.alunoId) {
        return {
          ...a,
          statusMei: entrada.statusFormalizacaoMei,
          historicoNotas: entrada.diagnosticoResumo
        };
      }
      return a;
    }));

    adicionarLogAuditoria('Registro no Diário de Bordo', `Encontro ${entrada.numeroEncontro} registrado para aluno ID ${entrada.alunoId}`);
    setAlertaGlobal('📘 Prontuário registrado com sucesso no Diário de Bordo!');
  };

  // ANEXAR PDF DO DIAGNÓSTICO (SUBSTITUI QUESTIONÁRIO LONGO)
  const anexarPdfDiagnostico = (alunoId: string, arquivo: { nome: string; url: string; dataUpload: string; tamanho?: string }) => {
    setAlunos(prev => prev.map(a => {
      if (a.id === alunoId) {
        return {
          ...a,
          diagnosticoPdf: arquivo
        };
      }
      return a;
    }));
    adicionarLogAuditoria('Upload de Diagnóstico PDF', `Arquivo "${arquivo.nome}" anexado ao prontuário do aluno ID ${alunoId}`);
    setAlertaGlobal(`📎 Diagnóstico em PDF anexado com sucesso para o aluno!`);
  };

  // GESTÃO DE BLOQUEIOS DE AGENDA
  const adicionarBloqueioAgenda = (bloqueio: Omit<BloqueioAgenda, 'id'>) => {
    const novo: BloqueioAgenda = {
      ...bloqueio,
      id: `bloq_${Date.now()}`
    };
    setBloqueios(prev => [novo, ...prev]);
    adicionarLogAuditoria('Bloqueio de Agenda Criado', `${bloqueio.tipo.toUpperCase()}: ${bloqueio.motivo} (${bloqueio.dataInicio} a ${bloqueio.dataFim})`);
    setAlertaGlobal(`🔒 Período bloqueado com sucesso na agenda das consultoras.`);
  };

  const removerBloqueioAgenda = (bloqueioId: string) => {
    setBloqueios(prev => prev.filter(b => b.id !== bloqueioId));
    adicionarLogAuditoria('Bloqueio de Agenda Removido', `Bloqueio ${bloqueioId} removido`);
    setAlertaGlobal(`🔓 Bloqueio de agenda removido com sucesso.`);
  };

  // ATUALIZAÇÃO DO SIG (SISTEMA INTEGRADO DE GESTÃO ACADÊMICA)
  const atualizarStatusSIG = (alunoId: string, statusSIG: StatusSincronizacaoSIG, codigoTurma?: string) => {
    setAlunos(prev => prev.map(a => {
      if (a.id === alunoId) {
        return {
          ...a,
          statusSincronizacaoSIG: statusSIG,
          codigoTurmaSIG: codigoTurma || a.codigoTurmaSIG
        };
      }
      return a;
    }));
    adicionarLogAuditoria('Sincronização SIG Atualizada', `Status SIG do aluno ID ${alunoId} alterado para ${statusSIG}`);
    setAlertaGlobal(`📡 Status do SIG atualizado para ${statusSIG}!`);
  };

  // IDENTIFICAÇÃO DE ALUNOS PASSIVOS (>15 DIAS SEM AGENDAMENTO)
  const getAlunosPassivos = (): Aluno[] => {
    const hoje = new Date();
    return alunos.filter(a => {
      if (a.statusPrograma === 'Concluído' || a.statusPrograma === 'Desligado') return false;

      // Verifica o último agendamento ou se não tem nenhum futuro
      const agsDoAluno = agendamentos.filter(ag => ag.alunoId === a.id && ag.status !== 'cancelado');
      const agsFuturos = agsDoAluno.filter(ag => ag.data >= hoje.toISOString().split('T')[0] && ag.status === 'agendado');
      
      // Se não tem nenhum futuro agendado
      if (agsFuturos.length === 0) {
        if (agsDoAluno.length === 0) return true; // Nunca agendou
        // Calcula dias desde o último agendamento
        const datas = agsDoAluno.map(ag => new Date(ag.data + 'T12:00:00').getTime());
        const maxData = Math.max(...datas);
        const diffDias = Math.round((hoje.getTime() - maxData) / (1000 * 60 * 60 * 24));
        return diffDias >= 15;
      }
      return false;
    });
  };

  // DÚVIDAS E MATERIAIS
  const enviarDuvida = (pergunta: string, alunoId: string, consultorId: string) => {
    const novaDuvida: DuvidaMentorado = {
      id: `duv_${Date.now()}`,
      alunoId,
      consultorId,
      pergunta,
      status: 'aberta',
      criadaEm: new Date().toLocaleString('pt-BR')
    };
    setDuvidas(prev => [novaDuvida, ...prev]);
    adicionarLogAuditoria('Dúvida Enviada', `Mentorado enviou uma dúvida para a consultora`);
    setAlertaGlobal('💬 Dúvida enviada para a mentora! Você receberá a orientação por aqui.');
  };

  const responderDuvida = (duvidaId: string, resposta: string) => {
    setDuvidas(prev => prev.map(d => {
      if (d.id === duvidaId) {
        return {
          ...d,
          resposta,
          status: 'respondida',
          respondidaEm: new Date().toLocaleString('pt-BR')
        };
      }
      return d;
    }));
    adicionarLogAuditoria('Dúvida Respondida', `Dúvida respondida pela mentora`);
    setAlertaGlobal('✅ Resposta enviada ao mentorado!');
  };

  const adicionarMaterial = (material: Omit<MaterialApoio, 'id' | 'criadoEm'>) => {
    const novo: MaterialApoio = {
      ...material,
      id: `m_${Date.now()}`,
      criadoEm: new Date().toISOString().split('T')[0]
    };
    setMateriais(prev => [novo, ...prev]);
    adicionarLogAuditoria('Material de Apoio Adicionado', `Material "${material.titulo}" publicado`);
  };

  const atualizarStatusMei = (alunoId: string, statusMei: StatusMEI) => {
    setAlunos(prev => prev.map(a => {
      if (a.id === alunoId) {
        return {
          ...a,
          statusMei,
          statusPrograma: statusMei === 'MEI Aberto e Ativo' ? 'MEI Formalizado' : a.statusPrograma
        };
      }
      return a;
    }));
    adicionarLogAuditoria('Status MEI Atualizado', `MEI do aluno ID ${alunoId} atualizado para ${statusMei}`);
  };

  // BACKUP E RESTAURAÇÃO
  const exportarBackupCloud = () => {
    const dump = {
      versao: '2.0',
      dataExportacao: new Date().toISOString(),
      usuarios,
      bloqueios,
      auditoria,
      alunos,
      consultores,
      agendamentos,
      diarios,
      duvidas,
      materiais
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_cloud_conex_hub_v2_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    adicionarLogAuditoria('Backup Exportado', `Exportação completa de dados v2 realizada`);
    setAlertaGlobal('💾 Backup v2 exportado com sucesso! Seus dados estão seguros.');
  };

  const restaurarBackupCloud = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.alunos && data.agendamentos) {
        setAlunos(data.alunos);
        setAgendamentos(data.agendamentos);
        if (data.usuarios) setUsuarios(data.usuarios);
        if (data.bloqueios) setBloqueios(data.bloqueios);
        if (data.auditoria) setAuditoria(data.auditoria);
        if (data.diarios) setDiarios(data.diarios);
        if (data.duvidas) setDuvidas(data.duvidas);
        if (data.materiais) setMateriais(data.materiais);
        adicionarLogAuditoria('Backup Restaurado', `Base de dados restaurada via arquivo JSON`);
        setAlertaGlobal('♻️ Backup restaurado com sucesso! Todos os registros foram restabelecidos.');
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const resetarDadosDemo = () => {
    setUsuarios(INITIAL_USUARIOS);
    setBloqueios(INITIAL_BLOQUEIOS);
    setAuditoria(INITIAL_AUDITORIA);
    setAlunos(INITIAL_ALUNOS);
    setAgendamentos(INITIAL_AGENDAMENTOS);
    setDiarios(INITIAL_DIARIOS);
    setDuvidas(INITIAL_DUVIDAS);
    setMateriais(INITIAL_MATERIAIS);
    localStorage.clear();
    setAlertaGlobal('🔄 Dados de demonstração recarregados com Super Admin, Regis, Max, Aline, Laiza e Arthur!');
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      currentUser, setCurrentUser,
      usuarios, bloqueios, auditoria,
      theme, toggleTheme,
      isSidebarCollapsed, toggleSidebar,
      activeTab, setActiveTab,
      consultoraAtiva, setConsultoraAtiva,
      alunos, consultores, agendamentos, diarios, duvidas, materiais,
      selectedAlunoId, setSelectedAlunoId,
      alertaGlobal, setAlertaGlobal,
      login, logout, simularRole, adicionarUsuario, alternarStatusUsuario, adicionarLogAuditoria,
      cadastrarAluno, agendarSessao, marcarPresenca, reagendarSessao, reagendarEmCascata, cancelarSessao,
      adicionarBloqueioAgenda, removerBloqueioAgenda, atualizarStatusSIG, getAlunosPassivos,
      enviarLembreteWhatsApp, salvarDiarioDeBordo, anexarPdfDiagnostico, enviarDuvida, responderDuvida,
      adicionarMaterial, atualizarStatusMei,
      exportarBackupCloud, restaurarBackupCloud, resetarDadosDemo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
