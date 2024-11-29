# plAAAner

**plAAAner** es una aplicación móvil desarrollada en React Native con Expo, Firebase y Google Cloud Functions diseñada para ayudar a los adolescentes con TDAH a organizar sus tareas escolares y mejorar su desempeño académico. La aplicación busca proporcionar herramientas para mejorar la concentración, promover la organización y mantener la motivación de los adolescentes, al mismo tiempo que les permite a profesionales y sus padres seguir su progreso con el fin de poder tomar decisiones informadas y diseñar intervenciones personalizadas que mejoren su bienestar. Además, nos aseguramos de priorizar la accesibilidad y usabilidad de la aplicación siguiendo las pautas WCAG para asegurar una experiencia inclusiva y adaptada a las necesidades de nuestros usuarios.

---

## Índice

1. [Introducción](#introducción)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Prerrequisitos](#prerrequisitos)
4. [Instalación](#instalación)
5. [Configuración](#configuración)
   - [Firebase](#configuración-de-firebase)
   - [Google Cloud Functions](#configuración-de-google-cloud-functions)
6. [Uso](#uso)

---

## Introducción

**plAAAner** combina herramientas de gestión de tareas y recompensas, ayudando a adolescentes con TDAH a organizar sus actividades y mejorar su productividad mediante la colaboración con familiares o docentes.

---

## Estructura del proyecto

El proyecto está organizado de la siguiente manera:

```markdown
plAAAner/
│
├── assets/             # Recursos estáticos (imágenes, íconos, etc.)
├── Components/         # Componentes reutilizables
├── Contexts/           # Contextos de React
	├── AuthProvider.js		    # Autenticación de los usuarios
	├── PatientsProvider.js		# Usuarios vinculados por parte del administrador
	├── RewardsProvider.js		# Recompensas para los estudiantes
	├── SubjectsProvider.js		# Materias para los estudiantes
	├── TaskProvider.js		    # Tareas para los estudiantes
├── functions/          # Google Cloud Functions
├── Modals/			   # Modales de la aplicación
├── Screens/            # Pantallas de la aplicación
├── Utils/              # Constantes globales y funciones auxiliares
├── .firebaserc         # Información sobre el proyecto Firebase
├── App.js              # Archivo principal de la aplicación
├── app.json            # Archivo de configuración de Expo
├── babel.config.js     # Archivo de configuración para Babel
├── eas.json            # Archivo de configuración EAS utilizado para buildear la aplicación
├── firebase-config.js  # Configuración y credenciales de Firebase
├── firebase.json       # Archivo de configuración para las herramientas de Firebase CLI
├── Navigation.js       # Configuración de la navegación, rutas y pantallas
├── package-lock.json   # Versiones de las dependencias instaladas
└── package.json        # Dependencias y metadatos del proyecto
```



---

## Prerrequisitos

Antes de comenzar, asegúrate de tener:

1. **Node.js**
   
2. **Expo CLI**  
   Instalar con:
   
   ```bash
   npm install -g expo-cli
   ```
   
3. **Firebase CLI**
    Instalar con:

   ```bash
   npm install -g firebase-tools
   ```

4. **Google Cloud SDK**
    [Instrucciones de instalación](https://cloud.google.com/sdk/docs/install)

5. **Cuenta de Firebase** y un proyecto configurado con plan Breeze.

------

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/simonKoenig/tdahapp.git
   cd tdahapp
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor Expo:

   ```bash
   expo start
   ```

Antes de iniciar el servidor, deben seguir las instrucciones de las documentaciones oficiales de Firebase y Google Cloud Functions para configurar sus servicios y obtener los archivos de configuración.

------

## Configuración

### Configuración de Firebase

1. **Crear un proyecto en Firebase**
    Accede a la [consola de Firebase](https://console.firebase.google.com/) y crea un proyecto.
2. **Habilitar Firestore y Authentication**
   - En **Firestore Database** crea una base de datos en modo de prueba.
   - En **Authentication**, habilitando el proveedor de autenticación correo electrónico/contraseña.
3. **Configurar Firebase en el proyecto**
   - Descarga los archivos de configuración `google-services.json` (para Android) o `GoogleService-Info.plist` (para iOS) desde la consola de Firebase.
4. **Configurar el archivo `firebase.js`**
    Asegúrate de incluir las credenciales de tu proyecto en este archivo para inicializar Firebase.

------

### Configuración de Google Cloud Functions

1. **Iniciar configuración de funciones**
    Ve al directorio de funciones:

   ```bash
   cd functions
   ```

   Configura Firebase Functions:

   ```bash
   firebase init functions
   ```

2. **Seleccionar el proyecto Firebase**
    Durante la configuración, selecciona el proyecto que configuraste en Firebase.

3. **Instalar dependencias de funciones**

   ```bash
   npm install
   ```

4. **Desplegar las funciones**

   ```bash
   firebase deploy --only functions
   ```
