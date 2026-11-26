import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar as CalendarIcon, Clock, CheckCircle2, 
  MessageCircle, BookOpen, Send, MapPin, 
  FileCheck, ExternalLink, ChevronRight, ChevronLeft, Check,
  CalendarSync, XCircle, AlertTriangle, X, User,
  FileText, Download, Eye, DollarSign, Calculator, Printer,
  TrendingDown, TrendingUp, Sparkles, Layers
} from 'lucide-react';
import { formatarDataAgenda, calcularPrazoCancelamento } from '../utils/dateUtils';

interface DiaAgenda {
  data: string;
  diaSemana: string;
  diaNum: string;
  mesAbrev: string;
  mesNome: string;
  mesChave: string; // '2026-10', '2026-11', '2026-12', '2027-01'
  ano: string;
  slots: string[];
}

interface NotificacaoAluno {
  id: string;
  tipo: 'alerta_falta' | 'sucesso' | 'info';
  titulo: string;
  mensagem: string;
}

const MESES_CONFIG = [
  { chave: '2026-10', nome: 'Outubro', ano: '2026' },
  { chave: '2026-11', nome: 'Novembro', ano: '2026' },
  { chave: '2026-12', nome: 'Dezembro', ano: '2026' },
  { chave: '2027-01', nome: 'Janeiro', ano: '2027' },
];

