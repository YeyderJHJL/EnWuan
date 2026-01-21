import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ValidationResult {
  isValid: boolean;
  reason: string;
  qualityScore: number;
}

export interface SuggestionResult {
  suggestions: string[];
  reasoning: string;
}

export interface AnalysisResult {
  insights: string[];
  recommendations: string[];
  predictions: string[];
  summary: string;
}

@Injectable()
export class AiService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('⚠️  GEMINI_API_KEY not found. AI features will be mocked.');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('✅ Google Gemini AI initialized');
  }

  /**
   * Validate user response quality using AI
   */
  async validateResponse(
    question: string,
    answer: string,
    questionType: string,
  ): Promise<ValidationResult> {
    if (!this.model) {
      // Mock response if no API key
      return {
        isValid: true,
        reason: 'Respuesta aceptada (modo demo)',
        qualityScore: 75,
      };
    }

    try {
      const prompt = `
Eres un validador de calidad de respuestas para encuestas.

Pregunta: "${question}"
Tipo de pregunta: ${questionType}
Respuesta del usuario: "${answer}"

Evalúa si la respuesta es válida y de calidad. Considera:
- ¿La respuesta tiene sentido para la pregunta?
- ¿Es spam o respuesta sin esfuerzo?
- ¿Aporta valor real?

Responde SOLO en formato JSON:
{
  "isValid": boolean,
  "reason": "razón corta en español",
  "qualityScore": número del 0-100
}
`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback if parsing fails
      return {
        isValid: true,
        reason: 'Respuesta procesada',
        qualityScore: 70,
      };
    } catch (error) {
      console.error('Error validating response:', error);
      return {
        isValid: true,
        reason: 'Error en validación, aceptada por defecto',
        qualityScore: 60,
      };
    }
  }

  /**
   * Suggest smart questions for companies based on their profile
   */
  async suggestQuestions(
    companyProfile: {
      name: string;
      description: string;
      sector: string;
      location?: string;
      targetAudience?: string;
      serviceMode?: string;
    },
    surveyGoal: string,
  ): Promise<SuggestionResult> {
    if (!this.model) {
      // Mock suggestions
      return {
        suggestions: [
          '¿Con qué frecuencia visita nuestro establecimiento?',
          '¿Cómo calificaría la calidad de nuestros productos?',
          '¿Qué mejoraría de nuestro servicio?',
        ],
        reasoning: 'Preguntas estándar generadas (modo demo)',
      };
    }

    try {
      const prompt = `
Eres un experto en diseño de encuestas para negocios.

Información de la empresa:
- Nombre: ${companyProfile.name}
- Descripción: ${companyProfile.description}
- Sector: ${companyProfile.sector}
- Ubicación: ${companyProfile.location || 'No especificada'}
- Público objetivo: ${companyProfile.targetAudience || 'General'}
- Modalidad: ${companyProfile.serviceMode || 'No especificada'}

Objetivo de la encuesta: ${surveyGoal}

Sugiere 5 preguntas inteligentes y específicas que:
1. Se alineen con el objetivo
2. Consideren el contexto del negocio
3. Generen insights accionables
4. Sean claras y directas

Responde SOLO en formato JSON:
{
  "suggestions": ["pregunta 1", "pregunta 2", "pregunta 3", "pregunta 4", "pregunta 5"],
  "reasoning": "breve explicación de por qué estas preguntas"
}
`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback
      return {
        suggestions: [
          '¿Qué aspectos valoras más de nuestro servicio?',
          '¿Cómo podemos mejorar tu experiencia?',
          '¿Recomendarías nuestro servicio?',
        ],
        reasoning: 'Preguntas generadas por defecto',
      };
    } catch (error) {
      console.error('Error suggesting questions:', error);
      return {
        suggestions: [
          '¿Qué tan satisfecho estás con nuestro servicio?',
          '¿Qué mejorarías?',
        ],
        reasoning: 'Error al generar sugerencias',
      };
    }
  }

  /**
   * Generate analysis and recommendations from survey results
   */
  async analyzeResults(
    surveyData: {
      title: string;
      questions: any[];
      responses: any[];
      companyProfile: any;
    },
  ): Promise<AnalysisResult> {
    if (!this.model) {
      // Mock analysis
      return {
        insights: [
          'La mayoría de usuarios están satisfechos',
          'Hay oportunidad de mejora en el servicio',
        ],
        recommendations: [
          'Implementar programa de fidelización',
          'Mejorar tiempos de respuesta',
        ],
        predictions: [
          'Se espera aumento de 15% en satisfacción',
        ],
        summary: 'Análisis generado en modo demo',
      };
    }

    try {
      const prompt = `
Eres un analista de negocios experto.

Encuesta: "${surveyData.title}"
Sector: ${surveyData.companyProfile?.sector || 'General'}
Número de respuestas: ${surveyData.responses.length}

Datos de respuestas:
${JSON.stringify(surveyData.responses.slice(0, 20), null, 2)}

Analiza estos resultados y genera:
1. 3-5 insights clave
2. 3-5 recomendaciones accionables
3. 2-3 predicciones o tendencias
4. Un resumen ejecutivo

Responde SOLO en formato JSON:
{
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": ["recomendación 1", "recomendación 2", ...],
  "predictions": ["predicción 1", "predicción 2", ...],
  "summary": "resumen ejecutivo breve"
}
`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback
      return {
        insights: ['Datos insuficientes para análisis completo'],
        recommendations: ['Continuar recolectando respuestas'],
        predictions: ['Tendencia en desarrollo'],
        summary: 'Análisis preliminar',
      };
    } catch (error) {
      console.error('Error analyzing results:', error);
      return {
        insights: ['Error en análisis'],
        recommendations: ['Revisar datos manualmente'],
        predictions: [],
        summary: 'Error al generar análisis',
      };
    }
  }

  /**
   * Generic method to analyze content with Gemini
   */
  async analyzeWithGemini(prompt: string): Promise<string> {
    if (!this.model) {
      // Return mock JSON response
      return JSON.stringify({
        isValid: true,
        reason: 'Mocked response',
        qualityScore: 75,
      });
    }

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Return fallback
      return JSON.stringify({
        isValid: true,
        reason: 'Default response due to error',
        qualityScore: 70,
      });
    }
  }
}
