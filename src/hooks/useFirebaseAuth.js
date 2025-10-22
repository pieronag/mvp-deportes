import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { UserService } from '../services/UserService';

/**
 * Hook personalizado para autenticación con Firebase
 */
export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        
        if (firebaseUser) {
          // Usuario autenticado
          setUser(firebaseUser);
          
          // Obtener datos adicionales del usuario desde Firestore
          const userDataFromFirestore = await UserService.getUserData(firebaseUser.uid);
          setUserData(userDataFromFirestore);
          
          // Si no existe en Firestore, crear registro
          if (!userDataFromFirestore) {
            const newUserData = {
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              createdAt: new Date(),
              totalReservations: 0,
              currentLevel: 'CANTERANO',
              monthlyTokens: 0,
              tokensUsed: 0,
              availableTokens: 0
            };
            
            const createdUser = await UserService.createOrUpdateUser(firebaseUser.uid, newUserData);
            setUserData(createdUser);
          }
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
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
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
      
      const updatedUserData = await UserService.createOrUpdateUser(user.uid, updates);
      setUserData(updatedUserData);
      return updatedUserData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    userData,
    loading,
    error,
    loginWithEmail,
    logout,
    updateUserData
  };
};