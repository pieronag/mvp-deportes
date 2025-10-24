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
import LevelScreen from '../screens/LevelScreen';
import TokensScreen from '../screens/TokensScreen';
import NotificationsSettingsScreen from '../screens/NotificationsSettingsScreen';
import PrivacySettingsScreen from '../screens/PrivacySettingsScreen';
import PaymentSettingsScreen from '../screens/PaymentSettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ReservationDetailScreen from '../screens/ReservationDetailScreen'; // NUEVA PANTALLA

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
        
        {/* NUEVA: Pantalla de Detalles de Reserva con QR */}
        <Stack.Screen 
          name="ReservationDetail" 
          component={ReservationDetailScreen}
        />
        
        {/* Pantalla de Logros */}
        <Stack.Screen 
          name="Achievements" 
          component={AchievementsScreen}
        />
        
        {/* Pantalla de Nivel */}
        <Stack.Screen 
          name="Level" 
          component={LevelScreen}
        />
        
        {/* Pantalla de Tokens */}
        <Stack.Screen 
          name="Tokens" 
          component={TokensScreen}
        />

        {/* Pantalla de Configuración de Notificaciones */}
        <Stack.Screen 
          name="NotificationsSettings" 
          component={NotificationsSettingsScreen}
          options={{ title: 'Notificaciones' }}
        />
        
        {/* Pantalla de Configuración de Privacidad */}
        <Stack.Screen 
          name="PrivacySettings" 
          component={PrivacySettingsScreen}
          options={{ title: 'Privacidad' }}
        />
        
        {/* Pantalla de Configuración de Pagos */}
        <Stack.Screen 
          name="PaymentSettings" 
          component={PaymentSettingsScreen}
          options={{ title: 'Métodos de Pago' }}
        />
        
        {/* Pantalla de Ayuda y Soporte */}
        <Stack.Screen 
          name="HelpSupport" 
          component={HelpSupportScreen}
          options={{ title: 'Ayuda y Soporte' }}
        />
        
        {/* Pantalla de Pago */}
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen}
          options={{ title: 'Pago' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}