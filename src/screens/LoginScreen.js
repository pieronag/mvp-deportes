// En src/screens/LoginScreen.js - Simplificado sin Firebase
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator,
  Platform,
  Alert 
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const { loginWithDevData, loginWithGoogle, user } = useAuth();

  const handleDevLogin = async () => {
    try {
      setIsLoading(true);
      
      // Usar el primer usuario de desarrollo
      const result = await loginWithDevData('dev@mvpdeportes.com', 'dev123');
      
      if (result && result.success) {
        console.log('Sesión de desarrollo iniciada');
        Alert.alert('Éxito', `Bienvenido ${result.user.name}`);
      } else {
        console.log('Error en login:', result?.error);
        Alert.alert('Error', result?.error || 'Error desconocido en el login');
      }
      
    } catch (error) {
      console.log('No se pudo iniciar sesión:', error.message);
      Alert.alert('Error', `No se pudo iniciar sesión: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      
      const result = await loginWithGoogle();
      
      if (result && result.success) {
        console.log('Login con Google exitoso');
        Alert.alert('Éxito', `Bienvenido ${result.user.name}`);
      } else {
        console.log('Error en login Google:', result?.error);
        Alert.alert('Error', result?.error || 'Error en login con Google');
      }
      
    } catch (error) {
      console.log('Error en Google login:', error.message);
      Alert.alert('Error', `Error en Google login: ${error.message}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      console.log('Usuario autenticado, navegando a Home...');
      navigation.navigate('Home');
    }
  }, [user, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⚽ 🎯 🎾 🏀</Text>
        <Text style={styles.appName}>MVP Deportes 2.0</Text>
        <Text style={styles.subtitle}>Plataforma Integral de Gestión Deportiva</Text>
        
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>🎯 Sistema de Niveles MVP</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>• Tokens mensuales gratuitos</Text>
            <Text style={styles.benefitItem}>• Descuentos progresivos hasta 40%</Text>
            <Text style={styles.benefitItem}>• Beneficios acumulativos por 24 meses</Text>
            <Text style={styles.benefitItem}>• Programa de fidelización exclusivo</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.devButton} 
          onPress={handleDevLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.devButtonContent}>
              <Text style={styles.devButtonText}>🎯 Ingresar a MVP 2.0</Text>
              <Text style={styles.devButtonSubtext}>Usuario: Desarrollo - Nivel Titular</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.googleButton, 
            googleLoading && styles.googleButtonDisabled
          ]} 
          onPress={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.googleButtonText}>Continuar con Google (Demo)</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.note}>
            Plataforma: {Platform.OS} {Platform.Version}
          </Text>
          <Text style={styles.note}>
            Modo: Desarrollo Local
          </Text>
          {(isLoading || googleLoading) && (
            <Text style={styles.loadingText}>Iniciando sesión...</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// Los estilos se mantienen igual...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 42,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 40,
    textAlign: 'center',
  },
  benefitsSection: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  benefitsList: {},
  benefitItem: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    textAlign: 'center',
  },
  devButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 10,
    minWidth: 220,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  devButtonContent: {
    alignItems: 'center',
  },
  devButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  devButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 4,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 15,
  },
  googleButtonDisabled: {
    backgroundColor: '#A0C3FF',
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  note: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 4,
  },
  loadingText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 10,
    fontStyle: 'italic',
  },
});