import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

/**
 * Pantalla dedicada a tokens y sistema de recompensas
 */
export default function TokensScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    name: user?.name || 'Usuario MVP',
    monthlyTokens: user?.monthlyTokens || 3,
    tokensUsed: user?.tokensUsed || 1,
    availableTokens: user?.availableTokens || 2,
    totalReservations: user?.totalReservations || 15,
    currentLevel: user?.currentLevel || 'TITULAR',
    streak: user?.streak || 8
  });

  /**
   * Calcula el ahorro potencial con tokens
   */
  const calculatePotentialSavings = () => {
    const avgPrice = 15000; // Precio promedio por reserva
    const discount = 0.10; // 10% descuento para nivel Titular
    return userData.availableTokens * (avgPrice * discount);
  };

  /**
   * Muestra información sobre cómo ganar tokens
   */
  const showHowToEarnTokens = () => {
    Alert.alert(
      '🎯 Cómo Ganar Más Tokens',
      'Puedes obtener tokens gratuitos mediante:\n\n• Realizar reservas consistentemente\n• Mantener tu racha de semanas activas\n• Completar desafíos mensuales\n• Invitar amigos a la plataforma\n• Participar en eventos especiales',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  /**
   * Muestra el próximo reinicio de tokens
   */
  const showNextReset = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const resetDate = nextMonth.toLocaleDateString('es-ES', options);
    
    Alert.alert(
      '🔄 Próximo Reinicio',
      `Tus tokens mensuales se reiniciarán el ${resetDate}\n\nAsegúrate de usar tus tokens disponibles antes de esa fecha.`,
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const potentialSavings = calculatePotentialSavings();

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
              🎫 Mis Tokens
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
        
        {/* Resumen de Tokens */}
        <View style={styles.tokensSummary}>
          <View style={styles.availableTokens}>
            <Text style={styles.availableNumber}>{userData.availableTokens}</Text>
            <Text style={styles.availableLabel}>Tokens Disponibles</Text>
          </View>
          
          <View style={styles.tokensBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownNumber}>{userData.monthlyTokens}</Text>
              <Text style={styles.breakdownLabel}>Mensuales</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownNumber}>{userData.tokensUsed}</Text>
              <Text style={styles.breakdownLabel}>Usados</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownNumber}>6</Text>
              <Text style={styles.breakdownLabel}>Máximo</Text>
            </View>
          </View>
        </View>

        {/* Ahorro Potencial */}
        <View style={styles.savingsCard}>
          <Text style={styles.savingsTitle}>💰 Ahorro Potencial</Text>
          <Text style={styles.savingsAmount}>${potentialSavings.toLocaleString()}</Text>
          <Text style={styles.savingsDescription}>
            Con tus {userData.availableTokens} tokens disponibles, puedes ahorrar hasta esta cantidad en tus próximas reservas
          </Text>
        </View>

        {/* Cómo Funcionan los Tokens */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 ¿Cómo Funcionan los Tokens?</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• 1 token = 1 reserva con descuento</Text>
            <Text style={styles.infoItem}>• Descuento según tu nivel (10%-40%)</Text>
            <Text style={styles.infoItem}>• Tokens mensuales se reinician cada mes</Text>
            <Text style={styles.infoItem}>• Tokens no expiran mientras seas activo</Text>
            <Text style={styles.infoItem}>• Máximo 6 tokens acumulables</Text>
          </View>
        </View>

        {/* Cómo Ganar Más Tokens */}
        <View style={styles.earnSection}>
          <Text style={styles.sectionTitle}>🚀 Cómo Ganar Más Tokens</Text>
          <Text style={styles.sectionSubtitle}>
            Obtén tokens gratuitos mediante tu actividad
          </Text>
          
          <View style={styles.earningMethods}>
            <View style={styles.earningMethod}>
              <Text style={styles.earningIcon}>📅</Text>
              <View style={styles.earningDetails}>
                <Text style={styles.earningTitle}>Reservas Consistentes</Text>
                <Text style={styles.earningDescription}>
                  +1 token por cada 5 reservas mensuales
                </Text>
              </View>
              <View style={styles.earningStatus}>
                <Text style={styles.earningProgress}>3/5</Text>
              </View>
            </View>
            
            <View style={styles.earningMethod}>
              <Text style={styles.earningIcon}>🔥</Text>
              <View style={styles.earningDetails}>
                <Text style={styles.earningTitle}>Racha Semanal</Text>
                <Text style={styles.earningDescription}>
                  +1 token por 4 semanas consecutivas activas
                </Text>
              </View>
              <View style={styles.earningStatus}>
                <Text style={styles.earningProgress}>{userData.streak}/4</Text>
              </View>
            </View>
            
            <View style={styles.earningMethod}>
              <Text style={styles.earningIcon}>👥</Text>
              <View style={styles.earningDetails}>
                <Text style={styles.earningTitle}>Invitar Amigos</Text>
                <Text style={styles.earningDescription}>
                  +1 token por cada amigo que se registre
                </Text>
              </View>
              <View style={styles.earningStatus}>
                <Text style={styles.earningAction}>Invitar</Text>
              </View>
            </View>
            
            <View style={styles.earningMethod}>
              <Text style={styles.earningIcon}>🎯</Text>
              <View style={styles.earningDetails}>
                <Text style={styles.earningTitle}>Desafíos Mensuales</Text>
                <Text style={styles.earningDescription}>
                  Completa desafíos para ganar tokens extra
                </Text>
              </View>
              <View style={styles.earningStatus}>
                <Text style={styles.earningAction}>Ver</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.earnMoreButton}
            onPress={showHowToEarnTokens}
          >
            <Text style={styles.earnMoreButtonText}>📈 Ver Todas las Formas de Ganar Tokens</Text>
          </TouchableOpacity>
        </View>

        {/* Próximo Reinicio */}
        <TouchableOpacity 
          style={styles.resetCard}
          onPress={showNextReset}
        >
          <Text style={styles.resetIcon}>🔄</Text>
          <View style={styles.resetInfo}>
            <Text style={styles.resetTitle}>Próximo Reinicio Mensual</Text>
            <Text style={styles.resetDate}>1 de Abril 2024</Text>
          </View>
          <Text style={styles.resetArrow}>›</Text>
        </TouchableOpacity>

        {/* Historial de Tokens */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>📊 Historial Reciente</Text>
          
          <View style={styles.historyList}>
            <View style={styles.historyItem}>
              <Text style={styles.historyIcon}>🎁</Text>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>Token Mensual</Text>
                <Text style={styles.historyDate}>1 de Marzo 2024 - Mensual</Text>
              </View>
              <Text style={styles.historyTokens}>+1</Text>
            </View>
            
            <View style={styles.historyItem}>
              <Text style={styles.historyIcon}>⚽</Text>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>Reserva Cancha Central</Text>
                <Text style={styles.historyDate}>15 de Marzo 2024 - Uso</Text>
              </View>
              <Text style={[styles.historyTokens, styles.usedTokens]}>-1</Text>
            </View>
            
            <View style={styles.historyItem}>
              <Text style={styles.historyIcon}>🔥</Text>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>Racha de 4 Semanas</Text>
                <Text style={styles.historyDate}>10 de Marzo 2024 - Recompensa</Text>
              </View>
              <Text style={styles.historyTokens}>+1</Text>
            </View>

            <View style={styles.historyItem}>
              <Text style={styles.historyIcon}>📅</Text>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>5 Reservas Mensuales</Text>
                <Text style={styles.historyDate}>5 de Marzo 2024 - Logro</Text>
              </View>
              <Text style={styles.historyTokens}>+1</Text>
            </View>
          </View>
        </View>

        {/* Preguntas Frecuentes */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>❓ Preguntas Frecuentes</Text>
          
          <View style={styles.faqList}>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>¿Los tokens expiran?</Text>
              <Text style={styles.faqAnswer}>
                Los tokens mensuales se reinician cada mes. Los tokens por logros y recompensas no expiran mientras mantengas actividad en la plataforma.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>¿Puedo transferir tokens?</Text>
              <Text style={styles.faqAnswer}>
                No, los tokens son personales e intransferibles. Están vinculados a tu cuenta y nivel MVP.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>¿Máximo de tokens acumulables?</Text>
              <Text style={styles.faqAnswer}>
                Puedes acumular hasta 6 tokens simultáneamente. Te recomendamos usarlos regularmente para maximizar tus beneficios.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>¿Cómo aumento mis tokens mensuales?</Text>
              <Text style={styles.faqAnswer}>
                Subiendo de nivel en el sistema MVP. Cada nivel superior te otorga más tokens mensuales gratuitos.
              </Text>
            </View>
          </View>
        </View>

        {/* CTA para Usar Tokens */}
        <TouchableOpacity 
          style={styles.useTokensButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.useTokensButtonText}>🎯 Usar Mis Tokens en una Reserva</Text>
          <Text style={styles.useTokensButtonSubtext}>
            Aprovecha tu descuento del {userData.currentLevel === 'TITULAR' ? '10%' : '15%'}
          </Text>
        </TouchableOpacity>

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
  tokensSummary: {
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
  availableTokens: {
    alignItems: 'center',
    marginBottom: 20,
  },
  availableNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  availableLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  tokensBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666666',
  },
  savingsCard: {
    backgroundColor: '#E8F5E8',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  savingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  savingsAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  savingsDescription: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 12,
  },
  infoList: {
    marginLeft: 8,
  },
  infoItem: {
    fontSize: 14,
    color: '#1565C0',
    marginBottom: 6,
    lineHeight: 20,
  },
  earnSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  earningMethods: {
    gap: 12,
    marginBottom: 16,
  },
  earningMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  earningIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  earningDetails: {
    flex: 1,
  },
  earningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  earningDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  earningStatus: {
    alignItems: 'flex-end',
  },
  earningProgress: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  earningAction: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  earnMoreButton: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  earnMoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    textAlign: 'center',
  },
  resetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  resetIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  resetInfo: {
    flex: 1,
  },
  resetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  resetDate: {
    fontSize: 12,
    color: '#666666',
  },
  resetArrow: {
    fontSize: 18,
    color: '#666666',
    fontWeight: 'bold',
  },
  historySection: {
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
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  historyIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  historyDetails: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: '#666666',
  },
  historyTokens: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  usedTokens: {
    color: '#F44336',
  },
  faqSection: {
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
  faqList: {
    gap: 16,
  },
  faqItem: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  useTokensButton: {
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
  useTokensButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  useTokensButtonSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  bottomSpacer: {
    height: 20,
  },
});