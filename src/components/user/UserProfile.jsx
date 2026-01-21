import { useEffect, useState } from 'react';
import { Card, CardBody, Button, Input, Textarea, Spinner } from '@nextui-org/react';
import { useAuth } from '../../contexts/AuthContext';
import { usersService } from '../../services/api';
import { User, Mail, MapPin, Save } from 'lucide-react';

export default function UserProfile() {
  const { firebaseUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    bio: '',
    location: '',
  });

  useEffect(() => {
    loadProfile();
  }, [firebaseUser]);

  const loadProfile = async () => {
    try {
      const response = await usersService.getUserById(firebaseUser.uid);
      if (response.data) {
        setProfile(response.data);
        setFormData({
          displayName: response.data.displayName || '',
          email: response.data.email || '',
          bio: response.data.bio || '',
          location: response.data.location || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // En MVP, simulamos la actualización
    console.log('Perfil actualizado:', formData);
    setEditing(false);
    alert('✓ Perfil actualizado correctamente');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
          Mi Perfil
        </h1>
        <p className="text-gray-600">Administra tu información personal</p>
      </div>

      {/* Avatar Section */}
      <Card className="shadow-lg mb-6">
        <CardBody className="p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gradient-to-br from-[#0764bf] to-[#1800ad] rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{formData.displayName || 'Usuario'}</h2>
              <p className="text-gray-600">{formData.email}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Profile Information */}
      <Card className="shadow-lg">
        <CardBody className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Información Personal</h3>
            <Button
              size="sm"
              className={editing ? 'bg-red-500 text-white' : 'bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white'}
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Cancelar' : 'Editar'}
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              label="Nombre Completo"
              placeholder="Tu nombre"
              startContent={<User className="w-4 h-4 text-gray-400" />}
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              isReadOnly={!editing}
            />

            <Input
              label="Email"
              placeholder="tu@email.com"
              type="email"
              startContent={<Mail className="w-4 h-4 text-gray-400" />}
              value={formData.email}
              isReadOnly={true}
              description="Email no puede ser modificado"
            />

            <Input
              label="Ubicación"
              placeholder="Ciudad, País"
              startContent={<MapPin className="w-4 h-4 text-gray-400" />}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              isReadOnly={!editing}
            />

            <Textarea
              label="Bio"
              placeholder="Cuéntanos sobre ti..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              isReadOnly={!editing}
              minRows={3}
            />

            {editing && (
              <Button
                className="w-full bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
                size="lg"
                startContent={<Save className="w-4 h-4" />}
                onClick={handleSave}
              >
                Guardar Cambios
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card className="shadow-lg border-l-4 border-[#0764bf]">
          <CardBody className="p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">Encuestas Respondidas</p>
            <p className="text-3xl font-bold text-[#0764bf]">12</p>
          </CardBody>
        </Card>

        <Card className="shadow-lg border-l-4 border-[#1800ad]">
          <CardBody className="p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">Ganancias Totales</p>
            <p className="text-3xl font-bold text-[#1800ad]">S/ 145.50</p>
          </CardBody>
        </Card>

        <Card className="shadow-lg border-l-4 border-green-600">
          <CardBody className="p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">Calidad Promedio</p>
            <p className="text-3xl font-bold text-green-600">87%</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
