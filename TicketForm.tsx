import React, { useState } from 'react';
import { TicketCategory, TicketPriority, Ticket, TicketStatus } from '../types';
import { analyzeTicketContent } from '../services/geminiService';
import { Sparkles, Save, Loader2, AlertTriangle, Check } from 'lucide-react';

interface TicketFormProps {
  onSubmit: (ticket: Ticket) => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requester, setRequester] = useState('');
  const [category, setCategory] = useState<TicketCategory>(TicketCategory.OTHER);
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.LOW);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  const handleAnalysis = async () => {
    if (!description || description.length < 10) return;
    
    setIsAnalyzing(true);
    const result = await analyzeTicketContent(description);
    setIsAnalyzing(false);
    
    if (result) {
      setAiSuggestion(result);
      // Auto-fill suggestion if user accepts (or just display it)
      setCategory(result.category);
      setPriority(result.priority);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      requester,
      category,
      priority,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      aiAnalysis: aiSuggestion?.summary
    };
    onSubmit(newTicket);
    // Reset form
    setTitle('');
    setDescription('');
    setRequester('');
    setAiSuggestion(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Novo Chamado</h2>
        <p className="text-slate-500">Descreva seu problema. A IA analisará para priorização correta.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Seu Nome</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: João Silva"
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Título do Problema</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Ex: Impressora não conecta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descrição Detalhada</label>
            <div className="relative">
              <textarea 
                required
                rows={5}
                className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="Descreva o que aconteceu, mensagens de erro, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleAnalysis} // Trigger analysis on blur for better UX
              />
              {isAnalyzing && (
                <div className="absolute top-2 right-2 flex items-center gap-2 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  IA Analisando...
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Nossa IA analisará o texto para sugerir categoria e prioridade automaticamente.</p>
          </div>

          {/* AI Suggestion Panel */}
          {aiSuggestion && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-900 text-sm">Sugestão Inteligente</h4>
                  <p className="text-sm text-blue-800">{aiSuggestion.summary}</p>
                  
                  {aiSuggestion.suggestedSolution && (
                    <div className="bg-white/80 p-3 rounded border border-blue-100 mt-2">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Tente isso antes:</span>
                      <p className="text-sm text-slate-700 mt-1">{aiSuggestion.suggestedSolution}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                      Categoria: {aiSuggestion.category}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md">
                      Prioridade: {aiSuggestion.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Categoria</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
              >
                {Object.values(TicketCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Prioridade</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
              >
                 {Object.values(TicketPriority).map(prio => (
                  <option key={prio} value={prio}>{prio}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
             <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              Abrir Chamado
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TicketForm;