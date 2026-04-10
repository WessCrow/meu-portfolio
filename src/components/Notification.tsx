import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <div className={`
      fixed bottom-8 left-1/2 -translate-x-1/2 z-[200]
      px-6 py-4 flex items-center gap-4
      border border-black 
      ${isSuccess ? 'bg-black text-white' : 'bg-white text-black'}
      shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
      animate-in slide-in-from-bottom-5 duration-300
    `}>
      {isSuccess ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
        {message}
      </span>

      <button 
        onClick={onClose}
        className={`
          ml-4 p-1 transition-colors
          ${isSuccess ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'}
        `}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
