const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Actualiza el estado de las tareas que están en progreso y que ya vencieron
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
    const notificationPromises = [];

    tasksSnapshot.forEach((taskDoc) => {
      const taskRef = taskDoc.ref;
      batch.update(taskRef, { estado: 'Vencida' });
    });

    const message = {
      token: 'dE3nn6Y0TwGdFcLE3dAXR9:APA91bEnRPS6bYWJMwzwwnUF8T5KoYPE97rIarLtAqy1nrclA3YBd9YIXyR_4bQcDyKQVD1E1sC1FHxjfmYVk4bGyytTWHEer7OjDMIdfhSuaE7jZWcHS_JRc3f4pPTL5WF09X0IFO0L',
      notification: {
        title: 'Tarea vencida',
        body: `La tarea ha vencido.`,
      },
    };

    notificationPromises.push(admin.messaging().send(message));


    await batch.commit();
    console.log('Tareas vencidas actualizadas correctamente');

  } catch (error) {
    console.error('Error actualizando tareas vencidas:', error);
  }
}

// Cloud Scheduler que ejecuta la función cada minuto para actualizar las tareas vencidas
exports.updateTareasVencidas = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  await updateTareasVencidas();
});