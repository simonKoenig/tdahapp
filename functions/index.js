const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// exports.updateTaskStatus = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
exports.prueba = functions.https.onRequest(async (req, res) => {
    const now = new Date();
    try {
        // Consultar todas las tareas en estado "en progreso" cuya fecha de vencimiento haya pasado
        const tasksSnapshot = await db.collectionGroup('tareas')
          .where('estado', '==', 'En progreso')
          .where('date', '>=', now)
          .get();
    
        if (tasksSnapshot.empty) {
          console.log('No hay tareas para actualizar');
          return res.status(200).send('No hay tareas para actualizar');
        }
    
        const batch = db.batch();
    
        // Actualizar el estado de las tareas vencidas
        tasksSnapshot.forEach((taskDoc) => {
          const taskRef = taskDoc.ref;
          batch.update(taskRef, { estado: 'vencida' });
        });
    
        await batch.commit();
        console.log('Tareas vencidas actualizadas correctamente');
        res.status(200).send('Tareas vencidas actualizadas correctamente');
    
    } 
    catch (error) {
        console.error('Error actualizando tareas vencidas:', error);
        res.status(500).send('Error actualizando tareas vencidas');
    }
});
