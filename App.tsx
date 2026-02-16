
import React, { useState, useEffect, useMemo } from 'react';
import { User, Tool, Transaction, View } from './types';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import UserManagement from './components/UserManagement';
import ToolManagement from './components/ToolManagement';
import ReportsView from './components/ReportsView';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize with some mock data for demonstration
  useEffect(() => {
    const savedUsers = localStorage.getItem('tf_users');
    const savedTools = localStorage.getItem('tf_tools');
    const savedTransactions = localStorage.getItem('tf_transactions');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    else {
      const initialUsers: User[] = [
        { id: '1', name: 'João Silva', employeeId: 'E001', department: 'Mecânica', createdAt: Date.now() },
        { id: '2', name: 'Maria Souza', employeeId: 'E002', department: 'Elétrica', createdAt: Date.now() },
      ];
      setUsers(initialUsers);
      localStorage.setItem('tf_users', JSON.stringify(initialUsers));
    }

    if (savedTools) setTools(JSON.parse(savedTools));
    else {
      const initialTools: Tool[] = [
        { id: 't1', name: 'Chave Inglesa 12"', code: 'CI-12', category: 'Manual', status: 'available' },
        { id: 't2', name: 'Multímetro Digital', code: 'MD-01', category: 'Elétrica', status: 'available' },
        { id: 't3', name: 'Parafusadeira Bosch', code: 'PB-22', category: 'Elétrica', status: 'available' },
      ];
      setTools(initialTools);
      localStorage.setItem('tf_tools', JSON.stringify(initialTools));
    }

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('tf_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tf_tools', JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem('tf_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleCheckout = (toolId: string, userId: string) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      toolId,
      userId,
      checkoutTime: Date.now(),
      status: 'pending'
    };

    setTransactions(prev => [...prev, newTransaction]);
    setTools(prev => prev.map(t => 
      t.id === toolId ? { ...t, status: 'checked_out', currentUserId: userId } : t
    ));
  };

  const handleCheckin = (toolId: string) => {
    setTransactions(prev => prev.map(t => 
      (t.toolId === toolId && t.status === 'pending') 
        ? { ...t, status: 'returned', checkinTime: Date.now() } 
        : t
    ));
    setTools(prev => prev.map(t => 
      t.id === toolId ? { ...t, status: 'available', currentUserId: undefined } : t
    ));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {view === 'dashboard' && (
            <DashboardView 
              tools={tools} 
              users={users} 
              transactions={transactions}
              onCheckout={handleCheckout}
              onCheckin={handleCheckin}
            />
          )}
          {view === 'users' && (
            <UserManagement users={users} setUsers={setUsers} />
          )}
          {view === 'tools' && (
            <ToolManagement tools={tools} setTools={setTools} />
          )}
          {view === 'reports' && (
            <ReportsView 
              tools={tools} 
              users={users} 
              transactions={transactions} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
