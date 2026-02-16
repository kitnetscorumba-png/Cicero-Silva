
import React, { useState, useEffect } from 'react';
import { Tool, User, Transaction } from '../types';
import { generateShiftReport } from '../services/geminiService';

interface ReportsViewProps {
  tools: Tool[];
  users: User[];
  transactions: Transaction[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ tools, users, transactions }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pending = transactions.filter(t => t.status === 'pending');
  const returned = transactions.filter(t => t.status === 'returned');

  const handleGenerateAIReport = async () => {
    setLoading(true);
    const result = await generateShiftReport(tools, users, transactions);
    setReport(result || "Erro ao gerar relatório.");
    setLoading(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Relatório de Turno</h2>
          <p className="text-slate-500">Balanço de entregas e pendências do período atual.</p>
        </div>
        <button 
          onClick={handleGenerateAIReport}
          disabled={loading}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <><svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Gerar Relatório Inteligente</>
          )}
        </button>
      </header>

      {/* AI Report Card */}
      {report && (
        <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-2xl animate-in fade-in zoom-in duration-500">
          <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold uppercase tracking-widest text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            Análise Baseada em IA
          </div>
          <div className="prose prose-indigo max-w-none text-slate-700 whitespace-pre-line">
            {report}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
            <h3 className="font-bold text-amber-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Ferramentas Pendentes (Não Devolvidas)
            </h3>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">{pending.length}</span>
          </div>
          <div className="divide-y divide-slate-50">
            {pending.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Tudo em ordem! Nenhuma pendência encontrada.</div>
            ) : pending.map(t => {
              const tool = tools.find(tool => tool.id === t.toolId);
              const user = users.find(u => u.id === t.userId);
              return (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div>
                    <div className="font-bold text-slate-800">{tool?.name} <span className="text-slate-400 font-normal">({tool?.code})</span></div>
                    <div className="text-sm text-slate-500">Com: <span className="font-medium text-slate-700">{user?.name}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Retirada em:</div>
                    <div className="text-xs font-medium text-slate-600">{new Date(t.checkoutTime).toLocaleTimeString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Returned Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
            <h3 className="font-bold text-emerald-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Ferramentas Devolvidas
            </h3>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">{returned.length}</span>
          </div>
          <div className="divide-y divide-slate-50">
            {returned.length === 0 ? (
              <div className="p-12 text-center text-slate-400">Nenhuma ferramenta devolvida ainda neste turno.</div>
            ) : returned.map(t => {
              const tool = tools.find(tool => tool.id === t.toolId);
              const user = users.find(u => u.id === t.userId);
              return (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div>
                    <div className="font-bold text-slate-800">{tool?.name}</div>
                    <div className="text-sm text-slate-500 text-emerald-600 flex items-center gap-1">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                       Entregue por {user?.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Tempo de Uso:</div>
                    <div className="text-xs font-medium text-slate-600">
                      {t.checkinTime ? Math.floor((t.checkinTime - t.checkoutTime) / (1000 * 60)) : 0} min
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
