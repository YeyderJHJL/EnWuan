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
import { Trash2, ExternalLink } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebase';

const TasksManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, orderBy('createdAt', 'desc'));
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

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        active: !currentStatus
      });
      // Actualizar estado local
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, active: !currentStatus } : task
      ));
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
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
    <div className="space-y-4" data-testid="tasks-management">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Tareas Creadas ({tasks.length})</h2>
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
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay tareas creadas aún</p>
        </div>
      ) : (
        <Table aria-label="Tabla de tareas" data-testid="tasks-table">
          <TableHeader>
            <TableColumn>TÍTULO</TableColumn>
            <TableColumn>RECOMPENSA</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} data-testid={`task-row-${task.id}`}>
                <TableCell>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{task.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip color="success" variant="flat">
                    S/. {task.reward?.toFixed(2) || '0.00'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Switch
                    data-testid={`task-switch-${task.id}`}
                    isSelected={task.active}
                    onValueChange={() => toggleTaskStatus(task.id, task.active)}
                    color="success"
                    size="sm"
                  >
                    {task.active ? 'Activa' : 'Inactiva'}
                  </Switch>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      data-testid={`task-view-${task.id}`}
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="primary"
                      onClick={() => window.open(task.form_url, '_blank')}
                    >
                      <ExternalLink size={16} />
                    </Button>
                    <Button
                      data-testid={`task-delete-${task.id}`}
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
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

export default TasksManagement;
