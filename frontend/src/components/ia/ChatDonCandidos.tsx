'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, User, HardHat } from 'lucide-react';

interface Message {
  tipo: 'user' | 'assistant' | 'system';
  mensaje: string;
  timestamp: Date;
  sugerencias?: string[];
}

interface ContextoUsuario {
  id: string;
  nombre: string;
  puesto: string;
  departamento: string;
  nivel_experiencia: 'basico' | 'intermedio' | 'avanzado';
  procesos_asignados: string[];
  permisos: string[];
}

interface ContextoProceso {
  modulo: 'rrhh' | 'crm' | 'iso' | 'auditoria';
  seccion: string;
  proceso: string;
  documentos_relacionados: string[];
  clausulas_iso: string[];
}

interface ChatDonCandidosProps {
  contextoUsuario: ContextoUsuario;
  contextoProceso: ContextoProceso;
  onClose: () => void;
}

export function ChatDonCandidos({ contextoUsuario, contextoProceso, onClose }: ChatDonCandidosProps) {
  const [mensajes, setMensajes] = useState<Message[]>([
    {
      tipo: 'assistant',
      mensaje: `👷‍♂️ ¡Hola! Soy DON CANDIDOS, tu asesor experto en ISO 9001 con más de 20 años de experiencia.

Estoy aquí para ayudarte con:
• Normas y cláusulas ISO 9001
• Procesos de calidad
• Auditorías y hallazgos
• Mejora continua
• Gestión de riesgos

¿En qué puedo asesorarte hoy?`,
      timestamp: new Date(),
      sugerencias: [
        '¿Qué dice la cláusula 8.1 sobre la planificación y control operacional?',
        'Cómo documentar un proceso según ISO 9001',
        'Pasos para realizar una auditoría interna'
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

  const validarConsulta = (consulta: string): { valida: boolean; respuesta?: string } => {
    const topicosPermitidos = [
      'iso 9001', 'procesos', 'calidad', 'auditorias', 'auditoría',
      'no conformidades', 'acciones correctivas', 'mejora continua',
      'documentación', 'indicadores', 'objetivos', 'riesgos',
      'satisfacción cliente', 'revisión dirección', 'cláusula',
      'normas', 'certificación', 'sistema de gestión'
    ];

    const topicosProhibidos = [
      'política', 'deportes', 'entretenimiento', 'noticias',
      'temas personales', 'religión', 'economía general'
    ];

    // Verificar si contiene tópicos prohibidos
    const contieneProhibido = topicosProhibidos.some(topico =>
      consulta.toLowerCase().includes(topico.toLowerCase())
    );

    if (contieneProhibido) {
      return {
        valida: false,
        respuesta: "Solo puedo asesorarte sobre temas relacionados con el Sistema de Gestión de Calidad ISO 9001 y los procesos de nuestra organización."
      };
    }

    // Verificar si contiene al menos un tópico permitido
    const contienePermitido = topicosPermitidos.some(topico =>
      consulta.toLowerCase().includes(topico.toLowerCase())
    );

    if (!contienePermitido) {
      return {
        valida: false,
        respuesta: "Tu consulta parece no estar relacionada con ISO 9001. Solo puedo ayudarte con temas de gestión de calidad, procesos, auditorías y normas ISO 9001."
      };
    }

    return { valida: true };
  };

  const enviarMensaje = async (mensaje?: string) => {
    const textoMensaje = mensaje || inputMensaje;
    if (!textoMensaje.trim()) return;

    // Validar consulta
    const validacion = validarConsulta(textoMensaje);
    if (!validacion.valida) {
      const mensajeValidacion: Message = {
        tipo: 'assistant',
        mensaje: validacion.respuesta!,
        timestamp: new Date()
      };
      setMensajes(prev => [...prev, mensajeValidacion]);
      setInputMensaje('');
      return;
    }

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
      // Llamada a la API de DON CANDIDOS
      const response = await fetch('/api/ia/don-candidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: textoMensaje,
          contextoUsuario,
          contextoProceso,
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
      console.error('Error al comunicarse con DON CANDIDOS:', error);

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
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header del chat */}
      <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <HardHat className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-bold text-lg">DON CANDIDOS</h3>
          <p className="text-sm opacity-90">Asesor ISO 9001</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Área de conversación */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensajes.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.tipo === 'assistant' && (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <HardHat className="w-5 h-5 text-green-600" />
              </div>
            )}

            <div className={`flex flex-col max-w-[80%]`}>
              <div
                className={`
                  p-3 rounded-lg
                  ${msg.tipo === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
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
                      className="block w-full text-left text-xs bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 p-2 rounded transition-colors"
                    >
                      💡 {sugerencia}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-xs text-gray-400 mt-1">
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
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <HardHat className="w-5 h-5 text-green-600" />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMensaje}
            onChange={(e) => setInputMensaje(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
            placeholder="Pregunta sobre ISO 9001..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={cargando}
          />
          <button
            onClick={() => enviarMensaje()}
            disabled={cargando || !inputMensaje.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Solo consultas sobre ISO 9001, procesos y gestión de calidad
        </p>
      </div>
    </div>
  );
}