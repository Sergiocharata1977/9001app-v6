'use client';

import React, { useState, useEffect } from 'react';
import { DonCandidoAnimation } from '@/components/ui/DonCandidoAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DonCandidoChatProps {
  /** Si está visible */
  visible?: boolean;
  /** Posición en la pantalla */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  /** Tamaño */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Tipo de animación */
  animationType?: 'saludo' | 'pensando' | 'feliz' | 'triste' | 'sorprendido';
  /** Duración antes de desaparecer */
  autoHide?: number;
  /** Mensaje a mostrar */
  message?: string;
  /** Callbacks */
  onShow?: () => void;
  onHide?: () => void;
  /** Clase CSS adicional */
  className?: string;
}

export const DonCandidoChat: React.FC<DonCandidoChatProps> = ({
  visible = false,
  position = 'bottom-right',
  size = 'lg',
  animationType = 'saludo',
  autoHide = 5000,
  message,
  onShow,
  onHide,
  className
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (isVisible) {
      onShow?.();
      
      // Mostrar mensaje después de un breve delay
      if (message) {
        setTimeout(() => setShowMessage(true), 1000);
      }
      
      // Auto-hide si está configurado
      if (autoHide > 0) {
        setTimeout(() => {
          setShowMessage(false);
          setTimeout(() => setIsVisible(false), 300);
        }, autoHide - 300);
      }
    } else {
      setShowMessage(false);
      onHide?.();
    }
  }, [isVisible, autoHide, message, onShow, onHide]);

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.6 
          }}
          className={cn(positionClasses[position], className)}
        >
          {/* Contenedor principal */}
          <div className="relative">
            {/* Don Candido Animation */}
            <div className="relative z-10">
              <DonCandidoAnimation
                animationType={animationType}
                size={size}
                loop={true}
                speed={1}
                visible={true}
              />
            </div>

            {/* Mensaje con burbuja de chat */}
            <AnimatePresence>
              {showMessage && message && (
                <motion.div
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className={cn(
                    'absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2',
                    'bg-white rounded-2xl shadow-lg border border-gray-200',
                    'max-w-xs px-4 py-3',
                    'before:content-[""] before:absolute before:top-full before:left-1/2 before:transform before:-translate-x-1/2',
                    'before:border-8 before:border-transparent before:border-t-white'
                  )}
                >
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {message}
                  </p>
                  
                  {/* Indicador de escritura */}
                  <motion.div
                    className="flex items-center mt-2 space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Efecto de partículas */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full"
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos(i * 60 * Math.PI / 180) * 50,
                    y: Math.sin(i * 60 * Math.PI / 180) * 50
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook para controlar Don Candido en el chat
export const useDonCandidoChat = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [animationType, setAnimationType] = useState<'saludo' | 'pensando' | 'feliz' | 'triste' | 'sorprendido'>('saludo');

  const showDonCandido = (
    msg: string, 
    type: 'saludo' | 'pensando' | 'feliz' | 'triste' | 'sorprendido' = 'saludo',
    duration = 5000
  ) => {
    setMessage(msg);
    setAnimationType(type);
    setVisible(true);
    
    if (duration > 0) {
      setTimeout(() => setVisible(false), duration);
    }
  };

  const hideDonCandido = () => {
    setVisible(false);
  };

  const showThinking = (msg: string = "Pensando...") => {
    showDonCandido(msg, 'pensando', 3000);
  };

  const showHappy = (msg: string = "¡Excelente!") => {
    showDonCandido(msg, 'feliz', 4000);
  };

  const showSad = (msg: string = "Ups, algo salió mal...") => {
    showDonCandido(msg, 'triste', 4000);
  };

  const showSurprised = (msg: string = "¡Wow!") => {
    showDonCandido(msg, 'sorprendido', 4000);
  };

  return {
    visible,
    message,
    animationType,
    showDonCandido,
    hideDonCandido,
    showThinking,
    showHappy,
    showSad,
    showSurprised,
    DonCandidoChatComponent: (props: Partial<DonCandidoChatProps>) => (
      <DonCandidoChat
        visible={visible}
        message={message}
        animationType={animationType}
        {...props}
      />
    )
  };
};

export default DonCandidoChat;
