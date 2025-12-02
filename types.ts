export enum TicketPriority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  CRITICAL = 'Crítica'
}

export enum TicketStatus {
  OPEN = 'Aberto',
  IN_PROGRESS = 'Em Andamento',
  RESOLVED = 'Resolvido',
  CLOSED = 'Fechado'
}

export enum TicketCategory {
  HARDWARE = 'Hardware',
  SOFTWARE = 'Software',
  NETWORK = 'Rede',
  ACCESS = 'Acesso/Login',
  OTHER = 'Outro'
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  requester: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  createdAt: string;
  aiAnalysis?: string; // AI generated suggestion/summary
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DashboardStats {
  total: number;
  open: number;
  resolved: number;
  avgTime: string;
}