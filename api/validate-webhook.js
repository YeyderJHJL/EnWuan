// Vercel Serverless Function para validar respuestas de Google Forms
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');

// Inicializar Firebase Admin (solo una vez)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  // Solo permitir POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid, taskId, responses } = req.body;

    // Validar datos recibidos
    if (!uid || !taskId || !responses) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Obtener información de la tarea
    const taskDoc = await db.collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const taskData = taskDoc.data();

    // Obtener información del usuario
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Preparar el prompt para Gemini
    const prompt = `Eres un auditor de datos especializado en validar respuestas de encuestas. 

Analiza si las respuestas son coherentes con las preguntas, detecta spam, respuestas muy cortas sin sentido, o respuestas generadas por bots.

**Tarea:** ${taskData.title}
**Descripción:** ${taskData.description}

**Preguntas y Respuestas:**
${responses.map((r, i) => `${i + 1}. Pregunta: ${r.question}\n   Respuesta: ${r.answer}`).join('\n\n')}

**Criterios de validación:**
- Las respuestas deben ser coherentes con las preguntas
- No deben ser spam (texto aleatorio, repetitivo)
- No deben ser respuestas genéricas sin sentido
- Deben tener un mínimo de esfuerzo y pensamiento
- No deben parecer generadas automáticamente

Retorna tu análisis en formato JSON con la siguiente estructura:
{
  "isValid": boolean,
  "reason": "Explicación detallada de tu decisión"
}`;

    // Llamar a Gemini AI
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.2,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Intentar parsear la respuesta como JSON
    let validation;
    try {
      // Extraer JSON del texto (puede venir con markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        validation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // Si no se puede parsear, asumir que es inválido
      validation = {
        isValid: false,
        reason: 'Error al validar la respuesta con IA',
      };
    }

    // Procesar el resultado
    const submissionData = {
      userId: uid,
      taskId: taskId,
      taskTitle: taskData.title,
      reward: taskData.reward,
      responses: responses,
      status: validation.isValid ? 'approved' : 'rejected',
      validationReason: validation.reason,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Crear el submission
    await db.collection('submissions').add(submissionData);

    // Si es válido, incrementar el saldo del usuario
    if (validation.isValid) {
      const userRef = db.collection('users').doc(uid);
      await userRef.update({
        balance: admin.firestore.FieldValue.increment(taskData.reward),
      });
    }

    return res.status(200).json({
      success: true,
      validation: validation,
      balanceUpdated: validation.isValid,
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
