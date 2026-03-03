import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Input, Button, Divider, Checkbox, RadioGroup, Radio } from '@nextui-org/react';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'user', // 'user' o 'business'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.displayName.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    setLoading(true);

    try {
      console.log('Iniciando registro con:', { email: formData.email, displayName: formData.displayName, accountType: formData.accountType });
      
      await signup(
        formData.email,
        formData.password,
        formData.displayName,
        formData.accountType
      );

      console.log('Registro exitoso, redirigiendo...');
      
      // Redirigir según el tipo de cuenta
      if (formData.accountType === 'business') {
        navigate('/onboarding/company');
      } else {
        navigate('/dashboard/user');
      }
    } catch (err) {
      console.error('Error de registro:', err);
      setError(err.response?.data?.message || err.message || 'Error al registrarse. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#01002e]/5 to-[#0764bf]/5 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-[#1800ad]" data-testid="register-card">
        <CardHeader className="flex flex-col gap-3 pb-0">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0764bf] to-[#1800ad] rounded-full flex items-center justify-center">
              <UserPlus className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">EnWuan</h1>
              <p className="text-sm text-gray-500">Crear Cuenta</p>
            </div>
          </div>
        </CardHeader>
        
        <Divider className="my-4" />
        
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" data-testid="register-error">
                {error}
              </div>
            )}

            <Input
              data-testid="register-name-input"
              type="text"
              label="Nombre Completo"
              name="displayName"
              placeholder="Juan Pérez"
              value={formData.displayName}
              onChange={handleChange}
              startContent={<User size={18} className="text-gray-400" />}
              required
              variant="bordered"
            />

            <Input
              data-testid="register-email-input"
              type="email"
              label="Email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              startContent={<Mail size={18} className="text-gray-400" />}
              required
              variant="bordered"
            />

            <Input
              data-testid="register-password-input"
              type="password"
              label="Contraseña"
              name="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              startContent={<Lock size={18} className="text-gray-400" />}
              required
              variant="bordered"
            />

            <Input
              data-testid="register-confirm-password-input"
              type="password"
              label="Confirmar Contraseña"
              name="confirmPassword"
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              startContent={<Lock size={18} className="text-gray-400" />}
              required
              variant="bordered"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Cuenta</label>
              <RadioGroup
                data-testid="register-account-type"
                value={formData.accountType}
                onValueChange={(value) => setFormData({ ...formData, accountType: value })}
              >
                <Radio value="user" data-testid="account-type-user">
                  <div className="flex flex-col">
                    <span className="font-medium">Usuario Normal</span>
                    <span className="text-xs text-gray-500">Completa encuestas y gana dinero</span>
                  </div>
                </Radio>
                <Radio value="business" data-testid="account-type-business">
                  <div className="flex flex-col">
                    <span className="font-medium">Empresa</span>
                    <span className="text-xs text-gray-500">Crea encuestas para tu negocio</span>
                  </div>
                </Radio>
              </RadioGroup>
            </div>

            <Button
              data-testid="register-submit-button"
              type="submit"
              className="w-full bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
              isLoading={loading}
            >
              Crear Cuenta
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-[#0764bf] hover:text-[#1800ad] font-medium transition-colors">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Register;
