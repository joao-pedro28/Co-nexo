import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, Calendar, Clock, PlusCircle, CheckCircle2, 
  MessageSquare, FileText, Send, User, ChevronRight, 
  HelpCircle, Sparkles, AlertCircle, FileUp, Download, Eye,
  Check, X, Award, TrendingUp, DollarSign, Briefcase
} from 'lucide-react';
import { StatusMEI, TipoSessao } from '../types';
import { formatarDataAgenda } from '../utils/dateUtils';

export const AlineView: React.FC = () => {
  const { 
    alunos, agendamentos, diarios, duvidas, materiais,
    selectedAlunoId, setSelectedAlunoId,
    salvarDiarioDeBordo, responderDuvida, adicionarMaterial,
    marcarPresenca, anexarPdfDiagnostico, consultoraAtiva, setConsultoraAtiva,
    activeTab, setActiveTab
  } = useApp();

  // Formulário de Nova Entrada no Diário de Bordo
  const [novoEncontroNum, setNovoEncontroNum] = useState<number>(1);
  const [novoDiagnostico, setNovoDiagnostico] = useState('');
  const [novasOrientacoes, setNovasOrientacoes] = useState('');
  const [novaTarefa, setNovaTarefa] = useState('');
  const [statusTarefaAnt, setStatusTarefaAnt] = useState<'cumprida' | 'em_andamento' | 'pendente'>('cumprida');
  const [novoStatusMei, setNovoStatusMei] = useState<StatusMEI>('Informal / Sem CNPJ');
  const [novosPassos, setNovosPassos] = useState('');

  // Métricas de Saída (Encontro 6)
  const [fatInicial, setFatInicial] = useState('R$ 2.400,00 / mês');
  const [fatFinal, setFatFinal] = useState('R$ 4.850,00 / mês');
  const [meiFinal, setMeiFinal] = useState(true);
  const [lucroFinal, setLucroFinal] = useState('Margem passou de 12% para 34%');

  // Modal / Upload de PDF do Diagnóstico
  const [modalUploadPdf, setModalUploadPdf] = useState(false);
  const [pdfNome, setPdfNome] = useState('Diagnostico_Inicial_Arthur_Santana_Conexo.pdf');

  // Formulário de Entrevista de Triagem (45 min)
  const [triagemRamo, setTriagemRamo] = useState('Alimentação / Gastronomia');
  const [triagemTempoNegocio, setTriagemTempoNegocio] = useState('1 ano e meio');
  const [triagemContasSeparadas, setTriagemContasSeparadas] = useState('Não (mistura tudo na mesma conta pessoal)');
  const [triagemMaiorDor, setTriagemMaiorDor] = useState('Não sabe quanto cobrar e não vê a cor do dinheiro');
  const [triagemExpectativa, setTriagemExpectativa] = useState('Organizar a marmitaria para poder tirar um pró-labore fixo e abrir o MEI');
  const [triagemEncaminhamento, setTriagemEncaminhamento] = useState('Apto para Trilha de 6 Encontros Co.Nexo');

  // Resposta de Dúvida
  const [respostaTexto, setRespostaTexto] = useState<{ [key: string]: string }>({});

  // Novo Material
  const [novoMatTitulo, setNovoMatTitulo] = useState('');
  const [novoMatCat, setNovoMatCat] = useState<'Gestão Financeira' | 'Vendas & Clientes' | 'Formalização MEI' | 'Controles Diários'>('Gestão Financeira');
  const [novoMatDesc, setNovoMatDesc] = useState('');
  const [novoMatLink, setNovoMatLink] = useState('');
  const [showModalMaterial, setShowModalMaterial] = useState(false);

  const alunoAtual = alunos.find(a => a.id === selectedAlunoId) || alunos[0] || null;
  const diariosDoAluno = alunoAtual ? diarios.filter(d => d.alunoId === alunoAtual.id) : [];

  const consultorIdAtivo = consultoraAtiva;
  const meusAgendamentos = agendamentos.filter(a => a.consultorId === consultorIdAtivo);
  const duvidasPendentes = duvidas.filter(d => d.consultorId === consultorIdAtivo || !d.resposta);

  const handleSalvarDiario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoAtual) {
      alert('Por favor, selecione um empreendedor.');
      return;
    }
    if (!novoDiagnostico || !novaTarefa) {
      alert('Por favor, preencha o diagnóstico e as tarefas combinadas.');
      return;
    }

    salvarDiarioDeBordo({
      alunoId: alunoAtual.id,
      consultorId: consultorIdAtivo,
      agendamentoId: `ag_mentoria_${Date.now()}`,
      numeroEncontro: novoEncontroNum,
      data: new Date().toISOString().split('T')[0],
      diagnosticoResumo: novoDiagnostico,
      orientacoesPrestadas: novasOrientacoes,
      tarefaProximoEncontro: novaTarefa,
      tarefaStatusAnterior: statusTarefaAnt,
      statusFormalizacaoMei: novoStatusMei,
      proximosPassos: novosPassos,
      metricasSaida: novoEncontroNum === 6 ? {
        faturamentoInicial: fatInicial,
        faturamentoFinal: fatFinal,
        meiFormalizado: meiFinal,
        lucroOrganizado: lucroFinal
      } : undefined
    });

    setNovoDiagnostico('');
    setNovasOrientacoes('');
    setNovaTarefa('');
    setNovosPassos('');
  };

  const handleUploadPdfDiagnostico = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoAtual) return;

    anexarPdfDiagnostico(alunoAtual.id, {
      nome: pdfNome,
      url: `/uploads/diagnosticos/${pdfNome}`,
      dataUpload: new Date().toLocaleDateString('pt-BR'),
      tamanho: '2.4 MB'
    });

    setModalUploadPdf(false);
  };

  const handleSalvarTriagem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoAtual) return;

    salvarDiarioDeBordo({
      alunoId: alunoAtual.id,
      consultorId: consultorIdAtivo,
      agendamentoId: `ag_triagem_${Date.now()}`,
      numeroEncontro: 0,
      data: new Date().toISOString().split('T')[0],
      diagnosticoResumo: `[ENTREVISTA DE TRIAGEM] Ramo: ${triagemRamo} | Tempo: ${triagemTempoNegocio} | Contas: ${triagemContasSeparadas} | Maior Dor: ${triagemMaiorDor} | Expectativa: ${triagemExpectativa}`,
      orientacoesPrestadas: `Encaminhamento: ${triagemEncaminhamento}`,
      tarefaProximoEncontro: 'Separar extratos e comprovantes de compras para a primeira sessão de mentoria (E1).',
      tarefaStatusAnterior: 'cumprida',
      statusFormalizacaoMei: 'Informal / Sem CNPJ',
      proximosPassos: 'Agendar bloco de 6 encontros quinzenais na recepção com Max.'
    });

    alert('Entrevista de triagem salva com sucesso! Registro integrado ao prontuário.');
    setActiveTab('prontuario');
  };

  const handleSalvarMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoMatTitulo || !novoMatLink) return;
    adicionarMaterial({
      titulo: novoMatTitulo,
      categoria: novoMatCat,
      descricao: novoMatDesc,
      linkOuTexto: novoMatLink,
      adicionadoPor: consultoraAtiva === 'c_aline' ? 'Aline Silva' : 'Laiza'
    });
    setShowModalMaterial(false);
    setNovoMatTitulo('');
    setNovoMatDesc('');
    setNovoMatLink('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-['Inter']">
      {/* Banner de Identificação da Consultora */}
      <div className="bg-[#004B8D] rounded-3xl p-6 sm:p-7 text-white shadow-lg border-b-4 border-[#A1D900] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#A1D900] text-xs font-bold uppercase tracking-wider mb-1 font-['Montserrat']">
            <span>Consultoria de Negócios</span>
            <span>•</span>
            <span>SENAC Santo Antônio de Jesus (SAJ)</span>
          </div>
          <h2 className="text-2xl font-bold font-['Montserrat']">
            Prontuário Único & Acompanhamento da Trilha
          </h2>
          <p className="text-blue-100/90 text-xs mt-1">
            Triagem inicial, anexo de PDF do diagnóstico, assiduidade em 1 clique e métricas de fechamento (E6).
          </p>
        </div>

        {/* Seletor de Consultora Ativa (Aline vs Laiza) */}
        <div className="bg-[#00386b] border border-blue-400/30 rounded-2xl p-2.5 flex items-center gap-2">
          <span className="text-xs text-blue-200 font-semibold px-2">Consultora:</span>
          <button
            onClick={() => setConsultoraAtiva('c_aline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              consultoraAtiva === 'c_aline'
                ? 'bg-[#A1D900] text-slate-900 shadow-sm'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Aline Silva (Dia)
          </button>
          <button
            onClick={() => setConsultoraAtiva('c_laiza')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              consultoraAtiva === 'c_laiza'
                ? 'bg-[#A1D900] text-slate-900 shadow-sm'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Laiza (Noite)
          </button>
        </div>
      </div>

      {/* Seletor de Empreendedor */}
      <div className="bg-white dark:bg-[#161B22] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#004B8D] dark:text-[#A1D900] flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-['Montserrat']">
              Empreendedor em Atendimento
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Prontuário, anexos em PDF, evolução financeira e assiduidade
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={alunoAtual?.id || ''}
            onChange={(e) => setSelectedAlunoId(e.target.value)}
            className="w-full sm:w-80 bg-slate-50 dark:bg-[#0D1117] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#004B8D] dark:focus:ring-[#A1D900] cursor-pointer"
          >
            {alunos.map(aluno => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome} — {aluno.negocio} ({aluno.statusPrograma})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ABA 1: PRONTUÁRIO & DIAGNÓSTICO (COM ANEXO EM PDF) */}
      {activeTab === 'prontuario' && (
        <div className="space-y-6">
          {alunoAtual ? (
            <>
              {/* Header do Aluno Selecionado com Status SIG e MEI */}
              <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Montserrat']">{alunoAtual.nome}</h3>
                    <span className="bg-slate-100 dark:bg-[#1E252E] text-slate-700 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-md font-mono border border-slate-200 dark:border-slate-700">
                      {alunoAtual.ramo}
                    </span>
                    <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs px-2.5 py-0.5 rounded-md font-bold">
                      SIG: {alunoAtual.codigoTurmaSIG || 'Sem Turma'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {alunoAtual.negocio} • WhatsApp: {alunoAtual.whatsapp} • Encontros Realizados: {alunoAtual.encontrosRealizados} de 6
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#A1D900] border border-emerald-200 dark:border-emerald-800">
                    MEI: {alunoAtual.statusMei}
                  </span>
                </div>
              </div>

              {/* CARD DE DIAGNÓSTICO EM PDF (SUBSTITUI FORMULÁRIO LONGO) */}
              <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-[#1E252E] dark:to-[#161B22] p-5 rounded-2xl border border-blue-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#004B8D] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-6 h-6 text-[#A1D900]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#004B8D] dark:text-[#A1D900] uppercase tracking-wider font-['Montserrat']">
                      Diagnóstico Inicial do Negócio (PDF)
                    </div>
                    {alunoAtual.diagnosticoPdf ? (
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {alunoAtual.diagnosticoPdf.nome}
                        </div>
                        <div className="text-xs text-slate-500">
                          Anexado em {alunoAtual.diagnosticoPdf.dataUpload} • {alunoAtual.diagnosticoPdf.tamanho || '2.4 MB'} • Disponível para o mentorado
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          Nenhum PDF anexado para este empreendedor.
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Gere o diagnóstico na sua ferramenta de preferência e anexe o arquivo aqui.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {alunoAtual.diagnosticoPdf && (
                    <button
                      onClick={() => alert(`Abrindo visualização do documento: ${alunoAtual.diagnosticoPdf?.nome}`)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-[#004B8D]" />
                      <span>Visualizar</span>
                    </button>
                  )}
                  <button
                    onClick={() => setModalUploadPdf(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#004B8D] hover:bg-[#00386b] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <FileUp className="w-4 h-4 text-[#A1D900]" />
                    <span>{alunoAtual.diagnosticoPdf ? 'Substituir PDF' : 'Anexar PDF'}</span>
                  </button>
                </div>
              </div>

              {/* Linha do Tempo de Entradas do Prontuário */}
              <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 font-['Montserrat']">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-[#A1D900]" />
                    <span>Linha do Tempo de Sessões & Evolução na Trilha</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">
                    {diariosDoAluno.length} registros no prontuário
                  </span>
                </div>

                {diariosDoAluno.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Nenhum registro para este empreendedor ainda. Realize a entrevista de triagem ou registre o 1º encontro abaixo!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {diariosDoAluno.map(diario => (
                      <div key={diario.id} className="border-l-4 border-emerald-500 bg-slate-50 dark:bg-[#1E252E] p-4 rounded-r-xl space-y-2.5 border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 font-['Montserrat']">
                            {diario.numeroEncontro === 0 ? 'Entrevista de Triagem (45m)' : `Encontro ${diario.numeroEncontro} de 6 da Trilha`}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-mono">{diario.data}</span>
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Diagnóstico & O que foi trabalhado:</div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{diario.diagnosticoResumo}</p>
                        </div>

                        {diario.orientacoesPrestadas && (
                          <div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Orientações Transmitidas:</div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{diario.orientacoesPrestadas}</p>
                          </div>
                        )}

                        {diario.metricasSaida && (
                          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl space-y-1 text-xs">
                            <div className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-purple-600" />
                              <span>Métricas Finais de Fechamento da Trilha (E6):</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-purple-800 dark:text-purple-200 pt-1">
                              <div><strong>Faturamento Inicial:</strong> {diario.metricasSaida.faturamentoInicial}</div>
                              <div><strong>Faturamento Final:</strong> {diario.metricasSaida.faturamentoFinal}</div>
                              <div><strong>MEI Formalizado:</strong> {diario.metricasSaida.meiFormalizado ? 'Sim 🎉' : 'Em andamento'}</div>
                              <div><strong>Resultado / Lucro:</strong> {diario.metricasSaida.lucroOrganizado}</div>
                            </div>
                          </div>
                        )}

                        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
                          <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span>Tarefas Combinadas com o Empreendedor:</span>
                          </div>
                          <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 font-medium">{diario.tarefaProximoEncontro}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulário de Registro de Nova Sessão no Prontuário */}
              <div className="bg-white dark:bg-[#161B22] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 font-['Montserrat']">
                    <PlusCircle className="w-5 h-5 text-emerald-600 dark:text-[#A1D900]" />
                    <span>Registrar Sessão no Prontuário</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Preenchimento rápido do prontuário durante ou logo após a mentoria presencial.
                  </p>
                </div>

                <form onSubmit={handleSalvarDiario} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Número do Encontro</label>
                      <select
                        value={novoEncontroNum}
                        onChange={e => setNovoEncontroNum(Number(e.target.value))}
                        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                      >
                        <option value={1}>Encontro 1 de 6 (Diagnóstico e Plano)</option>
                        <option value={2}>Encontro 2 de 6 (Precificação e Custos)</option>
                        <option value={3}>Encontro 3 de 6 (Vendas e Clientes)</option>
                        <option value={4}>Encontro 4 de 6 (Gestão Financeira e Caixa)</option>
                        <option value={5}>Encontro 5 de 6 (Formalização MEI)</option>
                        <option value={6}>Encontro 6 de 6 (Fechamento e Resultados) 🏆</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status da Tarefa Anterior</label>
                      <select
                        value={statusTarefaAnt}
                        onChange={e => setStatusTarefaAnt(e.target.value as any)}
                        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                      >
                        <option value="cumprida">✅ Cumprida com Sucesso</option>
                        <option value="em_andamento">⏳ Em Andamento / Parcial</option>
                        <option value="pendente">❌ Não Conseguiu Fazer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status Formalização MEI</label>
                      <select
                        value={novoStatusMei}
                        onChange={e => setNovoStatusMei(e.target.value as StatusMEI)}
                        className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                      >
                        <option value="Informal / Sem CNPJ">Informal / Sem CNPJ</option>
                        <option value="Em Análise / Documentação">Em Análise / Documentação</option>
                        <option value="MEI Aberto e Ativo">MEI Aberto e Ativo 🎉</option>
                        <option value="Desistência / Sem Interesse">Sem Interesse no Momento</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Diagnóstico & O que foi trabalhado hoje</label>
                    <textarea
                      rows={3}
                      value={novoDiagnostico}
                      onChange={e => setNovoDiagnostico(e.target.value)}
                      placeholder="Ex: Trabalhamos a separação da conta bancária física da jurídica e recalculamos o custo unitário da quentinha..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Orientações Transmitidas</label>
                    <input
                      type="text"
                      value={novasOrientacoes}
                      onChange={e => setNovasOrientacoes(e.target.value)}
                      placeholder="Ex: Ajustar o valor da marmita grande de R$ 18 para R$ 22 e registrar todas as saídas no caderno."
                      className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  {/* Campos Especiais se for Encontro 6 (Fechamento) */}
                  {novoEncontroNum === 6 && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-3">
                      <div className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span>Métricas de Saída & Fechamento da Trilha (Encontro 6)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-purple-900 dark:text-purple-300 mb-1">Faturamento Inicial</label>
                          <input
                            type="text"
                            value={fatInicial}
                            onChange={(e) => setFatInicial(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-[#0D1117] border border-purple-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-purple-900 dark:text-purple-300 mb-1">Faturamento Final</label>
                          <input
                            type="text"
                            value={fatFinal}
                            onChange={(e) => setFatFinal(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-[#0D1117] border border-purple-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-purple-900 dark:text-purple-300 mb-1">Situação MEI</label>
                          <select
                            value={meiFinal ? 'sim' : 'nao'}
                            onChange={(e) => setMeiFinal(e.target.value === 'sim')}
                            className="w-full p-2 bg-white dark:bg-[#0D1117] border border-purple-200 rounded-lg"
                          >
                            <option value="sim">MEI Aberto e Ativo com CNPJ 🎉</option>
                            <option value="nao">Não formalizado ainda</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-purple-900 dark:text-purple-300 mb-1">Evolução do Lucro / Margem</label>
                          <input
                            type="text"
                            value={lucroFinal}
                            onChange={(e) => setLucroFinal(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-[#0D1117] border border-purple-200 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-xl space-y-1">
                    <label className="block font-bold text-emerald-900 dark:text-[#A1D900]">
                      Tarefas para o Empreendedor Levar Feitas (Sincronizado com Arthur)
                    </label>
                    <textarea
                      rows={2}
                      value={novaTarefa}
                      onChange={e => setNovaTarefa(e.target.value)}
                      placeholder="Ex: 1. Aplicar a nova tabela de preços. 2. Preencher a folha de caixa com as vendas do fim de semana."
                      className="w-full p-2 bg-white dark:bg-[#0D1117] border border-emerald-300 dark:border-emerald-700 rounded-xl"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-sm"
                    >
                      Salvar Registro no Prontuário
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Selecione um empreendedor no menu acima para abrir o prontuário.
            </div>
          )}
        </div>
      )}

      {/* ABA 2: ENTREVISTA DE TRIAGEM (45 MIN) */}
      {activeTab === 'triagem' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat'] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#004B8D] dark:text-[#A1D900]" />
              <span>Entrevista Inicial de Triagem (45 minutos)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Coleta de dados da realidade do negócio antes do início da trilha quinzenal.
            </p>
          </div>

          <form onSubmit={handleSalvarTriagem} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ramo de Atividade</label>
                <input
                  type="text"
                  value={triagemRamo}
                  onChange={(e) => setTriagemRamo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tempo de Existência do Negócio</label>
                <input
                  type="text"
                  value={triagemTempoNegocio}
                  onChange={(e) => setTriagemTempoNegocio(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Separação de Contas (Pessoa Física vs Jurídica)</label>
              <input
                type="text"
                value={triagemContasSeparadas}
                onChange={(e) => setTriagemContasSeparadas(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Qual a Maior Dificuldade / Dor Atual do Empreendedor?</label>
              <textarea
                rows={2}
                value={triagemMaiorDor}
                onChange={(e) => setTriagemMaiorDor(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Expectativa Principal com o Programa Co.Nexo</label>
              <textarea
                rows={2}
                value={triagemExpectativa}
                onChange={(e) => setTriagemExpectativa(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Parecer & Encaminhamento</label>
              <select
                value={triagemEncaminhamento}
                onChange={(e) => setTriagemEncaminhamento(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-[#004B8D] dark:text-[#A1D900]"
              >
                <option value="Apto para Trilha de 6 Encontros Co.Nexo">Apto para Trilha de 6 Encontros Co.Nexo</option>
                <option value="Encaminhamento para Balcão SEBRAE">Encaminhamento para Balcão SEBRAE</option>
                <option value="Encaminhamento para Cursos Técnicos SENAC">Encaminhamento para Cursos Técnicos SENAC</option>
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#004B8D] hover:bg-[#00386b] text-white font-bold cursor-pointer shadow-sm"
              >
                Concluir Triagem e Enviar para Recepção
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABA 3: MINHA GRADE */}
      {activeTab === 'grade' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
                Minha Grade de Atendimentos — {consultoraAtiva === 'c_aline' ? 'Aline Silva (Tarde)' : 'Laiza (Noite)'}
              </h3>
              <p className="text-xs text-slate-500">Controle presencial em sala com marcação de presença e faltas em 1 clique</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold uppercase tracking-wider font-['Montserrat']">
                <tr>
                  <th className="py-3 px-4">Data & Horário</th>
                  <th className="py-3 px-4">Empreendedor</th>
                  <th className="py-3 px-4">Sessão</th>
                  <th className="py-3 px-4">Sala</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Chamada em 1 Clique</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {meusAgendamentos.map(ag => {
                  const aluno = alunos.find(a => a.id === ag.alunoId);
                  const infoData = formatarDataAgenda(ag.data);

                  return (
                    <tr key={ag.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{infoData.dia} de {infoData.mesAbrev}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{ag.horarioInicio} - {ag.horarioFim}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{aluno?.nome}</div>
                        <div className="text-[11px] text-slate-400">{aluno?.negocio}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {ag.tipo === 'triagem' ? 'Triagem' : ag.tipo === 'diagnostico_1h' ? 'Diagnóstico' : 'Mentoria 2h'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{ag.sala}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ag.status === 'realizado' ? 'bg-slate-100 text-slate-700' :
                          ag.status === 'confirmado' ? 'bg-emerald-100 text-emerald-800' :
                          ag.status === 'falta_injustificada' ? 'bg-rose-100 text-rose-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {ag.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {ag.status !== 'realizado' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => marcarPresenca(ag.id, 'realizado')}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                            >
                              Presente
                            </button>
                            <button
                              onClick={() => marcarPresenca(ag.id, 'falta_injustificada')}
                              className="px-2.5 py-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold cursor-pointer"
                            >
                              Falta
                            </button>
                          </div>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-[11px]">Concluído</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 4: DÚVIDAS */}
      {activeTab === 'duvidas' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">
              Canal Direto de Dúvidas (Fim do Silêncio de 15 Dias)
            </h3>
            <p className="text-xs text-slate-500">
              Responda perguntas e oriente tarefas intermediárias entre os encontros quinzenais.
            </p>
          </div>

          <div className="space-y-3">
            {duvidasPendentes.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Nenhuma dúvida pendente no momento!
              </div>
            ) : (
              duvidasPendentes.map(d => {
                const aluno = alunos.find(a => a.id === d.alunoId);
                return (
                  <div key={d.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1E252E] space-y-2.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white">{aluno?.nome} ({aluno?.negocio})</span>
                      <span className="text-slate-400">{d.criadaEm}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      "{d.pergunta}"
                    </div>

                    {d.resposta ? (
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <strong>Sua Resposta:</strong> {d.resposta}
                      </div>
                    ) : (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Digite sua orientação aqui..."
                          value={respostaTexto[d.id] || ''}
                          onChange={(e) => setRespostaTexto(prev => ({ ...prev, [d.id]: e.target.value }))}
                          className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1117]"
                        />
                        <button
                          onClick={() => {
                            if (!respostaTexto[d.id]) return;
                            responderDuvida(d.id, respostaTexto[d.id]);
                            setRespostaTexto(prev => ({ ...prev, [d.id]: '' }));
                          }}
                          className="px-4 py-2 rounded-xl bg-[#004B8D] text-white font-bold cursor-pointer"
                        >
                          Responder
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ABA 5: MATERIAIS DE APOIO */}
      {activeTab === 'materiais' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Materiais e Ferramentas Práticas de Apoio</h3>
              <p className="text-xs text-slate-500">Publicação de modelos, modelos de precificação e guias para os mentorados</p>
            </div>
            <button
              onClick={() => setShowModalMaterial(true)}
              className="px-4 py-2 rounded-xl bg-[#004B8D] text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              + Publicar Material
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materiais.map(mat => (
              <div key={mat.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#1E252E] space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{mat.titulo}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#004B8D]">{mat.categoria}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{mat.descricao}</p>
                <div className="pt-2">
                  <a
                    href={mat.linkOuTexto}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#004B8D] dark:text-[#A1D900] font-bold hover:underline"
                  >
                    <span>Acessar Ferramenta / Material</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DE UPLOAD DE PDF DO DIAGNÓSTICO */}
      {modalUploadPdf && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161B22] rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat'] flex items-center gap-2">
                <FileUp className="w-5 h-5 text-[#004B8D]" />
                Anexar Arquivo de Diagnóstico (PDF)
              </h3>
              <button onClick={() => setModalUploadPdf(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleUploadPdfDiagnostico} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome do Arquivo PDF</label>
                <input
                  type="text"
                  required
                  value={pdfNome}
                  onChange={(e) => setPdfNome(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50 dark:bg-[#0D1117]/50">
                <FileText className="w-8 h-8 mx-auto text-[#004B8D] dark:text-[#A1D900]" />
                <div className="font-bold text-slate-800 dark:text-slate-200">Arraste seu PDF aqui ou clique para selecionar</div>
                <div className="text-[11px] text-slate-400">Formatos aceitos: PDF (máx 15MB)</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalUploadPdf(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#004B8D] text-white font-bold cursor-pointer"
                >
                  Confirmar Anexo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO MATERIAL */}
      {showModalMaterial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161B22] rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Montserrat']">Novo Material de Apoio</h3>
              <button onClick={() => setShowModalMaterial(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSalvarMaterial} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Título</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tabela de Formação de Preço de Venda"
                  value={novoMatTitulo}
                  onChange={(e) => setNovoMatTitulo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Categoria</label>
                <select
                  value={novoMatCat}
                  onChange={(e) => setNovoMatCat(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 rounded-xl"
                >
                  <option value="Gestão Financeira">Gestão Financeira</option>
                  <option value="Vendas & Clientes">Vendas & Clientes</option>
                  <option value="Formalização MEI">Formalização MEI</option>
                  <option value="Controles Diários">Controles Diários</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={novoMatDesc}
                  onChange={(e) => setNovoMatDesc(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Link ou URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={novoMatLink}
                  onChange={(e) => setNovoMatLink(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-[#0D1117] border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModalMaterial(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#004B8D] text-white font-bold cursor-pointer"
                >
                  Salvar Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
