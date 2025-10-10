'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Plus,
  User,
  MessageSquare,
  Paperclip,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Note {
  id?: string;
  texto: string;
  fecha: string;
  usuario_id: string;
  usuario_nombre: string;
  tipo?: 'nota' | 'comentario' | 'seguimiento' | 'sistema';
  archivos?: Array<{
    nombre: string;
    url: string;
    tipo: string;
  }>;
}

interface NotesTimelineProps {
  notes: Note[];
  onAddNote?: (note: Omit<Note, 'fecha' | 'usuario_id' | 'usuario_nombre'>) => void;
  onEditNote?: (noteId: string, updatedNote: Partial<Note>) => void;
  onDeleteNote?: (noteId: string) => void;
  currentUserId?: string;
  currentUserName?: string;
  readOnly?: boolean;
  maxHeight?: string;
  showAddForm?: boolean;
}

export default function NotesTimeline({
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  currentUserId = 'USER-001',
  currentUserName = 'Usuario Actual',
  readOnly = false,
  maxHeight = '400px',
  showAddForm = true
}: NotesTimelineProps) {
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState<'nota' | 'comentario' | 'seguimiento'>('nota');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim() || !onAddNote) return;

    const noteData = {
      texto: newNote.trim(),
      tipo: newNoteType
    };

    try {
      await onAddNote(noteData);
      setNewNote('');
      setNewNoteType('nota');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const getTipoIcon = (tipo?: string) => {
    switch (tipo) {
      case 'comentario':
        return <MessageSquare className="h-4 w-4" />;
      case 'seguimiento':
        return <CheckCircle className="h-4 w-4" />;
      case 'sistema':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo?: string) => {
    switch (tipo) {
      case 'comentario':
        return 'border-blue-500 bg-blue-50';
      case 'seguimiento':
        return 'border-green-500 bg-green-50';
      case 'sistema':
        return 'border-orange-500 bg-orange-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getTipoLabel = (tipo?: string) => {
    switch (tipo) {
      case 'comentario':
        return 'Comentario';
      case 'seguimiento':
        return 'Seguimiento';
      case 'sistema':
        return 'Sistema';
      default:
        return 'Nota';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} horas`;
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Notas y Comentarios
          <Badge variant="secondary">{notes.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="space-y-4 overflow-y-auto"
          style={{ maxHeight }}
        >
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay notas registradas</p>
              <p className="text-sm text-gray-400">Agrega la primera nota para comenzar</p>
            </div>
          ) : (
            notes.map((note, index) => (
              <div
                key={index}
                className={`border-l-4 pl-4 py-3 ${getTipoColor(note.tipo)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {getInitials(note.usuario_nombre)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{note.usuario_nombre}</span>
                        {note.tipo && note.tipo !== 'nota' && (
                          <Badge variant="outline" className="text-xs">
                            {getTipoLabel(note.tipo)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(note.fecha)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {!readOnly && onEditNote && (
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // Implementar edición de nota
                          console.log('Edit note:', note.id);
                        }}
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                  {note.texto}
                </div>

                {note.archivos && note.archivos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {note.archivos.map((archivo, fileIndex) => (
                      <div
                        key={fileIndex}
                        className="flex items-center space-x-1 px-2 py-1 bg-white rounded border text-xs"
                      >
                        <Paperclip className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-700">{archivo.nombre}</span>
                        <Button size="sm" variant="ghost" className="h-4 w-4 p-0">
                          <Info className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {showAddForm && !readOnly && (
          <div className="pt-4 border-t mt-4">
            {!isAdding ? (
              <Button
                onClick={() => setIsAdding(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Nota
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Tipo:</label>
                  <select
                    value={newNoteType}
                    onChange={(e) => setNewNoteType(e.target.value as any)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="nota">Nota</option>
                    <option value="comentario">Comentario</option>
                    <option value="seguimiento">Seguimiento</option>
                  </select>
                </div>
                
                <Textarea
                  placeholder="Escribe tu nota aquí..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAdding(false);
                      setNewNote('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}




