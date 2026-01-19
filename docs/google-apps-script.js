/**
 * GOOGLE APPS SCRIPT PARA CAPTURAR ENVÍOS DE GOOGLE FORMS
 * 
 * INSTRUCCIONES DE CONFIGURACIÓN:
 * 
 * 1. Abre tu Google Form
 * 2. Haz clic en los tres puntos (⋮) -> Editor de secuencias de comandos
 * 3. Copia y pega este código completo
 * 4. Reemplaza 'YOUR_VERCEL_WEBHOOK_URL' con tu URL real de Vercel
 * 5. Guarda el proyecto (Ctrl+S o Cmd+S)
 * 6. Haz clic en "Activadores" (ícono de reloj en la barra lateral)
 * 7. Crea un nuevo activador:
 *    - Función: onFormSubmit
 *    - Evento: Del formulario -> Al enviar formulario
 * 8. Autoriza los permisos cuando se soliciten
 * 
 * IMPORTANTE: Configura un campo oculto en tu Google Form:
 * - Pregunta: "User ID" (oculta para el usuario)
 * - Tipo: Respuesta corta
 * - Copia el entry.XXXXXXX de la URL del campo (necesario para la tarea)
 */

// ================ CONFIGURACIÓN ================
const WEBHOOK_URL = 'YOUR_VERCEL_WEBHOOK_URL'; // ⚠️ REEMPLAZAR CON TU URL
// Ejemplo: 'https://enwuan-mvp.vercel.app/api/validate-webhook'

/**
 * Función que se ejecuta automáticamente cuando se envía el formulario
 */
function onFormSubmit(e) {
  try {
    // Obtener las respuestas del formulario
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    // Extraer UID del usuario (campo oculto)
    let uid = null;
    let taskId = null;
    const responses = [];
    
    itemResponses.forEach(function(itemResponse) {
      const question = itemResponse.getItem().getTitle();
      const answer = itemResponse.getResponse();
      
      // Detectar el campo del UID (puede tener diferentes nombres)
      if (question.toLowerCase().includes('user id') || 
          question.toLowerCase().includes('uid') ||
          question.toLowerCase() === 'id') {
        // El UID puede venir en formato "uid:taskId" o solo "uid"
        const parts = answer.split(':');
        uid = parts[0];
        if (parts.length > 1) {
          taskId = parts[1];
        }
      } else {
        // Guardar pregunta y respuesta
        responses.push({
          question: question,
          answer: answer
        });
      }
    });
    
    // Validar que se haya capturado el UID
    if (!uid) {
      Logger.log('ERROR: No se encontró el UID del usuario');
      return;
    }
    
    // Si no hay taskId en el UID, intentar obtenerlo de otra forma
    // (Esto depende de cómo configures tu sistema)
    if (!taskId) {
      // Podrías tener un campo adicional o configurarlo manualmente
      Logger.log('ADVERTENCIA: No se encontró taskId');
    }
    
    // Preparar el payload para el webhook
    const payload = {
      uid: uid,
      taskId: taskId,
      responses: responses,
      timestamp: new Date().toISOString(),
      formTitle: formResponse.getEditResponseUrl() // Para debugging
    };
    
    // Enviar datos al webhook
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    // Log para debugging
    Logger.log('Respuesta del webhook: ' + responseCode);
    Logger.log('Contenido: ' + responseText);
    
    if (responseCode === 200) {
      Logger.log('✅ Envío procesado correctamente');
    } else {
      Logger.log('❌ Error al procesar: ' + responseText);
    }
    
  } catch (error) {
    Logger.log('❌ ERROR en onFormSubmit: ' + error.toString());
  }
}

/**
 * Función de prueba (opcional)
 * Ejecuta esto manualmente para probar la conexión con el webhook
 */
function testWebhook() {
  const testPayload = {
    uid: 'test-user-123',
    taskId: 'test-task-456',
    responses: [
      {
        question: '¿Cómo calificarías nuestro servicio?',
        answer: 'Excelente, muy satisfecho con la atención recibida'
      },
      {
        question: '¿Qué mejorarías?',
        answer: 'El tiempo de respuesta podría ser más rápido'
      }
    ],
    timestamp: new Date().toISOString()
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(testPayload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log('Test Response Code: ' + response.getResponseCode());
    Logger.log('Test Response: ' + response.getContentText());
  } catch (error) {
    Logger.log('Test Error: ' + error.toString());
  }
}

/**
 * NOTAS ADICIONALES:
 * 
 * 1. Para configurar el campo oculto del UID:
 *    - En tu formulario, añade una pregunta de "Respuesta corta"
 *    - Nómbrala "User ID" o "UID"
 *    - Ve al modo de vista previa del formulario
 *    - Inspecciona el HTML y busca el name="entry.XXXXXXX" de ese campo
 *    - Ese entry.XXXXXXX es lo que debes configurar en la tarea
 * 
 * 2. Para capturar también el taskId:
 *    - Puedes enviar en la URL: ?entry.XXXXX=UID:TASKID
 *    - El script lo parseará automáticamente
 * 
 * 3. Para debugging:
 *    - Ve a "Ejecuciones" en el editor de Apps Script
 *    - Verás los logs de cada envío
 *    - Útil para detectar problemas
 */