const DIAS_DISPONIVEIS: DiaAgenda[] = [
  // Outubro 2026
  { data: '2026-10-20', diaSemana: 'Ter', diaNum: '20', mesAbrev: 'Out', mesNome: 'Outubro', mesChave: '2026-10', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-10-22', diaSemana: 'Qui', diaNum: '22', mesAbrev: 'Out', mesNome: 'Outubro', mesChave: '2026-10', ano: '2026', slots: ['14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-10-23', diaSemana: 'Sex', diaNum: '23', mesAbrev: 'Out', mesNome: 'Outubro', mesChave: '2026-10', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00'] },
  { data: '2026-10-27', diaSemana: 'Ter', diaNum: '27', mesAbrev: 'Out', mesNome: 'Outubro', mesChave: '2026-10', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-10-29', diaSemana: 'Qui', diaNum: '29', mesAbrev: 'Out', mesNome: 'Outubro', mesChave: '2026-10', ano: '2026', slots: ['14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-10-30', diaSemana: 'Sex', diaNum: '30', mesAbrev: 'Out', mesNome: 'Outubro', mesChave: '2026-10', ano: '2026', slots: ['09:00 às 11:00', '15:00 às 17:00'] },

  // Novembro 2026
  { data: '2026-11-03', diaSemana: 'Ter', diaNum: '03', mesAbrev: 'Nov', mesNome: 'Novembro', mesChave: '2026-11', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-11-05', diaSemana: 'Qui', diaNum: '05', mesAbrev: 'Nov', mesNome: 'Novembro', mesChave: '2026-11', ano: '2026', slots: ['14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-11-06', diaSemana: 'Sex', diaNum: '06', mesAbrev: 'Nov', mesNome: 'Novembro', mesChave: '2026-11', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00'] },
  { data: '2026-11-10', diaSemana: 'Ter', diaNum: '10', mesAbrev: 'Nov', mesNome: 'Novembro', mesChave: '2026-11', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-11-12', diaSemana: 'Qui', diaNum: '12', mesAbrev: 'Nov', mesNome: 'Novembro', mesChave: '2026-11', ano: '2026', slots: ['14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-11-17', diaSemana: 'Ter', diaNum: '17', mesAbrev: 'Nov', mesNome: 'Novembro', mesChave: '2026-11', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00'] },
  { data: '2026-11-19', diaSemana: 'Qui', diaNum: '19', mesAbrev: 'Nov', mesNome: 'Novembro', mesChave: '2026-11', ano: '2026', slots: ['14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-11-24', diaSemana: 'Ter', diaNum: '24', mesAbrev: 'Nov', mesNome: 'Novembro', mesChave: '2026-11', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-11-26', diaSemana: 'Qui', diaNum: '26', mesAbrev: 'Nov', mesNome: 'Novembro', mesChave: '2026-11', ano: '2026', slots: ['14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-11-27', diaSemana: 'Sex', diaNum: '27', mesAbrev: 'Nov', mesNome: 'Novembro', mesChave: '2026-11', ano: '2026', slots: ['09:00 às 11:00', '15:00 às 17:00'] },

  // Dezembro 2026
  { data: '2026-12-01', diaSemana: 'Ter', diaNum: '01', mesAbrev: 'Dez', mesNome: 'Dezembro', mesChave: '2026-12', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-12-03', diaSemana: 'Qui', diaNum: '03', mesAbrev: 'Dez', mesNome: 'Dezembro', mesChave: '2026-12', ano: '2026', slots: ['14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-12-04', diaSemana: 'Sex', diaNum: '04', mesAbrev: 'Dez', mesNome: 'Dezembro', mesChave: '2026-12', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00'] },
  { data: '2026-12-08', diaSemana: 'Ter', diaNum: '08', mesAbrev: 'Dez', mesNome: 'Dezembro', mesChave: '2026-12', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00'] },
  { data: '2026-12-10', diaSemana: 'Qui', diaNum: '10', mesAbrev: 'Dez', mesNome: 'Dezembro', mesChave: '2026-12', ano: '2026', slots: ['14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2026-12-15', diaSemana: 'Ter', diaNum: '15', mesAbrev: 'Dez', mesNome: 'Dezembro', mesChave: '2026-12', ano: '2026', slots: ['09:00 às 11:00', '14:00 às 16:00'] },
  { data: '2026-12-17', diaSemana: 'Qui', diaNum: '17', mesAbrev: 'Dez', mesNome: 'Dezembro', mesChave: '2026-12', ano: '2026', slots: ['14:00 às 16:00', '16:00 às 18:00'] },

  // Janeiro 2027
  { data: '2027-01-12', diaSemana: 'Ter', diaNum: '12', mesAbrev: 'Jan', mesNome: 'Janeiro', mesChave: '2027-01', ano: '2027', slots: ['09:00 às 11:00', '14:00 às 16:00'] },
  { data: '2027-01-14', diaSemana: 'Qui', diaNum: '14', mesAbrev: 'Jan', mesNome: 'Janeiro', mesChave: '2027-01', ano: '2027', slots: ['14:00 às 16:00', '16:00 às 18:00'] },
  { data: '2027-01-19', diaSemana: 'Ter', diaNum: '19', mesAbrev: 'Jan', mesNome: 'Janeiro', mesChave: '2027-01', ano: '2027', slots: ['09:00 às 11:00', '14:00 às 16:00'] },
  { data: '2027-01-21', diaSemana: 'Qui', diaNum: '21', mesAbrev: 'Jan', mesNome: 'Janeiro', mesChave: '2027-01', ano: '2027', slots: ['14:00 às 16:00', '16:00 às 18:00'] },
];

export const ArthurView: React.FC = () => {
  const { 
    alunos, agendamentos, duvidas, materiais, diarios,
    marcarPresenca, agendarSessao, reagendarSessao, cancelarSessao,
    enviarDuvida, consultores, activeTab, setAlertaGlobal,
    selectedAlunoId, setSelectedAlunoId
  } = useApp();

  // Empreendedor(a) atualmente selecionado(a)
  const alunoAtivo = alunos.find(a => a.id === selectedAlunoId) || alunos[0];
  const proximoAgendamento = agendamentos.find(
    ag => ag.alunoId === alunoAtivo.id && (ag.status === 'agendado' || ag.status === 'confirmado')
  );
  const consultora = consultores.find(c => c.id === proximoAgendamento?.consultorId) || consultores[0];
  const minhasDuvidas = duvidas.filter(d => d.alunoId === alunoAtivo.id);

  // Regra de Cancelamento e Limite
  const LIMITE_CANCELAMENTOS = 2;
  const cancelamentosRealizados = alunoAtivo.totalCancelamentos || 0;
  const atingiuLimiteCancelamento = cancelamentosRealizados >= LIMITE_CANCELAMENTOS;

  // Sistema de Notificação Dinâmica (Aparece e Desaparece após ser Notificado)
  const [notificacaoAtiva, setNotificacaoAtiva] = useState<NotificacaoAluno | null>(null);

  useEffect(() => {
    if (notificacaoAtiva) {
      const timer = setTimeout(() => {
        setNotificacaoAtiva(null);
      }, 6000); // Desaparece automaticamente após 6 segundos
      return () => clearTimeout(timer);
    }
  }, [notificacaoAtiva]);

  // Estados do Calendário Principal (com Escolha de Mês)
  const [mesSelecionado, setMesSelecionado] = useState<string>('2026-11');
  const diasDoMesAtual = DIAS_DISPONIVEIS.filter(d => d.mesChave === mesSelecionado);

  const [dataSelecionada, setDataSelecionada] = useState<string>(diasDoMesAtual[0]?.data || DIAS_DISPONIVEIS[0].data);
  const [slotSelecionado, setSlotSelecionado] = useState<string>('');

  // Estados de Reagendamento (com Escolha de Mês)
  const [showModalReagendar, setShowModalReagendar] = useState(false);
  const [mesReagendamento, setMesReagendamento] = useState<string>('2026-11');
  const diasDoMesReagendamento = DIAS_DISPONIVEIS.filter(d => d.mesChave === mesReagendamento);

  const [novaDataReagendamento, setNovaDataReagendamento] = useState<string>(diasDoMesReagendamento[0]?.data || DIAS_DISPONIVEIS[0].data);
  const [novoSlotReagendamento, setNovoSlotReagendamento] = useState<string>('');

  // Estados de Cancelamento
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');

  // Dúvidas e Tarefas
  const [novaPergunta, setNovaPergunta] = useState('');
  const [tarefasFeitas, setTarefasFeitas] = useState<{ [key: string]: boolean }>({});

  // Ferramentas Práticas: Calculadora de Precificação Descomplicada
  const [custoInsumos, setCustoInsumos] = useState<number>(9.50);
  const [custoEmbalagem, setCustoEmbalagem] = useState<number>(1.80);
  const [custoFixoUnit, setCustoFixoUnit] = useState<number>(2.20);
  const [margemDesejada, setMargemDesejada] = useState<number>(35);

  const custoTotalUnit = custoInsumos + custoEmbalagem + custoFixoUnit;
  const precoSugerido = margemDesejada < 100 ? custoTotalUnit / (1 - (margemDesejada / 100)) : custoTotalUnit * 1.5;
  const lucroLiquidoUnit = precoSugerido - custoTotalUnit;

  // Ferramentas Práticas: Mini Fluxo de Caixa Diário
  const [vendasPix, setVendasPix] = useState<number>(198.00);
  const [vendasDinheiro, setVendasDinheiro] = useState<number>(110.00);
  const [vendasCartao, setVendasCartao] = useState<number>(132.00);
  const [saidaMercado, setSaidaMercado] = useState<number>(145.00);
  const [saidaGas, setSaidaGas] = useState<number>(40.00);
  const [saidaMoto, setSaidaMoto] = useState<number>(35.00);

  const totalEntradas = vendasPix + vendasDinheiro + vendasCartao;
  const totalSaidas = saidaMercado + saidaGas + saidaMoto;
  const saldoDia = totalEntradas - totalSaidas;

  const handleMudarMes = (chave: string) => {
    setMesSelecionado(chave);
    const dias = DIAS_DISPONIVEIS.filter(d => d.mesChave === chave);
    if (dias.length > 0) {
      setDataSelecionada(dias[0].data);
      setSlotSelecionado('');
    }
  };

  const handleMudarMesReagendamento = (chave: string) => {
    setMesReagendamento(chave);
    const dias = DIAS_DISPONIVEIS.filter(d => d.mesChave === chave);
    if (dias.length > 0) {
      setNovaDataReagendamento(dias[0].data);
      setNovoSlotReagendamento('');
    }
  };

  const handleEnviarDuvida = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaPergunta) return;
    enviarDuvida(novaPergunta, alunoAtivo.id, 'c1');
    setNovaPergunta('');
    setNotificacaoAtiva({
      id: `notif_${Date.now()}`,
      tipo: 'sucesso',
      titulo: 'Dúvida Enviada!',
      mensagem: 'Sua pergunta foi enviada para a consultora Aline Silva. Em breve ela responderá pelo portal.'
    });
  };

  const toggleTarefa = (index: number) => {
    setTarefasFeitas(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleConfirmarNovoAgendamento = () => {
    if (!dataSelecionada || !slotSelecionado) return;

    const [hInicio, hFim] = slotSelecionado.split(' às ');
    const res = agendarSessao({
      alunoId: alunoAtivo.id,
      consultorId: 'c1', // Aline
      tipo: 'mentoria_2h',
      data: dataSelecionada,
      horarioInicio: hInicio.trim(),
      horarioFim: hFim.trim(),
      sala: 'Sala 204 - Bloco Empreendedorismo',
      observacoes: `Agendado pelo próprio mentorado (${alunoAtivo.nome}) no Portal Co.Nexo.`
    });

    if (res.success) {
      setSlotSelecionado('');
      const dataInfo = formatarDataAgenda(dataSelecionada);
      setNotificacaoAtiva({
        id: `notif_${Date.now()}`,
        tipo: 'sucesso',
        titulo: 'Reunião Agendada com Sucesso!',
        mensagem: `Seu encontro com a mentora Aline foi agendado para o dia ${dataInfo.dia} de ${dataInfo.mes} às ${hInicio}.`
      });
      setAlertaGlobal('✅ Reunião agendada com sucesso com a mentora Aline!');
    } else {
      alert(res.message);
    }
  };

  const handleConfirmarPresenca = () => {
    if (!proximoAgendamento) return;
    marcarPresenca(proximoAgendamento.id, 'confirmado');
    const dataInfo = formatarDataAgenda(proximoAgendamento.data);
    setNotificacaoAtiva({
      id: `notif_${Date.now()}`,
      tipo: 'sucesso',
      titulo: 'Presença Confirmada com Sucesso!',
      mensagem: `Sua presença para o encontro de ${dataInfo.dia} de ${dataInfo.mes} às ${proximoAgendamento.horarioInicio} está confirmada. A equipe do SENAC já foi informada.`
    });
  };

  const handleExecutarReagendamento = () => {
    if (!proximoAgendamento || !novaDataReagendamento || !novoSlotReagendamento) return;

    const [hInicio, hFim] = novoSlotReagendamento.split(' às ');
    const res = reagendarSessao(proximoAgendamento.id, novaDataReagendamento, hInicio.trim(), hFim.trim());

    if (res.success) {
      setShowModalReagendar(false);
      setNovoSlotReagendamento('');
      const dataInfo = formatarDataAgenda(novaDataReagendamento);
      setNotificacaoAtiva({
        id: `notif_${Date.now()}`,
        tipo: 'sucesso',
        titulo: 'Encontro Reagendado!',
        mensagem: `Novo horário marcado para ${dataInfo.dia} de ${dataInfo.mes} às ${hInicio}. Você utilizou ${alunoAtivo.totalReagendamentos + 1} de 3 reagendamentos permitidos.`
      });
      setAlertaGlobal(`✅ Encontro reagendado para ${dataInfo.dia} de ${dataInfo.mes} às ${hInicio}!`);
    } else {
      alert(res.message);
    }
  };

  // Cancelamento com prazo calculado pelo sistema e notificação temporária
  const handleExecutarCancelamento = () => {
    if (!proximoAgendamento) return;

    if (atingiuLimiteCancelamento) {
      alert('🚫 Limite de 2 cancelamentos atingido no programa Co.Nexo.');
      return;
    }

    const prazo = calcularPrazoCancelamento(proximoAgendamento.data, proximoAgendamento.horarioInicio);
    const res = cancelarSessao(
      proximoAgendamento.id, 
      motivoCancelamento || undefined, 
      prazo.foraDoPrazo
    );

    setShowModalCancelar(false);
    setMotivoCancelamento('');

    if (res.menos24h) {
      // Notifica falta contabilizada (aparece e desaparece automaticamente após alguns segundos)
      setNotificacaoAtiva({
        id: `notif_${Date.now()}`,
        tipo: 'alerta_falta',
        titulo: 'Notificação do Sistema: Falta Contabilizada',
        mensagem: `Seu cancelamento foi efetuado fora do prazo (menos de 24h de antecedência). Conforme as normas do Co.Nexo SENAC, foi registrada 1 falta no seu histórico escolar (${alunoAtivo.totalFaltas + 1}/2 faltas permitidas).`
      });
      setAlertaGlobal(`🚨 Cancelamento fora do prazo (<24h). 1 falta foi contabilizada no sistema.`);
    } else {
      // Notifica cancelamento dentro do prazo sem falta
      setNotificacaoAtiva({
        id: `notif_${Date.now()}`,
        tipo: 'sucesso',
        titulo: 'Encontro Cancelado Dentro do Prazo',
        mensagem: `Seu horário foi liberado com sucesso para outro aluno. Nenhuma falta foi registrada no seu histórico (${cancelamentosRealizados + 1}/2 cancelamentos utilizados).`
      });
      setAlertaGlobal(`✅ Encontro cancelado dentro do prazo. Horário liberado sem falta.`);
    }
  };

  const diaAtualObjeto = DIAS_DISPONIVEIS.find(d => d.data === dataSelecionada) || diasDoMesAtual[0] || DIAS_DISPONIVEIS[0];
  const infoDataCompromisso = proximoAgendamento ? formatarDataAgenda(proximoAgendamento.data) : null;
  const prazoCalculadoCancelamento = proximoAgendamento ? calcularPrazoCancelamento(proximoAgendamento.data, proximoAgendamento.horarioInicio) : null;

  return (
    <div className="space-y-6">
      {/* 1. Banner Minimalista e Objetivo com Saldos de Cancelamentos e Reagendamentos */}
      <div className="bg-[#004B8D] rounded-2xl p-6 text-white shadow-md border-b-4 border-[#A1D900] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[#A1D900] text-xs font-bold uppercase tracking-wider font-['Montserrat']">
            Portal do Empreendedor • SENAC
          </span>
          <h1 className="text-2xl font-bold font-['Montserrat'] mt-0.5">
            Olá, {alunoAtivo.nome}!
          </h1>
          
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-200 text-xs font-medium border border-blue-400/30">
              {alunoAtivo.negocio}
            </span>

            {/* Contador de Cancelamentos Realizados vs Permitidos */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20">
              <span>Cancelamentos:</span>
              <strong className={`font-mono ${cancelamentosRealizados >= LIMITE_CANCELAMENTOS ? 'text-rose-300' : 'text-[#A1D900]'}`}>
                {cancelamentosRealizados}/{LIMITE_CANCELAMENTOS}
              </strong>
              <span className="text-[10px] text-blue-200 font-normal">permitidos</span>
            </span>

            {/* Contador de Reagendamentos */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/20">
              <span>Reagendamentos:</span>
              <strong className={`font-mono ${alunoAtivo.totalReagendamentos >= 3 ? 'text-rose-300' : 'text-[#A1D900]'}`}>
                {alunoAtivo.totalReagendamentos}/3
              </strong>
            </span>

            {/* Faltas (se houver) */}
            {alunoAtivo.totalFaltas > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-bold font-mono">
                <AlertTriangle className="w-3 h-3 text-amber-300" />
                <span>{alunoAtivo.totalFaltas}/2 faltas</span>
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#334195] border border-blue-400/30 rounded-xl px-4 py-2 text-left sm:text-right shrink-0">
          <div className="text-xs text-blue-200 font-medium">Etapa no Programa:</div>
          <div className="text-sm font-bold text-white font-['Montserrat']">{alunoAtivo.statusPrograma}</div>
          <div className="text-[11px] text-[#A1D900] font-semibold mt-0.5">{alunoAtivo.encontrosRealizados} de 5 encontros concluídos</div>
        </div>
      </div>

      {/* Campo Select de Alunos para Navegação e Demonstração */}
      <div className="bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#004B8D] dark:text-[#A1D900] flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-['Montserrat']">
              Selecionar Aluno(a)
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Alterne entre os participantes para visualizar os agendamentos e tarefas individuais
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <label htmlFor="select-aluno" className="text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0 font-['Montserrat']">
            Aluno:
          </label>
          <select
            id="select-aluno"
            value={alunoAtivo.id}
            onChange={(e) => setSelectedAlunoId(e.target.value)}
            className="w-full sm:w-72 bg-slate-50 dark:bg-[#0D1117] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#004B8D] dark:focus:ring-[#A1D900] cursor-pointer shadow-2xs"
          >
            {alunos.map(aluno => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome} — {aluno.negocio} ({aluno.statusPrograma})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* NOTIFICAÇÃO TEMPORÁRIA: APARECE E DESAPARECE AUTOMATICAMENTE APÓS SER NOTIFICADO */}
      {notificacaoAtiva && (
        <div 
          className={`p-4 rounded-2xl border shadow-md flex items-start justify-between gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
            notificacaoAtiva.tipo === 'alerta_falta'
              ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
              : 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              notificacaoAtiva.tipo === 'alerta_falta'
                ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-[#A1D900]'
            }`}>
              {notificacaoAtiva.tipo === 'alerta_falta' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>

            <div className="text-xs">
              <div className="font-bold text-sm font-['Montserrat']">
                {notificacaoAtiva.titulo}
              </div>
              <p className="mt-0.5 text-xs opacity-90 leading-relaxed max-w-3xl">
                {notificacaoAtiva.mensagem}
              </p>
              <div className="text-[10px] opacity-75 mt-1 font-medium flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                <span>Esta notificação desaparecerá automaticamente em instantes...</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setNotificacaoAtiva(null)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Fechar notificação agora"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. ABA PRINCIPAL: AGENDAMENTO (Datas, Meses e Horários) */}
      {(activeTab === 'proximo' || activeTab === 'agendamento' || !activeTab) && (
        <div className="space-y-6">
          {/* Card 1: Próximo Compromisso Marcado (Visual, Direto, com Dia, Mês e Horário) */}
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-[#004B8D] dark:text-[#A1D900] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800 uppercase tracking-wide">
                  Próximo Compromisso Marcado
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5 font-['Montserrat']">
                  {proximoAgendamento?.tipo === 'mentoria_2h' 
                    ? '1º Encontro de Mentoria de Negócios (2 Horas)' 
                    : 'Entrevista de Diagnóstico (1 Hora)'}
                </h2>
              </div>

              {proximoAgendamento && (
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold w-fit ${
                  proximoAgendamento.status === 'confirmado' 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' 
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                }`}>
                  {proximoAgendamento.status === 'confirmado' ? '✓ Presença Confirmada' : '⏳ Confirmação Pendente'}
                </span>
              )}
            </div>

            {proximoAgendamento && infoDataCompromisso ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-[#1E252E] p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                {/* 1. Dia e Mês */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#004B8D] dark:text-[#A1D900] flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Dia & Mês</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-['Montserrat']">
                      {infoDataCompromisso.dia} de {infoDataCompromisso.mes}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {infoDataCompromisso.diaSemana} ({infoDataCompromisso.ano})
                    </div>
                  </div>
                </div>

                {/* 2. Horário */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#004B8D] dark:text-[#A1D900] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Horário</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      {proximoAgendamento.horarioInicio} às {proximoAgendamento.horarioFim}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Duração: 2 horas
                    </div>
                  </div>
                </div>

                {/* 3. Consultora & Local */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#004B8D] dark:text-[#A1D900] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Consultora & Sala</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{consultora.nome}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{proximoAgendamento.sala}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-5 bg-slate-50 dark:bg-[#1E252E] rounded-xl text-center text-slate-600 dark:text-slate-300 text-xs">
                Nenhum encontro agendado. Selecione o mês, a data e o horário no calendário abaixo para agendar.
              </div>
            )}

            {/* BARRA DE AÇÕES: CONFIRMAR PRESENÇA, REAGENDAR OU CANCELAR (Com limites exibidos) */}
            {proximoAgendamento && (
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Confirmação de Presença */}
                <div>
                  {proximoAgendamento.status === 'confirmado' ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-[#A1D900] bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 rounded-full border border-emerald-200 dark:border-emerald-800 w-fit">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#A1D900]" />
                      <span>Presença confirmada no encontro!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleConfirmarPresenca}
                      className="btn-conex-neon text-xs px-5 py-2.5 flex items-center justify-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirmar Presença</span>
                    </button>
                  )}
                </div>

                {/* Opções de Reagendamento e Cancelamento com Saldos */}
                <div className="flex items-center gap-2.5 justify-end flex-wrap">
                  {/* Botão Reagendar Horário */}
                  <button
                    onClick={() => {
                      if (alunoAtivo.totalReagendamentos >= 3) {
                        alert('🚫 Limite de 3 reagendamentos atingido no programa. Fale com a equipe do Co.Nexo.');
                        return;
                      }
                      setShowModalReagendar(true);
                    }}
                    disabled={alunoAtivo.totalReagendamentos >= 3}
                    className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                      alunoAtivo.totalReagendamentos >= 3
                        ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        : 'border-[#004B8D]/30 dark:border-blue-500/40 text-[#004B8D] dark:text-blue-300 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-[#004B8D] hover:text-white dark:hover:bg-blue-900/60'
                    }`}
                    title={alunoAtivo.totalReagendamentos >= 3 ? 'Limite de 3 reagendamentos atingido' : 'Reagendar para outro horário'}
                  >
                    <CalendarSync className="w-3.5 h-3.5" />
                    <span>Reagendar</span>
                    <span className="text-[10px] ml-0.5 px-1.5 py-0.5 rounded-full bg-white dark:bg-[#161B22] border border-blue-200 dark:border-blue-800 font-mono font-bold">
                      {alunoAtivo.totalReagendamentos}/3
                    </span>
                  </button>

                  {/* Botão Cancelar Encontro com Contador de Cancelamentos */}
                  <button
                    onClick={() => {
                      if (atingiuLimiteCancelamento) {
                        alert('🚫 Limite de 2 cancelamentos atingido no programa Co.Nexo.');
                        return;
                      }
                      setShowModalCancelar(true);
                    }}
                    disabled={atingiuLimiteCancelamento}
                    className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                      atingiuLimiteCancelamento
                        ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        : 'border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40'
                    }`}
                    title={atingiuLimiteCancelamento ? 'Limite de 2 cancelamentos atingido no programa' : 'Cancelar este encontro'}
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Cancelar Encontro</span>
                    <span className="text-[10px] ml-0.5 px-1.5 py-0.5 rounded-full bg-white dark:bg-[#161B22] border border-rose-200 dark:border-rose-800 font-mono font-bold">
                      {cancelamentosRealizados}/{LIMITE_CANCELAMENTOS}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Calendário com ESCOLHA DO MÊS, Datas e Horários Disponíveis */}
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Montserrat'] flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
                  <span>Agendar Mentoria</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Selecione o mês, a data e o horário desejado:
                </p>
              </div>

              <span className="text-xs font-semibold text-[#004B8D] dark:text-[#A1D900] bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full w-fit">
                Sessão de 2 Horas • Presencial
              </span>
            </div>

            {/* SELETOR DE MÊS */}
            <div>
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide font-['Montserrat']">
                  1. Mês:
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {diasDoMesAtual.length} datas disponíveis
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {MESES_CONFIG.map(m => {
                  const isMesAtivo = mesSelecionado === m.chave;
                  return (
                    <button
                      key={m.chave}
                      type="button"
                      onClick={() => handleMudarMes(m.chave)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isMesAtivo
                          ? 'bg-[#004B8D] text-white shadow-sm border border-[#004B8D] dark:border-blue-400'
                          : 'bg-slate-50 dark:bg-[#1E252E] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#252D37] border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>{m.nome}</span>
                      <span className={`text-[10px] ${isMesAtivo ? 'text-[#A1D900]' : 'text-slate-400'}`}>
                        {m.ano}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid do Calendário: Seleção de Dia do Mês Escolhido */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide block mb-2.5 font-['Montserrat']">
                2. Data ({MESES_CONFIG.find(m => m.chave === mesSelecionado)?.nome}):
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {diasDoMesAtual.map(dia => {
                  const isSelected = dataSelecionada === dia.data;
                  return (
                    <button
                      key={dia.data}
                      type="button"
                      onClick={() => {
                        setDataSelecionada(dia.data);
                        setSlotSelecionado('');
                      }}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#004B8D] text-white border-[#004B8D] shadow-sm font-bold ring-2 ring-[#A1D900]' 
                          : 'bg-slate-50 dark:bg-[#1E252E] hover:bg-slate-100 dark:hover:bg-[#252D37] border-slate-200 dark:border-slate-700 text-[#1A1A1A] dark:text-slate-100'
                      }`}
                    >
                      <div className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-[#A1D900]' : 'text-slate-500 dark:text-slate-400'}`}>
                        {dia.diaSemana}
                      </div>
                      <div className="text-xl font-bold font-['Montserrat'] my-0.5">
                        {dia.diaNum}
                      </div>
                      <div className={`text-[11px] font-medium ${isSelected ? 'text-blue-100' : 'text-slate-600 dark:text-slate-300'}`}>
                        {dia.mesNome}
                      </div>
                      <div className={`text-[10px] mt-1.5 font-semibold ${isSelected ? 'text-[#A1D900]' : 'text-emerald-600 dark:text-[#A1D900]'}`}>
                        {dia.slots.length} vagas
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seleção de Horários Disponíveis */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide block mb-2.5 font-['Montserrat']">
                3. Horário ({diaAtualObjeto.diaNum} de {diaAtualObjeto.mesNome}):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {diaAtualObjeto.slots.map(slot => {
                  const isSelected = slotSelecionado === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSlotSelecionado(slot)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#004B8D] text-white border-[#004B8D] shadow-sm font-bold'
                          : 'bg-slate-50 dark:bg-[#1E252E] hover:bg-slate-100 dark:hover:bg-[#252D37] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-[#A1D900]' : 'text-[#004B8D] dark:text-[#A1D900]'}`} />
                        <span className="text-xs font-semibold">{slot}</span>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#A1D900]" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ação de Confirmação Objetiva com Dia, Mês e Horário */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                {slotSelecionado ? (
                  <span>
                    Agendando para: <strong>{diaAtualObjeto.diaNum} de {diaAtualObjeto.mesNome} de {diaAtualObjeto.ano}</strong> ({diaAtualObjeto.diaSemana}) às <strong>{slotSelecionado}</strong>
                  </span>
                ) : (
                  <span>Selecione um horário acima para confirmar o agendamento.</span>
                )}
              </div>

              <button
                type="button"
                disabled={!slotSelecionado}
                onClick={handleConfirmarNovoAgendamento}
                className={`px-6 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  slotSelecionado
                    ? 'btn-conex-neon shadow-md'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Confirmar Agendamento</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ABA 2: MINHAS TAREFAS & DIAGNÓSTICO PDF */}
      {activeTab === 'diario' && (() => {
        const diariosDoAluno = diarios.filter(d => d.alunoId === alunoAtivo.id);
        const tarefasDoDiario = diariosDoAluno
          .filter(d => d.tarefaProximoEncontro)
          .map(d => d.tarefaProximoEncontro);

        const listaTarefas = tarefasDoDiario.length > 0 ? tarefasDoDiario : [
          'Guardar os recibos e comprovantes de compras da semana num envelope',
          'Não misturar as contas pessoais com as despesas do negócio',
          'Trazer as dúvidas anotadas para a próxima mentoria'
        ];

        return (
          <div className="space-y-6">
            {/* Card de Diagnóstico em PDF */}
            <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-[#1E252E] dark:to-[#161B22] p-5 rounded-2xl border border-blue-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#004B8D] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FileText className="w-6 h-6 text-[#A1D900]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#004B8D] dark:text-[#A1D900] uppercase tracking-wider font-['Montserrat']">
                    Seu Diagnóstico Oficial de Negócios (PDF)
                  </div>
                  {alunoAtivo.diagnosticoPdf ? (
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {alunoAtivo.diagnosticoPdf.nome}
                      </div>
                      <div className="text-xs text-slate-500">
                        Anexado pela consultoria em {alunoAtivo.diagnosticoPdf.dataUpload} • Documento oficial de orientação da trilha
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                        Diagnóstico em preparação pela consultoria Aline/Laiza.
                      </div>
                      <div className="text-[11px] text-slate-500">
                        O PDF oficial com a análise do seu negócio aparecerá aqui.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {alunoAtivo.diagnosticoPdf && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Visualizando documento: ${alunoAtivo.diagnosticoPdf?.nome}`)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-4 h-4 text-[#004B8D]" />
                    <span>Visualizar PDF</span>
                  </button>
                  <button
                    onClick={() => alert(`Iniciando download de: ${alunoAtivo.diagnosticoPdf?.nome}`)}
                    className="px-3.5 py-2 rounded-xl bg-[#004B8D] hover:bg-[#00386b] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4 text-[#A1D900]" />
                    <span>Baixar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tarefas Combinadas */}
            <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 font-['Montserrat']">
                    <FileCheck className="w-5 h-5 text-emerald-600 dark:text-[#A1D900]" />
                    <span>Tarefas Combinadas com a Mentora Aline</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Atividades para o negócio de {alunoAtivo.nome}
                  </p>
                </div>
                <span className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#A1D900] px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  {listaTarefas.length} tarefa(s)
                </span>
              </div>

              <div className="space-y-2.5">
                {listaTarefas.map((item, idx) => (
                  <label 
                    key={`${alunoAtivo.id}_${idx}`} 
                    className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-[#1E252E] hover:bg-slate-100 dark:hover:bg-[#252D37] rounded-xl cursor-pointer text-xs text-slate-800 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={!!tarefasFeitas[`${alunoAtivo.id}_${idx}`]}
                      onChange={() => setTarefasFeitas(prev => ({ ...prev, [`${alunoAtivo.id}_${idx}`]: !prev[`${alunoAtivo.id}_${idx}`] }))}
                      className="w-4 h-4 rounded text-[#004B8D] focus:ring-[#004B8D] cursor-pointer"
                    />
                    <span className={tarefasFeitas[`${alunoAtivo.id}_${idx}`] ? 'line-through text-slate-400 font-normal' : 'font-semibold'}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ABA ESPECIAL: FERRAMENTAS PRÁTICAS DO EMPREENDEDOR (SEM EXCEL) */}
      {activeTab === 'ferramentas' && (
        <div className="space-y-6">
          {/* Header da Ferramenta com Ação de Impressão do Caderno */}
          <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-['Montserrat']">
                  Caderno do Empreendedor & Ferramentas Práticas
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Controles rápidos desenhados para celular — sem depender de planilhas complexas de Excel.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-[#004B8D] hover:bg-[#00386b] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-[#A1D900]" />
              <span>Imprimir Caderno (PDF)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. CALCULADORA DE PRECIFICAÇÃO DESCOMPLICADA */}
            <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat']">
                    Calculadora de Preço de Venda
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Por Unidade
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Custo de Insumos / Ingredientes (R$)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    value={custoInsumos}
                    onChange={(e) => setCustoInsumos(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm"
                  />
                  <span className="text-[10px] text-slate-400">Ex: Arroz, feijão, frango, legumes</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Embalagem / Sacola (R$)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      value={custoEmbalagem}
                      onChange={(e) => setCustoEmbalagem(Number(e.target.value) || 0)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Rateio Gás/Luz/Moto (R$)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      value={custoFixoUnit}
                      onChange={(e) => setCustoFixoUnit(Number(e.target.value) || 0)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Margem de Lucro Desejada (%):
                    </label>
                    <span className="font-bold text-[#004B8D] dark:text-[#A1D900] font-mono">{margemDesejada}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={margemDesejada}
                    onChange={(e) => setMargemDesejada(Number(e.target.value))}
                    className="w-full accent-[#004B8D]"
                  />
                </div>

                {/* Resultado Destacado */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block font-semibold">
                      Preço Sugerido de Venda:
                    </span>
                    <span className="text-2xl font-black text-emerald-700 dark:text-[#A1D900] font-['Montserrat']">
                      R$ {precoSugerido.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Lucro Líquido Unitário:</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                      R$ {lucroLiquidoUnit.toFixed(2)} / un
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. MINI FLUXO DE CAIXA DIÁRIO */}
            <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat']">
                    Folha de Caixa Diário
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#004B8D]">
                  Hoje
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">Entradas do Dia (Vendas)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">PIX (R$)</label>
                      <input
                        type="number"
                        value={vendasPix}
                        onChange={(e) => setVendasPix(Number(e.target.value) || 0)}
                        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Dinheiro (R$)</label>
                      <input
                        type="number"
                        value={vendasDinheiro}
                        onChange={(e) => setVendasDinheiro(Number(e.target.value) || 0)}
                        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Cartão (R$)</label>
                      <input
                        type="number"
                        value={vendasCartao}
                        onChange={(e) => setVendasCartao(Number(e.target.value) || 0)}
                        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">Saídas do Dia (Despesas)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Mercado/Feira</label>
                      <input
                        type="number"
                        value={saidaMercado}
                        onChange={(e) => setSaidaMercado(Number(e.target.value) || 0)}
                        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs text-rose-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Gás/Insumos</label>
                      <input
                        type="number"
                        value={saidaGas}
                        onChange={(e) => setSaidaGas(Number(e.target.value) || 0)}
                        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs text-rose-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Moto Entrega</label>
                      <input
                        type="number"
                        value={saidaMoto}
                        onChange={(e) => setSaidaMoto(Number(e.target.value) || 0)}
                        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs text-rose-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Balanço do Dia */}
                <div className={`p-4 rounded-2xl border flex justify-between items-center ${
                  saldoDia >= 0 
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 text-blue-900 dark:text-blue-200' 
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-900 dark:text-rose-200'
                }`}>
                  <div>
                    <span className="text-[11px] block font-semibold">Saldo Final do Dia:</span>
                    <span className="text-2xl font-black font-['Montserrat']">
                      R$ {saldoDia.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right text-[11px]">
                    <div>Total Entradas: R$ {totalEntradas.toFixed(2)}</div>
                    <div className="text-rose-600">Total Saídas: R$ {totalSaidas.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. CARTÃO DO NEGÓCIO & CLIENTE IDEAL */}
          <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat'] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Cartão do Negócio — {alunoAtivo.negocio}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
              <div className="p-3.5 bg-slate-50 dark:bg-[#0D1117] rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-500 block text-[10px] uppercase">O Que Eu Vendo:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                  Quentinhas caseiras com sabor baiano autêntico e entregas diárias.
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-[#0D1117] rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-500 block text-[10px] uppercase">Meu Cliente Ideal:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                  Comerciários, bancários e atendentes de lojas do centro de Santo Antônio de Jesus.
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-[#0D1117] rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-500 block text-[10px] uppercase">Meu Diferencial:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1 block">
                  Pontualidade na entrega às 11h45 e facilidade de pagamento no PIX semanal.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ABA 3: DÚVIDAS */}
      {activeTab === 'duvidas' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 font-['Montserrat']">
                <MessageCircle className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
                <span>Tirar Dúvida com a Mentora Aline</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Canal direto de suporte de {alunoAtivo.nome}
              </p>
            </div>
          </div>

          <form onSubmit={handleEnviarDuvida} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Digite sua dúvida aqui..."
              value={novaPergunta}
              onChange={e => setNovaPergunta(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#004B8D]"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-conex-primary px-5 py-2 text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-[#A1D900]" />
                <span>Enviar Dúvida</span>
              </button>
            </div>
          </form>

          {/* Histórico Simplificado */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {minhasDuvidas.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                Nenhuma dúvida registrada para {alunoAtivo.nome} até o momento.
              </div>
            ) : (
              minhasDuvidas.map(d => (
                <div key={d.id} className="bg-slate-50 dark:bg-[#1E252E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="text-slate-700 dark:text-slate-300 font-medium">{alunoAtivo.nome}: "{d.pergunta}"</div>
                  {d.resposta ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-lg text-emerald-900 dark:text-emerald-200">
                      <strong className="text-emerald-800 dark:text-emerald-300">Aline:</strong> {d.resposta}
                    </div>
                  ) : (
                    <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                      Aguardando resposta da mentora...
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. ABA 4: MATERIAIS */}
      {activeTab === 'materiais' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 font-['Montserrat']">
              <BookOpen className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
              <span>Materiais de Apoio</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {materiais.map(mat => (
              <div key={mat.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1E252E] flex justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#004B8D] dark:text-[#A1D900] bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full">
                    {mat.categoria}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{mat.titulo}</h3>
                </div>

                <a 
                  href={mat.linkOuTexto} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-conex-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#A1D900]" />
                  <span>Acessar</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: REAGENDAMENTO DE HORÁRIO (Com Escolha de Mês, Dia e Horário) */}
      {showModalReagendar && proximoAgendamento && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            {/* Cabeçalho do Modal */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#004B8D] dark:text-[#A1D900] flex items-center justify-center">
                  <CalendarSync className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Reagendar Encontro</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Escolha o mês, o dia e o horário com a mentora Aline</p>
                </div>
              </div>
              <button
                onClick={() => setShowModalReagendar(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Resumo do Encontro Atual & Contador */}
            <div className="bg-slate-50 dark:bg-[#1E252E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Encontro Atual Marcado:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {infoDataCompromisso?.dia} de {infoDataCompromisso?.mes} às {proximoAgendamento.horarioInicio} - {proximoAgendamento.horarioFim}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-blue-800 dark:text-[#A1D900] bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-lg font-mono">
                Reagendamento {alunoAtivo.totalReagendamentos + 1} de 3
              </span>
            </div>

            {/* Seletor de Mês no Reagendamento */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide block mb-1.5 font-['Montserrat']">
                1. Selecione o Mês:
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {MESES_CONFIG.map(m => {
                  const isMesAtivo = mesReagendamento === m.chave;
                  return (
                    <button
                      key={m.chave}
                      type="button"
                      onClick={() => handleMudarMesReagendamento(m.chave)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        isMesAtivo
                          ? 'bg-[#004B8D] text-white border border-[#004B8D]'
                          : 'bg-slate-50 dark:bg-[#1E252E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>{m.nome}</span>
                      <span className={`text-[10px] ${isMesAtivo ? 'text-[#A1D900]' : 'text-slate-400'}`}>{m.ano}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seleção do Dia no Mês Escolhido */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide block mb-2 font-['Montserrat']">
                2. Selecione o Dia ({MESES_CONFIG.find(m => m.chave === mesReagendamento)?.nome}):
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {diasDoMesReagendamento.map(dia => {
                  const isSelected = novaDataReagendamento === dia.data;
                  return (
                    <button
                      key={dia.data}
                      type="button"
                      onClick={() => {
                        setNovaDataReagendamento(dia.data);
                        setNovoSlotReagendamento('');
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#004B8D] text-white border-[#004B8D] shadow-sm font-bold ring-2 ring-[#A1D900]' 
                          : 'bg-slate-50 dark:bg-[#0D1117] hover:bg-slate-100 dark:hover:bg-[#1E252E] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className={`text-[10px] uppercase font-bold ${isSelected ? 'text-[#A1D900]' : 'text-slate-400'}`}>
                        {dia.diaSemana}
                      </div>
                      <div className="text-lg font-bold font-['Montserrat']">
                        {dia.diaNum}
                      </div>
                      <div className={`text-[9px] ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {dia.mesAbrev}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seleção do Horário */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide block mb-2 font-['Montserrat']">
                3. Selecione o Horário:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(DIAS_DISPONIVEIS.find(d => d.data === novaDataReagendamento) || diasDoMesReagendamento[0] || DIAS_DISPONIVEIS[0]).slots.map(slot => {
                  const isSelected = novoSlotReagendamento === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNovoSlotReagendamento(slot)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#004B8D] text-white border-[#004B8D] shadow-sm font-bold'
                          : 'bg-slate-50 dark:bg-[#0D1117] hover:bg-slate-100 dark:hover:bg-[#1E252E] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[#A1D900]' : 'text-[#004B8D] dark:text-[#A1D900]'}`} />
                        <span className="text-xs font-semibold">{slot}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#A1D900]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aviso Informativo da Regra */}
            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl text-[11px] text-[#004B8D] dark:text-blue-300 flex items-start gap-2">
              <Clock className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Regra do Programa: É permitido realizar até <strong>3 reagendamentos</strong> durante sua trilha de mentoria.
              </span>
            </div>

            {/* Botões do Rodapé */}
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowModalReagendar(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={!novoSlotReagendamento}
                onClick={handleExecutarReagendamento}
                className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                  novoSlotReagendamento
                    ? 'btn-conex-neon shadow-md'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CalendarSync className="w-4 h-4" />
                <span>Confirmar Reagendamento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCELAMENTO DO ENCONTRO (Com Exibição Clara do Saldo de Cancelamentos Realizados e Permitidos) */}
      {showModalCancelar && proximoAgendamento && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            {/* Cabeçalho do Modal */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Cancelar Encontro</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Verificação automática de prazo e saldo de cancelamentos</p>
                </div>
              </div>
              <button
                onClick={() => setShowModalCancelar(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Contador de Cancelamentos Realizados vs Permitidos */}
            <div className="bg-slate-50 dark:bg-[#1E252E] p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Saldo de Cancelamentos:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Cancelamento {cancelamentosRealizados + 1} de {LIMITE_CANCELAMENTOS} permitidos
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-rose-100/80 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                {cancelamentosRealizados}/{LIMITE_CANCELAMENTOS} usados
              </span>
            </div>

            {/* Detalhes do Encontro */}
            <div className="bg-slate-50 dark:bg-[#1E252E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">Encontro a ser cancelado:</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat']">
                {infoDataCompromisso?.dia} de {infoDataCompromisso?.mes} de {infoDataCompromisso?.ano} às {proximoAgendamento.horarioInicio} - {proximoAgendamento.horarioFim}
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                Consultora: {consultora.nome} • {proximoAgendamento.sala}
              </div>
            </div>

            {/* AVALIAÇÃO AUTOMÁTICA DE PRAZO PELO SISTEMA */}
            {prazoCalculadoCancelamento?.foraDoPrazo ? (
              /* Caso 1: Fora do Prazo (< 24h) -> Notificação de Falta pelo Sistema */
              <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs uppercase tracking-wider font-['Montserrat']">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Cancelamento Fora do Prazo (&lt; 24h)</span>
                </div>
                
                <p className="text-xs text-rose-950 dark:text-rose-200">
                  O sistema identificou que faltam apenas <strong>{prazoCalculadoCancelamento.horasRestantes} horas</strong> para o encontro (prazo mínimo sem penalidade: 24 horas).
                </p>

                <div className="p-2.5 rounded-lg bg-rose-100/90 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-900 dark:text-rose-200 font-medium">
                  🚨 <strong>Aviso do Sistema:</strong> Este cancelamento será <strong>contabilizado como 1 falta</strong> no seu prontuário escolar ({alunoAtivo.totalFaltas + 1}/2 faltas registradas).
                </div>
              </div>
            ) : (
              /* Caso 2: Dentro do Prazo (>= 24h) -> Sem falta */
              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-[#A1D900] font-bold text-xs uppercase tracking-wider font-['Montserrat']">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#A1D900]" />
                  <span>Cancelamento Dentro do Prazo (+ de 24h)</span>
                </div>
                
                <p className="text-xs text-emerald-950 dark:text-emerald-200">
                  O sistema identificou que faltam <strong>{prazoCalculadoCancelamento?.horasRestantes} horas</strong> para o encontro.
                </p>

                <div className="p-2.5 rounded-lg bg-emerald-100/90 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 font-medium">
                  ✅ Seu horário será liberado no sistema para outro aluno e <strong>nenhuma falta será contabilizada</strong>.
                </div>
              </div>
            )}

            {/* Motivo Opcional */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Motivo do cancelamento (opcional):
              </label>
              <input
                type="text"
                value={motivoCancelamento}
                onChange={e => setMotivoCancelamento(e.target.value)}
                placeholder="Ex: Imprevisto com entregas do comércio..."
                className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Botões do Rodapé */}
            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowModalCancelar(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Manter Encontro
              </button>
              <button
                type="button"
                onClick={handleExecutarCancelamento}
                disabled={atingiuLimiteCancelamento}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
