import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '../types';
import { AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard: React.FC<DashboardProps> = ({ tickets }) => {
  // Calculate Stats
  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED).length;
  const open = tickets.filter(t => t.status === TicketStatus.OPEN).length;
  const critical = tickets.filter(t => t.priority === TicketPriority.CRITICAL || t.priority === TicketPriority.HIGH).length;

  // Prepare Chart Data
  const statusData = [
    { name: 'Aberto', value: tickets.filter(t => t.status === TicketStatus.OPEN).length },
    { name: 'Em Andamento', value: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length },
    { name: 'Resolvido', value: tickets.filter(t => t.status === TicketStatus.RESOLVED).length },
  ];

  const categoryData = Object.values(TicketCategory).map(cat => ({
    name: cat,
    tickets: tickets.filter(t => t.category === cat).length
  }));

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <p className="text-xs text-slate-400 mt-2">{subtext}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Gerencial</h2>
        <p className="text-slate-500">Visão geral do suporte técnico e métricas de desempenho.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Chamados" 
          value={total} 
          icon={FileText} 
          color="bg-blue-500" 
          subtext="+12% esse mês"
        />
        <StatCard 
          title="Chamados Abertos" 
          value={open} 
          icon={AlertCircle} 
          color="bg-yellow-500" 
          subtext="Aguardando atendimento"
        />
        <StatCard 
          title="Resolvidos" 
          value={resolved} 
          icon={CheckCircle} 
          color="bg-green-500" 
          subtext={`${((resolved/total || 0) * 100).toFixed(0)}% taxa de resolução`}
        />
        <StatCard 
          title="Prioridade Alta" 
          value={critical} 
          icon={Clock} 
          color="bg-red-500" 
          subtext="Requer atenção imediata"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Chamados por Categoria</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="tickets" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Status dos Chamados</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Simulation of Report Export */}
      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors text-sm">
           <FileText className="h-4 w-4" />
           Exportar Relatório Mensal (PDF)
        </button>
      </div>
    </div>
  );
};

export default Dashboard;