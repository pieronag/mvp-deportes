import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  increment 
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../services/firebaseConfig';

/**
 * Servicio para gestión de usuarios y sistema de niveles MVP 2.0
 */
export class UserService {
  
  // Sistema de niveles MVP 2.0
  static LEVELS = {
    CANTERANO: { min: 0, max: 5, tokens: 0, discount: 0 },
    TITULAR: { min: 6, max: 20, tokens: 1, discount: 10 },
    CAPITAN: { min: 21, max: 40, tokens: 2, discount: 15 },
    ESTRELLA: { min: 41, max: 60, tokens: 3, discount: 20 },
    MVP: { min: 61, max: 80, tokens: 4, discount: 25 },
    CAMPION: { min: 81, max: 100, tokens: 5, discount: 30 },
    BALON_DE_ORO: { min: 101, tokens: 6, discount: 40 }
  };

  /**
   * Obtiene los datos completos de un usuario
   */
  static async getUserData(userId) {
    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      throw error;
    }
  }

  /**
   * Crea o actualiza un usuario en Firestore
   */
  static async createOrUpdateUser(userId, userData) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await setDoc(userRef, {
        ...userData,
        updatedAt: new Date(),
        lastLogin: new Date()
      }, { merge: true });
      
      return await this.getUserData(userId);
    } catch (error) {
      console.error('Error creando/actualizando usuario:', error);
      throw error;
    }
  }

  /**
   * Actualiza las estadísticas del usuario después de una reserva
   */
  static async updateUserStats(userId, reservationData) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      
      const updates = {
        totalReservations: increment(1),
        lastActivity: new Date(),
        updatedAt: new Date()
      };

      // Si usó token, actualizar contador
      if (reservationData.useToken) {
        updates.tokensUsed = increment(1);
        updates.availableTokens = increment(-1);
      }

      await updateDoc(userRef, updates);

      // Recalcular nivel después de la reserva
      return await this.recalculateUserLevel(userId);
    } catch (error) {
      console.error('Error actualizando estadísticas:', error);
      throw error;
    }
  }

  /**
   * Recalcula el nivel del usuario basado en reservas totales
   */
  static async recalculateUserLevel(userId) {
    try {
      const userData = await this.getUserData(userId);
      if (!userData) return null;

      const totalReservations = userData.totalReservations || 0;
      const newLevel = this.calculateLevel(totalReservations);
      
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        currentLevel: newLevel.key,
        levelData: newLevel,
        updatedAt: new Date()
      });

      return newLevel;
    } catch (error) {
      console.error('Error recalculando nivel:', error);
      throw error;
    }
  }

  /**
   * Calcula el nivel basado en reservas totales
   */
  static calculateLevel(totalReservations) {
    for (const [key, level] of Object.entries(this.LEVELS)) {
      if (totalReservations >= level.min && 
          (!level.max || totalReservations <= level.max)) {
        return {
          key,
          name: key,
          tokens: level.tokens,
          discount: level.discount,
          min: level.min,
          max: level.max
        };
      }
    }

    // Si tiene más de 100 reservas, es Balón de Oro
    return {
      key: 'BALON_DE_ORO',
      name: 'BALON_DE_ORO',
      tokens: 6,
      discount: 40,
      min: 101
    };
  }

  /**
   * Obtiene el historial de reservas del usuario
   */
  static async getUserReservations(userId, limitCount = 20) {
    try {
      const reservationsRef = collection(db, COLLECTIONS.RESERVATIONS);
      const q = query(
        reservationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const reservations = [];

      querySnapshot.forEach((doc) => {
        reservations.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return reservations;
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      throw error;
    }
  }

  /**
   * Asigna tokens mensuales basados en el nivel del usuario
   */
  static async assignMonthlyTokens(userId) {
    try {
      const userData = await this.getUserData(userId);
      if (!userData) return null;

      const level = this.calculateLevel(userData.totalReservations || 0);
      const monthlyTokens = level.tokens;

      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        monthlyTokens,
        availableTokens: monthlyTokens,
        tokensUsed: 0,
        lastTokenReset: new Date(),
        updatedAt: new Date()
      });

      return monthlyTokens;
    } catch (error) {
      console.error('Error asignando tokens mensuales:', error);
      throw error;
    }
  }

  /**
   * Compra tokens adicionales
   */
  static async purchaseTokens(userId, tokenPack) {
    try {
      const packs = {
        '5': { price: 7500, tokens: 5 },
        '10': { price: 12000, tokens: 10 },
        '20': { price: 20000, tokens: 20 }
      };

      const pack = packs[tokenPack];
      if (!pack) throw new Error('Pack de tokens no válido');

      // Registrar la compra
      const purchaseRef = doc(collection(db, COLLECTIONS.TOKEN_PURCHASES));
      await setDoc(purchaseRef, {
        userId,
        tokenPack,
        tokens: pack.tokens,
        price: pack.price,
        status: 'completed',
        createdAt: new Date()
      });

      // Actualizar tokens del usuario
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        availableTokens: increment(pack.tokens),
        updatedAt: new Date()
      });

      const updatedUser = await this.getUserData(userId);
      
      return {
        success: true,
        tokensAdded: pack.tokens,
        newBalance: updatedUser.availableTokens
      };
    } catch (error) {
      console.error('Error comprando tokens:', error);
      throw error;
    }
  }
}