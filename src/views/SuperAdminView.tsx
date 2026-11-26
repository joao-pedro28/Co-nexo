import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role, UsuarioSistema } from '../types';
import { 
  Crown, ShieldCheck, Users, Activity, Database, RefreshCw, 
  Download, Upload, Eye, UserPlus, CheckCircle2, XCircle, Search, 
  Clock, Lock, Smartphone, AlertTriangle, Layers, Calendar
} from 'lucide-react';

export const SuperAdminView: React.FC = () => {
  const { 
    usuarios, auditoria, alunos, agendamentos, bloqueios,
    alternarStatusUsuario, adicionarUsuario, simularRole,
    exportarBackupCloud, restaurarBackupCloud, resetarDadosDemo,
    activeTab, setActiveTab
  } = useApp();

  const [buscaUsuario, setBuscaUsuario] = useState('');
  const [filtroRoleAuditoria, setFiltroRoleAuditoria] = useState<string>('todos');
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novoCargo, setNovoCargo] = useState('');
  const [novoRole, setNovoRole] = useState<Role>('max');

  // Métricas Globais
  const totalUsuariosAtivos = usuarios.filter(u => u.ativo).length;
  const totalAlunosAtivos = alunos.filter(a => a.statusPrograma !== 'Desligado' && a.statusPrograma !== 'Concluído').length;
  const totalDesligados = alunos.filter(a => a.statusPrograma === 'Desligado').length;
  const pendenciasSIG = alunos.filter(a => a.statusSincronizacaoSIG !== 'sincronizado').length;

  const usuariosFiltrados = usuarios.filter(u => 
    u.nome.toLowerCase().includes(buscaUsuario.toLowerCase()) ||
    u.email.toLowerCase().includes(buscaUsuario.toLowerCase()) ||
    u.cargo.toLowerCase().includes(buscaUsuario.toLowerCase())
  );

  const logsFiltrados = auditoria.filter(log => {
    if (filtroRoleAuditoria === 'todos') return true;
    return log.role === filtroRoleAuditoria;
  });

  const handleCriarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome || !novoEmail || !novaSenha || !novoCargo || !novoRole) return;

    adicionarUsuario({
      nome: novoNome,
      email: novoEmail,
      senha: novaSenha,
      cargo: novoCargo,
      role: novoRole,
      ativo: true
    });

    setNovoNome('');
    setNovoEmail('');
    setNovaSenha('');
    setNovoCargo('');
    setModalNovoUsuario(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-['Inter']">
      {/* 1. CABEÇALHO DO SUPER ADMIN */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#004B8D] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/30 border border-purple-400/40 text-purple-200">
              Diretoria & Governança SENAC SAJ
            </span>
            <span className="text-purple-300">•</span>
            <span className="text-xs text-purple-200">Nível Máximo de Acesso</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Montserrat'] tracking-tight flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            Painel do Administrador Supremo
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-2xl">
            Supervisão corporativa, controle de operadores, auditoria de segurança e integridade das regras do Programa Co.Nexo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportarBackupCloud}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Backup</span>
          </button>
          <button
            onClick={resetarDadosDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold transition-all border border-amber-400/30 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Resetar Demo</span>
          </button>
        </div>
      </div>

      {/* 2. CARDS DE KPIS GLOBAIS DE GOVERNANÇA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Operadores Ativos</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-800 dark:text-white font-['Montserrat']">
            {totalUsuariosAtivos} / {usuarios.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            100% de conformidade com papéis
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Empreendedores Ativos</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#004B8D] dark:text-[#A1D900]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-800 dark:text-white font-['Montserrat']">
            {totalAlunosAtivos}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Total matriculados no Co.Nexo
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Desligamentos Totais</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-800 dark:text-white font-['Montserrat']">
            {totalDesligados}
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
            2 faltas ou 3 reagendamentos
          </div>
        </div>

        <div className="bg-white dark:bg-[#161B22] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pendências SIG</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-800 dark:text-white font-['Montserrat']">
            {pendenciasSIG}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
            Ajustes e aberturas na Coordenação
          </div>
        </div>
      </div>

      {/* 3. NAVEGAÇÃO DE ABAS DO SUPER ADMIN */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold font-['Montserrat']">
        <button
          onClick={() => setActiveTab('operadores')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'operadores'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestão de Operadores ({usuarios.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('auditoria')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'auditoria'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Trilha de Auditoria ({auditoria.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('simulador')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'simulador'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Simulador de Perfis</span>
        </button>
      </div>

      {/* ABA 1: OPERADORES */}
      {activeTab === 'operadores' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, cargo ou e-mail..."
                value={buscaUsuario}
                onChange={(e) => setBuscaUsuario(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={() => setModalNovoUsuario(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Adicionar Operador</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider font-['Montserrat']">
                <tr>
                  <th className="py-3 px-4">Operador</th>
                  <th className="py-3 px-4">Cargo / Função</th>
                  <th className="py-3 px-4">Perfil (Role)</th>
                  <th className="py-3 px-4">Último Acesso</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{u.nome}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{u.cargo}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'superadmin' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' :
                        u.role === 'regis' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' :
                        u.role === 'max' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' :
                        u.role === 'aline' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' :
                        'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{u.ultimoAcesso}</td>
                    <td className="py-3 px-4">
                      {u.ativo ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-500 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Inativo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.role !== 'superadmin' && (
                        <button
                          onClick={() => alternarStatusUsuario(u.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            u.ativo 
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100' 
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {u.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 2: TRILHA DE AUDITORIA */}
      {activeTab === 'auditoria' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white font-['Montserrat']">
                Logs Oficiais de Auditoria & Conformidade
              </h3>
              <p className="text-xs text-slate-500">
                Registro inalterável de eventos operacionais, cancelamentos, faltas e alterações de agenda
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filtrar por Papel:</span>
              <select
                value={filtroRoleAuditoria}
                onChange={(e) => setFiltroRoleAuditoria(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] text-slate-800 dark:text-slate-200"
              >
                <option value="todos">Todos os Papéis</option>
                <option value="superadmin">Super Admin</option>
                <option value="regis">Régis (Gestão)</option>
                <option value="max">Max (Recepção)</option>
                <option value="aline">Aline / Laiza (Consultoria)</option>
                <option value="arthur">Arthur (Mentorado)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider font-['Montserrat']">
                <tr>
                  <th className="py-3 px-4">Data / Hora</th>
                  <th className="py-3 px-4">Usuário</th>
                  <th className="py-3 px-4">Perfil</th>
                  <th className="py-3 px-4">Ação Executada</th>
                  <th className="py-3 px-4">Detalhes</th>
                  <th className="py-3 px-4 text-right">Origem IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {logsFiltrados.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">{log.dataHora}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">{log.usuarioNome}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-purple-700 dark:text-purple-300 whitespace-nowrap">
                      {log.acao}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{log.detalhes}</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px] whitespace-nowrap">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: SIMULADOR DE PERFIS */}
      {activeTab === 'simulador' && (
        <div className="bg-white dark:bg-[#161B22] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white font-['Montserrat']">
              Simulador de Experiência dos Usuários (Live Preview)
            </h3>
            <p className="text-xs text-slate-500">
              Alterne instantaneamente para a visão de qualquer operador sem perder as credenciais da Diretoria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider font-['Montserrat']">
                  Admin Gestor
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Régis Santos
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Gestão estratégica, metas trimestrais, abertura de calendário e bloqueios de agenda.
                </div>
              </div>
              <button
                onClick={() => simularRole('regis')}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-[#004B8D] hover:bg-[#00386b] text-white text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
              >
                Simular Visão de Régis
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider font-['Montserrat']">
                  Atendimento & Recepção
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Max Silva
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Recepção, agendamento de blocos de 6 encontros, lista de passivos (&gt;15 dias) e controle SIG.
                </div>
              </div>
              <button
                onClick={() => simularRole('max')}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
              >
                Simular Visão de Max
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider font-['Montserrat']">
                  Consultoria de Negócios
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Aline Silva & Laiza
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Prontuário único, upload de PDF do diagnóstico, assiduidade em 1 clique e métricas E6.
                </div>
              </div>
              <button
                onClick={() => simularRole('aline')}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
              >
                Simular Visão das Consultoras
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider font-['Montserrat']">
                  Empreendedor Mentorado
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  Arthur Santana
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Visualização de diagnóstico PDF, ferramentas práticas (preço, caixa) e Caderno de Empreendedor.
                </div>
              </div>
              <button
                onClick={() => simularRole('arthur')}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
              >
                Simular Visão de Arthur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA ADICIONAR NOVO OPERADOR */}
      {modalNovoUsuario && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161B22] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-['Montserrat'] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                Cadastrar Novo Operador
              </h3>
              <button
                onClick={() => setModalNovoUsuario(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCriarUsuario} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Carlos Eduardo"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail de Acesso
                </label>
                <input
                  type="email"
                  required
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="exemplo@conexo.senac.br"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Senha Provisória
                </label>
                <input
                  type="password"
                  required
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cargo / Descrição
                </label>
                <input
                  type="text"
                  required
                  value={novoCargo}
                  onChange={(e) => setNovoCargo(e.target.value)}
                  placeholder="Ex: Consultor de Vendas ou Apoio SIG"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nível de Acesso (Role)
                </label>
                <select
                  value={novoRole}
                  onChange={(e) => setNovoRole(e.target.value as Role)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0D1117] text-slate-900 dark:text-white"
                >
                  <option value="regis">Régis (Administrador de Gestão)</option>
                  <option value="max">Max (Recepção e Atendimento)</option>
                  <option value="aline">Aline / Laiza (Consultorias)</option>
                  <option value="arthur">Arthur (Aluno / Mentorado)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalNovoUsuario(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
                >
                  Salvar Operador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
