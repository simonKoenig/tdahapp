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
    tasksSnapshot.forEach((taskDoc) => {
      const taskRef = taskDoc.ref;
      batch.update(taskRef, { estado: 'Vencida' });
    });

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