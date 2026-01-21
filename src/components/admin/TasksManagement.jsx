import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  Button,
  Chip,
  Spinner,
} from '@nextui-org/react';
import { Trash2 } from 'lucide-react';
import { surveysService } from '../../services/api';

const SurveysManagement = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const response = await surveysService.getActiveSurveys();
      setSurveys(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error al cargar encuestas:', error);
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSurveyStatus = async (surveyId, currentStatus) => {
    try {
      await surveysService.toggleSurveyActive(surveyId);
      setSurveys(surveys.map(survey => 
        survey.id === surveyId ? { ...survey, active: !currentStatus } : survey
      ));
    } catch (error) {
      console.error('Error al actualizar encuesta:', error);
    }
  };

  const deleteSurvey = async (surveyId) => {
    if (!confirm('¿Estás seguro de eliminar esta encuesta?')) return;

    try {
      await surveysService.deleteSurvey(surveyId);
      setSurveys(surveys.filter(survey => survey.id !== surveyId));
    } catch (error) {
      console.error('Error al eliminar encuesta:', error);
    }
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
        <h2 className="text-xl font-bold">Encuestas del Sistema ({surveys.length})</h2>
        <Button 
          size="sm" 
          variant="light"
          onClick={loadSurveys}
          style={{color: '#0764bf'}}
        >
          Actualizar
        </Button>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay encuestas creadas aún</p>
        </div>
      ) : (
        <Table aria-label="Tabla de encuestas">
          <TableHeader>
            <TableColumn>TÍTULO</TableColumn>
            <TableColumn>RECOMPENSA</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {surveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{survey.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{survey.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip color="success" variant="flat">
                    S/. {survey.reward?.toFixed(2) || '0.00'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Switch
                    isSelected={survey.isActive}
                    onValueChange={() => toggleSurveyStatus(survey.id, survey.isActive)}
                    color="success"
                    size="sm"
                  >
                    {survey.isActive ? 'Activa' : 'Inactiva'}
                  </Switch>
                </TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={() => deleteSurvey(survey.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SurveysManagement;
