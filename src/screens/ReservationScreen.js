import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

/**
 * Sistema de niveles MVP 2.0
 */
const LEVEL_SYSTEM = {
  CANTERANO: { discount: 0 },
  TITULAR: { discount: 10 },
  CAPITAN: { discount: 15 },
  ESTRELLA: { discount: 20 },
  MVP: { discount: 25 },
  CAMPION: { discount: 30 },
  BALON_DE_ORO: { discount: 40 }
};

export default function ReservationScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  
  // Obtener parámetros de navegación: establecimiento y categoría seleccionados
  const { establishment, category } = route.params;
  
  // Estados para gestionar la reserva
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  /**
   * Horarios disponibles para reserva
   */
  const availableTimes = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
    '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'
  ];

  /**
   * Genera los próximos 7 días para selección
   */
  const nextDays = [
    { date: new Date(), label: 'Hoy', formatted: formatDate(new Date()) },
    { date: new Date(Date.now() + 86400000), label: 'Mañana', formatted: formatDate(new Date(Date.now() + 86400000)) },
    { date: new Date(Date.now() + 172800000), label: getDayName(2), formatted: formatDate(new Date(Date.now() + 172800000)) },
    { date: new Date(Date.now() + 259200000), label: getDayName(3), formatted: formatDate(new Date(Date.now() + 259200000)) },
    { date: new Date(Date.now() + 345600000), label: getDayName(4), formatted: formatDate(new Date(Date.now() + 345600000)) },
    { date: new Date(Date.now() + 432000000), label: getDayName(5), formatted: formatDate(new Date(Date.now() + 432000000)) },
    { date: new Date(Date.now() + 518400000), label: getDayName(6), formatted: formatDate(new Date(Date.now() + 518400000)) }
  ];

  function getDayName(dayOffset) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const targetDate = new Date(Date.now() + (dayOffset * 86400000));
    return days[targetDate.getDay()];
  }

  function formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleReserve = () => {
    if (!selectedTime) {
      Alert.alert(
        'Horario no seleccionado',
        'Por favor elige un horario para tu reserva.',
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }
    
    console.log('📋 Mostrando confirmación de reserva...');
    setShowConfirmation(true);
  };

  /**
   * Navega a la pantalla de pago con los datos de la reserva
   */
  const navigateToPayment = () => {
    // Preparar datos para la pantalla de pago
    const reservationData = {
      establishmentName: establishment.name,
      establishmentId: establishment.id,
      date: selectedDate.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: selectedTime,
      duration: 60, // 1 hora
      price: calculateBasePrice(),
      originalPrice: parseInt(establishment.price.replace(/[$.]/g, '')),
      userLevel: user?.currentLevel || 'TITULAR',
      discountPercentage: LEVEL_SYSTEM[user?.currentLevel || 'TITULAR'].discount
    };

    console.log('💳 Navegando a pantalla de pago con datos:', reservationData);
    
    // Navegar a la pantalla de pago
    navigation.navigate('Payment', { 
      reservationData,
      category 
    });
    
    // Cerrar modal de confirmación
    setShowConfirmation(false);
  };

  /**
   * Calcula el precio base
   */
  const calculateBasePrice = () => {
    return parseInt(establishment.price.replace(/[$.]/g, ''));
  };

  const basePrice = calculateBasePrice();
  const userDiscount = LEVEL_SYSTEM[user?.currentLevel || 'TITULAR'].discount;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={category.color} barStyle="light-content" />
      
      {/* Header con imagen del establecimiento */}
      <ImageBackground
        source={{ uri: establishment.image }}
        style={styles.header}
        imageStyle={styles.headerImage}
      >
        <View style={[styles.headerOverlay, { backgroundColor: `${category.color}CC` }]} />
        
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.establishmentInfo}>
            <Text style={styles.establishmentName}>{establishment.name}</Text>
            <Text style={styles.establishmentAddress}>{establishment.address}</Text>
            <View style={styles.priceRatingContainer}>
              <Text style={styles.establishmentPrice}>{establishment.price}/hora</Text>
              <Text style={styles.establishmentRating}>⭐ {establishment.rating}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Contenido principal desplazable */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Sección de Información del Usuario */}
        <View style={styles.userInfoSection}>
          <View style={styles.userLevelBadge}>
            <Text style={styles.userLevelText}>
              🎯 Nivel {user?.currentLevel || 'TITULAR'} - {userDiscount}% descuento con tokens
            </Text>
          </View>
          <View style={styles.tokensStatus}>
            <Text style={styles.tokensStatusText}>
              🎫 Tokens disponibles: {user?.availableTokens || 0}
            </Text>
          </View>
        </View>

        {/* Sección 1: Selección de fecha */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Selecciona el día</Text>
          <Text style={styles.sectionSubtitle}>Elige la fecha para tu reserva</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.datesScroll}
          >
            {nextDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  selectedDate.toDateString() === day.date.toDateString() && styles.dateButtonSelected
                ]}
                onPress={() => setSelectedDate(day.date)}
              >
                <Text style={[
                  styles.dateButtonText,
                  selectedDate.toDateString() === day.date.toDateString() && styles.dateButtonTextSelected
                ]}>
                  {day.label}
                </Text>
                <Text style={[
                  styles.dateDayText,
                  selectedDate.toDateString() === day.date.toDateString() && styles.dateDayTextSelected
                ]}>
                  {day.formatted}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sección 2: Selección de horario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Horarios disponibles</Text>
          <Text style={styles.sectionSubtitle}>
            {selectedDate.toDateString() === new Date().toDateString() ? 'Horarios para hoy' : 
             selectedDate.toDateString() === new Date(Date.now() + 86400000).toDateString() ? 'Horarios para mañana' : 
             `Horarios para el ${selectedDate.toLocaleDateString('es-ES', { weekday: 'long' })}`}
          </Text>
          
          <View style={styles.timesGrid}>
            {availableTimes.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeButton,
                  selectedTime === time && styles.timeButtonSelected
                ]}
                onPress={() => handleTimeSelect(time)}
              >
                <Text style={[
                  styles.timeButtonText,
                  selectedTime === time && styles.timeButtonTextSelected
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Información de beneficios MVP */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>🎫 Tu beneficio MVP</Text>
          <Text style={styles.sectionSubtitle}>Aprovecha tus tokens en el pago</Text>
          
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitText}>
              • Nivel {user?.currentLevel || 'TITULAR'}: {userDiscount}% de descuento con tokens
            </Text>
            <Text style={styles.benefitText}>
              • Tokens disponibles: {user?.availableTokens || 0}
            </Text>
            <Text style={styles.benefitNote}>
              Podrás aplicar tu token en la siguiente pantalla de pago
            </Text>
          </View>
        </View>

        {/* Resumen de precios */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Precio por 1 hora:</Text>
            <Text style={styles.priceValue}>${basePrice.toLocaleString()}</Text>
          </View>
          
          <View style={[styles.priceRow, styles.finalPriceRow]}>
            <Text style={styles.finalPriceLabel}>Total a pagar:</Text>
            <Text style={styles.finalPriceValue}>${basePrice.toLocaleString()}</Text>
          </View>
          
          <Text style={styles.priceNote}>
            * El descuento por token se aplicará en la pantalla de pago
          </Text>
        </View>

        {/* Botón de reserva principal */}
        <TouchableOpacity 
          style={[
            styles.reserveButton,
            !selectedTime && styles.reserveButtonDisabled
          ]}
          onPress={handleReserve}
          disabled={!selectedTime}
        >
          <Text style={styles.reserveButtonText}>
            {selectedTime ? 
              `💳 Proceder al Pago - $${basePrice.toLocaleString()}` : 
              '⏰ Selecciona un horario primero'}
          </Text>
          <Text style={styles.reserveButtonSubtext}>
            Podrás aplicar tu token en el siguiente paso
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de confirmación de reserva */}
      <Modal
        visible={showConfirmation}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✅ Confirmar Reserva</Text>
            <Text style={styles.modalSubtitle}>Revisa los detalles antes de proceder al pago</Text>
            
            {/* Detalles de la reserva */}
            <View style={styles.reservationDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Establecimiento:</Text>
                <Text style={styles.detailValue}>{establishment.name}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fecha:</Text>
                <Text style={styles.detailValue}>
                  {selectedDate.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Horario:</Text>
                <Text style={styles.detailValue}>{selectedTime}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duración:</Text>
                <Text style={styles.detailValue}>1 hora</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nivel:</Text>
                <Text style={styles.detailValue}>{user?.currentLevel || 'TITULAR'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Precio base:</Text>
                <Text style={styles.detailValue}>${basePrice.toLocaleString()}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tokens disponibles:</Text>
                <Text style={styles.detailValue}>
                  {user?.availableTokens || 0} tokens ({userDiscount}% descuento cada uno)
                </Text>
              </View>
            </View>

            {/* Información de pago */}
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentInfoTitle}>💳 Información de Pago</Text>
              <Text style={styles.paymentInfoText}>
                En el siguiente paso podrás:
                • Aplicar tokens para descuento
                • Pagar con WebPay de forma segura
                • Confirmar tu reserva definitiva
              </Text>
            </View>

            {/* Botones de acción del modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.cancelButtonText}>✏️ Modificar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={navigateToPayment}
              >
                <Text style={styles.confirmButtonText}>💳 Proceder al Pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 180,
    justifyContent: 'flex-end',
  },
  headerImage: {},
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    padding: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  backButton: {
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  establishmentInfo: {
    flex: 1,
  },
  establishmentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  establishmentAddress: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 8,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  establishmentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  establishmentRating: {
    fontSize: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    flex: 1,
  },
  userInfoSection: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  userLevelBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  userLevelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tokensStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokensStatusText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  datesScroll: {
    flexDirection: 'row',
  },
  dateButton: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  dateButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dateDayText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  dateDayTextSelected: {
    color: '#FFFFFF',
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  timeButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  benefitsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  benefitsCard: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  benefitText: {
    fontSize: 14,
    color: '#2E7D32',
    marginBottom: 8,
    fontWeight: '500',
  },
  benefitNote: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  priceSummary: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  finalPriceRow: {
    borderTopWidth: 1,
    borderTopColor: '#DEE2E6',
    paddingTop: 12,
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  finalPriceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  finalPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceNote: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  reserveButton: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  reserveButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowColor: '#CCCCCC',
  },
  reserveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  reserveButtonSubtext: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  reservationDetails: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'right',
  },
  paymentInfo: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  paymentInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  paymentInfoText: {
    fontSize: 12,
    color: '#1565C0',
    lineHeight: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});