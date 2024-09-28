const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Función para actualizar el estado de las tareas que están en progreso y que ya vencieron
async function updateTareasVencidas() {
  const now = new Date();

  try {
    // Obtener las tareas en progreso que ya vencieron usando `collectionGroup`
    const tasksSnapshot = await db.collectionGroup('tareas')
      .where('estado', '==', 'En progreso')
      .where('date', '<=', now)
      .get();

    if (tasksSnapshot.empty) {
      console.log('No hay tareas para actualizar');
      return;
    }

    const batch = db.batch();
    const notificationPromises = [];
    const userTokens = ['frmvj6tZSRGeCldRkSbCGQ:APA91bFw5ViLGClbV7uaLt00OUt1pf9QWIYaPyLoqDWCzzZxU3mN0ySWFplOQ1jeOgUYn1z9Ct2isfsaVIT_PWJjRSNk5_trSKo4TAr4_z5E4oWoyR5360fNnuJeSTiqYZ03jqkRQe5X', 'fpIIit3rR4K7ln8gNRqoCO:APA91bFM64iRWUqNkyZIraHefadqiMvDyHtEqHRX3lHsFC8mznWgaBQA8rnVEGiMa-3BRXy4_auu400bj5u6PlzddTFZdEPmOzief08kUvrR5D5pu7piEVBfW6Gx49RJ1rZNVaNtwizR', 'elOpZivHSk2-Mr8NTsKY7Z:APA91bG_kL43aDnQWVQ2PzZfHYuPrNVjTJ-t8SUt40iBrCJfTMNGjTX78Oct9B-md5eS0zLXkbLDh3y_5dkOh2QZK4A3FIVsbAQXFFjne2MGMx8ffzkWOAArsQMU5vf7HS7QeMuJD4pj']; // Aquí agregaremos los tokens de los usuarios

    // Recoger todos los `UID` de los usuarios afectados
    const userUIDs = new Set(); // Usar `Set` para evitar duplicados

    // Recorrer las tareas y agregar los UID de los usuarios
    tasksSnapshot.forEach((taskDoc) => {
      const userUID = taskDoc.ref.parent.parent.id;
      userUIDs.add(userUID);
    });

    // Realizar una sola consulta para recuperar los nombres de todos los usuarios afectados
    const usersSnapshot = await db.collection('usuarios').where(admin.firestore.FieldPath.documentId(), 'in', Array.from(userUIDs)).get();

    // Crear un mapa (diccionario) para almacenar los nombres de los usuarios y sus tokens
    const userMap = {};
    usersSnapshot.forEach((userDoc) => {
      userMap[userDoc.id] = {
        nombre: userDoc.data().nombreApellido || 'Usuario Desconocido',
        token: userDoc.data().token // Asegúrate de que aquí tengas el token de FCM
      };
      userTokens.push(userDoc.data().token); // Agregar token a la lista
    });

    // Recorrer cada tarea vencida y actualizarla
    for (const taskDoc of tasksSnapshot.docs) {
      const taskRef = taskDoc.ref;
      const taskData = taskDoc.data(); // Obtener los datos de la tarea
      const nombreTarea = taskData.nombre || 'Sin nombre'; // Nombre de la tarea
      const userUID = taskRef.parent.parent.id; // Obtener el UID del usuario padre
      const nombreUsuario = userMap[userUID].nombre || 'Usuario Desconocido'; // Obtener el nombre del usuario del mapa

      console.log(`Tarea vencida: ${nombreTarea} para el usuario ${nombreUsuario} (UID: ${userUID})`); // Mostrar el UID y nombre de la tarea y del usuario en los logs

      // Crear el mensaje de notificación con el nombre del usuario y el nombre de la tarea
      const message = {
        notification: {
          title: `Tarea vencida`,
          body: `La tarea "${nombreTarea}" del usuario "${nombreUsuario}" ha vencido.`,
        },
      };

      // Agregar la notificación a la lista de promesas
      notificationPromises.push(admin.messaging().sendToDevice(userTokens, message));

      // Actualizar el estado de la tarea a 'Vencida'
      batch.update(taskRef, { estado: 'Vencida' });
    }

    // Ejecutar las actualizaciones en Firestore
    await batch.commit();

    // Enviar las notificaciones
    await Promise.all(notificationPromises);

    console.log('Tareas vencidas actualizadas y notificaciones enviadas correctamente');

  } catch (error) {
    console.error('Error actualizando tareas vencidas:', error);
  }
}

// Cloud Scheduler que ejecuta la función cada minuto para actualizar las tareas vencidas
exports.updateTareasVencidas = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  await updateTareasVencidas();
});
