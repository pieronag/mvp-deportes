import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator,
  Platform 
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { loginWithDevData, loginWithGoogle, user } = useAuth();

  const config = {
    webClientId: '872751327215-4dl00kfn1th69d6nndfppsufnmqsfsd1.apps.googleusercontent.com',
  };

  if (Platform.OS === 'android') {
    config.androidClientId = config.webClientId;
  }

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  React.useEffect(() => {
    console.log('Google Auth Response:', response);
    
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Login exitoso!');
      handleGoogleSignIn(authentication.accessToken);
    } else if (response?.type === 'error') {
      setIsLoading(false);
      console.log('Error:', response.error);
    }
  }, [response]);

  const handleGoogleSignIn = async (accessToken) => {
    try {
      setIsLoading(true);
      
      const result = await loginWithGoogle();
      
      if (result.success) {
        console.log('Login exitoso con Google');
      } else {
        console.log('Error en login:', result.error);
      }
      
    } catch (error) {
      console.log('Error en autenticación:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!request) {
      console.log('Inicializando Google Auth...');
      return;
    }

    setIsLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleDevLogin = async () => {
    try {
      setIsLoading(true);
      
      const devUserData = {
        email: 'dev@mvpdeportes.com',
        name: 'Usuario Desarrollo',
        totalReservations: 15,
        currentLevel: 'TITULAR',
        monthlyTokens: 3,
        tokensUsed: 1,
        availableTokens: 2,
        streak: 8,
        favoriteSport: 'Fútbol'
      };
      
      const result = await loginWithDevData(devUserData);
      
      if (result.success) {
        console.log('Sesión de desarrollo iniciada');
      } else {
        console.log('Error en login:', result.error);
      }
      
    } catch (error) {
      console.log('No se pudo iniciar sesión:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
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
            (isLoading || !request) && styles.googleButtonDisabled
          ]} 
          onPress={handleGoogleLogin}
          disabled={isLoading || !request}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.note}>
            Plataforma: {Platform.OS} {Platform.Version}
          </Text>
          {isLoading && (
            <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

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
  },
  loadingText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 10,
    fontStyle: 'italic',
  },
});