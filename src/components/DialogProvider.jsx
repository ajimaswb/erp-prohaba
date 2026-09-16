'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, HelpCircle, FileText } from 'lucide-react';

const DialogContext = createContext({});

export const useDialog = () => useContext(DialogContext);

export default function DialogProvider({ children }) {
  const [dialogs, setDialogs] = useState([]);

  const addDialog = (dialog) => {
    setDialogs((prev) => [...prev, { ...dialog, id: Date.now().toString() }]);
  };

  const removeDialog = (id) => {
    setDialogs((prev) => prev.filter((d) => d.id !== id));
  };

  const showAlert = useCallback((message, title = 'Informasi') => {
    return new Promise((resolve) => {
      addDialog({ type: 'alert', title, message, resolve });
    });
  }, []);

  const showConfirm = useCallback((message, title = 'Konfirmasi') => {
    return new Promise((resolve) => {
      addDialog({ type: 'confirm', title, message, resolve });
    });
  }, []);

  const showPrompt = useCallback((message, title = 'Masukkan Data', defaultValue = '') => {
    return new Promise((resolve) => {
      addDialog({ type: 'prompt', title, message, resolve, promptValue: defaultValue });
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (dialogs.length === 0) return;
      const topDialog = dialogs[dialogs.length - 1];
      if (e.key === 'Escape') {
        topDialog.resolve(topDialog.type === 'prompt' ? null : false);
        removeDialog(topDialog.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogs]);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
      {children}
      <AnimatePresence>
        {dialogs.map((dialog, index) => {
          const isTop = index === dialogs.length - 1;
          return (
            <DialogItem 
              key={dialog.id} 
              dialog={dialog} 
              isTop={isTop} 
              onClose={() => removeDialog(dialog.id)} 
            />
          );
        })}
      </AnimatePresence>
    </DialogContext.Provider>
  );
}

function DialogItem({ dialog, isTop, onClose }) {
  const [inputValue, setInputValue] = useState(dialog.promptValue || '');

  const handleConfirm = () => {
    if (dialog.type === 'prompt') dialog.resolve(inputValue);
    else dialog.resolve(true);
    onClose();
  };

  const handleCancel = () => {
    if (dialog.type === 'prompt') dialog.resolve(null);
    else dialog.resolve(false);
    onClose();
  };

  const getIcon = () => {
    if (dialog.type === 'alert') return <AlertCircle size={28} className="text-blue-500" />;
    if (dialog.type === 'confirm') return <HelpCircle size={28} className="text-orange-500" />;
    return <FileText size={28} className="text-navy-600" />;
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ pointerEvents: isTop ? 'auto' : 'none' }}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm"
        onClick={handleCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, type: 'spring', bounce: 0.3 }}
        className="relative bg-white w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden flex flex-col"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4 mb-2">
            <div className="p-3 bg-gray-50 rounded-2xl shrink-0">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-gray-900 mb-1 leading-tight">{dialog.title}</h3>
              <p className="text-[14px] text-gray-600 leading-relaxed">{dialog.message}</p>
            </div>
          </div>
          
          {dialog.type === 'prompt' && (
            <div className="mt-4">
              <input
                type="text"
                autoFocus
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all text-[15px]"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirm();
                }}
                placeholder="Ketik di sini..."
              />
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
          {dialog.type !== 'alert' && (
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-200 transition-colors text-[14px] flex items-center gap-2"
            >
              Batal
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl font-semibold text-white transition-colors text-[14px] flex items-center gap-2 ${
              dialog.type === 'confirm' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'bg-navy-600 hover:bg-navy-700 shadow-navy-600/20'
            } shadow-lg hover:shadow-xl hover:-translate-y-[1px] transform duration-200`}
          >
            {dialog.type === 'alert' ? 'Mengerti' : dialog.type === 'prompt' ? 'Konfirmasi' : 'Ya, Lanjutkan'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
