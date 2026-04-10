import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import AnimatedLogo from '../assets/logo-animado.mp4';

interface WelcomePopupProps {
  onClose: () => void;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal - Brutalist System Style */}
      <div className={`relative w-full max-w-sm transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden text-black text-center">
          
          {/* Close Button UI Component Style */}
          <button 
            onClick={handleClose}
            className="absolute top-0 right-0 p-3 bg-white border-l-2 border-b-2 border-black hover:bg-black hover:text-white transition-colors group z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-10 pt-12 flex flex-col items-center">
            {/* System Media Block - No Stroke */}
            <div className="w-24 h-24 bg-black mb-8 relative">
              <video 
                src={AnimatedLogo}
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover scale-110"
              />
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-balance px-4 leading-none">
              Valeu por testar o W+TYPE 💛
            </h2>
            
            <p className="text-black/50 text-[14px] leading-relaxed mb-10 text-balance px-2 font-bold uppercase tracking-widest">
              Fiz esse projeto meio que pra mim… mas se você tiver qualquer ideia, opinião ou só quiser trocar uma ideia, vou curtir muito ouvir 🙂
            </p>

            <div className="space-y-4 w-full">
              <a 
                href="https://www.linkedin.com/in/wessalves/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-black text-white py-6 px-6 border-2 border-black font-black uppercase text-xs tracking-[0.2em] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1),4px_4px_0px_2px_rgba(0,0,0,1)]"
              >
                Me chama no LinkedIn
              </a>

              <button 
                onClick={handleClose}
                className="flex items-center justify-center gap-2 w-full py-4 px-6 font-black uppercase text-[10px] tracking-[0.2em] transition-all text-black/40 hover:text-black"
              >
                Agora não
              </button>
            </div>
          </div>

          {/* System Footer Decor */}
          <div className="px-6 py-3 bg-black text-white border-t-2 border-black flex justify-between items-center">
            <span className="text-[8px] font-bold uppercase tracking-widest">v1.0.1-cb</span>
            <span className="text-[8px] font-bold uppercase tracking-widest animate-pulse">System.Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

