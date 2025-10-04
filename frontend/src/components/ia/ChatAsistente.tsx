'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  tipo: 'user' | 'assistant' | 'system';
  mensaje: string;
  timestamp: Date;
  sugerencias?: string[];
}

interface ChatAsistenteProps {
  modulo: string;
  submodulo?: string;
  onClose: () => void;
}

export function ChatAsistente({ modulo, submodulo, onClose }: ChatAsistenteProps) {
  const [mensajes, setMensajes] = useState<Message[]>([
    {
      tipo: 'assistant',
      mensaje: '👋 Hola, soy tu asistente de Recursos Humanos ISO 9001. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
      sugerencias: [
        'Cómo programar una capacitación',
        'Crear una evaluación de desempeño',
        'Consultar competencias requeridas'
      ]
    }
  ]);
  const [inputMensaje, setInputMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const enviarMensaje = async (mensaje?: string) => {
    const textoMensaje = mensaje || inputMensaje;
    if (!textoMensaje.trim()) return;

    // Agregar mensaje del usuario
    const nuevoMensajeUsuario: Message = {
      tipo: 'user',
      mensaje: textoMensaje,
      timestamp: new Date()
    };

    setMensajes(prev => [...prev, nuevoMensajeUsuario]);
    setInputMensaje('');
    setCargando(true);

    try {
      // Llamada a la API de Claude
      const response = await fetch('/api/ia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: textoMensaje,
          modulo,
          submodulo,
          historial: mensajes
        })
      });

      const data = await response.json();

      // Agregar respuesta del asistente
      const respuestaAsistente: Message = {
        tipo: 'assistant',
        mensaje: data.respuesta,
        timestamp: new Date(),
        sugerencias: data.sugerencias
      };

      setMensajes(prev => [...prev, respuestaAsistente]);
    } catch (error) {
      console.error('Error al comunicarse con IA:', error);

      const mensajeError: Message = {
        tipo: 'assistant',
        mensaje: 'Lo siento, hubo un error al procesar tu consulta. Por favor intenta nuevamente.',
        timestamp: new Date()
      };

      setMensajes(prev => [...prev, mensajeError]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold">Asistente IA RRHH</h3>
            <p className="text-xs text-emerald-100">ISO 9001 Specialist</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensajes.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.tipo === 'assistant' && (
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-emerald-600" />
              </div>
            )}

            <div className={`flex flex-col max-w-[80%]`}>
              <div
                className={`
                  p-3 rounded-2xl
                  ${msg.tipo === 'user'
                    ? 'bg-emerald-500 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-900 rounded-bl-none'
                  }
                `}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.mensaje}</p>
              </div>

              {/* Sugerencias */}
              {msg.sugerencias && msg.sugerencias.length > 0 && (
                <div className="mt-2 space-y-1">
                  {msg.sugerencias.map((sugerencia, i) => (
                    <button
                      key={i}
                      onClick={() => enviarMensaje(sugerencia)}
                      className="block w-full text-left text-xs bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 p-2 rounded-lg transition-colors"
                    >
                      💡 {sugerencia}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-xs text-slate-400 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>

            {msg.tipo === 'user' && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        ))}

        {cargando && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="bg-slate-100 p-3 rounded-2xl rounded-bl-none">
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMensaje}
            onChange={(e) => setInputMensaje(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
            placeholder="Escribe tu consulta..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={cargando}
          />
          <button
            onClick={() => enviarMensaje()}
            disabled={cargando || !inputMensaje.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white p-2 rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Pregunta sobre ISO 9001, procedimientos, capacitaciones, etc.
        </p>
      </div>
    </div>
  );
}