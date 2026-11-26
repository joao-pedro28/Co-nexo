import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, Award, Clock, TrendingUp, FileSpreadsheet,
  AlertTriangle, CheckCircle2, Users, Target, Calendar,
  MessageSquare, Briefcase, Activity, CheckCheck, Building2,
  Sparkles, Lock, Unlock, Plus, Trash2, CalendarDays
} from 'lucide-react';
import { BloqueioAgenda } from '../types';

export const RegisView: React.FC = () => {
  const { 
    alunos, agendamentos, diarios, duvidas, consultores, activeTab,
    atualizarStatusMei, bloqueios, adicionarBloqueioAgenda, removerBloqueioAgenda,
    getAlunosPassivos
  } = useApp();

  const [filtroFunil, setFiltroFunil] = useState<string>('todos');

  // Estados de Bloqueio de Agenda
  const [modalNovoBloqueio, setModalNovoBloqueio] = useState(false);
  const [bloqConsultorId, setBloqConsultorId] = useState<'todos' | string>('c_aline');
  const [bloqTipo, setBloqTipo] = useState<'ferias' | 'licenca' | 'feriado' | 'recesso' | 'manutencao'>('ferias');
  const [bloqMotivo, setBloqMotivo] = useState('');
  const [bloqDataInicio, setBloqDataInicio] = useState(() => new Date().toISOString().split('T')[0]);
  const [bloqDataFim, setBloqDataFim] = useState(() => new Date().toISOString().split('T')[0]);

  // Estado de Janela de Abertura Trimestral
  const [gradeAbertaAte, setGradeAbertaAte] = useState('31 de Janeiro de 2027');

  // Cálculos Estratégicos & Métricas Executivas da Gestão
  const totalAlunos = alunos.length;
  const totalMeisAbertos = alunos.filter(a => a.statusMei === 'MEI Aberto e Ativo' || a.statusPrograma === 'MEI Formalizado').length;
  const totalMeisEmProcesso = alunos.filter(a => a.statusMei === 'Em Análise / Documentação').length;
  const totalInformais = alunos.filter(a => a.statusMei === 'Informal / Sem CNPJ').length;
  const totalDesistentesMei = alunos.filter(a => a.statusMei === 'Desistência / Sem Interesse').length;
  const taxaConversaoMei = totalAlunos > 0 ? ((totalMeisAbertos / totalAlunos) * 100).toFixed(1) : '0.0';

  const agendamentosRealizados = agendamentos.filter(a => a.status === 'realizado');
  const totalHorasExecutadas = agendamentosRealizados.reduce((acc, curr) => {
    return acc + (curr.tipo === 'triagem' ? 1 : curr.tipo === 'diagnostico_1h' ? 1 : 2);
  }, 0);
  const mediaHorasPorAluno = totalAlunos > 0 ? (totalHorasExecutadas / totalAlunos).toFixed(1) : '0.0';

  const totalFaltasGerais = agendamentos.filter(a => a.status === 'falta_injustificada' || a.status === 'cancelado_menos_24h').length;
  const totalSessoesFinalizadas = agendamentosRealizados.length + totalFaltasGerais;
  const taxaNoShow = totalSessoesFinalizadas > 0 
    ? ((totalFaltasGerais / totalSessoesFinalizadas) * 100).toFixed(1)
    : '0.0';
  const taxaAssiduidade = (100 - Number(taxaNoShow)).toFixed(1);

  const alunosDesligados = alunos.filter(a => a.statusPrograma === 'Desligado');
  const totalDesligados = alunosDesligados.length;
  const totalAlunosAtivos = totalAlunos - totalDesligados;
  const taxaRetencao = totalAlunos > 0 ? ((totalAlunosAtivos / totalAlunos) * 100).toFixed(1) : '100.0';

  const alunosPassivos = getAlunosPassivos();
  const alunosRiscoPreventivo = alunos.filter(a => (a.totalFaltas === 1 || a.totalReagendamentos === 2) && a.statusPrograma !== 'Desligado');
  const filaAntiLimbo = alunos.filter(a => a.statusPrograma === 'Concluído' || a.dataFollowUp30d);

  const contagemFunil = {
    inscritos: alunos.filter(a => a.statusPrograma === 'Inscrito' || a.statusPrograma.includes('Agendada')).length,
    emTrilha: alunos.filter(a => a.statusPrograma.startsWith('Em Trilha')).length,
    concluidos: alunos.filter(a => a.statusPrograma === 'Concluído').length,
    meiAberto: totalMeisAbertos,
    desligados: totalDesligados
  };

  const handleCriarBloqueio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloqMotivo || !bloqDataInicio || !bloqDataFim) return;

    adicionarBloqueioAgenda({
      consultorId: bloqConsultorId,
      dataInicio: bloqDataInicio,
      dataFim: bloqDataFim,
      motivo: bloqMotivo,
      tipo: bloqTipo
    });

    setBloqMotivo('');
    setModalNovoBloqueio(false);
  };

  const handleAbrirProximoPeriodo = () => {
    setGradeAbertaAte('30 de Abril de 2027 (2º Trimestre)');
    alert('Grade de agendamento expandida com sucesso até 30 de Abril de 2027 para a Recepção (Max) e Consultoras!');
  };

  const exportarRelatorioCsv = () => {
    let csv = 'ID,Nome,WhatsApp,Negocio,Ramo,Turma_SIG,Status_SIG,Status_Programa,Status_MEI,Encontros,Faltas,Reagendamentos,Cadastro\n';
    alunos.forEach(a => {
      csv += `${a.id},"${a.nome}","${a.whatsapp}","${a.negocio}","${a.ramo}","${a.codigoTurmaSIG || ''}","${a.statusSincronizacaoSIG || ''}","${a.statusPrograma}","${a.statusMei}",${a.encontrosRealizados},${a.totalFaltas},${a.totalReagendamentos},${a.dataCadastro}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_gestao_conexo_saj_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-['Inter']">
      {/* Banner da Gestão Co.Nexo */}
      <div className="bg-[#004B8D] rounded-3xl p-6 sm:p-7 text-white shadow-lg border-b-4 border-[#A1D900] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#A1D900] text-xs font-bold uppercase tracking-wider mb-1 font-['Montserrat']">
            <span>Administrador de Gestão</span>
            <span>•</span>
            <span>Régis Santos (SENAC SAJ)</span>
          </div>
          <h2 className="text-2xl font-bold font-['Montserrat']">Painel Executivo & Governança da Grade</h2>
          <p className="text-blue-100/90 text-xs mt-1">
            Metas do programa, abertura de períodos, bloqueios de agenda das consultoras e monitoramento anti-limbo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportarRelatorioCsv}
            className="px-4 py-2.5 rounded-xl bg-[#A1D900] text-slate-900 font-bold text-xs hover:bg-[#8ec200] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-900" />
            <span>Exportar CSV Executivo</span>
          </button>
        </div>
      </div>

      {/* Cards de KPIs Executivos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500">Taxa de Assiduidade</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-['Montserrat']">
            {taxaAssiduidade}%
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            Meta: 85% • No-show: {taxaNoShow}%
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500">Conversão MEI</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#004B8D] dark:text-[#A1D900]">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-['Montserrat']">
            {taxaConversaoMei}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalMeisAbertos} MEIs ativos de {totalAlunos} alunos
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500">Horas de Mentoria</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-['Montserrat']">
            {totalHorasExecutadas}h
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Média: {mediaHorasPorAluno}h por empreendedor
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500">Taxa de Retenção</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-['Montserrat']">
            {taxaRetencao}%
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            {totalAlunosAtivos} ativos ({totalDesligados} desligados)
          </div>
        </div>
      </div>

      {/* ABA 1: DASHBOARD EXECUTIVO */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          {/* Gráfico do Funil e Distribuição de Ramos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat'] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#004B8D] dark:text-[#A1D900]" />
                  <span>Funil de Empreendedores na Trilha</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>1. Inscrições & Triagens ({contagemFunil.inscritos})</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#004B8D] h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>2. Em Mentoria Ativa ({contagemFunil.emTrilha})</span>
                    <span>{totalAlunos > 0 ? Math.round((contagemFunil.emTrilha / totalAlunos) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${totalAlunos > 0 ? (contagemFunil.emTrilha / totalAlunos) * 100 : 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>3. Concluídos 6 Encontros ({contagemFunil.concluidos})</span>
                    <span>{totalAlunos > 0 ? Math.round((contagemFunil.concluidos / totalAlunos) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalAlunos > 0 ? (contagemFunil.concluidos / totalAlunos) * 100 : 0}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span>4. Formalização MEI com CNPJ ({contagemFunil.meiAberto})</span>
                    <span>{taxaConversaoMei}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#A1D900] h-full rounded-full" style={{ width: `${taxaConversaoMei}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-['Montserrat'] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>Distribuição por Ramo em SAJ</span>
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                {alunos.slice(0, 4).map(aluno => (
                  <div key={aluno.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1E252E] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{aluno.negocio}</span>
                      <span className="text-[10px] text-slate-400">{aluno.ramo}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#004B8D] dark:text-[#A1D900] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
                      {aluno.statusPrograma}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: ABERTURA & BLOQUEIOS DE AGENDA */}
      {activeTab === 'calendario_abertura' && (
        <div className="space-y-6">
          {/* Card de Janela de Abertura Trimestral */}
          <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#004B8D] dark:text-[#A1D900] flex items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#004B8D] dark:text-[#A1D900] uppercase tracking-wider font-['Montserrat']">
                  Janela de Agendamento Oficial
                </span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Grade de Atendimentos Aberta até: <span className="text-[#004B8D] dark:text-[#A1D900]">{gradeAbertaAte}</span>
                </div>
                <div className="text-xs text-slate-500">
                  A Recepção (Max) só pode marcar sessões dentro do período autorizado pela Gestão.
                </div>
              </div>
            </div>

            <button
              onClick={handleAbrirProximoPeriodo}
              className="px-4 py-2.5 rounded-xl bg-[#004B8D] hover:bg-[#00386b] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Unlock className="w-4 h-4 text-[#A1D900]" />
              <span>Abrir Próximo Trimestre</span>
            </button>
          </div>

          {/* Gestão de Bloqueios de Agenda das Consultoras */}
          <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat'] flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-600" />
                  <span>Bloqueios de Agenda das Consultoras (Férias / Recesso / Feriados)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Períodos bloqueados impedem novos agendamentos e protegem a disponibilidade de Aline e Laiza.
                </p>
              </div>

              <button
                onClick={() => setModalNovoBloqueio(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Bloqueio</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase tracking-wider font-['Montserrat']">
                  <tr>
                    <th className="py-3 px-4">Consultora Afetada</th>
                    <th className="py-3 px-4">Tipo de Bloqueio</th>
                    <th className="py-3 px-4">Motivo / Descrição</th>
                    <th className="py-3 px-4">Período (Início a Fim)</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {bloqueios.map(bloq => {
                    const consultor = consultores.find(c => c.id === bloq.consultorId);
                    const nomeConsultor = bloq.consultorId === 'todos' ? 'Todas as Consultoras' : consultor?.nome || 'Aline Silva';

                    return (
                      <tr key={bloq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          {nomeConsultor}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            bloq.tipo === 'ferias' ? 'bg-amber-100 text-amber-800' :
                            bloq.tipo === 'recesso' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {bloq.tipo}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium">{bloq.motivo}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {bloq.dataInicio} a {bloq.dataFim}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => removerBloqueioAgenda(bloq.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                            title="Remover Bloqueio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: FUNIL DO PROGRAMA */}
      {activeTab === 'funil' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
              Funil de Evolução dos Participantes
            </h3>
            <p className="text-xs text-slate-500">
              Acompanhamento de etapas: da triagem inicial à formalização MEI.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            <div className="bg-slate-50 dark:bg-[#1E252E] p-3.5 rounded-xl border border-slate-200 text-center">
              <div className="text-xs font-semibold text-slate-500">1. Triagem & Inscrição</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Montserrat']">{contagemFunil.inscritos}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Diagnóstico inicial</div>
            </div>

            <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 text-center">
              <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">2. Em Mentoria</div>
              <div className="text-2xl font-bold text-amber-900 dark:text-amber-200 mt-1 font-['Montserrat']">{contagemFunil.emTrilha}</div>
              <div className="text-[10px] text-amber-700 mt-0.5">Trilha quinzenal</div>
            </div>

            <div className="bg-blue-50/70 dark:bg-blue-950/30 p-3.5 rounded-xl border border-blue-200 text-center">
              <div className="text-xs font-semibold text-blue-800 dark:text-blue-300">3. Concluído (E6)</div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1 font-['Montserrat']">{contagemFunil.concluidos}</div>
              <div className="text-[10px] text-blue-700 mt-0.5">6 sessões cumpridas</div>
            </div>

            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 text-center">
              <div className="text-xs font-semibold text-emerald-800 dark:text-[#A1D900]">4. MEI Formalizado</div>
              <div className="text-2xl font-bold text-emerald-900 dark:text-white mt-1 font-['Montserrat']">{contagemFunil.meiAberto}</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">CNPJ ativo</div>
            </div>

            <div className="bg-rose-50/70 dark:bg-rose-950/30 p-3.5 rounded-xl border border-rose-200 text-center col-span-2 sm:col-span-1">
              <div className="text-xs font-semibold text-rose-800 dark:text-rose-300">5. Desligados</div>
              <div className="text-2xl font-bold text-rose-900 dark:text-rose-200 mt-1 font-['Montserrat']">{contagemFunil.desligados}</div>
              <div className="text-[10px] text-rose-700 mt-0.5">Limite de faltas</div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: RADAR DE RISCO & FILA ANTI-LIMBO */}
      {activeTab === 'anti_limbo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar de Passivos (>15 dias) e Risco */}
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-amber-200 dark:border-amber-900/60 p-6 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
                  Alunos Passivos (&gt;15 dias)
                </h3>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                {alunosPassivos.length} no limbo
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Participantes sem agendamento futuro que correm risco de evasão se não forem contatados por Max.
            </p>

            <div className="space-y-2 pt-1">
              {alunosPassivos.map(aluno => (
                <div key={aluno.id} className="p-3 bg-slate-50 dark:bg-[#1E252E] rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{aluno.nome} ({aluno.negocio})</div>
                    <div className="text-slate-500 mt-0.5">WhatsApp: {aluno.whatsapp} • {aluno.statusPrograma}</div>
                  </div>
                  <span className="bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-md text-[11px]">
                    Necessita Resgate
                  </span>
                </div>
              ))}
              {alunosPassivos.length === 0 && (
                <div className="text-xs text-slate-400 py-4 text-center">Nenhum aluno em estado passivo no momento!</div>
              )}
            </div>
          </div>

          {/* Fila Anti-Limbo (Follow-up 30 e 60 dias) */}
          <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
                  Follow-up 30/60 dias (Pós-Trilha)
                </h3>
              </div>
              <span className="text-xs font-bold text-[#004B8D] dark:text-[#A1D900] bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 rounded-full">
                {filaAntiLimbo.length} concluintes
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Acompanhamento de formalização MEI e saúde do negócio após os 6 encontros.
            </p>

            <div className="space-y-2 pt-1">
              {filaAntiLimbo.map(aluno => (
                <div key={aluno.id} className="p-3 bg-slate-50 dark:bg-[#1E252E] rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{aluno.nome}</div>
                    <div className="text-slate-500">Status: <strong>{aluno.statusMei}</strong></div>
                  </div>

                  {aluno.statusMei !== 'MEI Aberto e Ativo' ? (
                    <button
                      onClick={() => atualizarStatusMei(aluno.id, 'MEI Aberto e Ativo')}
                      className="px-3 py-1 rounded-lg bg-[#A1D900] text-slate-900 font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Formalizou MEI
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      MEI Ativo
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO BLOQUEIO DE AGENDA */}
      {modalNovoBloqueio && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161B22] rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat'] flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                Cadastrar Bloqueio de Agenda
              </h3>
              <button onClick={() => setModalNovoBloqueio(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCriarBloqueio} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Consultora</label>
                <select
                  value={bloqConsultorId}
                  onChange={(e) => setBloqConsultorId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="c_aline">Aline Silva (Manhã / Tarde)</option>
                  <option value="c_laiza">Laiza (Noite)</option>
                  <option value="todos">Todas as Consultoras (Recesso Institucional)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tipo de Bloqueio</label>
                <select
                  value={bloqTipo}
                  onChange={(e) => setBloqTipo(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="ferias">Férias</option>
                  <option value="recesso">Recesso Institucional</option>
                  <option value="licenca">Licença / Afastamento</option>
                  <option value="feriado">Feriado Municipal / Estadual</option>
                  <option value="manutencao">Capacitação / Reunião Pedagógica</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Motivo / Descrição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Férias regulamentares 2º semestre"
                  value={bloqMotivo}
                  onChange={(e) => setBloqMotivo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Data Início</label>
                  <input
                    type="date"
                    required
                    value={bloqDataInicio}
                    onChange={(e) => setBloqDataInicio(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Data Fim</label>
                  <input
                    type="date"
                    required
                    value={bloqDataFim}
                    onChange={(e) => setBloqDataFim(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNovoBloqueio(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
                >
                  Confirmar Bloqueio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
