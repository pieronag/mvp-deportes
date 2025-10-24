import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  Share
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

/**
 * Pantalla de Detalles de Reserva con QR
 */
export default function ReservationDetailScreen({ navigation, route }) {
  const { reservation } = route.params;
  
  const [showQRModal, setShowQRModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Compartir código QR
   */
  const shareQRCode = async () => {
    try {
      await Share.share({
        message: `Mi reserva en ${reservation.establishment}\n📅 ${reservation.date} - ${reservation.time}\n📍 ${reservation.address}\nCódigo QR para acceso`,
        title: `Reserva en ${reservation.establishment}`
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  /**
   * Cancelar reserva
   */
  const handleCancelReservation = () => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que quieres cancelar esta reserva?',
      [
        { text: 'Mantener', style: 'cancel' },
        { 
          text: 'Cancelar Reserva', 
          style: 'destructive',
          onPress: () => {
            console.log('Reserva cancelada:', reservation.id);
            Alert.alert(
              'Reserva Cancelada',
              'Tu reserva ha sido cancelada exitosamente.',
              [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  /**
   * Generar datos para el QR
   */
  const generateQRData = () => {
    return JSON.stringify({
      reservationId: reservation.id,
      establishment: reservation.establishment,
      date: reservation.date,
      time: reservation.time,
      userId: 'user-123', // En una app real, vendría del contexto
      timestamp: new Date().toISOString()
    });
  };

  /**
   * Formatea la fecha para mostrar
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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
          <Text style={styles.headerTitle}>Detalles de Reserva</Text>
          <View style={styles.headerPlaceholder} />
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Tarjeta de Estado */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.establishmentName}>{reservation.establishment}</Text>
            <View style={[
              styles.statusBadge,
              reservation.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending
            ]}>
              <Text style={styles.statusText}>
                {reservation.status === 'confirmed' ? '✅ Confirmada' : '⏳ Pendiente'}
              </Text>
            </View>
          </View>
          <Text style={styles.sportText}>{reservation.sport}</Text>
        </View>

        {/* Código QR */}
        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>🎫 Código de Acceso</Text>
          <Text style={styles.sectionSubtitle}>
            Muestra este código QR al llegar al establecimiento
          </Text>
          
          <TouchableOpacity 
            style={styles.qrContainer}
            onPress={() => setShowQRModal(true)}
            activeOpacity={0.8}
          >
            <QRCode
              value={generateQRData()}
              size={200}
              backgroundColor="#FFFFFF"
              color="#000000"
            />
            <Text style={styles.qrHint}>Toca para ampliar</Text>
          </TouchableOpacity>

          <View style={styles.qrActions}>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={shareQRCode}
            >
              <Text style={styles.shareButtonText}>📤 Compartir QR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Información de la Reserva */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>📋 Detalles de la Reserva</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>{formatDate(reservation.date)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Horario</Text>
              <Text style={styles.infoValue}>{reservation.time}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Duración</Text>
              <Text style={styles.infoValue}>1 hora</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Jugadores</Text>
              <Text style={styles.infoValue}>{reservation.players}</Text>
            </View>
          </View>

          {/* Dirección expandible */}
          <TouchableOpacity 
            style={styles.addressSection}
            onPress={() => setIsExpanded(!isExpanded)}
            activeOpacity={0.7}
          >
            <View style={styles.addressHeader}>
              <Text style={styles.infoLabel}>📍 Dirección</Text>
              <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
            </View>
            <Text style={[
              styles.addressText,
              !isExpanded && styles.addressTextCollapsed
            ]} numberOfLines={isExpanded ? undefined : 2}>
              {reservation.address}
            </Text>
          </TouchableOpacity>

          {/* Información de Pago */}
          <View style={styles.paymentInfo}>
            <Text style={styles.infoLabel}>💳 Información de Pago</Text>
            <View style={styles.paymentDetails}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Precio total</Text>
                <Text style={styles.paymentValue}>${reservation.price.toLocaleString()}</Text>
              </View>
              {reservation.useToken && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Token aplicado</Text>
                  <Text style={styles.tokenApplied}>🎫 1 token</Text>
                </View>
              )}
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Estado del pago</Text>
                <Text style={styles.paymentStatus}>✅ Pagado</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tiempo Restante */}
        <View style={styles.countdownCard}>
          <Text style={styles.countdownTitle}>⏰ Tiempo Restante</Text>
          <Text style={styles.countdownTime}>{reservation.countdown}</Text>
          <Text style={styles.countdownSubtitle}>
            {reservation.status === 'confirmed' 
              ? 'Tu reserva está confirmada y lista'
              : 'Esperando confirmación del establecimiento'
            }
          </Text>
        </View>

        {/* Instrucciones */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📝 Instrucciones</Text>
          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>• Presenta el código QR al llegar</Text>
            <Text style={styles.instructionItem}>• Llega 15 minutos antes del horario</Text>
            <Text style={styles.instructionItem}>• Trae tu equipo deportivo</Text>
            <Text style={styles.instructionItem}>• Cancela con 2 horas de anticipación</Text>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => setShowQRModal(true)}
          >
            <Text style={styles.primaryButtonText}>👁️ Ver QR Completo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleCancelReservation}
          >
            <Text style={styles.secondaryButtonText}>🗑️ Cancelar Reserva</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal de QR Completo */}
      <Modal
        visible={showQRModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Código QR de Acceso</Text>
            <Text style={styles.modalSubtitle}>{reservation.establishment}</Text>
            
            <View style={styles.fullQRContainer}>
              <QRCode
                value={generateQRData()}
                size={250}
                backgroundColor="#FFFFFF"
                color="#000000"
              />
            </View>
            
            <Text style={styles.reservationInfo}>
              {formatDate(reservation.date)} - {reservation.time}
            </Text>
            <Text style={styles.reservationId}>
              ID: {reservation.id}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalShareButton}
                onPress={shareQRCode}
              >
                <Text style={styles.modalShareButtonText}>📤 Compartir</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowQRModal(false)}
              >
                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
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
    paddingBottom: 30,
  },
  statusCard: {
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
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  establishmentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
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
  sportText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  qrSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrHint: {
    fontSize: 12,
    color: '#666666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  qrActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shareButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
  },
  infoSection: {
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
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    width: '48%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  addressSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expandIcon: {
    fontSize: 12,
    color: '#666666',
  },
  addressText: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  addressTextCollapsed: {
    lineHeight: 18,
  },
  paymentInfo: {
    marginBottom: 10,
  },
  paymentDetails: {
    marginTop: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666666',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tokenApplied: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '600',
  },
  paymentStatus: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  countdownCard: {
    backgroundColor: '#FFF3E0',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  countdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  countdownTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  countdownSubtitle: {
    fontSize: 14,
    color: '#E65100',
    textAlign: 'center',
  },
  instructionsCard: {
    backgroundColor: '#E8F5E8',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  instructionsList: {
    gap: 8,
  },
  instructionItem: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFF5F5',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FED7D7',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53E3E',
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  fullQRContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    marginBottom: 16,
  },
  reservationInfo: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    textAlign: 'center',
  },
  reservationId: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalShareButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  modalShareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
  },
  modalCloseButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  modalCloseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
});