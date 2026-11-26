import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Clock, User, Phone, Check, AlertTriangle, 
  Send, UserPlus, Search, RefreshCw, XCircle, ShieldAlert,
  ChevronRight, CalendarPlus, CheckCircle, CalendarDays, ListFilter,
  Layers, MessageSquare, ExternalLink, Copy, CheckCheck, AlertCircle
} from 'lucide-react';
import { TipoSessao, StatusSincronizacaoSIG, Aluno } from '../types';
import { formatarDataAgenda } from '../utils/dateUtils';
import { SearchableSelect } from '../components/SearchableSelect';
import { CalendarView } from '../components/CalendarView';

const RAMOS_ATIVIDADE_OPCOES = [
  'Alimentação / Gastronomia',
  'Confeitaria & Panificação',
  'Beleza & Estética (Cabelo, Barba, Unhas)',
  'Moda, Vestuário & Confecção',
  'Artesanato, Costura & Decoração',
  'Comércio Varejista & Loja Física',
  'Comércio Online / E-commerce',
  'Serviços Gerais & Manutenção',
  'Construção Civil & Reformas',
  'Tecnologia, Informática & Web',
  'Marketing Digital & Redes Sociais',
  'Saúde, Fitness & Bem-Estar',
  'Educação, Aulas & Treinamentos',
  'Pet Care & Veterinária',
  'Transporte, Logística & Entregas',
  'Fotografia, Eventos & Festas',
  'Consultoria & Serviços Administrativos',
  'Outros / Diversos'
];

