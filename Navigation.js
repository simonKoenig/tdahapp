import React, { useContext } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

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


import { AuthContext } from './Context/AuthProvider';
import { AccountIcon, ChartBarIcon, GiftIcon, HomeIcon } from './Components/Icons';

import { PatientsContext } from './Context/PatientsProvider';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const RewardsStack = createStackNavigator();
const StatisticsStack = createStackNavigator();

function MyTabs() {
    const { role, user } = useContext(AuthContext);
    const { patients, selectedPatientId } = useContext(PatientsContext);
    const selectedPatient = patients.find(patient => patient.id === selectedPatientId)

    return (
        <Tab.Navigator initialRouteName="Perfil">
            <Tab.Screen name="Inicio" component={HomeStackScreen} options={{
                tabBarLabel: 'Inicio',
                headerTitle: user
                    ? (selectedPatient
                        ? `Paciente: ${selectedPatient.nombreApellido}`
                        : `Usuario: ${user.nombreApellido}`)
                    : 'Inicio',
                tabBarIcon: ({ color, size }) => (
                    <HomeIcon color={color} size={size} />
                ),
            }} />
            {role === 'administrador' && (
                <React.Fragment>
                    <Tab.Screen name="Estadísticas" component={StatisticsStackScreen} options={{
                        tabBarLabel: 'Estadísticas',
                        headerTitle: selectedPatient
                            ? `Paciente: ${selectedPatient.nombreApellido}`
                            : 'Estadísticas',
                        tabBarIcon: ({ color, size }) => (
                            <ChartBarIcon color={color} size={size} />
                        ),
                    }} />
                    <Tab.Screen name="Recompensas" component={RewardsStackScreen} options={{
                        tabBarLabel: 'Recompensas',
                        headerTitle: selectedPatient
                            ? `Paciente: ${selectedPatient.nombreApellido}`
                            : 'Recompensas',
                        tabBarIcon: ({ color, size }) => (
                            <GiftIcon color={color} size={size} />
                        ),
                    }} />
                </React.Fragment>
            )}
            <Tab.Screen name="Perfil" component={ProfileStackScreen} options={{
                tabBarLabel: 'Perfil',
                headerTitle: user ? `Usuario: ${user.nombreApellido}` : 'Perfil',
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

function RewardsStackScreen() {
    const { role } = useContext(AuthContext);


    if (role !== 'administrador') {
        return null; // No renderizar si el rol no es admin
    }

    return (
        <RewardsStack.Navigator initialRouteName="RewardsList" screenOptions={{ headerShown: false }}>
            <RewardsStack.Screen
                name="RewardsList"
                component={RewardsListScreen}
            />
            <RewardsStack.Screen name="AddReward" component={AddRewardScreen} />
            <RewardsStack.Screen name="RewardDetail" component={RewardDetailScreen} />
            <RewardsStack.Screen name="UserRewards" component={UserRewardsScreen} />
        </RewardsStack.Navigator>
    );
}

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="Profile" component={ProfileScreen} />
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
        </NavigationContainer>
    );
}