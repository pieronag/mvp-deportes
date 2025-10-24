// En src/context/AuthContext.js - Con función de tokens
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Usuarios de desarrollo pre-configurados
  const devUsers = [
    {
      id: '1',
      email: 'dev@mvpdeportes.com',
      name: 'Usuario Desarrollo MVP',
      totalReservations: 15,
      currentLevel: 'TITULAR',
      monthlyTokens: 3,
      tokensUsed: 1,
      availableTokens: 2,
      streak: 8,
      favoriteSport: 'Fútbol',
      avatar: 'https://via.placeholder.com/100'
    },
    {
      id: '2',
      email: 'admin@deportes.com',
      name: 'Administrador',
      totalReservations: 25,
      currentLevel: 'MVP',
      monthlyTokens: 5,
      tokensUsed: 2,
      availableTokens: 3,
      streak: 15,
      favoriteSport: 'Tenis',
      avatar: 'https://via.placeholder.com/100'
    }
  ];

  useEffect(() => {
    // Verificar si hay usuario en localStorage (o AsyncStorage)
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      // Simular verificación de usuario almacenado
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.log('Error checking stored user:', error);
      setLoading(false);
    }
  };

  // Función para login local
  const loginWithDevData = async (email, password) => {
    try {
      console.log('Intentando login local con:', email);
      
      // Validaciones básicas
      if (!email || !password) {
        return { 
          success: false, 
          error: 'Email y contraseña son requeridos' 
        };
      }

      // Buscar usuario en la lista de desarrollo
      const devUser = devUsers.find(user => user.email === email);
      
      if (!devUser) {
        return { 
          success: false, 
          error: 'Usuario no encontrado' 
        };
      }

      // Simular verificación de contraseña (en desarrollo, cualquier contraseña funciona)
      if (password.length < 3) {
        return { 
          success: false, 
          error: 'Contraseña demasiado corta' 
        };
      }

      // Login exitoso
      console.log('Login local exitoso:', devUser.name);
      setUser(devUser);
      
      // Guardar en AsyncStorage (opcional)
      // await AsyncStorage.setItem('user', JSON.stringify(devUser));
      
      return { 
        success: true, 
        user: devUser 
      };
      
    } catch (error) {
      console.error('Error en login local:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // Función para login rápido
  const quickLogin = async (userIndex = 0) => {
    if (userIndex >= devUsers.length) {
      return { 
        success: false, 
        error: 'Índice de usuario no válido' 
      };
    }
    
    const devUser = devUsers[userIndex];
    setUser(devUser);
    
    return { 
      success: true, 
      user: devUser 
    };
  };

  // Función para login con Google (simulada)
  const loginWithGoogle = async () => {
    try {
      // Simular login con Google
      const googleUser = {
        id: 'google-1',
        email: 'google@mvpdeportes.com',
        name: 'Usuario Google',
        totalReservations: 10,
        currentLevel: 'PRINCIPIANTE',
        monthlyTokens: 2,
        tokensUsed: 0,
        availableTokens: 2,
        streak: 5,
        favoriteSport: 'Baloncesto',
        avatar: 'https://via.placeholder.com/100'
      };
      
      setUser(googleUser);
      
      return { 
        success: true, 
        user: googleUser 
      };
      
    } catch (error) {
      console.error('Error en login Google:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // NUEVA FUNCIÓN: Actualizar tokens del usuario
  const updateUserTokens = async (newTokenCount) => {
    try {
      console.log('Actualizando tokens:', newTokenCount);
      
      if (user) {
        const updatedUser = {
          ...user,
          availableTokens: newTokenCount,
          tokensUsed: user.monthlyTokens - newTokenCount
        };
        
        setUser(updatedUser);
        
        // Aquí podrías guardar en AsyncStorage si lo usas
        // await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        
        console.log('Tokens actualizados exitosamente');
        return { success: true, user: updatedUser };
      }
      
      return { success: false, error: 'No hay usuario logueado' };
      
    } catch (error) {
      console.error('Error actualizando tokens:', error);
      return { success: false, error: error.message };
    }
  };

  // NUEVA FUNCIÓN: Consumir un token (para usar después del pago)
  const consumeToken = async () => {
    try {
      if (user && user.availableTokens > 0) {
        const newTokenCount = user.availableTokens - 1;
        return await updateUserTokens(newTokenCount);
      }
      
      return { success: false, error: 'No hay tokens disponibles' };
      
    } catch (error) {
      console.error('Error consumiendo token:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      // Limpiar AsyncStorage (opcional)
      // await AsyncStorage.removeItem('user');
      console.log('Logout exitoso');
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  const value = {
    user,
    loginWithDevData,
    loginWithGoogle,
    quickLogin,
    devUsers,
    logout,
    loading,
    updateUserTokens, // ← NUEVA FUNCIÓN
    consumeToken      // ← NUEVA FUNCIÓN
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};