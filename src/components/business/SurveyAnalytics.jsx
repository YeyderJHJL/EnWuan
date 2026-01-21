import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Spinner } from '@nextui-org/react';
import { surveysService, analyticsService, submissionsService } from '../../services/api';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

export default function SurveyAnalytics() {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [qualityTrend, setQualityTrend] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [surveyRes, trendRes, breakdownRes, submissionsRes] = await Promise.all([
          surveysService.getSurveyById(surveyId),
          analyticsService.getSurveyQualityTrend(surveyId),
          analyticsService.getSurveyBreakdown(surveyId),
          submissionsService.getSubmissionsBySurvey(surveyId),
        ]);
        
        setSurvey(surveyRes.data);
        setQualityTrend(trendRes.data);
        setBreakdown(breakdownRes.data);
        setSubmissions(submissionsRes.data || []);
        
        // Calculate basic analytics
        const validSubmissions = (submissionsRes.data || []).filter(s => s.aiValidated);
        setAnalytics({
          totalResponses: submissionsRes.data?.length || 0,
          validResponses: validSubmissions.length,
          averageQuality: validSubmissions.length > 0
            ? validSubmissions.reduce((sum, s) => sum + (s.qualityScore || 0), 0) / validSubmissions.length
            : 0,
          responseRate: 0,
        });
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Error al cargar los análisis');
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) fetchData();
  }, [surveyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
          Análisis: {survey?.title}
        </h1>
        <p className="text-gray-600">Calidad y desempeño de respuestas</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-lg border-l-4 border-[#0764bf]">
          <CardBody className="p-6 text-center">
            <div className="flex justify-center mb-2">
              <BarChart3 className="w-6 h-6 text-[#0764bf]" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Respuestas</p>
            <p className="text-4xl font-bold text-[#0764bf]">{analytics?.totalResponses || 0}</p>
          </CardBody>
        </Card>

        <Card className="shadow-lg border-l-4 border-green-600">
          <CardBody className="p-6 text-center">
            <div className="flex justify-center mb-2">
              <PieChart className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Respuestas Válidas</p>
            <p className="text-4xl font-bold text-green-600">{analytics?.validResponses || 0}</p>
          </CardBody>
        </Card>

        <Card className="shadow-lg border-l-4 border-[#1800ad]">
          <CardBody className="p-6 text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-[#1800ad]" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Calidad Promedio</p>
            <p className="text-4xl font-bold text-[#1800ad]">{analytics?.averageQuality?.toFixed(1) || '0.0'}%</p>
          </CardBody>
        </Card>

        <Card className="shadow-lg border-l-4 border-orange-600">
          <CardBody className="p-6 text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Tasa de Validez</p>
            <p className="text-4xl font-bold text-orange-600">
              {analytics?.totalResponses > 0 
                ? ((analytics?.validResponses / analytics?.totalResponses) * 100).toFixed(0)
                : '0'
              }%
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Quality Distribution */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold mb-4">Distribución de Calidad</h3>
            
            {submissions.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Sin datos de distribución</p>
            ) : (
              <div className="space-y-4">
                {[
                  { range: '90-100%', color: '#22c55e', icon: '★★★★★' },
                  { range: '70-89%', color: '#3b82f6', icon: '★★★★☆' },
                  { range: '50-69%', color: '#f59e0b', icon: '★★★☆☆' },
                  { range: '0-49%', color: '#ef4444', icon: '★★☆☆☆' },
                ].map((range, idx) => {
                  const count = submissions.filter(s => {
                    const score = s.qualityScore || 0;
                    const [min, max] = range.range.split('-').map(n => parseInt(n));
                    return score >= min && score <= max;
                  }).length;
                  
                  return (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{range.range}</span>
                        <span className="text-sm text-gray-600">{count} respuestas</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-300"
                          style={{ 
                            backgroundColor: range.color,
                            width: `${submissions.length > 0 ? (count / submissions.length) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="shadow-lg">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold mb-4">Validación IA</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Respuestas Válidas</span>
                  <span className="text-sm font-bold text-green-600">{analytics?.validResponses || 0}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600"
                    style={{ width: `${analytics?.totalResponses > 0 ? (analytics?.validResponses / analytics?.totalResponses) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Requieren Revisión</span>
                  <span className="text-sm font-bold text-orange-600">{(analytics?.totalResponses || 0) - (analytics?.validResponses || 0)}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-600"
                    style={{ width: `${analytics?.totalResponses > 0 ? (((analytics?.totalResponses || 0) - (analytics?.validResponses || 0)) / analytics?.totalResponses) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#0764bf]/5 border border-[#0764bf]/20 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">ℹ️ Nota:</span> Las respuestas son validadas automáticamente por IA para asegurar calidad y relevancia.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="shadow-lg">
        <CardBody className="p-6">
          <h3 className="text-xl font-bold mb-4">Recomendaciones</h3>
          
          <div className="space-y-3">
            {analytics?.averageQuality >= 80 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✓ Excelente calidad de respuestas. Considera aumentar la recompensa para atraer más respondientes.</p>
              </div>
            )}
            
            {analytics?.averageQuality < 80 && analytics?.averageQuality >= 60 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">⚠ Calidad moderada. Intenta revisar tus preguntas o proporcionar más contexto.</p>
              </div>
            )}
            
            {analytics?.averageQuality < 60 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">! Calidad baja. Reformula tus preguntas y usa la ayuda de IA para mejorar.</p>
              </div>
            )}

            {submissions.length < 10 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">ℹ Aún tienes pocas respuestas. Espera a tener más datos para análisis más precisos.</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
