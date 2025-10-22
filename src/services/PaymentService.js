import { 
  doc, 
  setDoc, 
  collection,
  serverTimestamp 
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../../firebaseConfig';

/**
 * Servicio para procesamiento de pagos MVP 2.0
 * Simulación de integración con Transbank y Mercado Pago
 */
export class PaymentService {
  
  /**
   * Procesa un pago de reserva
   */
  static async processReservationPayment(paymentData) {
    try {
      const {
        userId,
        reservationId,
        amount,
        paymentMethod,
        useToken
      } = paymentData;

      // Simular procesamiento de pago
      const paymentResult = await this.simulatePaymentProcessing({
        amount,
        paymentMethod,
        metadata: {
          reservationId,
          userId,
          useToken
        }
      });

      // Registrar transacción
      const transactionRef = doc(collection(db, COLLECTIONS.TRANSACTIONS));
      const transaction = {
        id: transactionRef.id,
        userId,
        reservationId,
        amount,
        finalAmount: paymentResult.finalAmount,
        paymentMethod,
        useToken,
        status: paymentResult.success ? 'completed' : 'failed',
        transactionId: paymentResult.transactionId,
        metadata: paymentResult.metadata,
        createdAt: serverTimestamp()
      };

      await setDoc(transactionRef, transaction);

      return {
        success: paymentResult.success,
        transactionId: transaction.id,
        message: paymentResult.message,
        finalAmount: paymentResult.finalAmount
      };
    } catch (error) {
      console.error('Error procesando pago:', error);
      throw error;
    }
  }

  /**
   * Simula el procesamiento de pago con diferentes métodos
   */
  static async simulatePaymentProcessing(paymentData) {
    const { amount, paymentMethod, metadata } = paymentData;

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular diferentes tasas de éxito según método de pago
    const successRates = {
      'webpay': 0.95, // 95% éxito
      'mercadopago': 0.92, // 92% éxito
      'transferencia': 0.98 // 98% éxito
    };

    const successRate = successRates[paymentMethod] || 0.90;
    const isSuccess = Math.random() < successRate;

    if (isSuccess) {
      return {
        success: true,
        transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        finalAmount: amount,
        message: 'Pago procesado exitosamente',
        metadata
      };
    } else {
      return {
        success: false,
        transactionId: null,
        finalAmount: amount,
        message: 'El pago fue rechazado. Por favor intenta con otro método.',
        metadata
      };
    }
  }

  /**
   * Procesa compra de tokens
   */
  static async processTokenPurchase(purchaseData) {
    try {
      const {
        userId,
        tokenPack,
        amount,
        paymentMethod
      } = purchaseData;

      // Simular procesamiento de pago
      const paymentResult = await this.simulatePaymentProcessing({
        amount,
        paymentMethod,
        metadata: {
          type: 'token_purchase',
          tokenPack,
          userId
        }
      });

      if (paymentResult.success) {
        // Registrar transacción de compra de tokens
        const transactionRef = doc(collection(db, COLLECTIONS.TRANSACTIONS));
        await setDoc(transactionRef, {
          userId,
          type: 'token_purchase',
          tokenPack,
          amount,
          finalAmount: paymentResult.finalAmount,
          paymentMethod,
          status: 'completed',
          transactionId: paymentResult.transactionId,
          createdAt: serverTimestamp()
        });

        return {
          success: true,
          transactionId: transactionRef.id,
          tokens: this.getTokensByPack(tokenPack),
          message: 'Compra de tokens procesada exitosamente'
        };
      } else {
        return {
          success: false,
          message: paymentResult.message
        };
      }
    } catch (error) {
      console.error('Error procesando compra de tokens:', error);
      throw error;
    }
  }

  /**
   * Obtiene cantidad de tokens por pack
   */
  static getTokensByPack(tokenPack) {
    const packs = {
      '5': 5,
      '10': 10,
      '20': 20
    };
    return packs[tokenPack] || 0;
  }

  /**
   * Obtiene historial de transacciones del usuario
   */
  static async getTransactionHistory(userId, limitCount = 20) {
    try {
      // En implementación real, se consultaría Firestore
      // Por ahora retornamos datos de ejemplo
      return [
        {
          id: 'txn_001',
          type: 'reservation',
          amount: 15000,
          description: 'Reserva Cancha Central Fútbol',
          date: new Date('2024-03-15'),
          status: 'completed'
        },
        {
          id: 'txn_002',
          type: 'token_purchase',
          amount: 7500,
          description: 'Compra Pack 5 Tokens',
          date: new Date('2024-03-10'),
          status: 'completed'
        }
      ];
    } catch (error) {
      console.error('Error obteniendo historial de transacciones:', error);
      throw error;
    }
  }
}