export const MaxView: React.FC = () => {
  const { 
    alunos, consultores, agendamentos, 
    agendarSessao, marcarPresenca, reagendarSessao, reagendarEmCascata,
    enviarLembreteWhatsApp, cadastrarAluno, getAlunosPassivos,
    atualizarStatusSIG, activeTab, setActiveTab
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTabela, setFiltroTabela] = useState<'todos' | 'em_risco' | 'desligados' | 'confirmados' | 'pendencias_sig'>('todos');
  
  // Modal Novo Agendamento
  const [showModalAgendamento, setShowModalAgendamento] = useState(false);
  const [novoAlunoId, setNovoAlunoId] = useState(alunos[0]?.id || '');
  const [novoConsultorId, setNovoConsultorId] = useState(consultores[0]?.id || '');
  const [novoTipo, setNovoTipo] = useState<TipoSessao>('diagnostico_1h');
  const [novaData, setNovaData] = useState(() => new Date().toISOString().split('T')[0]);
  const [novoInicio, setNovoInicio] = useState('14:00');
  const [novoFim, setNovoFim] = useState('15:00');
  const [novaSala, setNovaSala] = useState('Sala 204 - Bloco Empreendedorismo');
  const [novasNotas, setNovasNotas] = useState('');

  // Modal Agendamento em Bloco de 6 Sessões
  const [showModalBloco6, setShowModalBloco6] = useState(false);
  const [blocoAlunoId, setBlocoAlunoId] = useState('');
  const [blocoConsultorId, setBlocoConsultorId] = useState('c_aline');
  const [blocoDataInicio, setBlocoDataInicio] = useState(() => new Date().toISOString().split('T')[0]);
  const [blocoHorarioInicio, setBlocoHorarioInicio] = useState('14:00');
  const [blocoHorarioFim, setBlocoHorarioFim] = useState('16:00');
  const [blocoSala, setBlocoSala] = useState('Sala 204 - Bloco Empreendedorismo');

  // Modal Novo Aluno (Balcão/Recepção)
  const [showModalNovoAluno, setShowModalNovoAluno] = useState(false);
  const [nomeNovo, setNomeNovo] = useState('');
  const [whatsNovo, setWhatsNovo] = useState('');
  const [emailNovo, setEmailNovo] = useState('');
  const [negocioNovo, setNegocioNovo] = useState('');
  const [ramoNovo, setRamoNovo] = useState('');

  // Modal Reagendamento com Opção em Cascata
  const [reagendandoAgId, setReagendandoAgId] = useState<string | null>(null);
  const [reagendandoAlunoId, setReagendandoAlunoId] = useState<string>('');
  const [reagendarData, setReagendarData] = useState(() => new Date().toISOString().split('T')[0]);
  const [reagendarInicio, setReagendarInicio] = useState('13:00');
  const [reagendarFim, setReagendarFim] = useState('14:00');
  const [reagendarEmCascataAtivo, setReagendarEmCascataAtivo] = useState(true);

  // Modal de Modelos de Mensagem WhatsApp
  const [showModalWhatsApp, setShowModalWhatsApp] = useState(false);
  const [templateWhatsAppAluno, setTemplateWhatsAppAluno] = useState<Aluno | null>(null);
  const [tipoTemplateWA, setTipoTemplateWA] = useState<'lembrete' | 'resgate' | 'reagendamento' | 'falta'>('lembrete');
  const [copiadoWA, setCopiadoWA] = useState(false);

  // Modo de visualização da Grade: Semana, Mês ou Tabela
  const [modoVisualizacaoAgenda, setModoVisualizacaoAgenda] = useState<'semana' | 'mes' | 'tabela'>('semana');

  // Métricas e Alertas
  const alunosPassivos = getAlunosPassivos();
  const alunosEmRisco = alunos.filter(a => (a.totalFaltas === 1 || a.totalReagendamentos === 2) && a.statusPrograma !== 'Desligado');
  const alunosDesligados = alunos.filter(a => a.statusPrograma === 'Desligado');
  const alunosPendentesSIG = alunos.filter(a => a.statusSincronizacaoSIG !== 'sincronizado');
  const agendamentosConfirmados = agendamentos.filter(a => a.status === 'confirmado');
  const lembretesPendentes = agendamentos.filter(a => !a.lembreteEnviado24h && a.status === 'agendado');

  const handleTipoChange = (t: TipoSessao) => {
    setNovoTipo(t);
    const [h, m] = novoInicio.split(':').map(Number);
    const duracao = t === 'diagnostico_1h' ? 1 : 2;
    const hFim = String(h + duracao).padStart(2, '0');
    setNovoFim(`${hFim}:${String(m).padStart(2, '0')}`);
  };

  const handleInicioChange = (horario: string) => {
    setNovoInicio(horario);
    const [h, m] = horario.split(':').map(Number);
    const duracao = novoTipo === 'diagnostico_1h' ? 1 : 2;
    const hFim = String(h + duracao).padStart(2, '0');
    setNovoFim(`${hFim}:${String(m).padStart(2, '0')}`);
  };

  const handleSalvarAgendamento = (e: React.FormEvent) => {
    e.preventDefault();
    const res = agendarSessao({
      alunoId: novoAlunoId,
      consultorId: novoConsultorId,
      tipo: novoTipo,
      data: novaData,
      horarioInicio: novoInicio,
      horarioFim: novoFim,
      sala: novaSala,
      observacoes: novasNotas
    });

    if (res.success) {
      setShowModalAgendamento(false);
      setNovasNotas('');
    } else {
      alert(res.message);
    }
  };

  // AGENDAR BLOCO DE 6 SESSÕES QUINZENAIS DE UMA SÓ VEZ
  const handleCriarBloco6 = (e: React.FormEvent) => {
    e.preventDefault();
    const aluno = alunos.find(a => a.id === blocoAlunoId);
    if (!aluno) return;

    const temasSessoes = [
      'Encontro 1: Diagnóstico e Plano de Ação',
      'Encontro 2: Produto, Serviço e Precificação',
      'Encontro 3: Clientes, Vendas e Atendimento',
      'Encontro 4: Gestão Financeira e Fluxo de Caixa',
      'Encontro 5: Formalização MEI e Controles',
      'Encontro 6: Fechamento de Resultados e Pós-Trilha'
    ];

    let dataIter = new Date(blocoDataInicio + 'T12:00:00');
    let criados = 0;

    for (let i = 0; i < 6; i++) {
      const dataStr = dataIter.toISOString().split('T')[0];
      const res = agendarSessao({
        alunoId: blocoAlunoId,
        consultorId: blocoConsultorId,
        tipo: 'mentoria_2h',
        data: dataStr,
        horarioInicio: blocoHorarioInicio,
        horarioFim: blocoHorarioFim,
        sala: blocoSala,
        observacoes: temasSessoes[i]
      });

      if (res.success) criados++;
      // Adiciona 14 dias (cadência quinzenal recomendada)
      dataIter.setDate(dataIter.getDate() + 14);
    }

    setShowModalBloco6(false);
    alert(`Sucesso! Bloco de ${criados} sessões quinzenais agendado para ${aluno.nome}!`);
  };

  const handleSalvarNovoAluno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeNovo || !whatsNovo || !negocioNovo) {
      alert('Por favor, preencha os campos essenciais.');
      return;
    }
    const criado = cadastrarAluno({
      nome: nomeNovo,
      whatsapp: whatsNovo.replace(/\D/g, ''),
      email: emailNovo || `${nomeNovo.toLowerCase().replace(/\s+/g, '')}@email.com`,
      negocio: negocioNovo,
      ramo: ramoNovo || 'Geral',
      statusPrograma: 'Inscrito',
      statusMei: 'Informal / Sem CNPJ',
      historicoNotas: 'Cadastrado presencialmente no balcão por Max.'
    });

    setShowModalNovoAluno(false);
    setNomeNovo('');
    setWhatsNovo('');
    setEmailNovo('');
    setNegocioNovo('');
    setRamoNovo('');
    setNovoAlunoId(criado.id);
    setShowModalAgendamento(true);
  };

  const handleExecutarReagendamento = () => {
    if (!reagendandoAgId) return;

    if (reagendarEmCascataAtivo && reagendandoAlunoId) {
      const res = reagendarEmCascata(reagendandoAlunoId, reagendandoAgId, reagendarData);
      if (!res.success) {
        alert(res.message);
      }
    } else {
      const res = reagendarSessao(reagendandoAgId, reagendarData, reagendarInicio, reagendarFim);
      if (!res.success) {
        alert(res.message);
      }
    }
    setReagendandoAgId(null);
  };

  // Gerador de Mensagens do WhatsApp
  const gerarTextoWhatsApp = (aluno: Aluno | null, tipo: 'lembrete' | 'resgate' | 'reagendamento' | 'falta') => {
    if (!aluno) return '';
    const nome = aluno.nome.split(' ')[0];

    switch (tipo) {
      case 'lembrete':
        return `Olá, ${nome}! Aqui é Max, da recepção do Co.Nexo SENAC Santo Antônio de Jesus (SAJ). Passando para confirmar seu encontro de mentoria amanhã! Por favor, responda com *1 para CONFIRMAR* ou *2 caso tenha algum imprevisto*. Contamos com sua presença!`;
      case 'resgate':
        return `Olá, ${nome}! Sentimos sua falta aqui no Co.Nexo SENAC SAJ! Notamos que faz mais de 15 dias desde o nosso último contato. Como estão as vendas da ${aluno.negocio}? Temos novos horários de consultoria abertos esta semana. Podemos agendar sua próxima sessão?`;
      case 'reagendamento':
        return `Olá, ${nome}! Aqui é Max do Co.Nexo SENAC SAJ. Seu encontro de mentoria foi reagendado com sucesso no sistema. Já atualizamos a agenda da sua consultora e avisamos a coordenação acadêmica (SIG). Qualquer dúvida, estamos à disposição!`;
      case 'falta':
        return `Olá, ${nome}! Sentimos sua falta no encontro de mentoria de hoje no Co.Nexo SENAC SAJ. Lembramos que o programa permite até 2 faltas antes do cancelamento da vaga. Por favor, entre em contato conosco para reagendarmos e não interromper seu plano de crescimento!`;
      default:
        return '';
    }
  };

  const textoWhatsAppGerado = gerarTextoWhatsApp(templateWhatsAppAluno, tipoTemplateWA);

  const copiarTextoWhatsApp = () => {
    navigator.clipboard.writeText(textoWhatsAppGerado);
    setCopiadoWA(true);
    setTimeout(() => setCopiadoWA(false), 2000);
  };

  const abrirConversaWhatsApp = () => {
    if (!templateWhatsAppAluno) return;
    const url = `https://wa.me/55${templateWhatsAppAluno.whatsapp}?text=${encodeURIComponent(textoWhatsAppGerado)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-['Inter']">
      {/* Banner de Identificação do Operador */}
      <div className="bg-[#004B8D] rounded-3xl p-6 sm:p-7 text-white shadow-lg border-b-4 border-[#A1D900] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#A1D900] text-xs font-bold uppercase tracking-wider mb-1 font-['Montserrat']">
            <span>Recepção & Atendimento</span>
            <span>•</span>
            <span>Max Silva (SAJ)</span>
          </div>
          <h2 className="text-2xl font-bold font-['Montserrat']">Grade de Atendimento & Controle SIG</h2>
          <p className="text-blue-100/90 text-xs mt-1">
            Recepção de balcão, agendamento quinzenal, resgate de passivos e sincronização com a Coordenação Acadêmica.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowModalNovoAluno(true)}
            className="px-4 py-2.5 rounded-xl bg-[#A1D900] text-slate-900 font-bold text-xs hover:bg-[#8ec200] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Aluno (Balcão)</span>
          </button>

          <button
            onClick={() => {
              setBlocoAlunoId(alunos[0]?.id || '');
              setShowModalBloco6(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Agendar Bloco 6 Sessões</span>
          </button>

          <button
            onClick={() => setShowModalAgendamento(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarPlus className="w-4 h-4 text-[#A1D900]" />
            <span>Sessão Avulsa</span>
          </button>
        </div>
      </div>

      {/* 2. CARDS DE KPIS CLICÁVEIS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div 
          onClick={() => {
            setActiveTab('lembretes');
            setFiltroTabela('todos');
          }}
          className="bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3 cursor-pointer hover:border-[#004B8D] dark:hover:border-[#A1D900] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#004B8D] dark:text-[#A1D900] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-['Montserrat']">
              {lembretesPendentes.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Lembretes WhatsApp</div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('passivos')}
          className="bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 shadow-xs flex items-center gap-3 cursor-pointer hover:border-amber-500 transition-all group bg-amber-50/20"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-800 dark:text-amber-300 font-['Montserrat']">
              {alunosPassivos.length}
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">Passivos (&gt;15 dias)</div>
          </div>
        </div>

        <div 
          onClick={() => {
            setActiveTab('alunos');
            setFiltroTabela('em_risco');
          }}
          className="bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3 cursor-pointer hover:border-rose-400 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-['Montserrat']">
              {alunosEmRisco.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Alunos em Risco</div>
          </div>
        </div>

        <div 
          onClick={() => {
            setActiveTab('agenda');
            setFiltroTabela('confirmados');
          }}
          className="bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3 cursor-pointer hover:border-emerald-400 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#A1D900] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-['Montserrat']">
              {agendamentosConfirmados.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Confirmados</div>
          </div>
        </div>

        <div 
          onClick={() => {
            setActiveTab('alunos');
            setFiltroTabela('pendencias_sig');
          }}
          className="bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3 cursor-pointer hover:border-purple-400 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-['Montserrat']">
              {alunosPendentesSIG.length}
            </div>
            <div className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold">Pendências SIG</div>
          </div>
        </div>
      </div>

      {/* ABA 1: GRADE DE ATENDIMENTOS & PRESENÇA */}
      {activeTab === 'agenda' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-3">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50/50 dark:bg-[#1E252E]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat']">Grade de Atendimentos</h3>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300 bg-white dark:bg-[#161B22] px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                  Aline (Manhã/Tarde) • Laiza (Noite)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Cancelamento &lt; 24h contabiliza falta • Reagendamento em cascata sincroniza datas no SIG
              </p>
            </div>

            {/* Alternador de Visualização: Semana, Mês ou Tabela */}
            <div className="flex items-center bg-slate-200/80 dark:bg-[#0D1117] p-1 rounded-xl border border-slate-300/60 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setModoVisualizacaoAgenda('semana')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  modoVisualizacaoAgenda === 'semana'
                    ? 'bg-white dark:bg-[#161B22] text-[#004B8D] dark:text-[#A1D900] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Semana</span>
              </button>
              <button
                type="button"
                onClick={() => setModoVisualizacaoAgenda('mes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  modoVisualizacaoAgenda === 'mes'
                    ? 'bg-white dark:bg-[#161B22] text-[#004B8D] dark:text-[#A1D900] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Mês (5 Cores)</span>
              </button>
              <button
                type="button"
                onClick={() => setModoVisualizacaoAgenda('tabela')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  modoVisualizacaoAgenda === 'tabela'
                    ? 'bg-white dark:bg-[#161B22] text-[#004B8D] dark:text-[#A1D900] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Lista Tabela</span>
              </button>
            </div>
          </div>

          {modoVisualizacaoAgenda !== 'tabela' ? (
            <div className="p-4">
              <CalendarView
                agendamentos={agendamentos}
                alunos={alunos}
                consultores={consultores}
                viewMode={modoVisualizacaoAgenda}
                onViewModeChange={setModoVisualizacaoAgenda}
                onMarcarPresenca={marcarPresenca}
                onReagendar={(id, dataAtual) => {
                  const ag = agendamentos.find(a => a.id === id);
                  setReagendandoAgId(id);
                  setReagendandoAlunoId(ag?.alunoId || '');
                  setReagendarData(dataAtual);
                }}
                onNovoAgendamentoParaData={(dataEscolhida, horaEscolhida) => {
                  setNovaData(dataEscolhida);
                  if (horaEscolhida) {
                    setNovoInicio(horaEscolhida);
                    const [h, m] = horaEscolhida.split(':').map(Number);
                    const duracao = novoTipo === 'diagnostico_1h' ? 1 : 2;
                    const hFim = String(h + duracao).padStart(2, '0');
                    setNovoFim(`${hFim}:${String(m || 0).padStart(2, '0')}`);
                  }
                  setShowModalAgendamento(true);
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase tracking-wider font-['Montserrat']">
                  <tr>
                    <th className="py-3 px-4">Data & Horário</th>
                    <th className="py-3 px-4">Empreendedor (Aluno)</th>
                    <th className="py-3 px-4">Tipo de Sessão</th>
                    <th className="py-3 px-4">Consultora</th>
                    <th className="py-3 px-4">Status & Presença</th>
                    <th className="py-3 px-4 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {agendamentos.map(ag => {
                    const aluno = alunos.find(a => a.id === ag.alunoId);
                    const consultor = consultores.find(c => c.id === ag.consultorId);
                    const infoData = formatarDataAgenda(ag.data);

                    return (
                      <tr key={ag.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900 dark:text-white">{infoData.dia} de {infoData.mesAbrev}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{ag.horarioInicio} - {ag.horarioFim}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{aluno?.nome || 'Aluno'}</div>
                          <div className="text-[11px] text-slate-400">{aluno?.negocio}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ag.tipo === 'triagem' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                            ag.tipo === 'diagnostico_1h' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                            'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}>
                            {ag.tipo === 'triagem' ? 'Triagem (45m)' : ag.tipo === 'diagnostico_1h' ? 'Diagnóstico (1h)' : 'Mentoria (2h)'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          {consultor?.nome}
                          <div className="text-[10px] text-slate-400">{ag.sala}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ag.status === 'confirmado' ? 'bg-emerald-100 text-emerald-800' :
                            ag.status === 'agendado' ? 'bg-orange-100 text-orange-800' :
                            ag.status === 'falta_injustificada' ? 'bg-rose-100 text-rose-800' :
                            ag.status === 'reagendado' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {ag.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {ag.status !== 'realizado' && ag.status !== 'reagendado' && (
                              <>
                                <button
                                  onClick={() => marcarPresenca(ag.id, 'confirmado')}
                                  title="Confirmar Presença"
                                  className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setReagendandoAgId(ag.id);
                                    setReagendandoAlunoId(ag.alunoId);
                                    setReagendarData(ag.data);
                                  }}
                                  title="Reagendar"
                                  className="p-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer text-[11px] font-semibold"
                                >
                                  Reagendar
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ABA 2: LISTA DE PASSIVOS (>15 DIAS SEM AGENDAMENTO) */}
      {activeTab === 'passivos' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-amber-200 dark:border-amber-900/60 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
                  Lista de Passivos & Limbo (&gt;15 dias sem agendamento)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Empreendedores que realizaram a triagem ou sessões iniciais, mas estão sem horários futuros marcados.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 font-semibold uppercase tracking-wider font-['Montserrat']">
                <tr>
                  <th className="py-3 px-4">Empreendedor & Negócio</th>
                  <th className="py-3 px-4">WhatsApp</th>
                  <th className="py-3 px-4">Etapa Atual</th>
                  <th className="py-3 px-4">Encontros Feitos</th>
                  <th className="py-3 px-4">Situação SIG</th>
                  <th className="py-3 px-4 text-right">Ação de Resgate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {alunosPassivos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Nenhum aluno em estado passivo no momento! Todos possuem sessões agendadas ou concluídas.
                    </td>
                  </tr>
                ) : (
                  alunosPassivos.map(aluno => (
                    <tr key={aluno.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{aluno.nome}</div>
                        <div className="text-[11px] text-slate-400">{aluno.negocio} ({aluno.ramo})</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">{aluno.whatsapp}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {aluno.statusPrograma}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">{aluno.encontrosRealizados} de 6</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {aluno.codigoTurmaSIG || 'Sem Turma'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setTemplateWhatsAppAluno(aluno);
                              setTipoTemplateWA('resgate');
                              setShowModalWhatsApp(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Resgatar (WhatsApp)</span>
                          </button>
                          <button
                            onClick={() => {
                              setBlocoAlunoId(aluno.id);
                              setShowModalBloco6(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                          >
                            Agendar Bloco 6
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: LEMBRETES WHATSAPP */}
      {activeTab === 'lembretes' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
              Fila de Lembretes Automáticos D-1 (WhatsApp)
            </h3>
            <p className="text-xs text-slate-500">
              Disparo de mensagens padronizadas 24 horas antes do encontro presencial no SENAC SAJ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {agendamentos.filter(a => a.status === 'agendado').map(ag => {
              const aluno = alunos.find(a => a.id === ag.alunoId);
              const consultor = consultores.find(c => c.id === ag.consultorId);
              const infoData = formatarDataAgenda(ag.data);

              return (
                <div key={ag.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1E252E] flex justify-between items-center gap-3">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{aluno?.nome}</div>
                    <div className="text-[11px] text-slate-500">
                      {infoData.dia} de {infoData.mesAbrev} às {ag.horarioInicio} com {consultor?.nome}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">Whats: {aluno?.whatsapp}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const res = enviarLembreteWhatsApp(ag.id);
                        window.open(res.link, '_blank');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{ag.lembreteEnviado24h ? 'Reenviar' : 'Disparar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 4: LISTA GERAL DE ALUNOS & CONTROLE SIG */}
      {activeTab === 'alunos' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
                Empreendedores & Sincronização Acadêmica SIG
              </h3>
              <p className="text-xs text-slate-500">
                Acompanhe o status do código da turma no SIG e resolva pendências comunicadas pela Coordenação.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar empreendedor ou SIG..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase tracking-wider font-['Montserrat']">
                <tr>
                  <th className="py-3 px-4">Empreendedor</th>
                  <th className="py-3 px-4">Código Turma SIG</th>
                  <th className="py-3 px-4">Status SIG</th>
                  <th className="py-3 px-4">Faltas / Reag.</th>
                  <th className="py-3 px-4">Etapa Programa</th>
                  <th className="py-3 px-4 text-right">Ação SIG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {alunos
                  .filter(a => {
                    const matchBusca = a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                       a.negocio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       (a.codigoTurmaSIG && a.codigoTurmaSIG.toLowerCase().includes(searchTerm.toLowerCase()));
                    if (!matchBusca) return false;
                    if (filtroTabela === 'em_risco') return (a.totalFaltas === 1 || a.totalReagendamentos === 2) && a.statusPrograma !== 'Desligado';
                    if (filtroTabela === 'desligados') return a.statusPrograma === 'Desligado';
                    if (filtroTabela === 'pendencias_sig') return a.statusSincronizacaoSIG !== 'sincronizado';
                    return true;
                  })
                  .map(aluno => (
                    <tr key={aluno.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{aluno.nome}</div>
                        <div className="text-[11px] text-slate-400">{aluno.negocio}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#004B8D] dark:text-[#A1D900]">
                        {aluno.codigoTurmaSIG || 'Pendente'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          aluno.statusSincronizacaoSIG === 'sincronizado' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          aluno.statusSincronizacaoSIG === 'pendente_ajuste_data' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                          aluno.statusSincronizacaoSIG === 'pendente_abertura' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {aluno.statusSincronizacaoSIG === 'sincronizado' ? 'Sincronizado' :
                           aluno.statusSincronizacaoSIG === 'pendente_ajuste_data' ? 'Pendente Ajuste Data' :
                           aluno.statusSincronizacaoSIG === 'pendente_abertura' ? 'Pendente Abertura' : 'Pendente Encerramento'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-500">{aluno.totalFaltas}/2 Faltas</span> • <span className="text-slate-500">{aluno.totalReagendamentos}/3 Reag.</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{aluno.statusPrograma}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {aluno.statusSincronizacaoSIG !== 'sincronizado' && (
                            <button
                              onClick={() => atualizarStatusSIG(aluno.id, 'sincronizado')}
                              className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] cursor-pointer"
                            >
                              Sincronizar SIG
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setNovoAlunoId(aluno.id);
                              setShowModalAgendamento(true);
                            }}
                            className="text-xs text-[#004B8D] dark:text-[#A1D900] hover:underline font-semibold cursor-pointer"
                          >
                            + Agendar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL AGENDAR BLOCO DE 6 SESSÕES QUINZENAIS */}
      {showModalBloco6 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161B22] rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white font-['Montserrat'] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  Agendar Bloco Completo de 6 Sessões
                </h3>
                <p className="text-xs text-slate-500">Cadência quinzenal automática de 2h com a consultora</p>
              </div>
              <button onClick={() => setShowModalBloco6(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCriarBloco6} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Empreendedor</label>
                <select
                  value={blocoAlunoId}
                  onChange={(e) => setBlocoAlunoId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  {alunos.map(a => (
                    <option key={a.id} value={a.id}>{a.nome} — {a.negocio} ({a.statusPrograma})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Consultora</label>
                  <select
                    value={blocoConsultorId}
                    onChange={(e) => setBlocoConsultorId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="c_aline">Aline Silva (Manhã / Tarde)</option>
                    <option value="c_laiza">Laiza (Noite)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Data da 1ª Sessão (E1)</label>
                  <input
                    type="date"
                    required
                    value={blocoDataInicio}
                    onChange={(e) => setBlocoDataInicio(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Horário de Início</label>
                  <input
                    type="time"
                    required
                    value={blocoHorarioInicio}
                    onChange={(e) => setBlocoHorarioInicio(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Horário de Fim (2h)</label>
                  <input
                    type="time"
                    required
                    value={blocoHorarioFim}
                    onChange={(e) => setBlocoHorarioFim(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Local / Sala SENAC</label>
                <input
                  type="text"
                  value={blocoSala}
                  onChange={(e) => setBlocoSala(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900/40 text-[11px] text-purple-800 dark:text-purple-300">
                ✨ <strong>Automação Co.Nexo:</strong> Ao clicar em agendar, o sistema criará os 6 encontros quinzenais, preencherá os temas da trilha e vinculará a turma no SIG acadêmico.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModalBloco6(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
                >
                  Gerar os 6 Encontros
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE REAGENDAMENTO COM CASCATA */}
      {reagendandoAgId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161B22] rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Reagendar Atendimento</h3>
              <button onClick={() => setReagendandoAgId(null)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nova Data</label>
                <input
                  type="date"
                  value={reagendarData}
                  onChange={(e) => setReagendarData(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Novo Início</label>
                  <input
                    type="time"
                    value={reagendarInicio}
                    onChange={(e) => setReagendarInicio(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Novo Fim</label>
                  <input
                    type="time"
                    value={reagendarFim}
                    onChange={(e) => setReagendarFim(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/40">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reagendarEmCascataAtivo}
                    onChange={(e) => setReagendarEmCascataAtivo(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#004B8D]"
                  />
                  <div>
                    <span className="font-bold text-[#004B8D] dark:text-[#A1D900] block">Reagendar em Cascata</span>
                    <span className="text-[10px] text-slate-500">Desloca todas as sessões futuras deste aluno pelo mesmo intervalo de dias mantendo a cadência quinzenal.</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReagendandoAgId(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecutarReagendamento}
                  className="px-4 py-1.5 rounded-lg bg-[#004B8D] text-white font-bold cursor-pointer"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TEMPLATES WHATSAPP */}
      {showModalWhatsApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161B22] rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat'] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                Modelos de Comunicação WhatsApp
              </h3>
              <button onClick={() => setShowModalWhatsApp(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Escolha o Modelo de Mensagem:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTipoTemplateWA('resgate')}
                    className={`p-2 rounded-xl border text-left font-semibold cursor-pointer ${
                      tipoTemplateWA === 'resgate' ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Resgate de Passivo (&gt;15d)
                  </button>
                  <button
                    onClick={() => setTipoTemplateWA('lembrete')}
                    className={`p-2 rounded-xl border text-left font-semibold cursor-pointer ${
                      tipoTemplateWA === 'lembrete' ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Lembrete D-1 (Confirmado)
                  </button>
                  <button
                    onClick={() => setTipoTemplateWA('reagendamento')}
                    className={`p-2 rounded-xl border text-left font-semibold cursor-pointer ${
                      tipoTemplateWA === 'reagendamento' ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Aviso de Reagendamento
                  </button>
                  <button
                    onClick={() => setTipoTemplateWA('falta')}
                    className={`p-2 rounded-xl border text-left font-semibold cursor-pointer ${
                      tipoTemplateWA === 'falta' ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Alerta de 1ª Falta
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Mensagem Formatada:</label>
                <div className="p-3 bg-slate-50 dark:bg-[#0D1117] rounded-xl border border-slate-200 dark:border-slate-700 font-sans text-xs whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                  {textoWhatsAppGerado}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={copiarTextoWhatsApp}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                >
                  {copiadoWA ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiadoWA ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>

                <button
                  type="button"
                  onClick={abrirConversaWhatsApp}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir no WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO ALUNO (BALCÃO) */}
      {showModalNovoAluno && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Novo Cadastro no Balcão</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Atendimento presencial recepção SENAC SAJ</p>
              </div>
              <button onClick={() => setShowModalNovoAluno(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSalvarNovoAluno} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Arthur Santana"
                  value={nomeNovo}
                  onChange={e => setNomeNovo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="75987654321"
                    value={whatsNovo}
                    onChange={e => setWhatsNovo(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ramo de Atividade</label>
                  <SearchableSelect
                    value={ramoNovo}
                    onChange={setRamoNovo}
                    options={RAMOS_ATIVIDADE_OPCOES}
                    placeholder="Selecione..."
                    align="right"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome do Negócio</label>
                <input
                  type="text"
                  placeholder="Ex: Marmitaria do Arthur"
                  value={negocioNovo}
                  onChange={e => setNegocioNovo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">E-mail (Opcional)</label>
                <input
                  type="email"
                  placeholder="arthur@email.com"
                  value={emailNovo}
                  onChange={e => setEmailNovo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModalNovoAluno(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#A1D900] text-slate-900 cursor-pointer"
                >
                  Cadastrar e Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SESSÃO AVULSA */}
      {showModalAgendamento && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Novo Agendamento Individual</h3>
                <p className="text-xs text-slate-500">Validação automática de conflito e limite de faltas</p>
              </div>
              <button onClick={() => setShowModalAgendamento(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSalvarAgendamento} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Empreendedor</label>
                <select
                  value={novoAlunoId}
                  onChange={e => setNovoAlunoId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
                >
                  {alunos.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.nome} — {a.negocio} ({a.totalFaltas} faltas / {a.totalReagendamentos} reag.) {a.statusPrograma === 'Desligado' ? '🚫 DESLIGADO' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipo de Sessão</label>
                  <select
                    value={novoTipo}
                    onChange={e => handleTipoChange(e.target.value as TipoSessao)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value="triagem">Entrevista de Triagem (45m)</option>
                    <option value="diagnostico_1h">Diagnóstico Inicial (1h)</option>
                    <option value="mentoria_2h">Mentoria de Negócios (2h)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Consultora</label>
                  <select
                    value={novoConsultorId}
                    onChange={e => setNovoConsultorId(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    {consultores.map(c => (
                      <option key={c.id} value={c.id}>{c.nome} ({c.turnoPadrao})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Data</label>
                  <input
                    type="date"
                    value={novaData}
                    onChange={e => setNovaData(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Início</label>
                  <input
                    type="time"
                    value={novoInicio}
                    onChange={e => handleInicioChange(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Fim</label>
                  <input
                    type="time"
                    value={novoFim}
                    readOnly
                    className="w-full p-2 bg-slate-100 dark:bg-[#1E252E] border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sala no SENAC</label>
                <input
                  type="text"
                  value={novaSala}
                  onChange={e => setNovaSala(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Observações</label>
                <textarea
                  rows={2}
                  value={novasNotas}
                  onChange={e => setNovasNotas(e.target.value)}
                  placeholder="Informações adicionais..."
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModalAgendamento(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#004B8D] text-white cursor-pointer"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
