import React, { useContext } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import HomeScreen from "./Screens/HomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import RewardsScreen from "./Screens/RewardsScreen";
import StatisticsScreen from "./Screens/StatisticsScreen";

import SignUpScreen from "./Screens/SingUpScreen";

import { AuthContext } from './Context/AuthProvider';

// Icons
import { MaterialCommunityIcons } from "@expo/vector-icons";



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
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
            }} />
            {role === 'administrador' && (
                <>
                    <Tab.Screen name="Estadísticas" component={StatisticsStackScreen} options={{
                        tabBarLabel: 'Estadísticas',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
                        ),
                    }} />
                    <Tab.Screen name="Recompensas" component={RewardsStackScreen} options={{
                        tabBarLabel: 'Recompensas',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="gift" color={color} size={size} />
                        ),
                    }} />
                </>
            )}
            <Tab.Screen name="Perfil" component={ProfileStackScreen} options={{
                tabBarLabel: 'Perfil',
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="account" color={color} size={size} />
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
    if (role !== 'administrador') {
        return null; // No renderizar si el rol no es admin
    }

    return (
        <RewardsStack.Navigator initialRouteName="Rewards" screenOptions={{ headerShown: false }}>
            <RewardsStack.Screen name="Rewards" component={RewardsScreen} />
            {/* Agrega más pantallas al stack de Rewards aquí si es necesario */}
        </RewardsStack.Navigator>
    );
}

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
            <ProfileStack.Screen name="Profile" component={ProfileScreen} />
            {/* Agrega más pantallas al stack de Profile aquí si es necesario */}
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





// function MyStack() {
//     return (
//         <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Main" component={MyTabs} />
//             <Stack.Screen name="SignUp" component={SignUpScreen} />
//         </Stack.Navigator>
//     );
// }

export default function Navigation() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <NavigationContainer>
            {isAuthenticated ? <MyTabs /> : <AuthStackScreen />}
        </NavigationContainer>
    );
}