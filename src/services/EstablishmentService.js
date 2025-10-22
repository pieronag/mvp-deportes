import { 
  doc, 
  getDoc, 
  getDocs, 
  collection,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../../firebaseConfig';

/**
 * Servicio para gestión de establecimientos MVP 2.0
 */
export class EstablishmentService {
  
  /**
   * Obtiene todos los establecimientos
   */
  static async getAllEstablishments() {
    try {
      const establishmentsRef = collection(db, COLLECTIONS.ESTABLISHMENTS);
      const q = query(establishmentsRef, orderBy('name', 'asc'));
      
      const querySnapshot = await getDocs(q);
      const establishments = [];

      querySnapshot.forEach((doc) => {
        establishments.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return establishments;
    } catch (error) {
      console.error('Error obteniendo establecimientos:', error);
      throw error;
    }
  }

  /**
   * Obtiene establecimientos por categoría
   */
  static async getEstablishmentsByCategory(category) {
    try {
      const establishmentsRef = collection(db, COLLECTIONS.ESTABLISHMENTS);
      const q = query(
        establishmentsRef, 
        where('sportType', '==', category),
        orderBy('rating', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const establishments = [];

      querySnapshot.forEach((doc) => {
        establishments.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return establishments;
    } catch (error) {
      console.error('Error obteniendo establecimientos por categoría:', error);
      throw error;
    }
  }

  /**
   * Obtiene un establecimiento por ID
   */
  static async getEstablishmentById(establishmentId) {
    try {
      const establishmentDoc = await getDoc(doc(db, COLLECTIONS.ESTABLISHMENTS, establishmentId));
      if (establishmentDoc.exists()) {
        return {
          id: establishmentDoc.id,
          ...establishmentDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo establecimiento:', error);
      throw error;
    }
  }

  /**
   * Obtiene establecimientos populares (mejor rating)
   */
  static async getPopularEstablishments(limitCount = 6) {
    try {
      const establishmentsRef = collection(db, COLLECTIONS.ESTABLISHMENTS);
      const q = query(
        establishmentsRef, 
        orderBy('rating', 'desc'),
        orderBy('reviewCount', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const establishments = [];

      querySnapshot.forEach((doc) => {
        if (establishments.length < limitCount) {
          establishments.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });

      return establishments;
    } catch (error) {
      console.error('Error obteniendo establecimientos populares:', error);
      throw error;
    }
  }

  /**
   * Busca establecimientos por nombre o ubicación
   */
  static async searchEstablishments(searchTerm) {
    try {
      // En una implementación real, se usaría Algolia o similar para búsqueda
      // Por ahora filtramos en memoria (solo para demostración)
      const allEstablishments = await this.getAllEstablishments();
      
      return allEstablishments.filter(establishment => 
        establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error buscando establecimientos:', error);
      throw error;
    }
  }

  /**
   * Obtiene horarios disponibles de un establecimiento
   */
  static async getAvailableTimeSlots(establishmentId, date) {
    try {
      // En implementación real, se consultaría las reservas existentes
      // Por ahora retornamos horarios predefinidos
      return [
        '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
        '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
        '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'
      ];
    } catch (error) {
      console.error('Error obteniendo horarios disponibles:', error);
      throw error;
    }
  }
}