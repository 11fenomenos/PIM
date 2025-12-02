import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';

const LGPDConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lgpd_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('lgpd_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-full hidden md:block">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Privacidade e Proteção de Dados (LGPD)</h3>
            <p className="text-sm text-slate-600 max-w-2xl">
              Utilizamos cookies e dados pessoais para melhorar sua experiência e otimizar o suporte técnico com IA.
              Ao continuar navegando, você concorda com nossa <a href="#" className="text-blue-600 hover:underline">Política de Privacidade</a>.
              Seus dados são tratados com segurança conforme a Lei 13.709/2018.
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Aceitar e Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LGPDConsent;