import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, Button, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@nextui-org/react';
import { surveysService, submissionsService } from '../../services/api';
import { ArrowLeft, Download } from 'lucide-react';

export default function SurveyResponses() {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [surveyRes, responsesRes] = await Promise.all([
          surveysService.getSurveyById(surveyId),
          submissionsService.getSubmissionsBySurvey(surveyId),
        ]);
        
        setSurvey(surveyRes.data);
        setResponses(responsesRes.data || []);
      } catch (err) {
        console.error('Error fetching responses:', err);
        setError('Error al cargar las respuestas');
      } finally {
        setLoading(false);
      }
    };

    if (surveyId) fetchData();
  }, [surveyId]);

  const handleDownload = () => {
    const csv = [
      ['ID', 'Usuario', 'Calidad', 'Fecha', 'Validación IA'],
      ...responses.map(r => [
        r.id,
        r.userId,
        r.qualityScore || 'N/A',
        new Date(r.createdAt).toLocaleDateString('es-ES'),
        r.aiValidated ? 'Válida' : 'No válida'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey?.title}-respuestas.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
          Respuestas de: {survey?.title}
        </h1>
        <p className="text-gray-600">Total: {responses.length} respuestas</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-lg border-l-4 border-[#0764bf]">
          <CardBody className="p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">Total Respuestas</p>
            <p className="text-4xl font-bold text-[#0764bf]">{responses.length}</p>
          </CardBody>
        </Card>
        <Card className="shadow-lg border-l-4 border-green-600">
          <CardBody className="p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">Calidad Promedio</p>
            <p className="text-4xl font-bold text-green-600">
              {responses.length > 0 
                ? (responses.reduce((sum, r) => sum + (r.qualityScore || 0), 0) / responses.length).toFixed(1)
                : 'N/A'
              }
            </p>
          </CardBody>
        </Card>
        <Card className="shadow-lg border-l-4 border-[#1800ad]">
          <CardBody className="p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">Validadas por IA</p>
            <p className="text-4xl font-bold text-[#1800ad]">
              {responses.filter(r => r.aiValidated).length}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-4">
        <Button
          variant="bordered"
          className="border-[#0764bf] text-[#0764bf]"
          startContent={<Download className="w-4 h-4" />}
          onClick={handleDownload}
        >
          Descargar CSV
        </Button>
      </div>

      {/* Responses Table */}
      {responses.length === 0 ? (
        <Card className="shadow-lg">
          <CardBody className="p-12 text-center">
            <p className="text-gray-600">Aún no hay respuestas para esta encuesta</p>
          </CardBody>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardBody className="p-0">
            <Table aria-label="Respuestas">
              <TableHeader>
                <TableColumn>Usuario ID</TableColumn>
                <TableColumn>Calidad</TableColumn>
                <TableColumn>Validación IA</TableColumn>
                <TableColumn>Fecha</TableColumn>
              </TableHeader>
              <TableBody>
                {responses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-mono text-sm">{response.userId.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#0764bf] to-[#1800ad]"
                            style={{ width: `${((response.qualityScore || 0) / 100) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{(response.qualityScore || 0).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color={response.aiValidated ? 'success' : 'default'}
                        variant="flat"
                        size="sm"
                      >
                        {response.aiValidated ? 'Válida' : 'Revisión'}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(response.createdAt).toLocaleDateString('es-ES')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
