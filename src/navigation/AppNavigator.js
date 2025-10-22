import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importar todas las pantallas
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import ReservationScreen from '../screens/ReservationScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import ActiveReservationsScreen from '../screens/ActiveReservationsScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import LevelScreen from '../screens/LevelScreen'; // NUEVA
import TokensScreen from '../screens/TokensScreen'; // NUEVA

// Crear el navigator stack
const Stack = createStackNavigator();

/**
 * Navigator principal de la aplicación
 * Define todas las rutas y pantallas disponibles
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Pantalla de Login - DEBE SER LA PRIMERA */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
        />
        
        {/* Pantalla Principal - Home */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
        />
        
        {/* Pantalla de Detalle de Categoría */}
        <Stack.Screen 
          name="CategoryDetail" 
          component={CategoryDetailScreen}
        />
        
        {/* Pantalla de Reserva */}
        <Stack.Screen 
          name="Reservation" 
          component={ReservationScreen}
        />
        
        {/* Pantalla de Perfil de Usuario */}
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfileScreen}
        />
        
        {/* Pantalla de Reservas Activas */}
        <Stack.Screen 
          name="ActiveReservations" 
          component={ActiveReservationsScreen}
        />
        
        {/* Pantalla de Logros */}
        <Stack.Screen 
          name="Achievements" 
          component={AchievementsScreen}
        />
        
        {/* NUEVA: Pantalla de Nivel */}
        <Stack.Screen 
          name="Level" 
          component={LevelScreen}
        />
        
        {/* NUEVA: Pantalla de Tokens */}
        <Stack.Screen 
          name="Tokens" 
          component={TokensScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}