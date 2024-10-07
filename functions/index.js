const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Función para actualizar el estado de las tareas que están en progreso y que ya vencieron
async function updateTareasVencidas() {
  const now = new Date();

  try {
    // Obtener las tareas en progreso que ya vencieron usando collectionGroup
    const tasksSnapshot = await db.collectionGroup('tareas')
      .where('estado', '==', 'En progreso')
      .where('date', '<=', now)
      .get();

    if (tasksSnapshot.empty) {
      console.log('No hay tareas para actualizar');
      return;
    }

    const batch = db.batch();
    const userUIDs = new Set(); // Usar Set para evitar duplicados de UID de usuarios

    // Recorrer las tareas y agregar los UID de los usuarios afectados
    tasksSnapshot.forEach((taskDoc) => {
      const userUID = taskDoc.ref.parent.parent.id; // UID del usuario de la tarea
      userUIDs.add(userUID);
    });

    // Realizar una consulta para recuperar los nombres de todos los usuarios afectados
    const usersSnapshot = await db.collection('usuarios').where(admin.firestore.FieldPath.documentId(), 'in', Array.from(userUIDs)).get();

    // Crear un mapa (diccionario) para almacenar los nombres de los usuarios
    const userMap = {};
    usersSnapshot.forEach((userDoc) => {
      userMap[userDoc.id] = userDoc.data().nombreApellido || 'Usuario Desconocido';
    });

    // Consultar todos los administradores
    const adminsSnapshot = await db.collection('usuarios').where('rol', '==', 'administrador').get();

    // Recorrer cada tarea vencida y actualizarla
    for (const taskDoc of tasksSnapshot.docs) {
      const taskRef = taskDoc.ref;
      const taskData = taskDoc.data(); // Obtener los datos de la tarea
      const nombreTarea = taskData.nombre || 'Sin nombre'; // Nombre de la tarea
      const userUID = taskRef.parent.parent.id; // Obtener el UID del usuario padre
      const nombreUsuario = userMap[userUID] || 'Usuario Desconocido'; // Obtener el nombre del usuario del mapa

      console.log(`Tarea vencida: ${nombreTarea} para el usuario ${nombreUsuario} (UID: ${userUID})`); // Mostrar el UID y nombre de la tarea y del usuario en los logs

      // Crear un array para almacenar los tokens de los administradores que recibirán la notificación
      const notificationTokens = [];

      // Consultar token del paciente, en el atributi FCMtokens del const userUID = taskRef.parent.parent.id; y guardalo en el array notificationToken
      const userDoc = await db.collection('usuarios').doc(userUID).get();
      const userTokens = userDoc.data().FCMtokens || []; // Recuperar tokens del usuario
      if (userTokens.length > 0) {
        notificationTokens.push(...userTokens);
        console.log(`Tokens de notificación del usuario ${userUID} (Paciente):`, userTokens);
      } else {
        console.log(`El usuario ${userUID} (Paciente) no tiene tokens de notificación registrados.`);
      }

      // Consultar cada administrador y verificar si está vinculado a este paciente
      for (const adminDoc of adminsSnapshot.docs) {
        const adminData = adminDoc.data();
        const adminTokens = adminData.FCMtokens || []; // Recuperar tokens del administrador
        const adminUID = adminDoc.id;

        if (adminTokens.length === 0) {
          console.log(`El administrador ${adminUID} no tiene tokens registrados.`);
          // Si no tiene tokens, podrías notificar de otra manera, como por correo.
          continue;
        }

        // Verificar los pacientes de este administrador para ver si tienen la tarea vencida
        const pacientesSnapshot = await db.collection(`usuarios/${adminUID}/pacientes`).get();

        // Si este administrador tiene el paciente cuya tarea está vencida
        if (pacientesSnapshot.docs.some(pacienteDoc => pacienteDoc.id === userUID)) {
          // Agregar los tokens a la lista de tokens de notificación
          notificationTokens.push(...adminTokens);
          console.log(`Tokens de notificación para el administrador ${adminUID}:`, adminTokens);
        }
      }

      // Verificar si hay tokens antes de enviar notificaciones
      if (notificationTokens.length === 0) {
        console.log(`Ningún administrador vinculado tiene tokens registrados para la tarea "${nombreTarea}" del usuario "${nombreUsuario}".`);
      } else {
        // Enviar la notificación a cada token individualmente
        for (const token of notificationTokens) {
          const notificationMessage = {
            notification: {
              title: 'Tarea vencida',
              body: `La tarea "${nombreTarea}" del usuario "${nombreUsuario}" ha vencido.`,
            },
            token: token, // Mandar el token individualmente aquí
          };

          try {
            // Enviar la notificación al token individualmente
            const response = await admin.messaging().send(notificationMessage);
            console.log(`Notificación enviada correctamente al token ${token}:`, response);
          } catch (error) {
            console.error(`Error enviando notificación al token ${token}:`, error);
          }
        }
      }

      // Actualizar el estado de la tarea a 'Vencida'
      batch.update(taskRef, { estado: 'Vencida' });
    }

    // Ejecutar las actualizaciones en Firestore
    await batch.commit();

    console.log('Tareas vencidas actualizadas correctamente.');

  } catch (error) {
    console.error('Error actualizando tareas vencidas:', error);
  }
}

// Cloud Scheduler que ejecuta la función cada minuto para actualizar las tareas vencidas
exports.updateTareasVencidas = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  await updateTareasVencidas();
});

// Función para enviar notificación al crear una nueva tarea
exports.onCreateTarea = functions.firestore
  .document('usuarios/{userId}/tareas/{tareaId}')
  .onCreate(async (snapshot, context) => {
    const tareaData = snapshot.data(); // Datos de la tarea creada
    const userId = context.params.userId; // UID del usuario al que pertenece la tarea
    const nombreTarea = tareaData.nombre || 'Sin nombre'; // Nombre de la tarea

    try {
      // Obtener el nombre del usuario al que pertenece la tarea
      const userDoc = await db.collection('usuarios').doc(userId).get();
      const nombreUsuario = userDoc.exists ? userDoc.data().nombreApellido || 'Usuario Desconocido' : 'Usuario Desconocido';

      // Obtener los tokens de notificación del usuario (FCM tokens)
      const FCMtokens = userDoc.exists && userDoc.data().FCMtokens ? userDoc.data().FCMtokens : [];

      // Si no tiene tokens registrados, loguear y salir
      if (FCMtokens.length === 0) {
        console.log(`El usuario "${nombreUsuario}" (UID: ${userId}) no tiene tokens de notificación registrados.`);
        return; // Salir de la función, ya que no se puede enviar la notificación
      }

      console.log(`Nueva tarea creada: "${nombreTarea}" para el usuario: "${nombreUsuario}" (UID: ${userId})`);

      // Enviar la notificación a cada token individualmente
      for (const token of FCMtokens) {
        const notificationMessage = {
          notification: {
            title: 'Nueva Tarea Asignada',
            body: `Se ha asignado una nueva tarea: "${nombreTarea}".`,
          },
          token: token, // Enviar la notificación al token individualmente
        };

        try {
          const response = await admin.messaging().send(notificationMessage);
          console.log(`Notificación enviada correctamente al token ${token}:`, response);
        } catch (error) {
          console.error(`Error enviando notificación al token ${token}:`, error);
        }
      }

    } catch (error) {
      console.error('Error al notificar la nueva tarea:', error);
    }
  });