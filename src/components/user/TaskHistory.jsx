import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
} from '@nextui-org/react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { submissionsService } from '../../services/api';

export default function TaskHistory() {
  const { firebaseUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [firebaseUser]);

  const loadHistory = async () => {
    try {
      const response = await submissionsService.getSubmissionsByUser(firebaseUser.uid);
      setSubmissions(response.data || []);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (validated) => {
    if (validated) {
      return <CheckCircle size={18} className="text-green-600" />;
    }
    return <AlertCircle size={18} className="text-orange-600" />;
  };

  const getStatusChip = (validated) => {
    if (validated) {
      return <Chip color="success" size="sm" variant="flat">Validada</Chip>;
    }
    return <Chip color="warning" size="sm" variant="flat">Revisión</Chip>;
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
          Historial de Respuestas ({submissions.length})
        </h3>
      </div>

      {submissions.length === 0 ? (
        <Card className="shadow-lg">
          <CardBody className="text-center py-12">
            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">Aún no has respondido ninguna encuesta</p>
            <p className="text-sm text-gray-400 mt-2">Ve a "Encuestas Disponibles" para comenzar a ganar</p>
          </CardBody>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardBody className="p-0">
            <Table aria-label="Historial de respuestas">
              <TableHeader>
                <TableColumn>FECHA</TableColumn>
                <TableColumn>ENCUESTA</TableColumn>
                <TableColumn>CALIDAD</TableColumn>
                <TableColumn>RECOMPENSA</TableColumn>
                <TableColumn>VALIDACIÓN</TableColumn>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="text-sm">
                      {new Date(submission.createdAt).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{submission.surveyTitle || 'Encuesta'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#0764bf] to-[#1800ad]"
                            style={{ width: `${(submission.qualityScore || 0)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{(submission.qualityScore || 0).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-[#0764bf]">
                        S/ {(submission.rewardGiven || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(submission.aiValidated)}
                        {getStatusChip(submission.aiValidated)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
