import React, { useContext } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Toast from 'react-native-toast-message';
import { toastConfig } from './Utils/ToastConfig';

// Screens
import HomeScreen from "./Screens/HomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import StatisticsScreen from "./Screens/StatisticsScreen";
import SignUpScreen from "./Screens/SingUpScreen";

//Rewards
import RewardsListScreen from './Screens/Reward/RewardsListScreen'
import AddRewardScreen from './Screens/Reward/AddRewardScreen';
import RewardDetailScreen from './Screens/Reward/RewardDetailScreen';
import UserRewardsScreen from './Screens/Reward/UserRewardsScreen';
import ObtainTaskScreen from './Screens/Reward/ObtainTaskScreen';

//Subjects

import SubjectsListScreen from './Screens/Subject/SubjectsListScreen';
import AddSubjectScreen from './Screens/Subject/AddSubjectScreen';
import SubjectDetailScreen from './Screens/Subject/SubjectDetailScreen';
import UserSubjectsScreen from './Screens/Subject/UserSubjectsScreen';

// Tasks
import TasksListScreen from './Screens/Task/TasksListScreen';
import AddTaskScreen from './Screens/Task/AddTaskScreen';
import TaskDetailScreen from './Screens/Task/TaskDetailScreen';
import UserTasksScreen from './Screens/Task/UserTasksScreen';




import { AuthContext } from './Context/AuthProvider';
import { AccountIcon, ChartBarIcon, GiftIcon, HomeIcon, SubjectIcon } from './Components/Icons';

import { PatientsContext } from './Context/PatientsProvider';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const RewardsStack = createStackNavigator();
const StatisticsStack = createStackNavigator();
const SubjectsStack = createStackNavigator();


function MyTabs() {
    const { role, user } = useContext(AuthContext);
    const { patients, selectedPatientId } = useContext(PatientsContext);
    const selectedPatient = patients.find(patient => patient.id === selectedPatientId)

    return (
        <Tab.Navigator initialRouteName="Inicio">
            <Tab.Screen name="Inicio" component={HomeStackScreen} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <HomeIcon color={color} size={size} />
                ),
            }} />
            {role === 'administrador' && (
                <React.Fragment>
                    <Tab.Screen name="Estadísticas" component={StatisticsStackScreen} options={{
                        tabBarLabel: 'Estadísticas',
                        tabBarIcon: ({ color, size }) => (
                            <ChartBarIcon color={color} size={size} />
                        ),
                    }} />
                    <Tab.Screen name="Materias" component={SubjectsStackScreen} options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <SubjectIcon color={color} size={size} />
                        ),
                    }} />
                    <Tab.Screen name="Recompensas" component={RewardsStackScreen} options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <GiftIcon color={color} size={size} />
                        ),
                    }} />
                </React.Fragment>
            )}
            <Tab.Screen name="Perfil" component={ProfileStackScreen} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <AccountIcon color={color} size={size} />
                ),
            }} />
        </Tab.Navigator>
    );
}

// // Tasks
// import TasksListScreen from './Screens/Task/TasksListScreen';
// import AddTaskScreen from './Screens/Task/AddTaskScreen';
// import TaskDetailScreen from './Screens/Task/TaskDetailScreen';
// import UserTasksScreen from './Screens/Task/UserTasksScreen';


function HomeStackScreen() {
    return (
        <HomeStack.Navigator initialRouteName="TasksList">
            <HomeStack.Screen name="TasksList" component={TasksListScreen} options={{ headerShown: true, title: 'Inicio' }} />
            <HomeStack.Screen name="AddTask" component={AddTaskScreen} options={{ headerShown: true, title: 'Agregar nueva tarea' }} />
            <HomeStack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ headerShown: true, title: 'Detalles de la tarea' }} />
            <HomeStack.Screen name="UserTasks" component={UserTasksScreen} />
            <HomeStack.Screen name="ObtainTask" component={ObtainTaskScreen} options={{ headerShown: true, title: 'Obtener recompensa' }} />
        </HomeStack.Navigator>
    );
}



function StatisticsStackScreen() {
    const { role } = useContext(AuthContext);
    if (role !== 'administrador') {
        return null; // No renderizar si el rol no es admin
    }

    return (
        <StatisticsStack.Navigator initialRouteName="Statistics" screenOptions={{ headerShown: false }}>
            <StatisticsStack.Screen name="Statistics" component={StatisticsScreen} />

        </StatisticsStack.Navigator>
    );
}

function SubjectsStackScreen() {
    const { role } = useContext(AuthContext);
    if (role !== 'administrador') {
        return null; // No renderizar si el rol no es admin
    }

    return (
        <SubjectsStack.Navigator initialRouteName="SubjectsList">
            <SubjectsStack.Screen name="SubjectsList" component={SubjectsListScreen} options={{ headerShown: true, title: 'Lista de materias' }} />
            <SubjectsStack.Screen name="AddSubject" component={AddSubjectScreen} options={{ headerShown: true, title: 'Agregar nueva materia' }} />
            <SubjectsStack.Screen name="SubjectDetail" component={SubjectDetailScreen} options={{ headerShown: true, title: 'Detalles de la materia' }} />
            <SubjectsStack.Screen name="UserSubjects" component={UserSubjectsScreen} />
        </SubjectsStack.Navigator>
    );
}



function RewardsStackScreen() {
    const { role } = useContext(AuthContext);


    if (role !== 'administrador') {
        return null; // No renderizar si el rol no es admin
    }

    return (
        <RewardsStack.Navigator initialRouteName="RewardsList">
            <RewardsStack.Screen name="RewardsList" component={RewardsListScreen} options={{ headerShown: true, title: 'Lista de recompensas' }} />
            <RewardsStack.Screen name="AddReward" component={AddRewardScreen} options={{ headerShown: true, title: 'Agregar nueva recompensa' }} />
            <RewardsStack.Screen name="RewardDetail" component={RewardDetailScreen} options={{ headerShown: true, title: 'Detalles de la recompensa' }} />
            <RewardsStack.Screen name="UserRewards" component={UserRewardsScreen} />
        </RewardsStack.Navigator>
    );
}

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator initialRouteName="Profile">
            <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, title: 'Perfil' }} />
            <ProfileStack.Screen name="Login" component={LoginScreen} />

        </ProfileStack.Navigator>
    );
}

function AuthStackScreen() {
    return (
        <AuthStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Signup" component={SignUpScreen} />
        </AuthStack.Navigator>
    );
}

export default function Navigation() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <NavigationContainer>
            {isAuthenticated ? <MyTabs /> : <AuthStackScreen />}
            <Toast autoHide={false} visibilityTime={null} config={toastConfig} />
        </NavigationContainer>
    );
}