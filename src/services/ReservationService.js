import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  increment,
  serverTimestamp 
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../../firebaseConfig';
import { UserService } from './UserService';

/**
 * Servicio para gestión de reservas MVP 2.0
 */
export class ReservationService {
  
  /**
   * Crea una nueva reserva
   */
  static async createReservation(reservationData) {
    try {
      const {
        userId,
        establishmentId,
        establishmentName,
        date,
        time,
        price,
        useToken,
        userLevel
      } = reservationData;

      // Calcular precio final
      const finalPrice = this.calculateFinalPrice(price, useToken, userLevel);
      const savings = useToken ? price - finalPrice : 0;

      // Crear reserva
      const reservationRef = doc(collection(db, COLLECTIONS.RESERVATIONS));
      const reservation = {
        id: reservationRef.id,
        userId,
        establishmentId,
        establishmentName,
        date: new Date(date),
        time,
        duration: 60, // 1 hora por defecto
        basePrice: price,
        finalPrice,
        useToken,
        userLevel,
        discountApplied: useToken ? this.getDiscountByLevel(userLevel) : 0,
        savings,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(reservationRef, reservation);

      // Actualizar estadísticas del usuario
      await UserService.updateUserStats(userId, { useToken });

      // Actualizar estadísticas del establecimiento
      await this.updateEstablishmentStats(establishmentId);

      return reservation;
    } catch (error) {
      console.error('Error creando reserva:', error);
      throw error;
    }
  }

  /**
   * Calcula el precio final con descuento por nivel
   */
  static calculateFinalPrice(basePrice, useToken, userLevel) {
    if (!useToken) return basePrice;

    const discount = this.getDiscountByLevel(userLevel);
    return Math.round(basePrice * (1 - discount / 100));
  }

  /**
   * Obtiene el porcentaje de descuento por nivel
   */
  static getDiscountByLevel(userLevel) {
    const discounts = {
      'CANTERANO': 0,
      'TITULAR': 10,
      'CAPITAN': 15,
      'ESTRELLA': 20,
      'MVP': 25,
      'CAMPION': 30,
      'BALON_DE_ORO': 40
    };

    return discounts[userLevel] || 0;
  }

  /**
   * Actualiza estadísticas del establecimiento
   */
  static async updateEstablishmentStats(establishmentId) {
    try {
      const establishmentRef = doc(db, COLLECTIONS.ESTABLISHMENTS, establishmentId);
      // En una implementación real, aquí se actualizarían las estadísticas
      // como reservas mensuales, ingresos, etc.
      console.log('Actualizando estadísticas del establecimiento:', establishmentId);
    } catch (error) {
      console.error('Error actualizando estadísticas del establecimiento:', error);
      // No lanzamos error para no afectar la reserva
    }
  }

  /**
   * Verifica disponibilidad de horario
   */
  static async checkAvailability(establishmentId, date, time) {
    try {
      const reservationsRef = collection(db, COLLECTIONS.RESERVATIONS);
      const targetDate = new Date(date);
      
      const q = query(
        reservationsRef,
        where('establishmentId', '==', establishmentId),
        where('date', '==', targetDate),
        where('time', '==', time),
        where('status', 'in', ['confirmed', 'pending'])
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty; // true si está disponible
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      throw error;
    }
  }

  /**
   * Obtiene reservas futuras del usuario
   */
  static async getUpcomingReservations(userId) {
    try {
      const reservationsRef = collection(db, COLLECTIONS.RESERVATIONS);
      const now = new Date();
      
      const q = query(
        reservationsRef,
        where('userId', '==', userId),
        where('date', '>=', now),
        where('status', '==', 'confirmed'),
        orderBy('date', 'asc'),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const reservations = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reservations.push({
          id: doc.id,
          ...data,
          // Convertir Firestore Timestamp a Date si es necesario
          date: data.date?.toDate ? data.date.toDate() : data.date
        });
      });

      return reservations;
    } catch (error) {
      console.error('Error obteniendo reservas futuras:', error);
      throw error;
    }
  }

  /**
   * Cancela una reserva
   */
  static async cancelReservation(reservationId, userId) {
    try {
      const reservationRef = doc(db, COLLECTIONS.RESERVATIONS, reservationId);
      
      // Verificar que la reserva pertenece al usuario
      const reservation = await getDoc(reservationRef);
      if (!reservation.exists() || reservation.data().userId !== userId) {
        throw new Error('Reserva no encontrada o no autorizada');
      }

      // Actualizar estado de la reserva
      await updateDoc(reservationRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Si usó token, devolverlo
      if (reservation.data().useToken) {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        await updateDoc(userRef, {
          tokensUsed: increment(-1),
          availableTokens: increment(1),
          updatedAt: new Date()
        });
      }

      return { success: true, message: 'Reserva cancelada exitosamente' };
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      throw error;
    }
  }
}