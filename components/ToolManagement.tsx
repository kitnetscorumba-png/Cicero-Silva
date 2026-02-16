
import React, { useState } from 'react';
import { Tool, ToolStatus } from '../types';

interface ToolManagementProps {
  tools: Tool[];
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
}

const ToolManagement: React.FC<ToolManagementProps> = ({ tools, setTools }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', category: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const newTool: Tool = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      code: formData.code,
      category: formData.category,
      status: 'available'
    };

    setTools(prev => [...prev, newTool]);
    setFormData({ name: '', code: '', category: '' });
    setIsAdding(false);
  };

  const removeTool = (id: string) => {
    if (confirm('Deseja remover esta ferramenta do inventário?')) {
      setTools(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Gestão de Inventário</h2>
          <p className="text-slate-500">Controle total de equipamentos e ferramentas.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2"
        >
          {isAdding ? 'Cancelar' : (
            <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Cadastrar Ferramenta</>
          )}
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 max-w-2xl animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do Equipamento</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Martelete Combinado 800W"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código / Etiqueta</label>
              <input 
                type="text" 
                required
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: MC-08"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecione...</option>
                <option value="Manual">Manual</option>
                <option value="Elétrica">Elétrica</option>
                <option value="Pneumática">Pneumática</option>
                <option value="Medição">Medição</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-6 w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700">Adicionar ao Acervo</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">Nenhuma ferramenta cadastrada.</div>
        ) : tools.map(tool => (
          <div key={tool.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-slate-100 text-slate-500`}>
                {tool.category}
              </span>
              <button 
                onClick={() => removeTool(tool.id)}
                className="text-slate-300 hover:text-red-500 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1">{tool.name}</h4>
            <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              Tag: {tool.code}
            </p>
            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className={`flex items-center gap-1.5 text-xs font-semibold ${
                tool.status === 'available' ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${tool.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                {tool.status === 'available' ? 'Disponível' : 'Em Uso'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolManagement;
