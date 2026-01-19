import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
} from '@nextui-org/react';
import { ExternalLink, DollarSign, Clock } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const AvailableTasks = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    // Construir URL con el UID del usuario
    const separator = task.form_url.includes('?') ? '&' : '?';
    const taskUrl = `${task.form_url}${separator}${task.entry_id}=${currentUser.uid}`;
    window.open(taskUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="available-tasks">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Tareas Disponibles ({tasks.length})</h3>
        <Button 
          size="sm" 
          variant="light" 
          color="primary"
          onClick={loadTasks}
          data-testid="refresh-tasks-button"
        >
          Actualizar
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg font-medium">No hay tareas disponibles ahora</p>
            <p className="text-sm text-gray-400 mt-2">Vuelve más tarde para encontrar nuevas oportunidades</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <Card 
              key={task.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              isPressable
              data-testid={`task-card-${task.id}`}
            >
              <CardHeader className="flex flex-col items-start gap-2 pb-2">
                <div className="flex justify-between items-start w-full">
                  <h4 className="text-lg font-bold">{task.title}</h4>
                  <Chip color="success" variant="flat" size="sm">
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span>S/. {task.reward?.toFixed(2)}</span>
                    </div>
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {task.description}
                </p>
                <Button
                  data-testid={`task-start-button-${task.id}`}
                  color="primary"
                  className="w-full"
                  startContent={<ExternalLink size={18} />}
                  onClick={() => handleTaskClick(task)}
                >
                  Realizar Tarea
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableTasks;
