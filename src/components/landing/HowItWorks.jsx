import { Card, CardBody } from '@nextui-org/react';

const steps = [
  {
    step: 1,
    icon: '📝',
    title: 'Regístrate Gratis',
    description: 'Crea tu cuenta con email y contraseña. Verifica tu identidad en 30 segundos.'
  },
  {
    step: 2,
    icon: '📱',
    title: 'Explora Encuestas',
    description: 'Navega por encuestas disponibles. Cada una muestra el tiempo, recompensa y nivel.'
  },
  {
    step: 3,
    icon: '✍️',
    title: 'Responde con Calidad',
    description: 'Completa la encuesta con respuestas honestas y coherentes. 2-10 minutos de tiempo.'
  },
  {
    step: 4,
    icon: '🤖',
    title: 'IA Valida tu Respuesta',
    description: 'Google Gemini verifica calidad automáticamente. Obtienes un score de calidad.'
  },
  {
    step: 5,
    icon: '💰',
    title: 'Gana Dinero Inmediatamente',
    description: 'Tu saldo se actualiza al instante. La recompensa se basa en tu nivel (Bronce/Plata/Oro).'
  },
  {
    step: 6,
    icon: '📈',
    title: 'Sube de Nivel',
    description: 'Mantén 75+ calidad para Plata, 90+ para Oro. Desbloquea recompensas mayores.'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            6 simples pasos para comenzar a ganar dinero desde hoy
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="relative">
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {item.step}
              </div>

              <Card className="bg-white border border-gray-200 h-full">
                <CardBody className="p-6">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-white border-2 border-indigo-200 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Sistema de Calidad Explicado</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="font-bold text-lg text-gray-900 mb-2">🟢 Bronce (0-74%)</p>
              <p className="text-gray-600">Recompensa estándar 100%. Respuestas coherentes y válidas.</p>
            </div>
            <div>
              <p className="font-bold text-lg text-gray-900 mb-2">🔵 Plata (75-89%)</p>
              <p className="text-gray-600">Recompensa mejorada 110%. Respuestas de buena calidad consistente.</p>
            </div>
            <div>
              <p className="font-bold text-lg text-gray-900 mb-2">🟡 Oro (90%+)</p>
              <p className="text-gray-600">Recompensa máxima 125%. Respuestas excepcionales y reflexivas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
