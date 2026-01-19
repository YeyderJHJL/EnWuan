import { useState } from 'react';
import { Card, CardBody, CardHeader, Input, Textarea, Button } from '@nextui-org/react';
import { Plus, DollarSign } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

const CreateTask = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    form_url: '',
    entry_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const tasksRef = collection(db, 'tasks');
      await addDoc(tasksRef, {
        title: formData.title,
        description: formData.description,
        reward: parseFloat(formData.reward),
        form_url: formData.form_url,
        entry_id: formData.entry_id,
        active: true,
        createdBy: currentUser.uid,
        createdByEmail: currentUser.email,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        reward: '',
        form_url: '',
        entry_id: '',
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error al crear la tarea');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-md" data-testid="create-task-card">
      <CardHeader className="flex gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Plus className="text-blue-600" size={20} />
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-bold">Crear Nueva Tarea</p>
          <p className="text-sm text-gray-500">Agrega una encuesta para que los usuarios completen</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded" data-testid="create-task-success">
              ¡Tarea creada exitosamente!
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" data-testid="create-task-error">
              {error}
            </div>
          )}

          <Input
            data-testid="task-title-input"
            label="Título de la Tarea"
            name="title"
            placeholder="Ej: Encuesta de satisfacción del cliente"
            value={formData.title}
            onChange={handleChange}
            required
            variant="bordered"
          />

          <Textarea
            data-testid="task-description-input"
            label="Descripción"
            name="description"
            placeholder="Describe qué debe hacer el usuario..."
            value={formData.description}
            onChange={handleChange}
            required
            variant="bordered"
            minRows={3}
          />

          <Input
            data-testid="task-reward-input"
            label="Recompensa (S/.)"
            name="reward"
            type="number"
            step="0.01"
            placeholder="Ej: 5.00"
            value={formData.reward}
            onChange={handleChange}
            required
            variant="bordered"
            startContent={<DollarSign size={18} className="text-gray-400" />}
          />

          <Input
            data-testid="task-form-url-input"
            label="URL del Google Form"
            name="form_url"
            type="url"
            placeholder="https://docs.google.com/forms/d/e/..."
            value={formData.form_url}
            onChange={handleChange}
            required
            variant="bordered"
          />

          <Input
            data-testid="task-entry-id-input"
            label="Entry ID del campo oculto"
            name="entry_id"
            placeholder="Ej: entry.123456789"
            value={formData.entry_id}
            onChange={handleChange}
            required
            variant="bordered"
            description="Este campo se usa para inyectar el UID del usuario"
          />

          <Button
            data-testid="create-task-submit-button"
            type="submit"
            color="primary"
            className="w-full"
            isLoading={loading}
          >
            Crear Tarea
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateTask;
