import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                  variant === 'danger' 
                    ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">
                  {title}
                </h3>
                <p className="text-sm font-bold text-gray-500 leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/5 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 h-14 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                    variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20'
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
