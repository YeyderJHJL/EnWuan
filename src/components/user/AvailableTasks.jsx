import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
} from '@nextui-org/react';
import { ExternalLink, DollarSign, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { surveysService } from '../../services/api';

export default function AvailableTasks() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const response = await surveysService.getActiveSurveys();
      setSurveys(response.data || []);
    } catch (error) {
      console.error('Error al cargar encuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSurvey = (surveyId) => {
    navigate(`/survey/${surveyId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
          Encuestas Disponibles ({surveys.length})
        </h3>
        <Button 
          size="sm" 
          variant="flat"
          className="text-[#0764bf] hover:bg-[#0764bf]/10"
          onClick={loadSurveys}
        >
          Actualizar
        </Button>
      </div>

      {surveys.length === 0 ? (
        <Card className="shadow-lg">
          <CardBody className="text-center py-12">
            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg font-medium">No hay encuestas disponibles ahora</p>
            <p className="text-sm text-gray-400 mt-2">Vuelve más tarde para encontrar nuevas oportunidades</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {surveys.map((survey) => (
            <Card 
              key={survey.id} 
              className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-[#0764bf]"
              isPressable
            >
              <CardHeader className="flex flex-col items-start gap-2 pb-2">
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{survey.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">Por: {survey.companyName || 'Empresa'}</p>
                  </div>
                  <Chip 
                    startContent={<DollarSign className="w-3 h-3" />}
                    className="bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
                    variant="flat"
                    size="sm"
                  >
                    S/ {survey.reward?.toFixed(2)}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {survey.description}
                </p>
                
                <div className="flex gap-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{survey.estimatedTime || 5} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {survey.questions?.length || 0} preguntas
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
                  startContent={<ExternalLink size={16} />}
                  onClick={() => handleStartSurvey(survey.id)}
                >
                  Responder Encuesta
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
