import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function PaymentScreen({ navigation, route }) {
  const { user, consumeToken } = useContext(AuthContext);
  const [applyToken, setApplyToken] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed

  // Datos de la reserva que vienen de la pantalla anterior
  const reservationData = route.params?.reservationData || {
    establishmentName: 'Establecimiento No Especificado',
    date: 'Fecha no especificada',
    time: 'Horario no especificada',
    duration: 60, // Siempre 1 hora
    price: 0
  };

  // Calcular precios
  const calculatePrices = () => {
    const basePrice = reservationData.price;
    const discountPercentage = 0.10; // 10% de descuento por token
    const discountAmount = applyToken ? basePrice * discountPercentage : 0;
    const finalPrice = basePrice - discountAmount;

    return {
      basePrice,
      discountAmount,
      finalPrice,
      discountPercentage: discountPercentage * 100
    };
  };

  const { basePrice, discountAmount, finalPrice, discountPercentage } = calculatePrices();

  // Simular proceso de pago con Transbank
  const processPayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simular redirección a Transbank (3 segundos)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simular pago exitoso (en desarrollo siempre es exitoso)
      const paymentSuccess = true;

      if (paymentSuccess) {
        setPaymentStatus('success');
        
        // Consumir token si se aplicó
        if (applyToken && user.availableTokens > 0) {
          const tokenResult = await consumeToken();
          if (!tokenResult.success) {
            console.log('Error consumiendo token:', tokenResult.error);
          }
        }

        // Mostrar confirmación
        Alert.alert(
          '✅ Pago Exitoso',
          `Tu reserva en ${reservationData.establishmentName} ha sido confirmada.\n\n${applyToken ? 'Se ha aplicado un token para el descuento.' : ''}`,
          [
            {
              text: 'Ver Mis Reservas',
              onPress: () => {
                // Navegar a ActiveReservationsScreen
                navigation.navigate('ActiveReservations');
              }
            }
          ]
        );
      } else {
        setPaymentStatus('failed');
        Alert.alert(
          '❌ Pago Fallido',
          'El pago no pudo ser procesado. Por favor, intenta nuevamente.',
          [{ text: 'Reintentar', onPress: () => setPaymentStatus('pending') }]
        );
      }
    } catch (error) {
      setPaymentStatus('failed');
      Alert.alert('Error', 'Ocurrió un error durante el pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (applyToken && user.availableTokens === 0) {
      Alert.alert(
        'Sin Tokens Disponibles',
        'No tienes tokens disponibles para aplicar el descuento.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    Alert.alert(
      'Confirmar Pago',
      `¿Proceder con el pago de $${finalPrice.toLocaleString()}?${applyToken ? `\n\nSe aplicará un token para el ${discountPercentage}% de descuento.` : ''}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Pagar con WebPay', 
          onPress: processPayment 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              💳 Finalizar Pago
            </Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Resumen de la Reserva */}
        <View style={styles.reservationSummary}>
          <Text style={styles.sectionTitle}>📋 Resumen de tu Reserva</Text>
          
          <View style={styles.reservationDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Establecimiento</Text>
              <Text style={styles.detailValue}>{reservationData.establishmentName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha</Text>
              <Text style={styles.detailValue}>{reservationData.date}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Horario</Text>
              <Text style={styles.detailValue}>{reservationData.time}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duración</Text>
              <Text style={styles.detailValue}>{reservationData.duration} minutos</Text>
            </View>
          </View>
        </View>

        {/* Detalles de Pago */}
        <View style={styles.paymentDetails}>
          <Text style={styles.sectionTitle}>💰 Detalles de Pago</Text>
          
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio Base</Text>
              <Text style={styles.priceValue}>${basePrice.toLocaleString()}</Text>
            </View>
            
            {applyToken && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Descuento Token ({discountPercentage}%)</Text>
                <Text style={[styles.priceValue, styles.discountText]}>-${discountAmount.toLocaleString()}</Text>
              </View>
            )}
            
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total a Pagar</Text>
              <Text style={styles.totalValue}>${finalPrice.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Aplicar Token */}
        <View style={styles.tokenSection}>
          <View style={styles.tokenHeader}>
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenTitle}>🎫 Aplicar Token</Text>
              <Text style={styles.tokenDescription}>
                Usa 1 token para obtener {discountPercentage}% de descuento
              </Text>
              <Text style={styles.tokenBalance}>
                Tokens disponibles: {user?.availableTokens || 0}
              </Text>
            </View>
            <Switch
              value={applyToken}
              onValueChange={setApplyToken}
              disabled={user?.availableTokens === 0 || isProcessing}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={applyToken ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
          
          {applyToken && discountAmount > 0 && (
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>
                ¡Ahorras ${discountAmount.toLocaleString()}!
              </Text>
            </View>
          )}
          
          {user?.availableTokens === 0 && (
            <Text style={styles.noTokensText}>
              No tienes tokens disponibles. Sigue usando la app para ganar más tokens.
            </Text>
          )}
        </View>

        {/* Método de Pago */}
        <View style={styles.paymentMethod}>
          <Text style={styles.sectionTitle}>🏦 Método de Pago</Text>
          
          <View style={styles.paymentOption}>
            <View style={styles.paymentIcon}>
              <Text style={styles.paymentIconText}>💳</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>WebPay Plus</Text>
              <Text style={styles.paymentDescription}>
                Pago seguro con tarjeta de crédito o débito
              </Text>
            </View>
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>Seleccionado</Text>
            </View>
          </View>
          
          <Text style={styles.paymentNote}>
            Serás redirigido a la plataforma segura de Transbank para completar el pago.
          </Text>
        </View>

        {/* Procesando Pago */}
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <View style={styles.processingContent}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.processingText}>
                {paymentStatus === 'processing' 
                  ? 'Redirigiendo a WebPay...' 
                  : 'Procesando pago...'}
              </Text>
              <Text style={styles.processingSubtext}>
                Por favor, no cierres la aplicación
              </Text>
            </View>
          </View>
        )}

        {/* Botón de Pago */}
        <TouchableOpacity 
          style={[
            styles.payButton,
            (isProcessing || finalPrice === 0) && styles.payButtonDisabled
          ]}
          onPress={handlePayment}
          disabled={isProcessing || finalPrice === 0}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pagar con WebPay</Text>
              <Text style={styles.payButtonAmount}>${finalPrice.toLocaleString()}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Información de Seguridad */}
        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>🔒 Pago 100% Seguro</Text>
          <Text style={styles.securityText}>
            Tu información de pago está protegida con encriptación de última generación. 
            Transbank cumple con los más altos estándares de seguridad.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    minHeight: 44,
  },
  backButton: {
    padding: 8,
    width: 40,
    alignItems: 'flex-start',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    includeFontPadding: false,
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  reservationSummary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reservationDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  paymentDetails: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  priceBreakdown: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  discountText: {
    color: '#4CAF50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tokenSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tokenInfo: {
    flex: 1,
    marginRight: 16,
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tokenDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  tokenBalance: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  savingsBadge: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  noTokensText: {
    fontSize: 12,
    color: '#FF9800',
    fontStyle: 'italic',
    marginTop: 8,
  },
  paymentMethod: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentIconText: {
    fontSize: 18,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 12,
    color: '#666666',
  },
  selectedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  selectedBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  paymentNote: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  processingContent: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    margin: 20,
  },
  processingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  payButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  payButtonAmount: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  securityInfo: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#1565C0',
    lineHeight: 16,
  },
  bottomSpacer: {
    height: 20,
  },
});