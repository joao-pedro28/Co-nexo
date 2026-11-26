import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CoNexoLogo } from './CoNexoLogo';
import { 
  Calendar, MessageSquare, Users, BookOpen, 
  HelpCircle, FileText, ShieldCheck, FileCheck, 
  MessageCircle, BarChart3, TrendingUp, Clock, 
  LogOut, Sun, Moon, Pin, PinOff, Crown, Eye, Lock,
  AlertCircle, DollarSign
} from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const { 
    role, setRole, 
    activeTab, setActiveTab, 
    theme, toggleTheme 
  } = useApp();

  // Estado de hover: o menu expande com o mouse em cima e se retrai automaticamente ao sair
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isExpanded = isPinned || isHovered;

  // Nomes oficiais dos perfis
  const profileNames: Record<string, string> = {
    superadmin: 'Super Admin',
    regis: 'Gestão (Admin)',
    max: 'Recepção',
    aline: 'Mentor(a)',
    arthur: 'Aluno(a)'
  };

  const currentProfileName = role ? profileNames[role] || '' : '';

  // Abas de funcionalidades específicas de cada perfil
  const roleTabs: Record<string, TabItem[]> = {
    superadmin: [
      { id: 'operadores', label: 'Gestão de Usuários', icon: <Users className="w-5 h-5" /> },
      { id: 'auditoria', label: 'Logs de Auditoria', icon: <Clock className="w-5 h-5" /> },
      { id: 'simulador', label: 'Simulador de Perfis', icon: <Eye className="w-5 h-5" /> },
    ],
    regis: [
      { id: 'kpis', label: 'Dashboard Executivo', icon: <BarChart3 className="w-5 h-5" /> },
      { id: 'funil', label: 'Funil do Programa', icon: <TrendingUp className="w-5 h-5" /> },
      { id: 'calendario_abertura', label: 'Abertura & Bloqueios', icon: <Calendar className="w-5 h-5" /> },
      { id: 'anti_limbo', label: 'Fila Anti-Limbo (30/60d)', icon: <Clock className="w-5 h-5" /> },
    ],
    max: [
      { id: 'agenda', label: 'Grade de Atendimentos', icon: <Calendar className="w-5 h-5" /> },
      { id: 'passivos', label: 'Lista de Passivos (>15d)', icon: <AlertCircle className="w-5 h-5" /> },
      { id: 'lembretes', label: 'Lembretes WhatsApp', icon: <MessageSquare className="w-5 h-5" /> },
      { id: 'alunos', label: 'Alunos & SIG', icon: <Users className="w-5 h-5" /> },
    ],
    aline: [
      { id: 'prontuario', label: 'Prontuário & Diagnóstico', icon: <BookOpen className="w-5 h-5" /> },
      { id: 'triagem', label: 'Entrevista de Triagem', icon: <FileText className="w-5 h-5" /> },
      { id: 'grade', label: 'Minha Grade', icon: <Calendar className="w-5 h-5" /> },
      { id: 'duvidas', label: 'Dúvidas dos Alunos', icon: <HelpCircle className="w-5 h-5" /> },
      { id: 'materiais', label: 'Materiais de Apoio', icon: <FileCheck className="w-5 h-5" /> },
    ],
    arthur: [
      { id: 'proximo', label: 'Agendamento', icon: <Calendar className="w-5 h-5" /> },
      { id: 'diario', label: 'Minhas Tarefas & PDF', icon: <FileCheck className="w-5 h-5" /> },
      { id: 'ferramentas', label: 'Ferramentas Práticas', icon: <DollarSign className="w-5 h-5" /> },
      { id: 'duvidas', label: 'Dúvidas', icon: <MessageCircle className="w-5 h-5" /> },
      { id: 'materiais', label: 'Materiais', icon: <BookOpen className="w-5 h-5" /> },
    ],
  };

  const currentTabs = role ? roleTabs[role] || [] : [];

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out flex flex-col justify-between border-r ${
        isExpanded ? 'w-64 shadow-2xl' : 'w-20 shadow-xs'
      } bg-white dark:bg-[#161B22] border-slate-200 dark:border-slate-800 text-[#1A1A1A] dark:text-slate-100`}
    >
      {/* 1. TOPO: Logo Centralizada e Nome do Perfil Escolhido */}
      <div className="pt-6 pb-4 px-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-col items-center">
        {/* Logo centralizada */}
        <div className="flex justify-center items-center w-full min-h-[36px]">
          {isExpanded ? (
            <CoNexoLogo size="md" variant={theme === 'dark' ? 'dark' : 'light'} withTagline={false} />
          ) : (
            <div className="font-extrabold text-2xl font-['Montserrat'] tracking-tight select-none">
              <span className="text-[#A1D900]">co.</span>
            </div>
          )}
        </div>

        {/* Nome do perfil escolhido */}
        <div className="mt-3 text-center w-full">
          {isExpanded ? (
            <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-[#004B8D] dark:text-[#A1D900] tracking-wide font-['Montserrat']">
              {role === 'superadmin' && <Crown className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              <span>{currentProfileName}</span>
            </div>
          ) : (
            <div 
              className={`text-[10px] font-bold truncate px-1.5 py-0.5 rounded-md ${
                role === 'superadmin' 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' 
                  : 'text-[#004B8D] dark:text-[#A1D900] bg-blue-50 dark:bg-slate-800'
              }`}
              title={`Perfil: ${currentProfileName}`}
            >
              {role === 'superadmin' ? 'ADM' : currentProfileName.slice(0, 3)}
            </div>
          )}
        </div>
      </div>

      {/* 2. MEIO: Botões para aba de cada funcionalidade do perfil */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {currentTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={!isExpanded ? tab.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? role === 'superadmin' 
                    ? 'bg-purple-700 text-white shadow-xs font-["Montserrat"]'
                    : 'bg-[#004B8D] text-white shadow-xs font-["Montserrat"]'
                  : 'text-[#1A1A1A] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
              } ${!isExpanded ? 'justify-center' : 'justify-start'}`}
            >
              <span className={isActive ? (role === 'superadmin' ? 'text-yellow-300' : 'text-[#A1D900]') : 'text-[#004B8D] dark:text-slate-400'}>
                {tab.icon}
              </span>
              {isExpanded && (
                <span className="truncate">{tab.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. FINAL DA BARRA: Trocar Perfil, Trocar Tema Claro/Escuro e Modo Retrátil */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
        {/* Botão de Trocar Tema Claro/Escuro */}
        <button
          onClick={toggleTheme}
          title={!isExpanded ? (theme === 'dark' ? 'Tema Claro' : 'Tema Escuro') : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
            !isExpanded ? 'justify-center' : 'justify-start'
          }`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#A1D900]" />
          ) : (
            <Moon className="w-4 h-4 text-[#004B8D]" />
          )}
          {isExpanded && (
            <span>{theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}</span>
          )}
        </button>

        {/* Botão de Trocar Perfil */}
        <button
          onClick={() => setRole(null)}
          title={!isExpanded ? 'Sair / Trocar Perfil' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer ${
            !isExpanded ? 'justify-center' : 'justify-start'
          }`}
        >
          <LogOut className="w-4 h-4" />
          {isExpanded && (
            <span>Sair da Conta</span>
          )}
        </button>

        {/* Indicador de Auto-Retração / Trava opcional */}
        <button
          onClick={() => setIsPinned(!isPinned)}
          title={isPinned ? 'Desafixar (ativar retração automática ao tirar o mouse)' : 'Fixar menu aberto'}
          className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
            !isExpanded ? 'justify-center' : 'justify-between'
          }`}
        >
          {isExpanded && (
            <span>{isPinned ? 'Menu fixado' : 'Auto-retração ativa'}</span>
          )}
          {isPinned ? (
            <Pin className="w-3.5 h-3.5 text-[#004B8D] dark:text-[#A1D900]" />
          ) : (
            <PinOff className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
};
