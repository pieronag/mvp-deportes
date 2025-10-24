import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

/**
 * Sistema de niveles MVP 2.0 - 7 Niveles
 */
const LEVEL_SYSTEM = {
  CANTERANO: { 
    name: 'Canterano', 
    min: 0, 
    max: 5, 
    tokens: 0, 
    discount: 0, 
    color: '#9E9E9E',
    icon: '🌱',
    description: 'Estás comenzando tu journey deportivo',
    benefits: [
      'Acceso a la plataforma MVP',
      'Reserva básica de canchas',
      'Soporte por email',
      'Newsletter deportivo'
    ]
  },
  TITULAR: { 
    name: 'Titular', 
    min: 6, 
    max: 20, 
    tokens: 1, 
    discount: 10, 
    color: '#4CAF50',
    icon: '⭐',
    description: 'Eres un jugador constante y confiable',
    benefits: [
      '1 token mensual gratuito',
      '10% de descuento en reservas',
      'Acceso a todos los deportes',
      'Recordatorios de reserva',
      'Soporte prioritario'
    ]
  },
  CAPITAN: { 
    name: 'Capitán', 
    min: 21, 
    max: 40, 
    tokens: 2, 
    discount: 15, 
    color: '#2196F3',
    icon: '👑',
    description: 'Lideras e inspires a otros jugadores',
    benefits: [
      '2 tokens mensuales gratuitos',
      '15% de descuento en reservas',
      'Reserva prioritaria 48h antes',
      'Estadísticas de juego',
      'Invitaciones a torneos'
    ]
  },
  ESTRELLA: { 
    name: 'Estrella', 
    min: 41, 
    max: 60, 
    tokens: 3, 
    discount: 20, 
    color: '#FF9800',
    icon: '🌟',
    description: 'Brillas en cada partido que juegas',
    benefits: [
      '3 tokens mensuales gratuitos',
      '20% de descuento en reservas',
      'Acceso a horarios premium',
      'Análisis de rendimiento',
      'Eventos exclusivos MVP'
    ]
  },
  MVP: { 
    name: 'MVP', 
    min: 61, 
    max: 80, 
    tokens: 4, 
    discount: 25, 
    color: '#9C27B0',
    icon: '🏆',
    description: 'Eres el Jugador Más Valioso de la plataforma',
    benefits: [
      '4 tokens mensuales gratuitos',
      '25% de descuento en reservas',
      'Reserva instantánea',
      'Coach virtual incluido',
      'Soporte VIP 24/7'
    ]
  },
  CAMPION: { 
    name: 'Campeón', 
    min: 81, 
    max: 100, 
    tokens: 5, 
    discount: 30, 
    color: '#F44336',
    icon: '💎',
    description: 'Has demostrado excelencia consistente',
    benefits: [
      '5 tokens mensuales gratuitos',
      '30% de descuento en reservas',
      'Acceso a torneos exclusivos',
      'Merchandising oficial',
      'Reconocimiento especial'
    ]
  },
  BALON_DE_ORO: { 
    name: 'Balón de Oro', 
    min: 101, 
    tokens: 6, 
    discount: 40, 
    color: '#FFD700',
    icon: '⚽',
    description: 'Leyenda viviente del deporte',
    benefits: [
      '6 tokens mensuales gratuitos',
      '40% de descuento permanente',
      'Acceso ilimitado premium',
      'Eventos privados con atletas',
      'Status de embajador MVP'
    ]
  }
};

