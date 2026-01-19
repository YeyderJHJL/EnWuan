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
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const TaskHistory = () => {
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  const loadHistory = async () => {
    try {
      const submissionsRef = collection(db, 'submissions');
      const q = query(
        submissionsRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const submissionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={18} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={18} className="text-red-600" />;
      default:
        return <Clock size={18} className="text-gray-400" />;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <Chip color="success" size="sm" variant="flat">Aprobada</Chip>;
      case 'rejected':
        return <Chip color="danger" size="sm" variant="flat">Rechazada</Chip>;
      default:
        return <Chip color="warning" size="sm" variant="flat">Pendiente</Chip>;
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
    <div className="space-y-4" data-testid="task-history">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Historial de Tareas ({submissions.length})</h3>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-500">Aún no has completado ninguna tarea</p>
            <p className="text-sm text-gray-400 mt-2">Ve a "Tareas Disponibles" para comenzar a ganar</p>
          </CardBody>
        </Card>
      ) : (
        <Table aria-label="Historial de tareas" data-testid="history-table">
          <TableHeader>
            <TableColumn>FECHA</TableColumn>
            <TableColumn>TAREA</TableColumn>
            <TableColumn>RECOMPENSA</TableColumn>
            <TableColumn>ESTADO</TableColumn>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id} data-testid={`history-row-${submission.id}`}>
                <TableCell>
                  {submission.createdAt ? 
                    new Date(submission.createdAt.seconds * 1000).toLocaleDateString('es-ES') 
                    : 'N/A'
                  }
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{submission.taskTitle || 'Tarea'}</p>
                    {submission.validationReason && submission.status === 'rejected' && (
                      <p className="text-xs text-red-500 mt-1">{submission.validationReason}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-green-600">
                    S/. {submission.reward?.toFixed(2) || '0.00'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(submission.status)}
                    {getStatusChip(submission.status)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TaskHistory;
