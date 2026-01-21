import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Input, Select, SelectItem, Textarea, Spinner } from '@nextui-org/react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { surveysService, submissionsService } from '../services/api';

const QuestionTypeEnum = {
  MULTIPLE_CHOICE: 'multiple_choice',
  RANKING: 'ranking',
  OPEN: 'open',
};

export default function SurveyDetail() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Load survey
  useEffect(() => {
    const loadSurvey = async () => {
      try {
        setLoading(true);
        if (!surveyId) {
          setError('Survey ID no proporcionado');
          return;
        }

        const response = await surveysService.getSurveyById(surveyId);
        if (response.data) {
          setSurvey(response.data);
          // Initialize answers object
          const initialAnswers = {};
          response.data.questions?.forEach((q) => {
            initialAnswers[q.id] = '';
          });
          setAnswers(initialAnswers);
        }
      } catch (err) {
        console.error('Error loading survey:', err);
        setError('No se pudo cargar la encuesta');
      } finally {
        setLoading(false);
      }
    };

    loadSurvey();
  }, [surveyId]);

  // Handle answer change
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit survey
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Validate all questions are answered
      const unanswered = survey.questions.some(
        (q) => !answers[q.id] || answers[q.id].toString().trim() === ''
      );

      if (unanswered) {
        setError('Por favor responde todas las preguntas');
        setSubmitting(false);
        return;
      }

      // Format answers as array of objects
      const formattedAnswers = survey.questions.map((q) => ({
        questionId: q.id,
        questionText: q.text,
        answer: answers[q.id],
      }));

      // Submit to backend
      const response = await submissionsService.submitSurvey(surveyId, formattedAnswers);

      if (response.data) {
        setResult(response.data);
        // Scroll to result
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Error submitting survey:', err);
      setError(err.response?.data?.message || 'Error al enviar respuestas');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" label="Cargando encuesta..." />
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error && !survey) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-20">
          <Card className="bg-red-50 border border-red-200">
            <CardBody>
              <p className="text-red-700 font-semibold">{error}</p>
              <Button
                className="mt-4"
                onClick={() => navigate('/surveys')}
              >
                Volver a Encuestas
              </Button>
            </CardBody>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Result screen after submission
  if (result) {
    const qualityPercentage = Math.round(result.qualityScore * 100);
    const rewardAmount = result.rewardGiven || 0;

    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-12 px-4">
          {/* Success Card */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 mb-6">
            <CardBody className="p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-green-700 mb-2">
                ¡Encuesta Completada!
              </h2>
              <p className="text-green-600 mb-6">
                Tu respuesta ha sido validada por IA con éxito
              </p>

              {/* Quality Badge */}
              <div className="bg-white rounded-lg p-6 mb-6 border-2 border-green-200">
                <div className="text-sm text-gray-600 mb-2">Calidad de Respuesta</div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-5xl font-bold text-green-600">
                    {qualityPercentage}%
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-green-700">
                      {qualityPercentage >= 90 ? '⭐ Excelente' : 
                       qualityPercentage >= 75 ? '⭐ Bueno' : 
                       '✓ Válido'}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.validationReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reward Card */}
              <div className="bg-white rounded-lg p-6 border-2 border-yellow-300">
                <div className="text-sm text-gray-600 mb-2">Recompensa Obtenida</div>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-yellow-500">
                    ${rewardAmount.toFixed(2)}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Se agregó a tu saldo</div>
                    <div className="text-lg font-semibold text-green-600 mt-1">
                      {currentUser?.balance ? `Saldo Total: $${(currentUser.balance + rewardAmount).toFixed(2)}` : 'Saldo actualizado'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Level Info */}
              {result.newLevel && (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mt-6 text-center">
                  <div className="text-sm text-blue-600">🎉 ¡Felicidades!</div>
                  <div className="font-bold text-blue-700 text-lg">
                    Subiste a nivel {result.newLevel.toUpperCase()}
                  </div>
                  <div className="text-sm text-blue-600 mt-2">
                    Tus ganancias futuras serán mayores
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              fullWidth
              onClick={() => navigate('/surveys')}
              className="bg-indigo-600 text-white font-bold"
            >
              Ver Más Encuestas
            </Button>
            <Button
              fullWidth
              onClick={() => navigate('/dashboard/user')}
              variant="bordered"
              className="border-indigo-600 text-indigo-600"
            >
              Ir a Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Survey form
  if (!survey) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-12">
          <Card>
            <CardBody>
              <p>Encuesta no encontrada</p>
              <Button onClick={() => navigate('/surveys')} className="mt-4">
                Volver
              </Button>
            </CardBody>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Survey Header */}
        <Card className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <CardBody className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {survey.title}
            </h1>
            <p className="text-lg text-gray-700 mb-4">{survey.description}</p>

            {survey.goal && (
              <div className="bg-white rounded-lg p-4 border-l-4 border-indigo-500">
                <div className="text-sm font-semibold text-gray-600 mb-1">Objetivo</div>
                <p className="text-gray-700">{survey.goal}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <div>
                  <div className="text-xs text-gray-600">Tiempo estimado</div>
                  <div className="font-bold text-gray-900">5-10 minutos</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <div>
                  <div className="text-xs text-gray-600">Recompensa</div>
                  <div className="font-bold text-green-600">${survey.reward.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">❓</span>
                <div>
                  <div className="text-xs text-gray-600">Preguntas</div>
                  <div className="font-bold text-gray-900">{survey.questions?.length || 0}</div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Error Alert */}
        {error && (
          <Card className="mb-6 bg-red-50 border-2 border-red-300">
            <CardBody className="p-4">
              <p className="text-red-700 font-semibold">{error}</p>
            </CardBody>
          </Card>
        )}

        {/* Questions Form */}
        <div className="space-y-6 mb-8">
          {survey.questions?.map((question, index) => (
            <Card key={question.id} className="border border-gray-200">
              <CardBody className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {question.text}
                      {question.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h3>

                    {/* Render based on question type */}
                    {question.type === QuestionTypeEnum.MULTIPLE_CHOICE && (
                      <Select
                        label="Selecciona una opción"
                        value={answers[question.id]}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full"
                      >
                        {question.options?.map((option, i) => (
                          <SelectItem key={i} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </Select>
                    )}

                    {question.type === QuestionTypeEnum.RANKING && (
                      <Select
                        label="Selecciona una puntuación"
                        value={answers[question.id]}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full"
                      >
                        <SelectItem key="1" value="1">1 - Muy malo</SelectItem>
                        <SelectItem key="2" value="2">2 - Malo</SelectItem>
                        <SelectItem key="3" value="3">3 - Regular</SelectItem>
                        <SelectItem key="4" value="4">4 - Bueno</SelectItem>
                        <SelectItem key="5" value="5">5 - Excelente</SelectItem>
                      </Select>
                    )}

                    {question.type === QuestionTypeEnum.OPEN && (
                      <Textarea
                        placeholder="Escribe tu respuesta aquí..."
                        value={answers[question.id]}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        minRows={4}
                        maxRows={8}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            fullWidth
            onClick={() => navigate('/surveys')}
            variant="bordered"
            className="text-gray-700"
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold"
          >
            {submitting ? 'Enviando...' : 'Enviar Respuestas'}
          </Button>
        </div>

        {/* Info Box */}
        <Card className="mt-8 bg-blue-50 border border-blue-200">
          <CardBody className="p-4">
            <div className="flex gap-3">
              <span className="text-2xl flex-shrink-0">ℹ️</span>
              <div>
                <p className="font-semibold text-blue-900 mb-1">Validación por IA</p>
                <p className="text-sm text-blue-800">
                  Tus respuestas serán analizadas por Google Gemini para verificar calidad. 
                  Sé honesto y reflexivo para obtener mejores puntuaciones.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