export default function LevelScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [progress] = useState(new Animated.Value(0));
  const [currentLevel, setCurrentLevel] = useState(null);

  /**
   * Obtiene el siguiente nivel del usuario
   */
  function getNextLevel(currentLevelKey) {
    const levels = Object.keys(LEVEL_SYSTEM);
    const currentIndex = levels.indexOf(currentLevelKey);
    
    if (currentIndex < levels.length - 1) {
      return LEVEL_SYSTEM[levels[currentIndex + 1]];
    }
    return null;
  }

  /**
   * Calcula el progreso hacia el siguiente nivel
   */
  function calculateProgress(currentLevel, userReservations) {
    if (!currentLevel) return 0;
    
    const nextLevel = getNextLevel(Object.keys(LEVEL_SYSTEM).find(key => LEVEL_SYSTEM[key].name === currentLevel.name));
    if (!nextLevel) return 100;
    
    const currentMin = currentLevel.min;
    const nextMin = nextLevel.min;
    
    return ((userReservations - currentMin) / (nextMin - currentMin)) * 100;
  }

  // Determinar nivel actual del usuario
  useEffect(() => {
    if (user) {
      const userReservations = user.totalReservations || 0;
      let userLevel = LEVEL_SYSTEM.CANTERANO;
      
      // Encontrar el nivel actual basado en reservas
      Object.values(LEVEL_SYSTEM).forEach(level => {
        if (userReservations >= level.min) {
          userLevel = level;
        }
      });
      
      setCurrentLevel(userLevel);
      
      // Animación de progreso
      const progressValue = Math.min(calculateProgress(userLevel, userReservations) / 100, 1);
      
      Animated.timing(progress, {
        toValue: progressValue,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false
      }).start();
    }
  }, [user]);

  const nextLevel = currentLevel ? getNextLevel(Object.keys(LEVEL_SYSTEM).find(key => LEVEL_SYSTEM[key].name === currentLevel.name)) : null;
  const userReservations = user?.totalReservations || 0;
  const progressPercentage = currentLevel ? calculateProgress(currentLevel, userReservations) : 0;

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
              ⭐ Mi Nivel MVP
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
        
        {/* Tarjeta de Nivel Actual */}
        {currentLevel && (
          <View style={styles.currentLevelCard}>
            <View style={styles.levelHeader}>
              <View style={[styles.levelIconContainer, { backgroundColor: currentLevel.color }]}>
                <Text style={styles.levelIcon}>{currentLevel.icon}</Text>
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelName}>{currentLevel.name}</Text>
                <Text style={styles.levelDescription}>{currentLevel.description}</Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userReservations}</Text>
                <Text style={styles.statLabel}>Reservas Totales</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user?.streak || 0}</Text>
                <Text style={styles.statLabel}>Semanas Activo</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentLevel.tokens}</Text>
                <Text style={styles.statLabel}>Tokens Mensuales</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentLevel.discount}%</Text>
                <Text style={styles.statLabel}>Descuento</Text>
              </View>
            </View>
          </View>
        )}

        {/* Progreso al Siguiente Nivel */}
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>🎯 Progreso al Siguiente Nivel</Text>
          
          {nextLevel ? (
            <>
              <View style={styles.progressHeader}>
                <Text style={styles.currentLevelText}>Nivel {currentLevel?.name}</Text>
                <Text style={styles.nextLevelText}>Nivel {nextLevel.name}</Text>
              </View>
              
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      }),
                      backgroundColor: currentLevel?.color || '#4CAF50'
                    }
                  ]} 
                />
              </View>
              
              <View style={styles.progressStats}>
                <Text style={styles.progressStat}>
                  {userReservations - (currentLevel?.min || 0)} / {nextLevel.min - (currentLevel?.min || 0)}
                </Text>
                <Text style={styles.progressStat}>
                  {nextLevel.min - userReservations} reservas faltantes
                </Text>
              </View>

              {/* Próximo Nivel Preview */}
              <View style={styles.nextLevelPreview}>
                <Text style={styles.nextLevelTitle}>Próximo Nivel: {nextLevel.name}</Text>
                <View style={styles.nextLevelBenefits}>
                  <Text style={styles.benefitItem}>• {nextLevel.tokens} tokens mensuales</Text>
                  <Text style={styles.benefitItem}>• {nextLevel.discount}% de descuento</Text>
                  <Text style={styles.benefitItem}>• {nextLevel.description}</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.maxLevel}>
              <Text style={styles.maxLevelIcon}>🏆</Text>
              <Text style={styles.maxLevelTitle}>¡Has alcanzado el nivel máximo!</Text>
              <Text style={styles.maxLevelText}>
                Eres una leyenda MVP. Disfruta de todos los beneficios exclusivos.
              </Text>
            </View>
          )}
        </View>

        {/* Beneficios del Nivel Actual */}
        {currentLevel && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎁 Beneficios de {currentLevel.name}</Text>
            
            <View style={styles.benefitsList}>
              {currentLevel.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Text style={styles.benefitIcon}>✓</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Todos los Niveles */}
        <View style={styles.allLevelsCard}>
          <Text style={styles.sectionTitle}>📊 Todos los Niveles MVP</Text>
          
          {Object.entries(LEVEL_SYSTEM).map(([key, level]) => (
            <View 
              key={key} 
              style={[
                styles.levelRow,
                currentLevel?.name === level.name && styles.currentLevelRow
              ]}
            >
              <View style={styles.levelIndicator}>
                <Text style={styles.levelRowIcon}>{level.icon}</Text>
                {currentLevel?.name === level.name && (
                  <View style={styles.currentLevelBadge}>
                    <Text style={styles.currentLevelBadgeText}>Actual</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.levelDetails}>
                <Text style={styles.levelRowName}>{level.name}</Text>
                <Text style={styles.levelRowRequirements}>
                  {level.min}+ reservas • {level.tokens} tokens • {level.discount}% descuento
                </Text>
              </View>
              
              <View style={styles.levelStatus}>
                {userReservations >= level.min ? (
                  <Text style={styles.completedText}>✅ Completado</Text>
                ) : (
                  <Text style={styles.pendingText}>
                    {level.min - userReservations} faltan
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Consejos para Subir de Nivel */}
        <View style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>🚀 Consejos para Subir de Nivel</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Realiza reservas consistentemente cada semana</Text>
            <Text style={styles.tipItem}>• Invita amigos y juega en grupo</Text>
            <Text style={styles.tipItem}>• Prueba diferentes deportes y establecimientos</Text>
            <Text style={styles.tipItem}>• Usa tus tokens estratégicamente</Text>
            <Text style={styles.tipItem}>• Mantén tu racha de semanas activas</Text>
          </View>
        </View>

        {/* CTA para Reservar */}
        <TouchableOpacity 
          style={styles.reserveButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.reserveButtonText}>🎯 Hacer una Reserva</Text>
          <Text style={styles.reserveButtonSubtext}>
            Avanza hacia el siguiente nivel
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
  currentLevelCard: {
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
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    padding: 8,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  progressCard: {
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
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  currentLevelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  nextLevelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressStat: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  nextLevelPreview: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  nextLevelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  nextLevelBenefits: {
    marginLeft: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    lineHeight: 20,
  },
  maxLevel: {
    alignItems: 'center',
    padding: 20,
  },
  maxLevelIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  maxLevelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  maxLevelText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
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
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  benefitIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 12,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    lineHeight: 20,
  },
  allLevelsCard: {
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
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  currentLevelRow: {
    backgroundColor: '#F0F9FF',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  levelIndicator: {
    width: 50,
    alignItems: 'center',
    position: 'relative',
  },
  levelRowIcon: {
    fontSize: 20,
  },
  currentLevelBadge: {
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentLevelBadgeText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  levelDetails: {
    flex: 1,
    marginLeft: 12,
  },
  levelRowName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  levelRowRequirements: {
    fontSize: 12,
    color: '#666666',
  },
  levelStatus: {
    alignItems: 'flex-end',
  },
  completedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  pendingText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  tipsCard: {
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
  tipsList: {
    marginLeft: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  reserveButton: {
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
  reserveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reserveButtonSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  bottomSpacer: {
    height: 20,
  },
});