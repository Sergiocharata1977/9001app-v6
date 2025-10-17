'use client';

import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DonCandidoAnimationProps {
  /** Tipo de animación a mostrar */
  animationType?: 'saludo' | 'pensando' | 'feliz' | 'triste' | 'sorprendido';
  /** Tamaño de la animación */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Si debe aparecer automáticamente */
  autoShow?: boolean;
  /** Duración en ms antes de desaparecer (0 = no desaparece) */
  autoHide?: number;
  /** Si está visible */
  visible?: boolean;
  /** Callback cuando la animación termina */
  onAnimationComplete?: () => void;
  /** Callback cuando aparece */
  onShow?: () => void;
  /** Callback cuando desaparece */
  onHide?: () => void;
  /** Clase CSS adicional */
  className?: string;
  /** Si debe hacer loop */
  loop?: boolean;
  /** Velocidad de reproducción */
  speed?: number;
}

// Mapeo de tipos de animación a archivos
const animationFiles = {
  saludo: '/animations/don-candido-saludo.json',
  pensando: '/animations/don-candido-pensando.json',
  feliz: '/animations/don-candido-feliz.json',
  triste: '/animations/don-candido-triste.json',
  sorprendido: '/animations/don-candido-sorprendido.json'
};

// Mapeo de tamaños
const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48'
};

export const DonCandidoAnimation: React.FC<DonCandidoAnimationProps> = ({
  animationType = 'saludo',
  size = 'md',
  autoShow = false,
  autoHide = 3000,
  visible: controlledVisible,
  onAnimationComplete,
  onShow,
  onHide,
  className,
  loop = true,
  speed = 1
}) => {
  const [internalVisible, setInternalVisible] = useState(autoShow);
  const [animationData, setAnimationData] = useState(null);
  const lottieRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determinar si está visible (controlado o interno)
  const isVisible = controlledVisible !== undefined ? controlledVisible : internalVisible;

  // Cargar animación
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const animationFile = animationFiles[animationType];
        const response = await fetch(animationFile);
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Error cargando animación de Don Candido:', error);
        // Fallback a animación por defecto
        setAnimationData(null);
      }
    };

    loadAnimation();
  }, [animationType]);

  // Manejar autoShow
  useEffect(() => {
    if (autoShow) {
      setInternalVisible(true);
      onShow?.();
    }
  }, [autoShow, onShow]);

  // Manejar autoHide
  useEffect(() => {
    if (isVisible && autoHide > 0) {
      timeoutRef.current = setTimeout(() => {
        setInternalVisible(false);
        onHide?.();
      }, autoHide);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, autoHide, onHide]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAnimationComplete = () => {
    onAnimationComplete?.();
  };

  const handleShow = () => {
    if (controlledVisible === undefined) {
      setInternalVisible(true);
    }
    onShow?.();
  };

  const handleHide = () => {
    if (controlledVisible === undefined) {
      setInternalVisible(false);
    }
    onHide?.();
  };

  if (!animationData) {
    // Fallback: mostrar un placeholder simple
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              'flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white',
              sizeClasses[size],
              className
            )}
          >
            <span className="text-2xl">👨‍💼</span>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.5 
          }}
          className={cn('relative', sizeClasses[size], className)}
          onMouseEnter={handleShow}
          onMouseLeave={autoHide > 0 ? handleHide : undefined}
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop={loop}
            autoplay={true}
            speed={speed}
            onComplete={handleAnimationComplete}
            className="w-full h-full"
          />
          
          {/* Efecto de brillo */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent"
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0.8, 1.1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook para usar Don Candido de forma más fácil
export const useDonCandido = () => {
  const [visible, setVisible] = useState(false);

  const showDonCandido = (duration = 3000) => {
    setVisible(true);
    if (duration > 0) {
      setTimeout(() => setVisible(false), duration);
    }
  };

  const hideDonCandido = () => {
    setVisible(false);
  };

  return {
    visible,
    showDonCandido,
    hideDonCandido,
    DonCandido: (props: Partial<DonCandidoAnimationProps>) => (
      <DonCandidoAnimation visible={visible} {...props} />
    )
  };
};

export default DonCandidoAnimation;
