import React, { useState } from 'react';
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

/**
 * Datos de ejemplo del usuario
 */
const mockUserData = {
  id: 'user-123',
  name: 'Juan Pérez',
  currentLevel: 'TITULAR',
  monthlyTokens: 3,
  tokensUsed: 1,
  availableTokens: 2
};

/**
 * Pantalla completa del sistema de reservas
 * Permite seleccionar fecha, horario y aplicar tokens de descuento
 */
export default function ReservationScreen({ route, navigation }) {
  // Obtener parámetros de navegación: establecimiento y categoría seleccionados
  const { establishment, category } = route.params;
  
  // Estados para gestionar la reserva
  const [selectedDate, setSelectedDate] = useState(new Date()); // Fecha seleccionada
  const [selectedTime, setSelectedTime] = useState(null); // Horario seleccionado
  const [useToken, setUseToken] = useState(false); // Si usa token para descuento
  const [showConfirmation, setShowConfirmation] = useState(false); // Mostrar modal de confirmación
  const [userData, setUserData] = useState(mockUserData);

  /**
   * Horarios disponibles para reserva
   * Divididos en turnos mañana y tarde
   */
  const availableTimes = [
    // Turno mañana
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    // Turno tarde
    '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
    // Turno noche
    '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'
  ];

  /**
   * Genera los próximos 7 días para selección
   * Incluye hoy, mañana y los siguientes 5 días
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

  /**
   * Obtiene el nombre del día de la semana
   * @param {number} dayOffset - Días a agregar desde hoy
   * @returns {string} - Nombre del día
   */
  function getDayName(dayOffset) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const targetDate = new Date(Date.now() + (dayOffset * 86400000));
    return days[targetDate.getDay()];
  }

  /**
   * Formatea la fecha a string legible
   * @param {Date} date - Fecha a formatear
   * @returns {string} - Fecha formateada (DD/MM)
   */
  function formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }

  /**
   * Maneja la selección de horario
   * @param {string} time - Horario seleccionado
   */
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    console.log('⏰ Horario seleccionado:', time);
  };

  /**
   * Maneja el uso de tokens
   */
  const handleTokenToggle = () => {
    if (!useToken && userData.availableTokens === 0) {
      Alert.alert(
        'Sin Tokens Disponibles',
        'No tienes tokens disponibles este mes. Puedes comprar tokens adicionales o esperar al próximo mes.',
        [
          { text: 'Comprar Tokens', onPress: () => console.log('Navegar a compra de tokens') },
          { text: 'Entendido', style: 'cancel' }
        ]
      );
      return;
    }
    setUseToken(!useToken);
  };

  /**
   * Valida y procede con la reserva
   * Muestra modal de confirmación si todo está correcto
   */
  const handleReserve = () => {
    if (!selectedTime) {
      Alert.alert(
        'Horario no seleccionado',
        'Por favor elige un horario para tu reserva.',
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }
    
    if (useToken && userData.availableTokens === 0) {
      Alert.alert(
        'Token no disponible',
        'No puedes usar un token porque no tienes disponibles este mes.',
        [{ text: 'Entendido', style: 'default' }]
      );
      setUseToken(false);
      return;
    }
    
    console.log('📋 Iniciando proceso de reserva...');
    console.log('🏢 Establecimiento:', establishment.name);
    console.log('📅 Fecha:', selectedDate.toLocaleDateString('es-ES'));
    console.log('⏰ Horario:', selectedTime);
    console.log('🎫 Usa token:', useToken);
    console.log('💰 Precio final:', `$${calculateFinalPrice().toLocaleString()}`);
    console.log('👤 Nivel usuario:', userData.currentLevel);
    console.log('🎫 Tokens disponibles:', userData.availableTokens);
    
    setShowConfirmation(true);
  };

  /**
   * Confirma la reserva definitivamente
   * Aquí se integraría con Firebase en el futuro
   */
  const confirmReservation = () => {
    // Simular guardado en base de datos
    const reservationData = {
      establishment: establishment.name,
      date: selectedDate,
      time: selectedTime,
      useToken: useToken,
      finalPrice: calculateFinalPrice(),
      userLevel: userData.currentLevel,
      discountApplied: useToken ? LEVEL_SYSTEM[userData.currentLevel].discount : 0,
      reservationId: 'RSV-' + Date.now(),
      status: 'confirmed'
    };
    
    console.log('✅ Reserva confirmada:', reservationData);
    
    // Actualizar tokens del usuario si usó uno
    if (useToken) {
      setUserData(prev => ({
        ...prev,
        tokensUsed: prev.tokensUsed + 1,
        availableTokens: prev.availableTokens - 1
      }));
    }
    
    // Cerrar modal
    setShowConfirmation(false);
    
    // Mostrar alerta de éxito
    Alert.alert(
      '¡Reserva Confirmada! 🎉',
      `Tu reserva en ${establishment.name} para ${selectedTime} ha sido confirmada.\n\n` +
      `📅 ${selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
      `💰 Precio final: $${calculateFinalPrice().toLocaleString()}\n` +
      `🎫 ${useToken ? `1 token aplicado (${LEVEL_SYSTEM[userData.currentLevel].discount}% descuento)` : 'Sin uso de tokens'}\n` +
      `📊 Nivel actual: ${userData.currentLevel}\n\n` +
      `ID de reserva: ${reservationData.reservationId}`,
      [
        {
          text: 'Volver al Inicio',
          onPress: () => navigation.navigate('Home')
        },
        {
          text: 'Seguir Explorando',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  /**
   * Calcula el precio final aplicando descuento si usa token
   * @returns {number} - Precio final
   */
  const calculateFinalPrice = () => {
    // Extraer precio base (remover símbolos y convertir a número)
    const basePrice = parseInt(establishment.price.replace(/[$.]/g, ''));
    
    if (useToken) {
      // Calcular descuento según nivel del usuario
      const discountPercentage = LEVEL_SYSTEM[userData.currentLevel].discount;
      // Aplicar descuento
      return Math.round(basePrice * (1 - discountPercentage / 100));
    }
    
    return basePrice;
  };

  /**
   * Calcula el ahorro por usar token
   * @returns {number} - Monto ahorrado
   */
  const calculateSavings = () => {
    const basePrice = parseInt(establishment.price.replace(/[$.]/g, ''));
    return basePrice - calculateFinalPrice();
  };

  const finalPrice = calculateFinalPrice();
  const savings = calculateSavings();
  const userDiscount = LEVEL_SYSTEM[userData.currentLevel].discount;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={category.color} barStyle="light-content" />
      
      {/* Header con imagen del establecimiento */}
      <ImageBackground
        source={{ uri: establishment.image }}
        style={styles.header}
        imageStyle={styles.headerImage}
      >
        {/* Overlay con color de categoría para mejor legibilidad */}
        <View style={[styles.headerOverlay, { backgroundColor: `${category.color}CC` }]} />
        
        <View style={styles.headerContent}>
          {/* Botón para volver atrás */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          {/* Información del establecimiento */}
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
              🎯 Nivel {userData.currentLevel} - {userDiscount}% descuento con tokens
            </Text>
          </View>
          <View style={styles.tokensStatus}>
            <Text style={styles.tokensStatusText}>
              🎫 Tokens: {userData.availableTokens} disponibles de {userData.monthlyTokens} mensuales
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

        {/* Sección 3: Opción de token */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎫 Tu beneficio MVP</Text>
          <Text style={styles.sectionSubtitle}>Aprovecha tus tokens para obtener descuentos</Text>
          
          <TouchableOpacity 
            style={[
              styles.tokenOption,
              userData.availableTokens === 0 && styles.tokenOptionDisabled
            ]}
            onPress={handleTokenToggle}
            activeOpacity={0.7}
            disabled={userData.availableTokens === 0}
          >
            <View style={[
              styles.checkbox,
              useToken && styles.checkboxSelected,
              userData.availableTokens === 0 && styles.checkboxDisabled
            ]}>
              {useToken && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.tokenInfo}>
              <Text style={[
                styles.tokenTitle,
                userData.availableTokens === 0 && styles.tokenTitleDisabled
              ]}>
                Usar 1 token para descuento
              </Text>
              <Text style={styles.tokenDescription}>
                Aplica {userDiscount}% de descuento en tu reserva (nivel {userData.currentLevel})
              </Text>
              {useToken && (
                <Text style={styles.tokenSavings}>
                  ¡Ahorras: ${savings.toLocaleString()}!
                </Text>
              )}
              {userData.availableTokens === 0 && (
                <Text style={styles.tokenWarning}>
                  No tienes tokens disponibles este mes
                </Text>
              )}
            </View>
          </TouchableOpacity>
          
          {/* Información de tokens disponibles */}
          <View style={styles.tokensAvailable}>
            <Text style={styles.tokensAvailableText}>
              🎫 Tienes {userData.availableTokens} tokens disponibles (máximo {userData.monthlyTokens} mensuales)
            </Text>
            <TouchableOpacity 
              style={styles.buyTokensLink}
              onPress={() => console.log('Navegar a compra de tokens')}
            >
              <Text style={styles.buyTokensLinkText}>
                Comprar tokens adicionales →
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resumen de precios */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Precio base:</Text>
            <Text style={styles.priceValue}>{establishment.price}</Text>
          </View>
          {useToken && (
            <>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Descuento ({userDiscount}%):</Text>
                <Text style={[styles.priceValue, styles.discountText]}>
                  -${savings.toLocaleString()}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Token utilizado:</Text>
                <Text style={styles.priceValue}>🎫 1 token</Text>
              </View>
            </>
          )}
          <View style={[styles.priceRow, styles.finalPriceRow]}>
            <Text style={styles.finalPriceLabel}>Precio final:</Text>
            <Text style={styles.finalPriceValue}>${finalPrice.toLocaleString()}</Text>
          </View>
        </View>

        {/* Botón de reserva principal */}
        <TouchableOpacity 
          style={[
            styles.reserveButton,
            (!selectedTime || (useToken && userData.availableTokens === 0)) && styles.reserveButtonDisabled
          ]}
          onPress={handleReserve}
          disabled={!selectedTime || (useToken && userData.availableTokens === 0)}
        >
          <Text style={styles.reserveButtonText}>
            {selectedTime ? 
              `🎯 Confirmar Reserva - $${finalPrice.toLocaleString()}` : 
              '⏰ Selecciona un horario primero'}
          </Text>
          {useToken && (
            <Text style={styles.reserveButtonSubtext}>
              Con {userDiscount}% de descuento por tu nivel {userData.currentLevel}
            </Text>
          )}
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
            <Text style={styles.modalSubtitle}>Revisa los detalles antes de confirmar</Text>
            
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
                <Text style={styles.detailValue}>{userData.currentLevel}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Precio final:</Text>
                <Text style={styles.detailValue}>${finalPrice.toLocaleString()}</Text>
              </View>
              
              {useToken && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tokens usados:</Text>
                  <Text style={styles.detailValue}>
                    1 🎫 ({userDiscount}% descuento) - ${savings.toLocaleString()} ahorrados
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tokens restantes:</Text>
                <Text style={styles.detailValue}>
                  {useToken ? userData.availableTokens - 1 : userData.availableTokens} de {userData.monthlyTokens}
                </Text>
              </View>
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
                onPress={confirmReservation}
              >
                <Text style={styles.confirmButtonText}>✅ Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Estilos de la pantalla de reservas
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header con imagen
  header: {
    height: 180,
    justifyContent: 'flex-end',
  },
  headerImage: {
    // Estilos para la imagen de fondo
  },
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
  // Sección de información del usuario
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
  // Secciones del contenido
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
  // Selector de fechas
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
  // Grid de horarios
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
  // Opción de token
  tokenOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  tokenOptionDisabled: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxDisabled: {
    backgroundColor: '#F0F0F0',
    borderColor: '#DDDDDD',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tokenTitleDisabled: {
    color: '#999999',
  },
  tokenDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  tokenSavings: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  tokenWarning: {
    fontSize: 12,
    color: '#F44336',
    fontStyle: 'italic',
  },
  tokensAvailable: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tokensAvailableText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
    marginBottom: 8,
  },
  buyTokensLink: {
    alignSelf: 'flex-start',
  },
  buyTokensLinkText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  // Resumen de precios
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
  discountText: {
    color: '#4CAF50',
    fontWeight: 'bold',
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
  // Botón de reserva principal
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
  // Modal de confirmación
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