import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { CoNexoLogo } from '../components/CoNexoLogo';
import { 
  Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, 
  UserCheck, Briefcase, GraduationCap, BarChart3, Crown, AlertCircle 
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, simularRole, theme, toggleTheme } = useApp();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(true);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!email.trim() || !senha.trim()) {
      setErro('Por favor, informe seu e-mail e senha.');
      return;
    }

    const res = login(email, senha, lembrar);
    if (!res.success) {
      setErro(res.message || 'Credenciais inválidas.');
    }
  };

  const handleDemoAccess = (targetRole: Role, demoEmail: string, demoSenha: string) => {
    setEmail(demoEmail);
    setSenha(demoSenha);
    setErro(null);
    simularRole(targetRole);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0D1117] flex flex-col justify-between items-center px-4 py-8 font-['Inter'] transition-colors duration-200">
      {/* Top subtle bar with institution branding */}
      <div className="w-full max-w-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-widest text-[#004B8D] dark:text-[#A1D900] uppercase font-['Montserrat']">
            SENAC BAHIA • SANTO ANTÔNIO DE JESUS (SAJ)
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-semibold"
          title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md my-auto">
        <div className="bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-7 sm:p-9 shadow-lg">
          {/* Logo Oficial Co.Nexo Senac */}
          <div className="flex justify-center mb-5">
            <CoNexoLogo size="lg" variant={theme === 'dark' ? 'dark' : 'light'} withTagline={false} />
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-white font-['Montserrat']">
              Portal de Gestão Co.Nexo
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              SENAC Santo Antônio de Jesus • Acesse sua conta
            </p>
          </div>

          {erro && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{erro}</span>
            </div>
          )}

          {/* Formulário de Login Tradicional */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-['Montserrat']">
                E-mail Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@conexo.senac.br"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0D1117] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004B8D] dark:focus:ring-[#A1D900] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-['Montserrat']">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0D1117] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004B8D] dark:focus:ring-[#A1D900] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                  className="rounded border-slate-300 text-[#004B8D] focus:ring-[#004B8D]"
                />
                <span>Lembrar meu acesso</span>
              </label>
              <span className="text-[#004B8D] dark:text-[#A1D900] hover:underline cursor-pointer">
                Esqueceu a senha?
              </span>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#004B8D] hover:bg-[#00386b] dark:bg-[#A1D900] dark:text-slate-900 dark:hover:bg-[#8ec200] transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divisor com Acesso Rápido de Demonstração */}
          <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="text-center mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-['Montserrat']">
                Acesso Rápido de Demonstração (1 Clique)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoAccess('superadmin', 'admin@conexo.senac.br', 'admin')}
                className="col-span-full flex items-center justify-between p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/70 dark:bg-purple-950/30 hover:border-purple-400 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-purple-900 dark:text-purple-300 text-[11px] font-['Montserrat']">
                      Admin Supremo (Diretoria)
                    </div>
                    <div className="text-[10px] text-purple-700 dark:text-purple-400">
                      Controle total, auditoria e usuários
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleDemoAccess('regis', 'regis@conexo.senac.br', 'regis')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 hover:border-blue-400 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#004B8D] dark:text-[#A1D900]" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      Régis (Admin Gestão)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Metas e Bloqueios
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoAccess('max', 'max@conexo.senac.br', 'max')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-[#004B8D] text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      Max (Recepção)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Agenda, Passivos & SIG
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoAccess('aline', 'mentoria@conexo.senac.br', 'mentoria')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-[#004B8D] text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      Aline & Laiza (Mentoria)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Prontuário & PDF
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoAccess('arthur', 'arthur@marmitaria.com', 'arthur')}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-[#004B8D] text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      Arthur (Mentorado)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Marmitaria & Práticas
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Footer */}
      <footer className="text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center gap-1">
        <p className="font-medium">SENAC Santo Antônio de Jesus • Co.Nexo v2.0</p>
        <p className="text-[11px]">Ambiente Seguro com Sincronização Acadêmica SIG</p>
      </footer>
    </div>
  );
};
