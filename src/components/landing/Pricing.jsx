import { Card, CardBody, Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Bronce',
    color: '#CD7F32',
    description: 'Comienza tu viaje',
    price: 'Gratis',
    features: [
      'Acceso a encuestas básicas',
      'Recompensas estándar (100%)',
      'Retiros sin comisión',
      'Soporte por email',
      'Dashboard básico'
    ],
    highlight: false
  },
  {
    name: 'Plata',
    color: '#C0C0C0',
    description: 'Para usuarios activos',
    price: 'Automático',
    subtitle: 'Al completar 50 encuestas',
    features: [
      'Todo de Bronce +',
      'Recompensas mejoradas (100-110%)',
      'Acceso a encuestas Premium',
      'Soporte prioritario',
      'Estadísticas avanzadas'
    ],
    highlight: false
  },
  {
    name: 'Oro',
    color: '#FFD700',
    description: 'Máximas ganancias',
    price: 'Automático',
    subtitle: 'Al mantener 90+ calidad',
    features: [
      'Todo de Plata +',
      'Recompensas máximas (125%)',
      'Acceso a encuestas VIP',
      'Community exclusiva',
      'Bonus mensual'
    ],
    highlight: true
  }
];

export default function Pricing() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sistema de Niveles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Progresa automáticamente según tu calidad de respuestas. Sin pagos, solo gana más.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div key={index} className="relative">
              {/* Highlight Badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                    ⭐ Más Popular
                  </span>
                </div>
              )}

              <Card 
                className={`${
                  plan.highlight 
                    ? 'md:scale-105 border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white' 
                    : 'border border-gray-200 bg-white'
                }`}
              >
                <CardBody className="p-8">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold"
                        style={{ backgroundColor: plan.color }}
                      >
                        ◆
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                    {plan.subtitle && (
                      <p className="text-sm text-gray-600 mt-2">{plan.subtitle}</p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-8 space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-green-500 text-lg leading-none mt-0.5">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link to="/register" className="w-full">
                    <Button 
                      fullWidth
                      className={`${
                        plan.highlight
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Comenzar
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">
            💡 <strong>Tip:</strong> Tu nivel se ajusta automáticamente cada semana según tu calidad promedio de respuestas. 
            No hay pagos requeridos - ¡solo sube de nivel completando encuestas de calidad!
          </p>
        </div>
      </div>
    </section>
  );
}
