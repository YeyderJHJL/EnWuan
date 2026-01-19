import { Link } from 'react-router-dom';
import { Button, Card, CardBody } from '@nextui-org/react';
import { Clock, TrendingUp, Shield, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Clock className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EnWuan
              </span>
            </div>
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="light" color="primary" data-testid="nav-login-button">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button color="primary" data-testid="nav-register-button">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Aprovecha tus <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">tiempos muertos</span>
            <br />
            y gana dinero
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Completa encuestas validadas por IA y recibe pagos reales. 
            Simple, rápido y confiable.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                color="primary" 
                className="font-semibold"
                data-testid="hero-get-started-button"
              >
                Comenzar Ahora
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="bordered"
              data-testid="hero-learn-more-button"
            >
              Saber Más
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué EnWuan?
          </h2>
          <p className="text-lg text-gray-600">
            La plataforma más confiable para ganar dinero en tu tiempo libre
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow" data-testid="feature-card-time">
            <CardBody className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Flexibilidad Total</h3>
              <p className="text-gray-600">
                Completa encuestas cuando quieras, donde quieras. Sin horarios fijos.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow" data-testid="feature-card-ai">
            <CardBody className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Validación con IA</h3>
              <p className="text-gray-600">
                Inteligencia artificial verifica la calidad de tus respuestas.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow" data-testid="feature-card-money">
            <CardBody className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pagos Reales</h3>
              <p className="text-gray-600">
                Retira tu dinero fácilmente a través de PayPal o transferencia.
              </p>
            </CardBody>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow" data-testid="feature-card-fast">
            <CardBody className="text-center space-y-4 p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="text-pink-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Rápido y Simple</h3>
              <p className="text-gray-600">
                Proceso sencillo. Regístrate y comienza a ganar en minutos.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-2xl">
          <CardBody className="text-center space-y-6 p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ¿Listo para empezar a ganar?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Únete a miles de usuarios que ya están aprovechando sus tiempos muertos
            </p>
            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 font-semibold hover:bg-blue-50"
                data-testid="cta-register-button"
              >
                Crear Cuenta Gratis
              </Button>
            </Link>
          </CardBody>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Clock className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold">EnWuan</span>
            </div>
            <p className="text-gray-400 mb-4">
              Aprovecha tus tiempos muertos para ganar dinero
            </p>
            <p className="text-sm text-gray-500">
              © 2025 EnWuan. Proyecto Startup Perú - Ely, Avril, Victor, Jhamil
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
