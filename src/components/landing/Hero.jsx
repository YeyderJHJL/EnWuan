import { Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-transparent flex items-center justify-center px-4 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-6 inline-block">
          <span className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm border border-white/20">
            ✨ Gana dinero desde tu casa
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Monetiza tu <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-300">tiempo libre</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Responde encuestas validadas por IA, gana micro-ingresos y sube de nivel en nuestro sistema de gamificación
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 font-bold hover:bg-gray-100 px-8"
            >
              Registrarse Gratis
            </Button>
          </Link>
          <Link to="/login">
            <Button 
              size="lg" 
              variant="bordered" 
              className="border-white text-white hover:bg-white/10 px-8"
            >
              Iniciar Sesión
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white/70 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Sin depósito requerido</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Pagos directos a Payoneer</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Retiros desde $5</span>
          </div>
        </div>

        {/* Decorative element */}
        <div className="mt-16 relative">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-white">
                <p className="text-4xl font-bold text-yellow-300">5,000+</p>
                <p className="text-white/70 mt-2">Usuarios activos</p>
              </div>
              <div className="text-white">
                <p className="text-4xl font-bold text-pink-300">$150K+</p>
                <p className="text-white/70 mt-2">Pagado a usuarios</p>
              </div>
              <div className="text-white">
                <p className="text-4xl font-bold text-purple-300">10,000+</p>
                <p className="text-white/70 mt-2">Encuestas completadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
