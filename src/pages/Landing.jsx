import { Button, Card, CardBody } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';

export default function LandingPage() {
  const { userProfile } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Gana dinero respondiendo encuestas
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            EnWuan te conecta con empresas que desean tus opiniones. Completa encuestas, gana recompensas y mejora tu nivel.
          </p>
          <div className="flex justify-center gap-4">
            {userProfile ? (
              <>
                <Button
                  as={Link}
                  to="/surveys"
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold"
                >
                  Explorar Encuestas
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/register?type=user"
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold"
                >
                  Empezar como Usuario
                </Button>
                <Button
                  as={Link}
                  to="/register?type=business"
                  size="lg"
                  variant="bordered"
                  className="border-2 border-purple-600 text-purple-600 font-bold"
                >
                  Crear Empresa
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-purple-50 rounded-3xl my-12">
        <h2 className="text-4xl font-bold text-center mb-12">¿Cómo funciona EnWuan?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-lg">
            <CardBody className="p-8">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-2xl font-bold mb-4">Para Usuarios</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Completa encuestas cortas</li>
                <li>✓ Gana dinero por respuesta</li>
                <li>✓ Mejora tu nivel</li>
                <li>✓ Desbloquea recompensas</li>
              </ul>
            </CardBody>
          </Card>

          <Card className="shadow-lg">
            <CardBody className="p-8">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold mb-4">Para Empresas</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Crea encuestas propias</li>
                <li>✓ Obtén feedback real</li>
                <li>✓ IA valida calidad</li>
                <li>✓ Analítica avanzada</li>
              </ul>
            </CardBody>
          </Card>

          <Card className="shadow-lg">
            <CardBody className="p-8">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-4">Con IA</h3>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Valida respuestas</li>
                <li>✓ Sugiere preguntas</li>
                <li>✓ Genera insights</li>
                <li>✓ Predice tendencias</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Planes para Empresas</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {['Bronce', 'Plata', 'Oro'].map((plan, index) => (
            <Card key={plan} className={`${index === 1 ? 'ring-2 ring-purple-600 transform scale-105' : ''} shadow-lg`}>
              <CardBody className="p-8">
                <h3 className="text-3xl font-bold mb-4">{plan}</h3>
                <p className="text-4xl font-bold text-purple-600 mb-6">
                  ${[99, 299, 999][index]}/mes
                </p>
                <ul className="space-y-3 mb-8 text-gray-600">
                  <li>✓ {[5, 20, 'Ilimitadas'][index]} encuestas</li>
                  <li>✓ {[10, 100, 1000]  [index]} respuestas/mes</li>
                  <li>✓ Análisis básico</li>
                  {index >= 1 && <li>✓ Sugerencias IA</li>}
                  {index >= 2 && <li>✓ Soporte prioritario</li>}
                </ul>
                <Button className="w-full bg-purple-600 text-white font-bold">
                  Elegir Plan
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl text-white text-center">
        <h2 className="text-4xl font-bold mb-4">¿Listo para empezar?</h2>
        <p className="text-xl mb-8 opacity-90">Únete a miles de usuarios ganando dinero hoy</p>
        {!userProfile && (
          <Button
            as={Link}
            to="/register"
            size="lg"
            className="bg-white text-purple-600 font-bold"
          >
            Registrarse Gratis
          </Button>
        )}
      </section>
    </MainLayout>
  );
}
