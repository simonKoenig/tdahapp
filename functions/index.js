const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Función para obtener tokens de notificación del usuario
async function getUserTokens(userUID) {
  try {
    const userDoc = await db.collection('usuarios').doc(userUID).get();
    if (!userDoc.exists) {
      console.log(`El  ${userUID} no existe.`);
      return [];
    }
    const FCMtokens = userDoc.data().FCMtokens || [];
    if (FCMtokens.length === 0) {
      console.log(`El usuario ${userUID} no tiene tokens registrados.`);
    }
    return FCMtokens;
  } catch (error) {
    console.error(`Error al obtener tokens del usuario ${userUID}:`, error);
    return [];
  }
}

// Función para obtener tokens de notificación de los administradores vinculados a un paciente
async function getAdminTokensForPatient(userUID) {
  try {
    const adminsSnapshot = await db.collection('usuarios').where('rol', '==', 'administrador').get();
    const notificationTokens = [];

    for (const adminDoc of adminsSnapshot.docs) {
      const adminData = adminDoc.data();
      const adminTokens = adminData.FCMtokens || [];
      const adminUID = adminDoc.id;

      // Verificar si este administrador está vinculado al paciente
      const pacientesSnapshot = await db.collection(`usuarios/${adminUID}/pacientes`).get();
      if (pacientesSnapshot.docs.some(pacienteDoc => pacienteDoc.id === userUID)) {
        notificationTokens.push(...adminTokens);
      }
    }

    return notificationTokens;
  } catch (error) {
    console.error('Error obteniendo tokens de administradores vinculados:', error);
    return [];
  }
}

// Función para enviar notificaciones
async function sendNotification(tokens, title, body) {
  if (tokens.length === 0) {
    console.log('No hay tokens disponibles para enviar la notificación.');
    return;
  }

  const notificationMessage = {
    notification: {
      title: title,
      body: body,
    }
  };

  for (const token of tokens) {
    try {
      const response = await admin.messaging().send({
        ...notificationMessage,
        token: token,
      });
      console.log(`Notificación enviada al token ${token}:`, response);
    } catch (error) {
      console.error(`Error enviando notificación al token ${token}:`, error);
    }
  }
}

