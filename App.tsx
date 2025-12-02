import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import ChatAssistant from './components/ChatAssistant';
import LGPDConsent from './components/LGPDConsent';
import { Ticket, TicketPriority, TicketStatus, TicketCategory } from './types';

// Mock Data Initialization
const INITIAL_TICKETS: Ticket[] = [
  {
    id: '928371',
    title: 'Erro no login do ERP',
    description: 'Não consigo acessar o sistema financeiro, diz senha incorreta mesmo após reset.',
    requester: 'Ana Souza',
    priority: TicketPriority.HIGH,
    status: TicketStatus.OPEN,
    category: TicketCategory.ACCESS,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: '827361',
    title: 'Impressora 2º andar offline',
    description: 'A impressora laser não está recebendo documentos da rede.',
    requester: 'Carlos Lima',
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.IN_PROGRESS,
    category: TicketCategory.HARDWARE,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: '726351',
    title: 'Instalação VS Code',
    description: 'Preciso do VS Code instalado para desenvolvimento.',
    requester: 'Dev Team',
    priority: TicketPriority.LOW,
    status: TicketStatus.RESOLVED,
    category: TicketCategory.SOFTWARE,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);

  const handleNewTicket = (ticket: Ticket) => {
    setTickets(prev => [ticket, ...prev]);
    // Simulate navigation/notification could go here
    alert("Chamado criado com sucesso!");
    window.location.hash = '#/tickets';
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard tickets={tickets} />} />
          <Route path="/new-ticket" element={<TicketForm onSubmit={handleNewTicket} />} />
          <Route 
            path="/tickets" 
            element={
              <TicketList 
                tickets={tickets} 
                onUpdate={handleUpdateTicket} 
                onDelete={handleDeleteTicket} 
              />
            } 
          />
          <Route path="/chat" element={<ChatAssistant />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <LGPDConsent />
      </Layout>
    </Router>
  );
};

export default App;