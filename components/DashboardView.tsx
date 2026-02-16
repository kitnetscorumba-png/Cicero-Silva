
import React, { useState } from 'react';
import { Tool, User, Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardViewProps {
  tools: Tool[];
  users: User[];
  transactions: Transaction[];
  onCheckout: (toolId: string, userId: string) => void;
  onCheckin: (toolId: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ tools, users, transactions, onCheckout, onCheckin }) => {
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');

  const stats = [
    { label: 'Ferramentas Totais', value: tools.length, color: 'bg-indigo-500' },
    { label: 'Em Uso', value: tools.filter(t => t.status === 'checked_out').length, color: 'bg-amber-500' },
    { label: 'Disponíveis', value: tools.filter(t => t.status === 'available').length, color: 'bg-emerald-500' },
    { label: 'Usuários Ativos', value: users.length, color: 'bg-sky-500' },
  ];

  const chartData = [
    { name: 'Disponível', value: tools.filter(t => t.status === 'available').length },
    { name: 'Em Uso', value: tools.filter(t => t.status === 'checked_out').length },
    { name: 'Manutenção', value: tools.filter(t => t.status === 'maintenance').length },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const handleAction = () => {
    if (selectedTool && selectedUser) {
      onCheckout(selectedTool, selectedUser);
      setSelectedTool('');
      setSelectedUser('');
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Painel de Controle</h2>
        <p className="text-slate-500">Visão geral do inventário e operações de turno.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
            </div>
            <div className={`${s.color} w-12 h-12 rounded-xl opacity-20 flex items-center justify-center`}>
              <div className={`${s.color} w-6 h-6 rounded-full`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Action Card */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            Retirada Rápida
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Selecionar Ferramenta</label>
              <select 
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecione uma ferramenta disponível</option>
                {tools.filter(t => t.status === 'available').map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Selecionar Operário</label>
              <select 
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Quem está retirando?</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} - {u.employeeId}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAction}
              disabled={!selectedTool || !selectedUser}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition disabled:opacity-50 disabled:shadow-none mt-4"
            >
              Confirmar Retirada
            </button>
          </div>
        </div>

        {/* Real-time Status List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Estado das Ferramentas</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="text-left">
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="pb-4">Ferramenta</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Usuário Atual</th>
                  <th className="pb-4">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tools.map(tool => {
                  const currentUser = users.find(u => u.id === tool.currentUserId);
                  return (
                    <tr key={tool.id} className="text-sm">
                      <td className="py-4">
                        <div className="font-medium text-slate-900">{tool.name}</div>
                        <div className="text-xs text-slate-500">{tool.code} • {tool.category}</div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tool.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 
                          tool.status === 'checked_out' ? 'bg-amber-100 text-amber-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {tool.status === 'available' ? 'Disponível' : tool.status === 'checked_out' ? 'Em Uso' : 'Manutenção'}
                        </span>
                      </td>
                      <td className="py-4 text-slate-600">
                        {currentUser ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                              {currentUser.name.charAt(0)}
                            </div>
                            {currentUser.name}
                          </div>
                        ) : '—'}
                      </td>
                      <td className="py-4">
                        {tool.status === 'checked_out' && (
                          <button 
                            onClick={() => onCheckin(tool.id)}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs flex items-center gap-1"
                          >
                            Devolver
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" /></svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Card */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Distribuição de Inventário</h3>
           <ResponsiveContainer width="100%" height="90%">
             <BarChart data={chartData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
               <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
               <Tooltip 
                 cursor={{fill: '#f8fafc'}}
                 contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
               />
               <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                 {chartData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
