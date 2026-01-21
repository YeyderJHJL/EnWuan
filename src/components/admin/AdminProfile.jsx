import { useEffect, useState } from 'react';
import { Card, CardBody, Button, Input, Spinner, Chip } from '@nextui-org/react';
import { useAuth } from '../../contexts/AuthContext';
import { usersService } from '../../services/api';
import { User, Mail, MapPin, Phone, Edit2, Check, X, Shield } from 'lucide-react';

export default function AdminProfile() {
  const { userProfile, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (userProfile?.uid) {
          const response = await usersService.getUserById(userProfile.uid);
          setProfile(response.data || userProfile);
          setFormData(response.data || userProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(userProfile);
        setFormData(userProfile);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile) fetchProfile();
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Aquí iría el update al backend si está disponible
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
          Mi Perfil
        </h1>
        <p className="text-gray-600 mt-2">Administrador del Sistema</p>
      </div>

      {/* Profile Card */}
      <Card className="shadow-lg mb-8">
        <CardBody className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{profile?.displayName || 'Admin'}</h2>
              <div className="flex items-center gap-4">
                <Chip
                  color="secondary"
                  variant="flat"
                  startContent={<Shield className="w-4 h-4" />}
                >
                  Administrador
                </Chip>
                <Chip
                  color="success"
                  variant="flat"
                >
                  {profile?.status === 'active' ? 'Activo' : 'Inactivo'}
                </Chip>
              </div>
            </div>
            <Button
              isIconOnly
              color={editing ? 'default' : 'primary'}
              variant="flat"
              onClick={() => setEditing(!editing)}
              style={!editing ? { backgroundColor: '#0764bf', color: 'white' } : {}}
            >
              {editing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </Button>
          </div>

          {/* Profile Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Nombre</label>
              <Input
                disabled={!editing}
                value={formData?.displayName || ''}
                onChange={handleChange}
                name="displayName"
                startContent={<User className="w-4 h-4 text-gray-400" />}
                placeholder="Nombre completo"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
              <Input
                disabled={true}
                value={profile?.email || ''}
                startContent={<Mail className="w-4 h-4 text-gray-400" />}
                placeholder="Email"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Teléfono</label>
              <Input
                disabled={!editing}
                value={formData?.phoneNumber || ''}
                onChange={handleChange}
                name="phoneNumber"
                startContent={<Phone className="w-4 h-4 text-gray-400" />}
                placeholder="Teléfono"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Ubicación</label>
              <Input
                disabled={!editing}
                value={formData?.location || ''}
                onChange={handleChange}
                name="location"
                startContent={<MapPin className="w-4 h-4 text-gray-400" />}
                placeholder="Ciudad, País"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="text-gray-600 text-sm">Miembro desde</p>
              <p className="text-lg font-bold" style={{ color: '#0764bf' }}>
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-ES') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Usuarios en sistema</p>
              <p className="text-lg font-bold" style={{ color: '#1800ad' }}>
                --
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Último acceso</p>
              <p className="text-lg font-bold" style={{ color: '#01002e' }}>
                Hoy
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {editing && (
              <>
                <Button
                  onClick={handleSave}
                  style={{ backgroundColor: '#0764bf', color: 'white' }}
                  startContent={<Check className="w-4 h-4" />}
                >
                  Guardar Cambios
                </Button>
                <Button
                  variant="bordered"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </Button>
              </>
            )}
            <Button
              color="danger"
              variant="flat"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Activity Info */}
      <Card className="shadow-lg border-l-4" style={{ borderLeftColor: '#0764bf' }}>
        <CardBody className="p-6">
          <h3 className="text-lg font-bold mb-4">Información Adicional</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Has administrado {profile?.companiesManaged || 0} empresas</p>
            <p>• Has gestionado {profile?.usersManaged || 0} usuarios</p>
            <p>• Últimas acciones: Monitoreo de sistema activo</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
