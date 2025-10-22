import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile 
} from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { UserService } from '../services/UserService';

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        setError(null);
        
        if (firebaseUser) {
          // Usuario autenticado con Firebase
          setUser(firebaseUser);
          
          // Obtener datos adicionales del usuario desde Firestore
          let userDataFromFirestore = await UserService.getUserData(firebaseUser.uid);
          
          if (!userDataFromFirestore) {
            // Crear nuevo usuario en Firestore si no existe
            const newUserData = {
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              createdAt: new Date(),
              totalReservations: 0,
              currentLevel: 'CANTERANO',
              monthlyTokens: 0,
              tokensUsed: 0,
              availableTokens: 0,
              lastLogin: new Date(),
              streak: 0,
              favoriteSport: 'Fútbol'
            };
            
            userDataFromFirestore = await UserService.createOrUpdateUser(firebaseUser.uid, newUserData);
          } else {
            // Actualizar último login
            await UserService.createOrUpdateUser(firebaseUser.uid, {
              lastLogin: new Date()
            });
          }
          
          setUserData(userDataFromFirestore);
        } else {
          // Usuario no autenticado
          setUser(null);
          setUserData(null);
        }
      } catch (err) {
        console.error('Error en auth state change:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  /**
   * Iniciar sesión con email y contraseña
   */
  const loginWithEmail = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (err) {
      const errorMessage = this.getAuthErrorMessage(err.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registrar nuevo usuario con email y contraseña
   */
  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil del usuario con el nombre
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Crear datos del usuario en Firestore
      const newUserData = {
        email: email,
        name: name,
        createdAt: new Date(),
        totalReservations: 0,
        currentLevel: 'CANTERANO',
        monthlyTokens: 0,
        tokensUsed: 0,
        availableTokens: 0,
        lastLogin: new Date(),
        streak: 0,
        favoriteSport: 'Fútbol'
      };
      
      await UserService.createOrUpdateUser(userCredential.user.uid, newUserData);
      
      return { success: true, user: userCredential.user };
    } catch (err) {
      const errorMessage = this.getAuthErrorMessage(err.code);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Iniciar sesión con datos de desarrollo (simulado)
   */
  const loginWithDevData = async (devUserData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular usuario de desarrollo
      const devUser = {
        uid: 'dev-user-123',
        email: devUserData.email,
        displayName: devUserData.name
      };
      
      setUser(devUser);
      setUserData(devUserData);
      
      return { success: true, user: devUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Iniciar sesión con Google (simulado para desarrollo)
   */
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular login con Google (en desarrollo)
      const googleUser = {
        uid: 'google-user-' + Date.now(),
        email: 'google@mvpdeportes.com',
        displayName: 'Usuario Google'
      };
      
      setUser(googleUser);
      
      // Crear datos de usuario para Google
      const userData = {
        email: googleUser.email,
        name: googleUser.displayName,
        createdAt: new Date(),
        totalReservations: 0,
        currentLevel: 'CANTERANO',
        monthlyTokens: 0,
        tokensUsed: 0,
        availableTokens: 0,
        lastLogin: new Date(),
        streak: 0,
        favoriteSport: 'Fútbol'
      };
      
      setUserData(userData);
      
      return { success: true, user: googleUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar datos del usuario
   */
  const updateUserData = async (updates) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      const updatedUserData = await UserService.createOrUpdateUser(user.uid, {
        ...updates,
        updatedAt: new Date()
      });
      
      setUserData(updatedUserData);
      return updatedUserData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Actualizar tokens después de una reserva
   */
  const updateTokensAfterReservation = async (usedToken = false) => {
    try {
      if (!user || !userData) return;

      const updates = {
        totalReservations: (userData.totalReservations || 0) + 1,
        lastActivity: new Date()
      };

      if (usedToken) {
        updates.tokensUsed = (userData.tokensUsed || 0) + 1;
        updates.availableTokens = Math.max(0, (userData.availableTokens || 0) - 1);
      }

      // Recalcular nivel
      const newLevel = UserService.calculateLevel(updates.totalReservations);
      updates.currentLevel = newLevel.key;

      await updateUserData(updates);
    } catch (err) {
      console.error('Error actualizando tokens:', err);
      throw err;
    }
  };

  /**
   * Comprar tokens adicionales
   */
  const purchaseTokens = async (tokenPack) => {
    try {
      if (!user) throw new Error('Usuario no autenticado');
      
      const result = await UserService.purchaseTokens(user.uid, tokenPack);
      
      // Actualizar datos locales
      if (result.success) {
        setUserData(prev => ({
          ...prev,
          availableTokens: result.newBalance
        }));
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Obtener el nivel actual del usuario
   */
  const getCurrentLevel = () => {
    if (!userData) return null;
    
    return UserService.calculateLevel(userData.totalReservations || 0);
  };

  /**
   * Obtener progreso hacia el siguiente nivel
   */
  const getLevelProgress = () => {
    if (!userData) return { progress: 0, nextLevel: null };
    
    const currentLevel = getCurrentLevel();
    const levels = UserService.LEVELS;
    const levelKeys = Object.keys(levels);
    const currentIndex = levelKeys.indexOf(currentLevel.key);
    
    if (currentIndex < levelKeys.length - 1) {
      const nextLevelKey = levelKeys[currentIndex + 1];
      const nextLevel = levels[nextLevelKey];
      const progress = ((userData.totalReservations - currentLevel.min) / 
                       (nextLevel.min - currentLevel.min)) * 100;
      
      return {
        progress: Math.min(100, Math.max(0, progress)),
        nextLevel: {
          key: nextLevelKey,
          ...nextLevel
        }
      };
    }
    
    return { progress: 100, nextLevel: null };
  };

  /**
   * Obtener mensaje de error amigable
   */
  const getAuthErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/invalid-email': 'El formato del email no es válido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este email',
      'auth/wrong-password': 'La contraseña es incorrecta',
      'auth/email-already-in-use': 'Ya existe una cuenta con este email',
      'auth/weak-password': 'La contraseña es demasiado débil',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
    };
    
    return errorMessages[errorCode] || 'Error desconocido. Intenta nuevamente';
  };

  /**
   * Limpiar errores
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Verificar si el usuario está autenticado
   */
  const isAuthenticated = () => {
    return !!user;
  };

  /**
   * Obtener tokens disponibles
   */
  const getAvailableTokens = () => {
    return userData?.availableTokens || 0;
  };

  /**
   * Obtener descuento actual según nivel
   */
  const getCurrentDiscount = () => {
    const level = getCurrentLevel();
    return level ? level.discount : 0;
  };

  // Valor del contexto
  const contextValue = {
    // Estado
    user,
    userData,
    loading,
    error,
    
    // Métodos de autenticación
    loginWithEmail,
    signup,
    loginWithDevData,
    loginWithGoogle,
    logout,
    
    // Métodos de datos de usuario
    updateUserData,
    updateTokensAfterReservation,
    purchaseTokens,
    getCurrentLevel,
    getLevelProgress,
    getAvailableTokens,
    getCurrentDiscount,
    isAuthenticated,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

// Sistema de niveles MVP 2.0
UserService.LEVELS = {
  CANTERANO: { 
    name: 'Canterano', 
    min: 0, 
    max: 5, 
    tokens: 0, 
    discount: 0, 
    color: '#9E9E9E',
    icon: '🌱'
  },
  TITULAR: { 
    name: 'Titular', 
    min: 6, 
    max: 20, 
    tokens: 1, 
    discount: 10, 
    color: '#4CAF50',
    icon: '⭐'
  },
  CAPITAN: { 
    name: 'Capitán', 
    min: 21, 
    max: 40, 
    tokens: 2, 
    discount: 15, 
    color: '#2196F3',
    icon: '👑'
  },
  ESTRELLA: { 
    name: 'Estrella', 
    min: 41, 
    max: 60, 
    tokens: 3, 
    discount: 20, 
    color: '#FF9800',
    icon: '🌟'
  },
  MVP: { 
    name: 'MVP', 
    min: 61, 
    max: 80, 
    tokens: 4, 
    discount: 25, 
    color: '#9C27B0',
    icon: '🏆'
  },
  CAMPION: { 
    name: 'Campeón', 
    min: 81, 
    max: 100, 
    tokens: 5, 
    discount: 30, 
    color: '#F44336',
    icon: '💎'
  },
  BALON_DE_ORO: { 
    name: 'Balón de Oro', 
    min: 101, 
    tokens: 6, 
    discount: 40, 
    color: '#FFD700',
    icon: '⚽'
  }
};