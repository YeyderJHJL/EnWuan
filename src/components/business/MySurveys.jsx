import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Switch,
  Spinner,
  Divider,
} from '@nextui-org/react';
import { ExternalLink, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const MySurveys = () => {
  const { currentUser } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  useEffect(() => {
    loadSurveys();
  }, [currentUser]);

  const loadSurveys = async () => {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef, 
        where('createdBy', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const surveysData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setSurveys(surveysData);
      
      // Calcular estadísticas
      const active = surveysData.filter(s => s.active).length;
      setStats({
        total: surveysData.length,
        active: active,
        inactive: surveysData.length - active,
      });
    } catch (error) {
      console.error('Error al cargar encuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSurveyStatus = async (surveyId, currentStatus) => {
    try {
      const surveyRef = doc(db, 'tasks', surveyId);
      await updateDoc(surveyRef, {
        active: !currentStatus
      });
      // Actualizar estado local
      setSurveys(surveys.map(survey => 
        survey.id === surveyId ? { ...survey, active: !currentStatus } : survey
      ));
      // Recalcular estadísticas
      const updatedSurveys = surveys.map(survey => 
        survey.id === surveyId ? { ...survey, active: !currentStatus } : survey
      );
      const active = updatedSurveys.filter(s => s.active).length;
      setStats({
        total: updatedSurveys.length,
        active: active,
        inactive: updatedSurveys.length - active,
      });
    } catch (error) {
      console.error('Error al actualizar encuesta:', error);
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
    <div className="space-y-6" data-testid="my-surveys">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none">
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total de Encuestas</p>
          </CardBody>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none">
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Activas</p>
          </CardBody>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none">
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
            <p className="text-sm text-gray-600">Inactivas</p>
          </CardBody>
        </Card>
      </div>

      {/* Lista de Encuestas */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Mis Encuestas</h3>
          <Button 
            size="sm" 
            variant="light" 
            color="primary"
            onClick={loadSurveys}
            data-testid="refresh-surveys-button"
          >
            Actualizar
          </Button>
        </div>

        {surveys.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-500">No has creado ninguna encuesta aún</p>
              <p className="text-sm text-gray-400 mt-2">Usa la pestaña "Crear Encuesta" para comenzar</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {surveys.map((survey) => (
              <Card key={survey.id} data-testid={`survey-card-${survey.id}`}>
                <CardHeader className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{survey.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{survey.description}</p>
                  </div>
                  <Switch
                    data-testid={`survey-switch-${survey.id}`}
                    isSelected={survey.active}
                    onValueChange={() => toggleSurveyStatus(survey.id, survey.active)}
                    color="success"
                    size="sm"
                  />
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="font-semibold text-green-600">
                        S/. {survey.reward?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {survey.active ? (
                        <>
                          <CheckCircle size={16} className="text-green-600" />
                          <Chip color="success" size="sm" variant="flat">Activa</Chip>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-gray-400" />
                          <Chip color="default" size="sm" variant="flat">Inactiva</Chip>
                        </>
                      )}
                    </div>
                    
                    <Button
                      data-testid={`survey-view-${survey.id}`}
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<ExternalLink size={16} />}
                      onClick={() => window.open(survey.form_url, '_blank')}
                    >
                      Ver Formulario
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySurveys;
