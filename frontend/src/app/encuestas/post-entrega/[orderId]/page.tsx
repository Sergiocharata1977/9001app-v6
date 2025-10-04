'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, Send, CheckCircle } from 'lucide-react';

interface SurveyData {
  productQuality: number;
  deliveryTime: number;
  packaging: number;
  customerService: number;
}

interface SurveyFormData extends SurveyData {
  positiveComments?: string;
  negativeComments?: string;
  suggestions?: string;
}

const PostDeliverySurvey = () => {
  const params = useParams();
  const orderId = params.orderId as string;

  const [ratings, setRatings] = useState<SurveyData>({
    productQuality: 0,
    deliveryTime: 0,
    packaging: 0,
    customerService: 0,
  });

  const [comments, setComments] = useState({
    positiveComments: '',
    negativeComments: '',
    suggestions: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const questions = [
    { key: 'productQuality', label: 'Calidad del Producto' },
    { key: 'deliveryTime', label: 'Tiempo de Entrega' },
    { key: 'packaging', label: 'Empaque' },
    { key: 'customerService', label: 'Servicio al Cliente' },
  ];

  const handleRatingChange = (question: keyof SurveyData, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [question]: rating
    }));
  };

  const handleCommentChange = (field: string, value: string) => {
    setComments(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/customer-surveys/post-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          ratings,
          ...comments,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error('Error submitting survey');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (question: keyof SurveyData) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(question, star)}
            className="focus:outline-none"
            disabled={submitted}
          >
            <Star
              className={`h-8 w-8 ${
                star <= ratings[question]
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Gracias por tu tiempo!
          </h1>
          <p className="text-gray-600">
            Tu opinión es muy importante para nosotros. Nos ayuda a mejorar continuamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Encuesta de Satisfacción Post-Entrega
            </h1>
            <p className="text-gray-600">
              Tu opinión nos ayuda a mejorar. Por favor califica los siguientes aspectos:
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((question) => (
              <div key={question.key} className="border-b border-gray-200 pb-6">
                <label className="block text-lg font-medium text-gray-900 mb-4">
                  {question.label}
                </label>
                <div className="flex items-center space-x-4">
                  {renderStars(question.key as keyof SurveyData)}
                  <span className="text-sm text-gray-500">
                    {ratings[question.key as keyof SurveyData] > 0 &&
                      `${ratings[question.key as keyof SurveyData]} estrella${ratings[question.key as keyof SurveyData] !== 1 ? 's' : ''}`
                    }
                  </span>
                </div>
              </div>
            ))}

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Comentarios Positivos
                </label>
                <textarea
                  value={comments.positiveComments}
                  onChange={(e) => handleCommentChange('positiveComments', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="¿Qué te gustó especialmente?"
                  disabled={submitted}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Comentarios Negativos
                </label>
                <textarea
                  value={comments.negativeComments}
                  onChange={(e) => handleCommentChange('negativeComments', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="¿Qué podríamos mejorar?"
                  disabled={submitted}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Sugerencias
                </label>
                <textarea
                  value={comments.suggestions}
                  onChange={(e) => handleCommentChange('suggestions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="¿Tienes alguna sugerencia para nosotros?"
                  disabled={submitted}
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading || submitted}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>{loading ? 'Enviando...' : 'Enviar Encuesta'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostDeliverySurvey;