import React, { useContext } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import HomeScreen from "./Screens/HomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import StatisticsScreen from "./Screens/StatisticsScreen";
import RewardsListScreen from './Screens/RewardsListScreen';
import AddRewardScreen from './Screens/AddRewardScreen';
import RewardDetailScreen from './Screens/RewardDetailScreen';
import SignUpScreen from "./Screens/SingUpScreen";
import AddPatientScreen from "./Screens/AddPatientScreen"; // Importa la nueva pantalla

import { AuthContext } from './Context/AuthProvider';
import { AccountIcon, ChartBarIcon, GiftIcon, HomeIcon } from './Components/Icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const RewardsStack = createStackNavigator();
const StatisticsStack = createStackNavigator();

function MyTabs() {
    const { role } = useContext(AuthContext);
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Inicio" component={HomeStackScreen} options={{
                tabBarLabel: 'Inicio',
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
                    <Tab.Screen name="Recompensas" component={RewardsStackScreen} options={{
                        tabBarLabel: 'Recompensas',
                        tabBarIcon: ({ color, size }) => (
                            <GiftIcon color={color} size={size} />
                        ),
                    }} />
                </React.Fragment>
            )}
            <Tab.Screen name="Perfil" component={ProfileStackScreen} options={{
                tabBarLabel: 'Perfil',
                tabBarIcon: ({ color, size }) => (
                    <AccountIcon color={color} size={size} />
                ),
            }} />
        </Tab.Navigator>
    );
}

function HomeStackScreen() {
    return (
        <HomeStack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            {/* Agrega más pantallas al stack de Home aquí si es necesario */}
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
            {/* Agrega más pantallas al stack de Statistics aquí si es necesario */}
        </StatisticsStack.Navigator>
    );
}

function RewardsStackScreen() {
    const { role } = useContext(AuthContext);
    const patientId = "j9ZfszJNZRRV6In1e3yZMYxiQky2"; // Reemplaza esto con el ID del paciente real

    if (role !== 'administrador') {
        return null; // No renderizar si el rol no es admin
    }

    return (
        <RewardsStack.Navigator initialRouteName="RewardsList" screenOptions={{ headerShown: false }}>
            <RewardsStack.Screen
                name="RewardsList"
                component={RewardsListScreen}
                initialParams={{ patientId }} // Pasar el ID del paciente aquí
            />
            <RewardsStack.Screen name="AddReward" component={AddRewardScreen} />
            <RewardsStack.Screen name="RewardDetail" component={RewardDetailScreen} />
        </RewardsStack.Navigator>
    );
}

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="Profile" component={ProfileScreen} />
            <ProfileStack.Screen name="Login" component={LoginScreen} />
            <ProfileStack.Screen name="AddPatient" component={AddPatientScreen} />

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
        </NavigationContainer>
    );
}