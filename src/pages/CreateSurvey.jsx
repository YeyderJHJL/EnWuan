import { useState } from 'react';
import { Card, CardBody, Button, Input, Textarea, Select, SelectItem } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { surveysService, companiesService } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import { Plus, Trash2, Sparkles } from 'lucide-react';

export default function CreateSurvey() {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: 1,
    estimatedTime: 5,
    questions: [
      {
        text: '',
        type: 'multiple_choice',
        options: ['', ''],
        required: true,
      },
    ],
  });

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: '',
          type: 'multiple_choice',
          options: ['', ''],
          required: true,
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.push('');
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Obtener empresa del usuario
      const companyResponse = await companiesService.getCompanyByUserId(firebaseUser.uid);
      
      if (!companyResponse.data) {
        setError('Debes completar tu perfil de empresa primero');
        setLoading(false);
        return;
      }

      await surveysService.createSurvey({
        ...formData,
        companyId: companyResponse.data.id,
      });

      navigate('/business/surveys');
    } catch (error) {
      console.error('Error creating survey:', error);
      setError('Error al crear la encuesta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
            Crear Nueva Encuesta
          </h1>
          <p className="text-gray-600">Diseña tu encuesta y obtén feedback valioso</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="shadow-lg">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold mb-4">Información Básica</h2>
              
              <div className="space-y-4">
                <Input
                  label="Título de la Encuesta"
                  placeholder="Ej: Encuesta de Satisfacción del Cliente"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  size="lg"
                />

                <Textarea
                  label="Descripción"
                  placeholder="Describe el objetivo de esta encuesta..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  minRows={3}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Recompensa (S/)"
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: parseFloat(e.target.value) })}
                    required
                    min="0.5"
                    step="0.5"
                  />

                  <Input
                    type="number"
                    label="Tiempo Estimado (minutos)"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: parseInt(e.target.value) })}
                    required
                    min="1"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Questions */}
          <Card className="shadow-lg">
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Preguntas</h2>
                <Button
                  size="sm"
                  variant="flat"
                  className="text-[#0764bf]"
                  startContent={<Sparkles className="w-4 h-4" />}
                >
                  IA Sugerir
                </Button>
              </div>

              <div className="space-y-6">
                {formData.questions.map((question, qIndex) => (
                  <Card key={qIndex} className="border-2 border-gray-200">
                    <CardBody className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-bold text-gray-500">Pregunta {qIndex + 1}</span>
                        {formData.questions.length > 1 && (
                          <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            color="danger"
                            onClick={() => removeQuestion(qIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Input
                          label="Texto de la pregunta"
                          placeholder="¿Qué te gustaría saber?"
                          value={question.text}
                          onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                          required
                        />

                        <Select
                          label="Tipo de pregunta"
                          selectedKeys={[question.type]}
                          onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                        >
                          <SelectItem key="multiple_choice" value="multiple_choice">
                            Opción Múltiple
                          </SelectItem>
                          <SelectItem key="rating" value="rating">
                            Calificación (1-5)
                          </SelectItem>
                          <SelectItem key="open" value="open">
                            Respuesta Abierta
                          </SelectItem>
                        </Select>

                        {question.type === 'multiple_choice' && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Opciones:</label>
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex gap-2">
                                <Input
                                  size="sm"
                                  placeholder={`Opción ${oIndex + 1}`}
                                  value={option}
                                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                  required
                                />
                                {question.options.length > 2 && (
                                  <Button
                                    size="sm"
                                    isIconOnly
                                    variant="light"
                                    color="danger"
                                    onClick={() => removeOption(qIndex, oIndex)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <Button
                              size="sm"
                              variant="flat"
                              onClick={() => addOption(qIndex)}
                              startContent={<Plus className="w-4 h-4" />}
                            >
                              Agregar Opción
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))}

                <Button
                  variant="bordered"
                  className="w-full border-2 border-dashed border-[#0764bf] text-[#0764bf] hover:bg-[#0764bf]/5"
                  onClick={addQuestion}
                  startContent={<Plus className="w-5 h-5" />}
                >
                  Agregar Pregunta
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="bordered"
              className="flex-1"
              onClick={() => navigate('/business/surveys')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
              isLoading={loading}
              size="lg"
            >
              {loading ? 'Creando...' : 'Crear Encuesta'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}