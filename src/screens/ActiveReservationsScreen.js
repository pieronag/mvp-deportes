import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from 'react-native';

/**
 * Pantalla de reservas activas del usuario
 */
export default function ActiveReservationsScreen({ navigation }) {
  const [activeReservations, setActiveReservations] = useState([
    {
      id: 'RSV-123456',
      establishment: 'Cancha Central Fútbol',
      sport: 'Fútbol',
      date: '2024-03-20',
      time: '18:00 - 19:00',
      players: 10,
      status: 'confirmed',
      countdown: '2h 30m',
      address: 'Av. Deportiva 123, Rancagua, Región del Libertador Bernardo OHiggins',
      price: 15000,
      useToken: true,
      establishmentId: 'est-001'
    },
    {
      id: 'RSV-123457',
      establishment: 'Pádel Premium',
      sport: 'Pádel',
      date: '2024-03-21',
      time: '20:00 - 21:00',
      players: 4,
      status: 'confirmed',
      countdown: '1d 2h 30m',
      address: 'Av. Deportiva 789, Rancagua, Región del Libertador Bernardo OHiggins',
      price: 20000,
      useToken: false,
      establishmentId: 'est-002'
    },
    {
      id: 'RSV-123458',
      establishment: 'Básquet Arena',
      sport: 'Básquetbol',
      date: '2024-03-22',
      time: '17:00 - 18:00',
      players: 8,
      status: 'pending',
      countdown: '2d 1h 15m',
      address: 'Calle Deportes 654, Rancagua, Región del Libertador Bernardo OHiggins',
      price: 12000,
      useToken: true,
      establishmentId: 'est-003'
    }
  ]);

  /**
   * Formatea la fecha para mostrar
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  /**
   * Maneja la cancelación de reserva
   */
  const handleCancelReservation = (reservationId) => {
    console.log('Cancelando reserva:', reservationId);
    // Aquí iría la lógica real de cancelación
  };

  /**
   * Maneja ver detalles de reserva
   */
  const handleViewDetails = (reservation) => {
    console.log('Viendo detalles:', reservation);
    // Navegar a pantalla de detalles con QR
    navigation.navigate('ReservationDetail', { reservation });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header con más espacio */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🎯 Reservas Activas</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Contador de reservas */}
        <View style={styles.reservationsCount}>
          <Text style={styles.countNumber}>{activeReservations.length}</Text>
          <Text style={styles.countLabel}>reservas activas</Text>
        </View>

        {/* Lista de reservas */}
        <View style={styles.reservationsList}>
          {activeReservations.map((reservation) => (
            <View key={reservation.id} style={styles.reservationCard}>
              
              {/* Header de la reserva */}
              <View style={styles.reservationHeader}>
                <View style={styles.establishmentInfo}>
                  <Text style={styles.establishmentName}>
                    {reservation.establishment}
                  </Text>
                  <Text style={styles.reservationSport}>
                    {reservation.sport} • {reservation.players} jugadores
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  reservation.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending
                ]}>
                  <Text style={styles.statusText}>
                    {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </Text>
                </View>
              </View>

              {/* Detalles de fecha y hora */}
              <View style={styles.reservationDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>📅</Text>
                  <Text style={styles.detailText}>
                    {formatDate(reservation.date)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>⏰</Text>
                  <Text style={styles.detailText}>{reservation.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>📍</Text>
                  <Text style={styles.detailText} numberOfLines={2}>
                    {reservation.address}
                  </Text>
                </View>
              </View>

              {/* Countdown y precio */}
              <View style={styles.reservationFooter}>
                <View style={styles.countdownSection}>
                  <Text style={styles.countdownLabel}>Faltan</Text>
                  <Text style={styles.countdownTime}>{reservation.countdown}</Text>
                </View>
                
                <View style={styles.priceSection}>
                  <Text style={styles.price}>${reservation.price.toLocaleString()}</Text>
                  {reservation.useToken && (
                    <Text style={styles.tokenUsed}>🎫 Token aplicado</Text>
                  )}
                </View>
              </View>

              {/* Botones de acción */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => handleViewDetails(reservation)}
                >
                  <Text style={styles.detailsButtonText}>Ver Detalles</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleCancelReservation(reservation.id)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Estado vacío */}
        {activeReservations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📅</Text>
            <Text style={styles.emptyStateTitle}>No tienes reservas activas</Text>
            <Text style={styles.emptyStateText} numberOfLines={3}>
              Realiza tu primera reserva y aparecerá aquí para que puedas gestionarla fácilmente
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreButtonText}>Explorar Canchas</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Información adicional - MEJORADO */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Información Importante</Text>
          <Text style={styles.infoText} numberOfLines={4}>
            • Puedes cancelar hasta 2 horas antes sin penalización{"\n"}
            • Recomendamos llegar 15 minutos antes del horario{"\n"}
            • No olvides traer tu equipo deportivo personal{"\n"}
            • Los tokens aplicados no se devuelven al cancelar
          </Text>
        </View>

        {/* Espacio adicional al final */}
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
  // HEADER MEJORADO con más espacio
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    paddingTop: 50, // Más espacio arriba
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 20, // Un poco más grande
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerPlaceholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30, // Más espacio al final
  },
  reservationsCount: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  countNumber: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  countLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  reservationsList: {
    marginBottom: 20,
  },
  reservationCard: {
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
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  establishmentInfo: {
    flex: 1,
    marginRight: 12,
  },
  establishmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  reservationSport: {
    fontSize: 14,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#E8F5E8',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  reservationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Cambiado para mejor alineación
    marginBottom: 10, // Más espacio entre filas
    minHeight: 24, // Altura mínima para consistencia
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 24,
    marginTop: 2, // Mejor alineación vertical
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    lineHeight: 20, // Mejor legibilidad
  },
  reservationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  countdownSection: {
    alignItems: 'flex-start',
  },
  countdownLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  countdownTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  tokenUsed: {
    fontSize: 11,
    color: '#FF9800',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    padding: 14, // Un poco más de padding
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  cancelButton: {
    flex: 1,
    padding: 14, // Un poco más de padding
    backgroundColor: '#FFF5F5',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53E3E',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20, // Más espacio
  },
  emptyStateTitle: {
    fontSize: 20, // Más grande
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15, // Más grande
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22, // Mejor interlineado
    paddingHorizontal: 10, // Padding para no pegarse a los bordes
  },
  exploreButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32, // Más ancho
    paddingVertical: 14, // Más alto
    borderRadius: 12,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    padding: 20, // Más padding
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 17, // Más grande
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 22, // Mejor interlineado
  },
  bottomSpacer: {
    height: 20, // Espacio adicional al final
  },
});