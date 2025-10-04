'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { DonCandidoChat, useDonCandidoChat } from '@/components/chat/DonCandidoChat';

interface DonCandidoContextType {
  // Estados
  visible: boolean;
  message: string;
  animationType: 'saludo' | 'pensando' | 'feliz' | 'triste' | 'sorprendido';
  
  // Métodos básicos
  showDonCandido: (msg: string, type?: 'saludo' | 'pensando' | 'feliz' | 'triste' | 'sorprendido', duration?: number) => void;
  hideDonCandido: () => void;
  
  // Métodos específicos
  showThinking: (msg?: string) => void;
  showHappy: (msg?: string) => void;
  showSad: (msg?: string) => void;
  showSurprised: (msg?: string) => void;
  
  // Métodos contextuales para diferentes partes del sistema
  showWelcome: () => void;
  showProcessComplete: () => void;
  showError: (errorMsg?: string) => void;
  showSuccess: (successMsg?: string) => void;
  showLoading: (loadingMsg?: string) => void;
  showHelp: () => void;
  showNotification: (notification: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const DonCandidoContext = createContext<DonCandidoContextType | undefined>(undefined);

interface DonCandidoProviderProps {
  children: ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  autoHide?: number;
}

export const DonCandidoProvider: React.FC<DonCandidoProviderProps> = ({
  children,
  position = 'bottom-right',
  size = 'lg',
  autoHide = 5000
}) => {
  const {
    visible,
    message,
    animationType,
    showDonCandido,
    hideDonCandido,
    showThinking,
    showHappy,
    showSad,
    showSurprised,
    DonCandidoChatComponent
  } = useDonCandidoChat();

  // Métodos contextuales
  const showWelcome = useCallback(() => {
    showDonCandido(
      "¡Hola! Soy Don Candido, tu asistente para ISO 9001. ¿En qué puedo ayudarte hoy?",
      'saludo',
      6000
    );
  }, [showDonCandido]);

  const showProcessComplete = useCallback(() => {
    showHappy("¡Proceso completado exitosamente! 🎉");
  }, [showHappy]);

  const showError = useCallback((errorMsg: string = "Algo salió mal. Vamos a solucionarlo juntos.") => {
    showSad(errorMsg);
  }, [showSad]);

  const showSuccess = useCallback((successMsg: string = "¡Perfecto! Todo está funcionando correctamente.") => {
    showHappy(successMsg);
  }, [showHappy]);

  const showLoading = useCallback((loadingMsg: string = "Procesando información...") => {
    showThinking(loadingMsg);
  }, [showThinking]);

  const showHelp = useCallback(() => {
    showDonCandido(
      "¿Necesitas ayuda? Puedo asistirte con procesos, documentos y puntos de norma ISO 9001.",
      'feliz',
      7000
    );
  }, [showDonCandido]);

  const showNotification = useCallback((
    notification: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const animationMap = {
      info: 'saludo' as const,
      success: 'feliz' as const,
      warning: 'sorprendido' as const,
      error: 'triste' as const
    };

    showDonCandido(notification, animationMap[type], 4000);
  }, [showDonCandido]);

  const contextValue: DonCandidoContextType = {
    visible,
    message,
    animationType,
    showDonCandido,
    hideDonCandido,
    showThinking,
    showHappy,
    showSad,
    showSurprised,
    showWelcome,
    showProcessComplete,
    showError,
    showSuccess,
    showLoading,
    showHelp,
    showNotification
  };

  return (
    <DonCandidoContext.Provider value={contextValue}>
      {children}
      <DonCandidoChatComponent
        position={position}
        size={size}
        autoHide={autoHide}
      />
    </DonCandidoContext.Provider>
  );
};

// Hook para usar Don Candido
export const useDonCandidoContext = (): DonCandidoContextType => {
  const context = useContext(DonCandidoContext);
  if (!context) {
    throw new Error('useDonCandidoContext debe ser usado dentro de DonCandidoProvider');
  }
  return context;
};

// Hook simplificado para casos comunes
export const useDonCandidoActions = () => {
  const {
    showWelcome,
    showProcessComplete,
    showError,
    showSuccess,
    showLoading,
    showHelp,
    showNotification
  } = useDonCandidoContext();

  return {
    welcome: showWelcome,
    complete: showProcessComplete,
    error: showError,
    success: showSuccess,
    loading: showLoading,
    help: showHelp,
    notify: showNotification
  };
};

export default DonCandidoContext;
