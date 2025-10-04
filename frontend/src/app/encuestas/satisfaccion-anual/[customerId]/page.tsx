'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, Send, CheckCircle } from 'lucide-react';

interface AnnualSurveyData {
  productQuality: number;
  serviceQuality: number;
  responsiveness: number;
  technicalSupport: number;
  priceValue: number;
  innovation: number;
  reliability: number;
  overallSatisfaction: number;
  willContinue: boolean;
  willRecommend: boolean;
  strengths?: string;
  weaknesses?: string;
  improvements?: string;
  competitorComparison?: string;
}

const AnnualSatisfactionSurvey = () => {
  const params = useParams();
  const customerId = params.customerId as string;

  const [ratings, setRatings] = useState<Omit<AnnualSurveyData, 'willContinue' | 'willRecommend' | 'strengths' | 'weaknesses' | 'improvements' | 'competitorComparison'>>({
    productQuality: 0,
    serviceQuality: 0,
    responsiveness: 0,
    technicalSupport: 0,
    priceValue: 0,
    innovation: 0,
    reliability: 0,
    overallSatisfaction: 0,
  });

  const [booleanAnswers, setBooleanAnswers] = useState({
    willContinue: null as boolean | null,
    willRecommend: null as boolean | null,
  });

  const [comments, setComments] = useState({
    strengths: '',
    weaknesses: '',
    improvements: '',
    competitorComparison: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const questions = [
    { key: 'productQuality', label: 'Calidad de los Productos' },
    { key: 'serviceQuality', label: 'Calidad del Servicio' },
    { key: 'responsiveness', label: 'Capacidad de Respuesta' },
    { key: 'technicalSupport', label: 'Soporte Técnico' },
    { key: 'priceValue', label: 'Relación Calidad-Precio' },
    { key: 'innovation', label: 'Innovación' },
    { key: 'reliability', label: 'Confiabilidad' },
    { key: 'overallSatisfaction', label: 'Satisfacción General' },
  ];

  const handleRatingChange = (question: keyof typeof ratings, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [question]: rating
    }));
  };

  const handleBooleanChange = (field: keyof typeof booleanAnswers, value: boolean) => {
    setBooleanAnswers(prev => ({
      ...prev,
      [field]: value
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
      const surveyData: AnnualSurveyData = {
        ...ratings,
        willContinue: booleanAnswers.willContinue!,
        willRecommend: booleanAnswers.willRecommend!,
        ...comments,
      };

      const response = await fetch('/api/customer-surveys/annual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          surveyYear: new Date().getFullYear(),
          ...surveyData,
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

  const renderStars = (question: keyof typeof ratings) => {
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

  const isFormValid = () => {
    const allRatingsComplete = Object.values(ratings).every(rating => rating > 0);
    const booleanAnswersComplete = booleanAnswers.willContinue !== null && booleanAnswers.willRecommend !== null;
    return allRatingsComplete && booleanAnswersComplete;
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
            Tu opinión es muy importante para nosotros. Nos ayuda a mejorar continuamente nuestros servicios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Encuesta Anual de Satisfacción
            </h1>
            <p className="text-gray-600">
              Tu opinión nos ayuda a mejorar. Por favor califica los siguientes aspectos de nuestros servicios:
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((question) => (
                <div key={question.key} className="border border-gray-200 rounded-lg p-6">
                  <label className="block text-lg font-medium text-gray-900 mb-4">
                    {question.label}
                  </label>
                  <div className="flex items-center space-x-4">
                    {renderStars(question.key as keyof typeof ratings)}
                    <span className="text-sm text-gray-500">
                      {ratings[question.key as keyof typeof ratings] > 0 &&
                        `${ratings[question.key as keyof typeof ratings]} estrella${ratings[question.key as keyof typeof ratings] !== 1 ? 's' : ''}`
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Boolean Questions */}
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <label className="block text-lg font-medium text-gray-900 mb-4">
                  ¿Continuarías trabajando con nosotros?
                </label>
                <div className="flex space-x-6">
                  <button
                    type="button"
                    onClick={() => handleBooleanChange('willContinue', true)}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      booleanAnswers.willContinue === true
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    disabled={submitted}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBooleanChange('willContinue', false)}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      booleanAnswers.willContinue === false
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    disabled={submitted}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <label className="block text-lg font-medium text-gray-900 mb-4">
                  ¿Nos recomendarías a otros?
                </label>
                <div className="flex space-x-6">
                  <button
                    type="button"
                    onClick={() => handleBooleanChange('willRecommend', true)}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      booleanAnswers.willRecommend === true
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    disabled={submitted}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBooleanChange('willRecommend', false)}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      booleanAnswers.willRecommend === false
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    disabled={submitted}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Fortalezas
                </label>
                <textarea
                  value={comments.strengths}
                  onChange={(e) => handleCommentChange('strengths', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="¿Cuáles son nuestros puntos fuertes?"
                  disabled={submitted}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Debilidades
                </label>
                <textarea
                  value={comments.weaknesses}
                  onChange={(e) => handleCommentChange('weaknesses', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="¿Dónde podemos mejorar?"
                  disabled={submitted}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Sugerencias de Mejora
                </label>
                <textarea
                  value={comments.improvements}
                  onChange={(e) => handleCommentChange('improvements', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="¿Qué podríamos hacer mejor?"
                  disabled={submitted}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  Comparación con Competidores
                </label>
                <textarea
                  value={comments.competitorComparison}
                  onChange={(e) => handleCommentChange('competitorComparison', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="¿Cómo nos comparamos con la competencia?"
                  disabled={submitted}
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading || submitted || !isFormValid()}
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

export default AnnualSatisfactionSurvey;