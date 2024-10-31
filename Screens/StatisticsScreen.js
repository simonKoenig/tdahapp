// React y React Native
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// Contexts
import { PatientsContext } from '../Context/PatientsProvider';
import { RewardsContext } from '../Context/RewardsProvider';
import { SubjectsContext } from '../Context/SubjectsProvider';
import { TasksContext } from '../Context/TaskProvider';
// Componentes
import PatientSelector from '../Components/PatientSelector';
import LoadingScreen from '../Components/LoadingScreen';
import GraphPie from '../Components/GraphPie';
import GraphBar from '../Components/GraphBar';
import GraphBarHours from '../Components/GraphBarHours';
// Import moment para formatear la fecha y mostrarla en español
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

function StatisticsScreen() {
    const { selectedPatientId } = useContext(PatientsContext);
    const { fetchRewards, rewards } = useContext(RewardsContext);
    const { fetchSubjects, subjects } = useContext(SubjectsContext);
    const { fetchTasks, tasks } = useContext(TasksContext);
    const [loading, setLoading] = useState(false);
    // Variables de estadísticas
    const [tareasTotales, setTareasTotales] = useState(0);
    const [tareasFinalizadas, setTareasFinalizadas] = useState(0);
    const [tareasVencidas, setTareasVencidas] = useState(0);
    const [tareasPendientes, setTareasPendientes] = useState(0);
    const [tareasEnProgreso, setTareasEnProgreso] = useState(0);
    const [cantidadMateriasConTareas, setcantidadMateriasConTareas] = useState('');
    const [cantidadMateriasConTareasEnProgreso, setcantidadMateriasConTareasEnProgreso] = useState('');
    const [cantidadMateriasConTareasPendiente, setcantidadMateriasConTareasPendiente] = useState('');
    const [cantidadMateriasConTareasFinalizadas, setcantidadMateriasConTareasFinalizadas] = useState('');
    const [cantidadMateriasConTareasVencidas, setcantidadMateriasConTareasVencidas] = useState('');
    const [cantidadTareasPorDia, setCantidadTareasPorDia] = useState([]);
    const [tiempoPromedioDeFinalizacion, setTiempoPromedioDeFinalizacion] = useState(0);
    const [horarioMayorProductividad, setHorarioMayorProductividad] = useState(null);
    const [tareasPorHora, setTareasPorHora] = useState(Array(24).fill(0));
    const [diaConMasTareasFinalizadas, setDiaConMasTareasFinalizadas] = useState('');

    // useEffect(() => {
    //     const fetchDataAndProcessStats = async () => {
    //         if (selectedPatientId) {
    //             setLoading(true); // Activar loading mientras se cargan y procesan los datos
    //             await Promise.all([
    //                 fetchRewards(selectedPatientId),
    //                 fetchSubjects(selectedPatientId),
    //                 fetchTasks(selectedPatientId)
    //             ]);

    //             // Procesar estadísticas después de cargar los datos
    //             filtrarTareas();
    //             setLoading(false); // Desactivar loading cuando todo esté listo
    //         }
    //     };

    //     fetchDataAndProcessStats();
    // }, [selectedPatientId]);

    // Función para manejar la selección de un paciente
    // const handlePatientSelection = async (patientId) => {
    //     if (patientId) {
    //         setLoading(true);
    //         await Promise.all([
    //             fetchRewards(patientId),
    //             fetchSubjects(patientId),
    //             fetchTasks(patientId)
    //         ]);
    //         setLoading(false); // Finalizar pantalla de carga una vez que todos los datos se hayan cargado
    //     }
    // };

    // // useEffect para filtrar las tareas cuando se selecciona un paciente
    // useEffect(() => {
    //     if (selectedPatientId && tasks.length > 0 && subjects.length > 0) {
    //         filtrarTareas();
    //     }
    // }, [selectedPatientId, tasks, subjects]);

    useEffect(() => {
        const loadDataAndProcessStats = async () => {
            if (selectedPatientId) {
                setLoading(true);

                await Promise.all([
                    fetchRewards(selectedPatientId),
                    fetchSubjects(selectedPatientId),
                    fetchTasks(selectedPatientId)
                ]);

                setLoading(false);
            }
        };

        loadDataAndProcessStats();
    }, [selectedPatientId]);

    useEffect(() => {
        // Ejecuta `filtrarTareas` solo cuando `tasks` y `subjects` estén cargados
        if (selectedPatientId && tasks.length > 0 && subjects.length > 0) {
            filtrarTareas();
        }
    }, [tasks, subjects]);




    // función para filtrar las tareas
    const filtrarTareas = () => {
        const cantidadTareasTotales = tasks.length;
        const tareasEnProgreso = tasks.filter(task => task.estado === 'En progreso');
        const tareasPendientes = tasks.filter(task => task.estado === 'Pendiente');
        const tareasFinalizadas = tasks.filter(task => task.estado === 'Finalizada');
        //console.log(tareasFinalizadas);
        const tareasVencidas = tasks.filter(task => task.estado === 'Vencida');

        setTareasTotales(cantidadTareasTotales);
        setTareasEnProgreso(tareasEnProgreso);
        setTareasPendientes(tareasPendientes);
        setTareasFinalizadas(tareasFinalizadas);
        setTareasVencidas(tareasVencidas);

        filtrarMaterias();
        if (tareasFinalizadas.length > 0) {
            contarTareasFinalizadasPorDia(tareasFinalizadas);
            calcularTiempoPromedioDeFinalizacion(tareasFinalizadas);
            calcularHorarioMayorProductividad(tareasFinalizadas);
        }
    }

    // Función para filtrar las materias que tienen tareas
    const filtrarMaterias = () => {
        const cantidadMateriasConTareas = contarTareasPorMateria(tasks);
        const cantidadMateriasConTareasEnProgreso = contarTareasPorMateria(tareasEnProgreso);
        const cantidadMateriasConTareasPendiente = contarTareasPorMateria(tareasPendientes);
        const cantidadMateriasConTareasFinalizadas = contarTareasPorMateria(tareasFinalizadas);
        const cantidadMateriasConTareasVencidas = contarTareasPorMateria(tareasVencidas);

        setcantidadMateriasConTareas(cantidadMateriasConTareas);
        setcantidadMateriasConTareasEnProgreso(cantidadMateriasConTareasEnProgreso);
        setcantidadMateriasConTareasPendiente(cantidadMateriasConTareasPendiente);
        setcantidadMateriasConTareasFinalizadas(cantidadMateriasConTareasFinalizadas);
        setcantidadMateriasConTareasVencidas(cantidadMateriasConTareasVencidas);
    };

    // Función para contar las tareas por materia y devolver un array con la cantidad de tareas por materia ordenadas de mayor a menor
    const contarTareasPorMateria = (tareasFiltradas) => {
        // Si no hay tareas filtradas, retornar un guión
        if (!Array.isArray(tareasFiltradas) || tareasFiltradas.length === 0) {
            return '';
        }

        // Obtener los IDs de las materias de las tareas filtradas y buscar los nombres de las materias en el array de materias
        const materiasId = tareasFiltradas.map(task => task.selectedSubjectId);
        const nombresMaterias = materiasId.map(selectedSubjectId => {
            const subject = subjects.find(subject => subject.id === selectedSubjectId);
            return subject ? subject.nombre : '';
        });

        // Contar la cantidad de tareas por materia
        const conteo = nombresMaterias.reduce((acc, materia) => {
            acc[materia] = (acc[materia] || 0) + 1;
            return acc;
        }, {});

        // Convertir el objeto `conteo` a un array de objetos con materia y cantidad
        const materiasOrdenadas = Object.entries(conteo)
            .map(([materia, cantidad]) => ({ materia, cantidad })) // Convertir a objetos
            .sort((a, b) => b.cantidad - a.cantidad); // Ordenar de mayor a menor por cantidad

        return materiasOrdenadas;
    };

    // Función para contar la cantidad de tareas finalizadas según el día de la semana
    const contarTareasFinalizadasPorDia = (tareasFinalizadas) => {
        const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

        // Iniciar el conteo con todos los días en 0
        const conteo = dias.reduce((acc, dia) => {
            acc[dia] = 0;
            return acc;
        }, {});

        // Contar las tareas finalizadas según el día de la semana
        tareasFinalizadas.forEach((tarea) => {
            const dia = tarea.correccion.correctionDate && tarea.correccion.correctionDate.toDate
                ? moment(tarea.correccion.correctionDate.toDate()).format('dddd')
                : '';

            if (conteo[dia] !== undefined) { // Evitar días no válidos
                conteo[dia]++;
            }
        });

        // Convertir el objeto en un array de objetos, preservando el orden de días
        const cantidadTareasPorDia = dias.map((dia) => ({
            dia,
            cantidad: conteo[dia],
        }));

        const DiaConMasTareasFinalizadas = cantidadTareasPorDia.reduce((max, item) =>
            item.cantidad > max.cantidad ? item : max
        );


        setDiaConMasTareasFinalizadas(DiaConMasTareasFinalizadas.dia);
        setCantidadTareasPorDia(cantidadTareasPorDia);
    };

    // Función para calcular el tiempo promedio de finalización de las tareas
    const calcularTiempoPromedioDeFinalizacion = (tareasFinalizadas) => {
        if (!tareasFinalizadas || tareasFinalizadas.length === 0) {
            setTiempoPromedioDeFinalizacion("No hay tareas finalizadas");
            return;
        }

        const tiempoTotal = tareasFinalizadas.reduce((acc, tarea) => {

            if (tarea.fechaCreacion && tarea.fechaCreacion.toDate && tarea.correccion && tarea.correccion.correctionDate && tarea.correccion.correctionDate.toDate) {
                const fechaCreacion = tarea.fechaCreacion?.toDate();
                const fechaFinalizacion = tarea.correccion?.correctionDate?.toDate();
                const tiempo = moment(fechaFinalizacion).diff(moment(fechaCreacion));
                return acc + tiempo;
            }
            return acc; // Si alguna fecha es inválida, se ignora esa tarea en el cálculo
        }, 0);

        // Promedio en milisegundos
        const tiempoPromedio = tiempoTotal / tareasFinalizadas.length;

        // Convertir el tiempo promedio usando Moment.js
        const horas = moment.duration(tiempoPromedio).asHours();
        const dias = moment.duration(tiempoPromedio).asDays();

        const tiempoPromedioFormateado =
            dias >= 1
                ? `${Math.floor(dias)} días`
                : `${Math.floor(horas)} horas`;

        setTiempoPromedioDeFinalizacion(tiempoPromedioFormateado);
    };

    // Función para calcular el horario de mayor productividad
    const calcularHorarioMayorProductividad = (tareasFinalizadas) => {

        if (!tareasFinalizadas || tareasFinalizadas.length === 0) {
            setHorarioMayorProductividad("No hay tareas finalizadas");
            return;
        }

        // Crear un array para contar tareas en cada hora (0–23)
        const tareasPorHoraTemp = Array(24).fill(0);

        // Recorrer tareas y acumular en el array según la hora de finalización
        tareasFinalizadas.forEach((tarea) => {
            if (!tarea.tareaTerminada || !tarea.tareaTerminada.toDate) {
                return;
            }

            const fechaFinalizacion = tarea.tareaTerminada.toDate();

            if (fechaFinalizacion) {
                const hora = moment(fechaFinalizacion).hour();
                tareasPorHoraTemp[hora]++;
            }
        });

        // Encontrar la hora con más tareas completadas
        const maxTareas = Math.max(...tareasPorHoraTemp);
        const horario = tareasPorHoraTemp.indexOf(maxTareas);

        // Actualizar los estados con los resultados
        setHorarioMayorProductividad(horario);
        setTareasPorHora(tareasPorHoraTemp);

        console.log(tareasPorHoraTemp);
        console.log("Hora con + completados", horario);
    };

    return (
        <View style={styles.container}>
            <PatientSelector />
            {loading ? (
                <LoadingScreen />
            ) : (
                selectedPatientId ? (
                    <ScrollView>
                        <Text style={styles.statText}>Cantidad de tareas: {tareasTotales}</Text>
                        <Text style={styles.statText}>Tareas en progreso: {tareasEnProgreso.length}</Text>
                        <Text style={styles.statText}>Tareas pendientes: {tareasPendientes.length}</Text>
                        <Text style={styles.statText}>Tareas completadas: {tareasFinalizadas.length}</Text>
                        <Text style={styles.statText}>Tareas vencidas: {tareasVencidas.length}</Text>
                        <Text style={styles.statText}>Materia con más tareas:
                            {cantidadMateriasConTareas.length > 0 ? cantidadMateriasConTareas[0].materia : 'No hay materias'}
                        </Text>
                        <Text style={styles.statText}>Materia con más tareas en progreso:
                            {cantidadMateriasConTareasEnProgreso.length > 0 ? cantidadMateriasConTareasEnProgreso[0].materia : 'No hay materias'}
                        </Text>
                        <Text style={styles.statText}>Materia con más tareas pendientes:
                            {cantidadMateriasConTareasPendiente.length > 0 ? cantidadMateriasConTareasPendiente[0].materia : 'No hay materias'}
                        </Text>
                        <Text style={styles.statText}>Materia con más tareas finalizadas:
                            {cantidadMateriasConTareasFinalizadas.length > 0 ? cantidadMateriasConTareasFinalizadas[0].materia : 'No hay materias'}
                        </Text>
                        <Text style={styles.statText}>Materia con más tareas vencidas:
                            {cantidadMateriasConTareasVencidas.length > 0 ? cantidadMateriasConTareasVencidas[0].materia : 'No hay materias'}
                        </Text>
                        <Text style={styles.statText}>Tiempo promedio de finalización de tareas:
                            {tiempoPromedioDeFinalizacion}
                        </Text>
                        <Text style={styles.statText}>Día de la semana con más tareas finalizadas:
                            {diaConMasTareasFinalizadas}
                        </Text>
                        <Text style={styles.statText}>Horario de mayor productividad:
                            {horarioMayorProductividad !== null ? `${horarioMayorProductividad}:00` : 'No hay tareas finalizadas'}
                        </Text>
                        <GraphPie data={cantidadMateriasConTareas} />
                        <GraphBar cantidadTareasPorDia={cantidadTareasPorDia} />
                        <GraphBarHours tareasPorHora={tareasPorHora} />
                    </ScrollView>
                ) : (
                    <Text style={styles.noPatientText}>Selecciona un paciente para ver sus estadísticas.</Text>
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
    },
    statText: {
        fontSize: 18,
        marginVertical: 10,
    },
    noPatientText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666666',
        marginTop: 20,
    }
});

export default StatisticsScreen;