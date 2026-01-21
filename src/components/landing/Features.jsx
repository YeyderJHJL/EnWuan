import { Card, CardBody } from '@nextui-org/react';

const features = [
  {
    icon: '🎯',
    title: 'Encuestas Inteligentes',
    description: 'Validadas por IA para garantizar calidad y coherencia. Cada respuesta es verificada automáticamente.'
  },
  {
    icon: '💰',
    title: 'Ganancias Reales',
    description: 'Gana dinero por cada encuesta completada. Recompensas desde $0.50 hasta $5 por survey.'
  },
  {
    icon: '📈',
    title: 'Sistema de Niveles',
    description: 'Bronce → Plata → Oro. Sube de nivel y aumenta tus ganancias hasta 125%.'
  },
  {
    icon: '⚡',
    title: 'Respuestas Rápidas',
    description: 'Encuestas de 2-10 minutos. Completa desde tu celular, tablet o PC.'
  },
  {
    icon: '🏆',
    title: 'Gamificación',
    description: 'Compite con otros usuarios, gana insignias y desbloqu ea logros exclusivos.'
  },
  {
    icon: '💳',
    title: 'Retiros Fáciles',
    description: 'Dinero directo a Payoneer, Stripe o tu cuenta bancaria. Mínimo: $5.'
  }
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir EnWuan?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plataforma segura, confiable y validada por inteligencia artificial
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardBody className="p-6">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