// Función para actualizar el estado de las tareas que están en progreso y que ya vencieron
async function updateTareasVencidas() {
  const now = new Date();

  try {
    const tasksSnapshot = await db.collectionGroup('tareas')
      .where('estado', '==', 'En progreso')
      .where('date', '<=', now)
      .get();

    if (tasksSnapshot.empty) {
      console.log('No hay tareas para actualizar');
      return;
    }

    const batch = db.batch();

    for (const taskDoc of tasksSnapshot.docs) {
      const taskRef = taskDoc.ref;
      const taskData = taskDoc.data();
      const nombreTarea = taskData.nombre || 'Sin nombre';
      const userUID = taskRef.parent.parent.id;

      // Obtener el nombre del usuario
      const userDoc = await db.collection('usuarios').doc(userUID).get();
      const userName = userDoc.exists ? userDoc.data().nombreApellido : 'Usuario desconocido';

      // Obtener tokens del usuario y de los administradores vinculados
      const userTokens = await getUserTokens(userUID);
      const adminTokens = await getAdminTokensForPatient(userUID);
      const allTokens = [...userTokens, ...adminTokens];

      // Enviar la notificación con diferentes mensajes para usuarios y administradores
      for (const token of allTokens) {
        const isAdminToken = adminTokens.includes(token);

        const title = 'Tarea vencida';
        const body = isAdminToken
          ? `La tarea "${nombreTarea}" del estudiante "${userName}" ha vencido.`
          : `La tarea "${nombreTarea}" ha vencido.`;

        await sendNotification([token], title, body);
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

// Función para enviar notificación al crear una nueva tarea (solo al usuario)
exports.onCreateTarea = functions.firestore
  .document('usuarios/{userId}/tareas/{tareaId}')
  .onCreate(async (snapshot, context) => {
    const tareaData = snapshot.data();
    const userId = context.params.userId;
    const nombreTarea = tareaData.nombre || 'Sin nombre';

    try {
      // Obtener solo los tokens del paciente (NO los de los administradores)
      const userTokens = await getUserTokens(userId);

      // Enviar la notificación solo al paciente
      await sendNotification(userTokens, 'Nueva tarea Asignada', `Se ha asignado una nueva tarea: "${nombreTarea}".`);
    } catch (error) {
      console.error('Error al enviar la notificación de nueva tarea:', error);
    }
  });


// // Función para enviar notificación cuando cambia el estado de la tarea (excluyendo "Vencida")
// exports.onUpdateTarea = functions.firestore
//   .document('usuarios/{userId}/tareas/{tareaId}')
//   .onUpdate(async (change, context) => {
//     const tareaDataBefore = change.before.data();
//     const tareaDataAfter = change.after.data();
//     const userId = context.params.userId;
//     const nombreTarea = tareaDataAfter.nombre || 'Sin nombre';

//     // Verificar si el estado ha cambiado
//     if (tareaDataBefore.estado !== tareaDataAfter.estado && tareaDataAfter.estado !== 'Vencida') {
//       try {
//         // Obtener solo los tokens del paciente
//         const userTokens = await getUserTokens(userId);

//         // Enviar la notificación solo al paciente
//         await sendNotification(
//           userTokens,
//           'Estado de Tarea Actualizado',
//           `La tarea "${nombreTarea}" ha cambiado de estado a "${tareaDataAfter.estado}".`
//         );
//       } catch (error) {
//         console.error('Error al enviar la notificación de cambio de estado:', error);
//       }
//     }
//   });

// Función para enviar notificación cuando la tarea pasa de 'En progreso' a 'Pendiente'
exports.onUpdateTarea = functions.firestore
  .document('usuarios/{userId}/tareas/{tareaId}')
  .onUpdate(async (change, context) => {
    const tareaDataBefore = change.before.data();
    const tareaDataAfter = change.after.data();
    const userId = context.params.userId;
    const nombreTarea = tareaDataAfter.nombre || 'Sin nombre';

    // Verificar si el estado ha cambiado de 'En progreso' a 'Pendiente'
    if (tareaDataBefore.estado === 'En progreso' && tareaDataAfter.estado === 'Pendiente') {
      try {
        // Obtener el nombre del usuario
        const userDoc = await db.collection('usuarios').doc(userId).get();
        const userName = userDoc.exists ? userDoc.data().nombreApellido : 'Usuario desconocido';

        // Obtener los tokens de los administradores vinculados al paciente
        const adminTokens = await getAdminTokensForPatient(userId);

        // Enviar la notificación solo a los administradores
        await sendNotification(
          adminTokens,
          'Tarea actualizada',
          `La tarea "${nombreTarea}" del estudiante "${userName}" ha cambiado su estado a "Pendiente".`
        );
      } catch (error) {
        console.error('Error al enviar la notificación de cambio de estado a los administradores:', error);
      }
    }
  });

exports.onUpdateTareaFinalizada = functions.firestore
  .document('usuarios/{userId}/tareas/{tareaId}')
  .onUpdate(async (change, context) => {
    const tareaDataBefore = change.before.data();
    const tareaDataAfter = change.after.data();
    const userId = context.params.userId;
    const nombreTarea = tareaDataAfter.nombre || 'Sin nombre';

    // Verificar si el estado ha cambiado de 'Pendiente' a 'Finalizada'
    if (tareaDataBefore.estado === 'Pendiente' && tareaDataAfter.estado === 'Finalizada') {
      try {
        // Obtener el nombre del usuario (paciente)
        const userDoc = await db.collection('usuarios').doc(userId).get();
        const userName = userDoc.exists ? userDoc.data().nombreApellido : 'Usuario desconocido';

        // Obtener el adminUID del campo corrección
        const adminUID = tareaDataAfter.correccion ? tareaDataAfter.correccion.adminUID : null;
        console.log('adminUID obtenido de la tarea:', adminUID);

        // Si hay un adminUID, obtener sus tokens
        let adminTokensToRemove = [];
        if (adminUID) {
          const adminDoc = await db.collection('usuarios').doc(adminUID).get();
          adminTokensToRemove = adminDoc.exists ? adminDoc.data().FCMtokens || [] : [];
          console.log(`Tokens del administrador (${adminUID}) que serán filtrados:`, adminTokensToRemove);
        }

        // Obtener los tokens de los administradores vinculados al paciente
        let adminTokens = await getAdminTokensForPatient(userId);

        // Filtrar los tokens del administrador que realizó la corrección
        const filteredAdminTokens = adminTokens.filter(token => !adminTokensToRemove.includes(token));
        console.log('Tokens después de filtrar (administradores que recibirán la notificación):', filteredAdminTokens);

        // Notificación para los administradores, excluyendo al que realizó la acción
        if (filteredAdminTokens.length > 0) {
          await sendNotification(
            filteredAdminTokens,
            'Tarea Finalizada',
            `La tarea "${nombreTarea}" del estudiante "${userName}" ha sido finalizada correctamente.`
          );
        }

        // Obtener los tokens del usuario (paciente)
        const userTokens = await getUserTokens(userId);

        // Notificación para el paciente, sin el nombre del usuario
        if (userTokens.length > 0) {
          await sendNotification(
            userTokens,
            'Tarea Finalizada',
            `¡Excelente! Tu tarea "${nombreTarea}" fue corregida exitosamente. ¡Buen trabajo!`
          );
        }
      } catch (error) {
        console.error('Error al enviar la notificación de tarea finalizada:', error);
      }
    }
  });
