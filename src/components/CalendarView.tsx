import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, 
  User, Check, AlertTriangle, RefreshCw, CheckCircle, 
  Plus, X, Filter, MapPin, Briefcase, Phone, ExternalLink
} from 'lucide-react';
import { Agendamento, Aluno, Consultor, StatusAgendamento, TipoSessao } from '../types';

interface CalendarViewProps {
  agendamentos: Agendamento[];
  alunos: Aluno[];
  consultores: Consultor[];
  viewMode: 'semana' | 'mes';
  onViewModeChange?: (mode: 'semana' | 'mes') => void;
  onMarcarPresenca: (agendamentoId: string, status: StatusAgendamento) => void;
  onReagendar: (agendamentoId: string, dataAtual: string) => void;
  onNovoAgendamentoParaData?: (data: string, hora?: string) => void;
}

const HORAS_GRADE = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Helper para formatar YYYY-MM-DD com segurança de fuso
const formatYMD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  agendamentos,
  alunos,
  consultores,
  viewMode,
  onViewModeChange,
  onMarcarPresenca,
  onReagendar,
  onNovoAgendamentoParaData,
}) => {
  // Inicializa sempre na data atual (Hoje)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [selectedConsultorId, setSelectedConsultorId] = useState<string>('todos');
  const [detalheAgendamento, setDetalheAgendamento] = useState<Agendamento | null>(null);
  const [diaSelecionadoStr, setDiaSelecionadoStr] = useState<string>(() => formatYMD(new Date()));

  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const diasSemanaNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const diasSemanaAbrev = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const anosDisponiveis = [2024, 2025, 2026, 2027, 2028];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Filtragem por consultor se selecionado
  const agendamentosFiltrados = useMemo(() => {
    if (selectedConsultorId === 'todos') return agendamentos;
    return agendamentos.filter(ag => ag.consultorId === selectedConsultorId);
  }, [agendamentos, selectedConsultorId]);

  // Mapa de agendamentos por chave de data YYYY-MM-DD
  const agendamentosPorData = useMemo(() => {
    const map: Record<string, Agendamento[]> = {};
    agendamentosFiltrados.forEach(ag => {
      if (!map[ag.data]) {
        map[ag.data] = [];
      }
      map[ag.data].push(ag);
    });
    // Ordena cada dia pelo horário de início
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio));
    });
    return map;
  }, [agendamentosFiltrados]);

  // Navegação anterior / próximo
  const handleAnterior = () => {
    const nova = new Date(currentDate);
    if (viewMode === 'mes') {
      nova.setMonth(nova.getMonth() - 1);
    } else {
      nova.setDate(nova.getDate() - 7);
    }
    setCurrentDate(nova);
  };

  const handleProximo = () => {
    const nova = new Date(currentDate);
    if (viewMode === 'mes') {
      nova.setMonth(nova.getMonth() + 1);
    } else {
      nova.setDate(nova.getDate() + 7);
    }
    setCurrentDate(nova);
  };

  const handleHoje = () => {
    setCurrentDate(new Date());
  };

  const handleMudarMes = (mesIdx: number) => {
    const nova = new Date(currentDate);
    nova.setMonth(mesIdx);
    setCurrentDate(nova);
  };

  const handleMudarAno = (ano: number) => {
    const nova = new Date(currentDate);
    nova.setFullYear(ano);
    setCurrentDate(nova);
  };

  // CÁLCULO DOS DIAS DO MÊS (GRADE 7x6 = 42 dias com Segunda como início)
  const diasDoMesGrid = useMemo(() => {
    const primeiroDiaMes = new Date(currentYear, currentMonth, 1, 12, 0, 0);
    let primeiroDiaSemana = primeiroDiaMes.getDay(); // 0 = Domingo, 1 = Segunda, ...
    const offsetInicio = primeiroDiaSemana === 0 ? 6 : primeiroDiaSemana - 1;

    const dias: { date: Date; dateStr: string; isCurrentMonth: boolean; isToday: boolean }[] = [];
    const hojeStr = formatYMD(new Date());

    const inicioGrid = new Date(primeiroDiaMes);
    inicioGrid.setDate(inicioGrid.getDate() - offsetInicio);

    for (let i = 0; i < 42; i++) {
      const d = new Date(inicioGrid);
      d.setDate(inicioGrid.getDate() + i);
      const dateStr = formatYMD(d);
      dias.push({
        date: d,
        dateStr,
        isCurrentMonth: d.getMonth() === currentMonth,
        isToday: dateStr === hojeStr
      });
    }

    const ultimaLinhaPertenceProximoMes = dias.slice(35).every(d => !d.isCurrentMonth);
    return ultimaLinhaPertenceProximoMes ? dias.slice(0, 35) : dias;
  }, [currentYear, currentMonth]);

  // CÁLCULO DOS DIAS DA SEMANA ATUAL (Segunda a Domingo)
  const diasDaSemanaGrid = useMemo(() => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 12, 0, 0);
    const day = d.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);

    const hojeStr = formatYMD(new Date());
    const dias: { date: Date; dateStr: string; isToday: boolean }[] = [];

    for (let i = 0; i < 7; i++) {
      const proximo = new Date(monday);
      proximo.setDate(monday.getDate() + i);
      const dateStr = formatYMD(proximo);
      dias.push({
        date: proximo,
        dateStr,
        isToday: dateStr === hojeStr
      });
    }
    return dias;
  }, [currentDate]);

  // Helpers de horário
  const getHourNumber = (timeStr: string) => {
    if (!timeStr) return 0;
    return parseInt(timeStr.split(':')[0], 10);
  };

  const getMinuteNumber = (timeStr: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return parts.length > 1 ? parseInt(parts[1], 10) : 0;
  };

  // Helper de cores e badges de status com Sistema Oficial de 5 Cores do Co.Nexo
  const getStatusBadge = (status: StatusAgendamento, tipo?: TipoSessao) => {
    // 1. Azul: Triagem ou Diagnóstico Inicial
    if (tipo === 'triagem' || tipo === 'diagnostico_1h') {
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        dot: 'bg-blue-500',
        label: tipo === 'triagem' ? 'Triagem' : 'Diagnóstico Inicial'
      };
    }
    // 2. Verde: Confirmado
    if (status === 'confirmado') {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        label: 'Confirmado'
      };
    }
    // 3. Laranja: Pendente de Confirmação
    if (status === 'agendado') {
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
        dot: 'bg-orange-500',
        label: 'Pendente de Confirmação'
      };
    }
    // 4. Vermelho: Falta / Cancelamento <24h
    if (status === 'falta_injustificada' || status === 'cancelado_menos_24h') {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500',
        label: status === 'falta_injustificada' ? 'Falta Injustificada' : 'Cancelou <24h'
      };
    }
    // 5. Amarelo: Reagendado
    if (status === 'reagendado') {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 line-through',
        dot: 'bg-amber-500',
        label: 'Reagendado'
      };
    }
    // Realizado ou outros
    return {
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400',
      label: status === 'realizado' ? 'Realizado' : status
    };
  };

  // Helper para tipo de sessão
  const getTipoSessaoBadge = (tipo: TipoSessao) => {
    if (tipo === 'diagnostico_1h') {
      return {
        label: 'Diagnóstico (1h)',
        badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        borderLeft: 'border-l-purple-500'
      };
    }
    return {
      label: 'Mentoria (2h)',
      badge: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      borderLeft: 'border-l-indigo-500'
    };
  };

  // Total de agendamentos no período selecionado
  const totalAgendamentosPeriodo = useMemo(() => {
    if (viewMode === 'mes') {
      return diasDoMesGrid
        .filter(d => d.isCurrentMonth)
        .reduce((acc, d) => acc + (agendamentosPorData[d.dateStr]?.length || 0), 0);
    } else {
      return diasDaSemanaGrid.reduce((acc, d) => acc + (agendamentosPorData[d.dateStr]?.length || 0), 0);
    }
  }, [viewMode, diasDoMesGrid, diasDaSemanaGrid, agendamentosPorData]);

  // Atendimentos do dia selecionado (para painel lateral do mês)
  const agendamentosDiaSelecionado = useMemo(() => {
    return agendamentosPorData[diaSelecionadoStr] || [];
  }, [agendamentosPorData, diaSelecionadoStr]);

  return (
    <div className="space-y-4">
      {/* BARRA SUPERIOR DE CONTROLES: NAVEGAÇÃO ANUAL, MENSAL E FILTROS */}
      <div className="bg-slate-50/70 dark:bg-[#1E252E] p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Título do Período e Navegadores Rápidos */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={handleAnterior}
              title={viewMode === 'mes' ? 'Mês anterior' : 'Semana anterior'}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleHoje}
              title="Ir para a data de hoje"
              className="px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
            >
              Hoje
            </button>
            <button
              onClick={handleProximo}
              title={viewMode === 'mes' ? 'Próximo mês' : 'Próxima semana'}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Nome do Mês e Ano por extenso */}
          <div className="ml-1">
            <span className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
              {mesesNomes[currentMonth]} {currentYear}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block sm:inline sm:ml-2">
              ({totalAgendamentosPeriodo} {totalAgendamentosPeriodo === 1 ? 'atendimento' : 'atendimentos'})
            </span>
          </div>
        </div>

        {/* Seletores Diretos: Mês, Ano e Filtro de Consultor */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor de Mês (Durante o ano) */}
          <select
            value={currentMonth}
            onChange={e => handleMudarMes(Number(e.target.value))}
            className="p-1.5 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
          >
            {mesesNomes.map((nome, idx) => (
              <option key={nome} value={idx}>{nome}</option>
            ))}
          </select>

          {/* Seletor de Ano */}
          <select
            value={currentYear}
            onChange={e => handleMudarAno(Number(e.target.value))}
            className="p-1.5 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
          >
            {anosDisponiveis.map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>

          {/* Filtro por Consultor */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedConsultorId}
              onChange={e => setSelectedConsultorId(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos os Consultores</option>
              {consultores.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Alternador de Modo Semana / Mês */}
          {onViewModeChange && (
            <div className="flex items-center bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeChange('semana')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'semana'
                    ? 'bg-[#004B8D] text-white dark:bg-[#A1D900] dark:text-[#0D1117]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Semana
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('mes')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  viewMode === 'mes'
                    ? 'bg-[#004B8D] text-white dark:bg-[#A1D900] dark:text-[#0D1117]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mês
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEGENDA OFICIAL DE 5 CORES DA GRADE CONEXO                                */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-medium">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Legenda de Status:</span>
        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Confirmado (Verde)</span>
        </span>
        <span className="inline-flex items-center gap-1 text-orange-700 dark:text-orange-300">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span>Pendente Confirmação (Laranja)</span>
        </span>
        <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Falta / &lt;24h (Vermelho)</span>
        </span>
        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Reagendado (Amarelo)</span>
        </span>
        <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-300">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Triagem / Diagnóstico (Azul)</span>
        </span>
      </div>

      {/* ========================================================================= */}
      {/* MODO 1: VISUALIZAÇÃO SEMANAL COM HORAS NA LATERAL (TIMELINE CALENDÁRIO)  */}
      {/* ========================================================================= */}
      {viewMode === 'semana' && (
        <div className="bg-white dark:bg-[#161B22] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {/* Subtítulo informativo */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1E252E] flex justify-between items-center text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Semana de {diasDaSemanaGrid[0].date.getDate()} de {mesesNomes[diasDaSemanaGrid[0].date.getMonth()]} a {diasDaSemanaGrid[6].date.getDate()} de {mesesNomes[diasDaSemanaGrid[6].date.getMonth()]} de {diasDaSemanaGrid[6].date.getFullYear()}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Grade horária com eixo lateral de horas • Turnos: 08h-12h e 13h-17h
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[780px]">
              {/* LINHA DE CABEÇALHO DOS DIAS DA SEMANA */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)] sm:grid-cols-[68px_repeat(7,1fr)] border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1E252E] sticky top-0 z-10">
                {/* Célula superior da coluna de horas lateral */}
                <div className="p-2 border-r border-slate-200/80 dark:border-slate-800/80 flex items-center justify-center text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                </div>

                {/* 7 Colunas dos Dias da Semana */}
                {diasDaSemanaGrid.map(diaInfo => {
                  const diaNomeSemana = diasSemanaAbrev[diaInfo.date.getDay() === 0 ? 6 : diaInfo.date.getDay() - 1];
                  const diaNum = diaInfo.date.getDate();
                  const mesAbrev = mesesNomes[diaInfo.date.getMonth()].slice(0, 3);
                  const agsDoDia = agendamentosPorData[diaInfo.dateStr] || [];

                  return (
                    <div
                      key={diaInfo.dateStr}
                      className={`p-2 text-center border-r border-slate-200/60 dark:border-slate-800/60 last:border-r-0 ${
                        diaInfo.isToday ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {diaNomeSemana}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <span
                          className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                            diaInfo.isToday
                              ? 'bg-[#004B8D] text-white dark:bg-[#A1D900] dark:text-[#0D1117]'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {diaNum}
                        </span>
                        <span className="text-[10px] text-slate-400">{mesAbrev}</span>
                        {agsDoDia.length > 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-[#004B8D] dark:text-blue-300 ml-0.5">
                            {agsDoDia.length}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CORPO DA GRADE: HORAS NA LATERAL E SLOTS DOS DIAS */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {HORAS_GRADE.map(hora => {
                  const slotHour = parseInt(hora.split(':')[0], 10);

                  return (
                    <div
                      key={hora}
                      className="grid grid-cols-[60px_repeat(7,1fr)] sm:grid-cols-[68px_repeat(7,1fr)] min-h-[58px]"
                    >
                      {/* COLUNA LATERAL DE HORAS (TIMELINE) */}
                      <div className="p-2 border-r border-slate-200/80 dark:border-slate-800/80 flex items-start justify-end pr-2 bg-slate-50/40 dark:bg-[#1E252E]/30 select-none">
                        <span className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500">
                          {hora}
                        </span>
                      </div>

                      {/* 7 CÉLULAS DOS DIAS NESTE HORÁRIO ESPECÍFICO */}
                      {diasDaSemanaGrid.map(diaInfo => {
                        const agsDoDia = agendamentosPorData[diaInfo.dateStr] || [];

                        // Agendamentos que INICIAM exatamente nesta hora
                        const agsIniciando = agsDoDia.filter(ag => getHourNumber(ag.horarioInicio) === slotHour);

                        // Agendamentos que estão EM ANDAMENTO (iniciaram antes e continuam nesta hora)
                        const agsEmAndamento = agsDoDia.filter(ag => {
                          const start = getHourNumber(ag.horarioInicio);
                          const end = getHourNumber(ag.horarioFim);
                          const endMin = getMinuteNumber(ag.horarioFim);
                          return start < slotHour && (end > slotHour || (end === slotHour && endMin > 0));
                        });

                        return (
                          <div
                            key={`${diaInfo.dateStr}-${hora}`}
                            className={`p-1.5 border-r border-slate-100 dark:border-slate-800/50 last:border-r-0 relative group transition-colors ${
                              diaInfo.isToday ? 'bg-blue-50/10 dark:bg-blue-950/10' : ''
                            } hover:bg-slate-50/50 dark:hover:bg-[#1E252E]/40`}
                          >
                            {/* Card de Atendimento Iniciando nesta hora */}
                            {agsIniciando.map(ag => {
                              const aluno = alunos.find(a => a.id === ag.alunoId);
                              const consultor = consultores.find(c => c.id === ag.consultorId);
                              const statusInfo = getStatusBadge(ag.status, ag.tipo);
                              const tipoInfo = getTipoSessaoBadge(ag.tipo);

                              return (
                                <button
                                  key={ag.id}
                                  type="button"
                                  onClick={() => setDetalheAgendamento(ag)}
                                  className={`w-full text-left p-1.5 rounded-lg border border-l-3 shadow-2xs transition-all hover:shadow-xs block cursor-pointer mb-1 ${tipoInfo.borderLeft} ${statusInfo.bg}`}
                                  title={`Clique para ver detalhes e gerenciar presença`}
                                >
                                  <div className="flex items-center justify-between gap-1 leading-none mb-1">
                                    <span className="font-mono text-[10px] font-bold">
                                      {ag.horarioInicio}-{ag.horarioFim}
                                    </span>
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusInfo.dot}`} />
                                  </div>
                                  <div className="font-semibold text-xs truncate leading-tight">
                                    {aluno?.nome?.split(' ')[0] || 'Aluno'}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                                    {consultor?.nome?.split(' ')[0]} • {ag.sala.split(' - ')[0]}
                                  </div>
                                </button>
                              );
                            })}

                            {/* Indicador sutil de sessão contínua de 2h iniciada anteriormente */}
                            {agsIniciando.length === 0 && agsEmAndamento.length > 0 && (
                              <div
                                onClick={() => setDetalheAgendamento(agsEmAndamento[0])}
                                className="h-full flex items-center px-1.5 py-1 text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-[#1E252E]/30 border-l-2 border-dashed border-indigo-400 dark:border-indigo-600 rounded-r cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1E252E]"
                                title="Sessão de 2h em andamento. Clique para ver detalhes."
                              >
                                <span className="truncate">↳ {alunos.find(a => a.id === agsEmAndamento[0].alunoId)?.nome?.split(' ')[0]} (até {agsEmAndamento[0].horarioFim})</span>
                              </div>
                            )}

                            {/* Botão sutil de Adicionar Agendamento neste horário se estiver vazio */}
                            {agsIniciando.length === 0 && agsEmAndamento.length === 0 && onNovoAgendamentoParaData && (
                              <button
                                type="button"
                                onClick={() => onNovoAgendamentoParaData(diaInfo.dateStr, hora)}
                                title={`Agendar para ${diaInfo.dateStr} às ${hora}`}
                                className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-slate-400 hover:text-[#004B8D] dark:hover:text-[#A1D900] transition-opacity cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 2: VISUALIZAÇÃO MENSAL COM PAINEL LATERAL DE HORAS DO DIA            */}
      {/* ========================================================================= */}
      {viewMode === 'mes' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Grade do Mês (3 colunas em tela grande) */}
          <div className="lg:col-span-3 bg-white dark:bg-[#161B22] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            {/* Cabeçalho dos Dias da Semana */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1E252E] text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
              {diasSemanaNomes.map((dia, idx) => (
                <div key={dia} className="py-2.5 px-1 truncate">
                  <span className="hidden sm:inline">{dia}</span>
                  <span className="sm:hidden">{diasSemanaAbrev[idx]}</span>
                </div>
              ))}
            </div>

            {/* Grade de Células de Dias */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800">
              {diasDoMesGrid.map((celula, idx) => {
                const diaNum = celula.date.getDate();
                const agsDoDia = agendamentosPorData[celula.dateStr] || [];
                const isWeekend = celula.date.getDay() === 0 || celula.date.getDay() === 6;
                const isSelected = celula.dateStr === diaSelecionadoStr;

                return (
                  <div
                    key={`${celula.dateStr}-${idx}`}
                    onClick={() => setDiaSelecionadoStr(celula.dateStr)}
                    className={`min-h-[96px] p-1.5 flex flex-col justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-inset ring-[#004B8D] dark:ring-[#A1D900] bg-blue-50/20 dark:bg-[#004B8D]/10'
                        : !celula.isCurrentMonth
                        ? 'bg-slate-50/50 dark:bg-[#0D1117]/50 text-slate-400 dark:text-slate-600'
                        : isWeekend
                        ? 'bg-slate-50/30 dark:bg-[#12161D]'
                        : 'bg-white dark:bg-[#161B22]'
                    } hover:bg-slate-50/80 dark:hover:bg-[#1E252E]/60`}
                  >
                    {/* Topo da Célula: Número do Dia e Contador */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-semibold inline-flex items-center justify-center w-5 h-5 rounded-full ${
                          celula.isToday
                            ? 'bg-[#004B8D] text-white dark:bg-[#A1D900] dark:text-[#0D1117] font-bold'
                            : celula.isCurrentMonth
                            ? 'text-slate-800 dark:text-slate-200'
                            : 'text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {diaNum}
                      </span>

                      {agsDoDia.length > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#004B8D] dark:text-blue-300">
                          {agsDoDia.length}
                        </span>
                      )}
                    </div>

                    {/* Pílulas Resumidas dos Atendimentos */}
                    <div className="space-y-1 flex-1 overflow-hidden">
                      {agsDoDia.slice(0, 2).map(ag => {
                        const aluno = alunos.find(a => a.id === ag.alunoId);
                        const statusInfo = getStatusBadge(ag.status, ag.tipo);

                        return (
                          <div
                            key={ag.id}
                            className={`p-1 rounded text-[10px] border leading-tight truncate ${statusInfo.bg}`}
                          >
                            <span className="font-mono font-bold mr-1">{ag.horarioInicio}</span>
                            <span className="truncate">{aluno?.nome?.split(' ')[0]}</span>
                          </div>
                        );
                      })}

                      {agsDoDia.length > 2 && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-1 font-medium">
                          +{agsDoDia.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PAINEL LATERAL: HORAS E DETALHES DO DIA SELECIONADO */}
          <div className="bg-white dark:bg-[#161B22] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  Horas do Dia Selecionado
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat']">
                  {diaSelecionadoStr.split('-').reverse().join('/')}
                </h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#004B8D] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {agendamentosDiaSelecionado.length} {agendamentosDiaSelecionado.length === 1 ? 'atend.' : 'atend.'}
              </span>
            </div>

            {/* Linha do Tempo Lateral de Horas */}
            <div className="mt-3 space-y-2 flex-1 overflow-y-auto max-h-[460px] pr-1">
              {HORAS_GRADE.map(hora => {
                const slotHour = parseInt(hora.split(':')[0], 10);
                const agsNestaHora = agendamentosDiaSelecionado.filter(
                  ag => getHourNumber(ag.horarioInicio) === slotHour
                );

                return (
                  <div key={hora} className="flex items-start gap-2 text-xs">
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 w-12 shrink-0 pt-0.5">
                      {hora}
                    </span>

                    <div className="flex-1">
                      {agsNestaHora.length > 0 ? (
                        agsNestaHora.map(ag => {
                          const aluno = alunos.find(a => a.id === ag.alunoId);
                          const consultor = consultores.find(c => c.id === ag.consultorId);
                          const statusInfo = getStatusBadge(ag.status, ag.tipo);
                          const tipoInfo = getTipoSessaoBadge(ag.tipo);

                          return (
                            <button
                              key={ag.id}
                              type="button"
                              onClick={() => setDetalheAgendamento(ag)}
                              className={`w-full text-left p-2 rounded-lg border border-l-3 transition-all hover:shadow-xs cursor-pointer mb-1 ${tipoInfo.borderLeft} ${statusInfo.bg}`}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-mono text-[10px] font-bold">
                                  {ag.horarioInicio} - {ag.horarioFim}
                                </span>
                                <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${statusInfo.bg}`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              <div className="font-semibold text-xs truncate">
                                {aluno?.nome || 'Aluno'}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {consultor?.nome?.split(' ')[0]} • {ag.sala.split(' - ')[0]}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div
                          onClick={() => onNovoAgendamentoParaData && onNovoAgendamentoParaData(diaSelecionadoStr, hora)}
                          className="h-7 border border-dashed border-slate-200 dark:border-slate-800 rounded-md flex items-center justify-between px-2 text-[10px] text-slate-400 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                        >
                          <span>Horário disponível</span>
                          <Plus className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DETALHADO DO AGENDAMENTO (AO CLICAR EM QUALQUER SESSÃO)             */}
      {/* ========================================================================= */}
      {detalheAgendamento && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          {(() => {
            const ag = detalheAgendamento;
            const aluno = alunos.find(a => a.id === ag.alunoId);
            const consultor = consultores.find(c => c.id === ag.consultorId);
            const statusInfo = getStatusBadge(ag.status, ag.tipo);
            const tipoInfo = getTipoSessaoBadge(ag.tipo);
            const [anoStr, mesStr, diaStr] = ag.data.split('-');

            return (
              <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${tipoInfo.badge}`}>
                      {tipoInfo.label}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat'] mt-1">
                      {aluno?.nome || 'Empreendedor'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {aluno?.negocio || 'Negócio'} {aluno?.ramo ? `(${aluno.ramo})` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetalheAgendamento(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                {/* Informações de Data, Horário e Local */}
                <div className="space-y-2 text-xs bg-slate-50 dark:bg-[#0D1117] p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      Data:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {diaStr}/{mesStr}/{anoStr}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Horário:
                    </span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {ag.horarioInicio} às {ag.horarioFim}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Local / Sala:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {ag.sala}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Consultor(a):
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {consultor?.nome}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-slate-500 dark:text-slate-400">Status Atual:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Contato WhatsApp */}
                {aluno?.whatsapp && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161B22]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <div className="text-[10px] text-slate-400">WhatsApp</div>
                        <div className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">{aluno.whatsapp}</div>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/55${aluno.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 dark:text-[#A1D900] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Ações de Presença para a Recepção (Max) */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ações de Operação (Recepção)
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {ag.status !== 'confirmado' && ag.status !== 'realizado' && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarcarPresenca(ag.id, 'confirmado');
                          setDetalheAgendamento(null);
                        }}
                        className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#A1D900] border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirmar Presença</span>
                      </button>
                    )}

                    {ag.status !== 'realizado' && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarcarPresenca(ag.id, 'realizado');
                          setDetalheAgendamento(null);
                        }}
                        className="p-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Marcar Presente</span>
                      </button>
                    )}

                    {ag.status !== 'realizado' && ag.status !== 'cancelado_menos_24h' && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarcarPresenca(ag.id, 'cancelado_menos_24h');
                          setDetalheAgendamento(null);
                        }}
                        className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold hover:bg-amber-100 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Cancelou &lt;24h</span>
                      </button>
                    )}

                    {ag.status !== 'realizado' && ag.status !== 'falta_injustificada' && (
                      <button
                        type="button"
                        onClick={() => {
                          onMarcarPresenca(ag.id, 'falta_injustificada');
                          setDetalheAgendamento(null);
                        }}
                        className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Falta Injustificada</span>
                      </button>
                    )}

                    {ag.status !== 'realizado' && (
                      <button
                        type="button"
                        onClick={() => {
                          setDetalheAgendamento(null);
                          onReagendar(ag.id, ag.data);
                        }}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-200 flex items-center justify-center gap-1.5 cursor-pointer col-span-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reagendar Horário do Atendimento</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setDetalheAgendamento(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
