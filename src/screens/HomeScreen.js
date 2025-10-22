import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  ImageBackground
} from 'react-native';

/**
 * Configuración de categorías deportivas
 */
const categories = [
  { 
    id: 1, 
    name: 'Fútbol', 
    icon: '⚽', 
    color: '#4CAF50',
    establishments: 24,
    avgPrice: '$15.000',
    tokenDiscount: '15%',
    image: 'https://cdn.pixabay.com/photo/2014/10/14/20/24/ball-488718_1280.jpg'
  },
  { 
    id: 2, 
    name: 'Pádel', 
    icon: '🎯', 
    color: '#F44336',
    establishments: 12,
    avgPrice: '$18.000',
    tokenDiscount: '15%',
    image: 'https://cdn.pixabay.com/photo/2021/06/04/06/54/racket-6308994_1280.jpg'
  },
  { 
    id: 3, 
    name: 'Tenis', 
    icon: '🎾', 
    color: '#03A9F4',
    establishments: 8,
    avgPrice: '$22.000',
    tokenDiscount: '20%',
    image: 'https://cdn.pixabay.com/photo/2020/10/02/16/23/tennis-5621605_1280.jpg'
  },
  { 
    id: 4, 
    name: 'Básquetbol', 
    icon: '🏀', 
    color: '#FF9800',
    establishments: 6,
    avgPrice: '$12.000',
    tokenDiscount: '10%',
    image: 'https://cdn.pixabay.com/photo/2020/08/19/13/26/basketball-5500888_1280.jpg'
  },
];

/**
 * Sistema de niveles MVP 2.0 para jugadores
 */
const LEVEL_SYSTEM = {
  CANTERANO: { 
    name: 'Canterano', 
    min: 0, 
    max: 5, 
    tokens: 0, 
    discount: 0, 
    color: '#9E9E9E',
    icon: '🌱'
  },
  TITULAR: { 
    name: 'Titular', 
    min: 6, 
    max: 20, 
    tokens: 1, 
    discount: 10, 
    color: '#4CAF50',
    icon: '⭐'
  },
  CAPITAN: { 
    name: 'Capitán', 
    min: 21, 
    max: 40, 
    tokens: 2, 
    discount: 15, 
    color: '#2196F3',
    icon: '👑'
  },
  ESTRELLA: { 
    name: 'Estrella', 
    min: 41, 
    max: 60, 
    tokens: 3, 
    discount: 20, 
    color: '#FF9800',
    icon: '🌟'
  }
};

/**
 * Datos de ejemplo del usuario
 */
const mockUserData = {
  name: 'Juan Pérez',
  email: 'juan@mvpdeportes.com',
  totalReservations: 15,
  currentLevel: 'TITULAR',
  monthlyTokens: 3,
  tokensUsed: 1,
  availableTokens: 2
};

/**
 * Pantalla principal de la aplicación
 */
export default function HomeScreen({ navigation, route }) {
  const user = route.params?.user || mockUserData;
  const userLevel = LEVEL_SYSTEM[user.currentLevel] || LEVEL_SYSTEM.CANTERANO;

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryDetail', { category });
  };

  const handleProfilePress = () => {
    navigation.navigate('UserProfile', { user });
  };

  const handleActiveReservationsPress = () => {
    navigation.navigate('ActiveReservations');
  };

  const handleAchievementsPress = () => {
    navigation.navigate('Achievements');
  };

  const calculateProgress = () => {
    const levels = Object.values(LEVEL_SYSTEM);
    const currentIndex = levels.findIndex(level => level.name === userLevel.name);
    
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1];
      const progress = ((user.totalReservations - userLevel.min) / 
                       (nextLevel.min - userLevel.min)) * 100;
      return Math.min(100, Math.max(0, progress));
    }
    return 100;
  };

  const progress = calculateProgress();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header con información de usuario */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <TouchableOpacity onPress={handleProfilePress} style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: userLevel.color }]}>
              <Text style={styles.avatarText}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userText}>
              <Text style={styles.welcome}>Bienvenido</Text>
              <Text style={styles.userName}>{user.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Nivel actual del usuario en el lado derecho - MÁS ANCHO */}
        <TouchableOpacity 
          style={styles.levelBadgeHeader}
          onPress={() => navigation.navigate('Level')}
        >
          <View style={[styles.levelIconHeader, { backgroundColor: userLevel.color }]}>
            <Text style={styles.levelIconText}>{userLevel.icon}</Text>
          </View>
          <View style={styles.levelInfoHeader}>
            <Text style={styles.levelNameHeader}>Nivel: {userLevel.name}</Text>
            <Text style={styles.levelDiscountHeader}>{userLevel.discount}% descuento</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Contenido principal desplazable */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* Sección de Progreso de Nivel */}
        <View style={styles.levelProgressCard}>
          <View style={styles.levelProgressHeader}>
            <Text style={styles.levelProgressTitle}>Tu Progreso MVP</Text>
            <Text style={styles.levelProgressSubtitle}>
              {user.totalReservations} reservas acumuladas
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLevel}>{userLevel.name}</Text>
              <Text style={styles.progressNext}>
                {progress < 100 ? 'Siguiente nivel' : 'Nivel máximo'}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progress}%`,
                    backgroundColor: userLevel.color
                  }
                ]} 
              />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressStat}>
                🎫 {user.availableTokens || 2} tokens disponibles
              </Text>
              <Text style={styles.progressStat}>
                💰 {userLevel.discount}% descuento con tokens
              </Text>
            </View>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleActiveReservationsPress}
            >
              <Text style={styles.actionIcon}>🎯</Text>
              <Text style={styles.actionText}>Reservas Activas</Text>
              <View style={styles.actionBadge}>
                <Text style={styles.actionBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Level')}
            >
              <Text style={styles.actionIcon}>⭐</Text>
              <Text style={styles.actionText}>Mi Nivel</Text>
              <Text style={styles.actionSubtext}>{userLevel.name}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Tokens')}
            >
              <Text style={styles.actionIcon}>🎫</Text>
              <Text style={styles.actionText}>Tokens</Text>
              <Text style={styles.actionSubtext}>{user.availableTokens} disp.</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleAchievementsPress}
            >
              <Text style={styles.actionIcon}>🏆</Text>
              <Text style={styles.actionText}>Logros</Text>
              <Text style={styles.actionSubtext}>4/12</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categorías Destacadas */}
        <Text style={styles.sectionTitle}>Categorías Destacadas</Text>
        
        {/* Grid de categorías deportivas */}
        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={{ uri: category.image }}
                style={styles.categoryBackground}
                imageStyle={styles.categoryImage}
              >
                <View style={[styles.overlay, { backgroundColor: `${category.color}CC` }]} />
                
                <View style={styles.categoryContent}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{category.establishments}</Text>
                      <Text style={styles.statLabel}>establecimientos</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{category.avgPrice}</Text>
                      <Text style={styles.statLabel}>precio avg</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>🎫 {category.tokenDiscount}</Text>
                      <Text style={styles.statLabel}>con token</Text>
                    </View>
                  </View>
                  
                  <View style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Ver canchas</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sección de tokens */}
        <TouchableOpacity 
          style={styles.tokensCard} 
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Tokens')}
        >
          <ImageBackground
            source={{ uri: 'https://cdn.pixabay.com/photo/2016/09/01/21/54/coins-1637722_1280.jpg' }}
            style={styles.tokensBackground}
            imageStyle={styles.tokensImage}
          >
            <View style={styles.tokensOverlay} />
            
            <View style={styles.tokensContent}>
              <View style={styles.tokensHeader}>
                <Text style={styles.tokensTitle}>🎫 Tus Tokens MVP</Text>
                <Text style={styles.tokensSubtitle}>Sistema de recompensas exclusivo</Text>
              </View>
              
              <View style={styles.tokensInfo}>
                <View style={styles.tokenCount}>
                  <Text style={styles.tokensNumber}>{user.availableTokens || 2}</Text>
                  <Text style={styles.tokensLabel}>disponibles</Text>
                </View>
                <View style={styles.tokenCount}>
                  <Text style={styles.tokensNumber}>{user.monthlyTokens || 3}</Text>
                  <Text style={styles.tokensLabel}>mensuales</Text>
                </View>
                <View style={styles.tokenCount}>
                  <Text style={styles.tokensNumber}>6</Text>
                  <Text style={styles.tokensLabel}>máximo</Text>
                </View>
              </View>
              
              <Text style={styles.tokensNote}>
                Toca para gestionar tus tokens y beneficios
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Espacio al final */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // HEADER ACTUALIZADO con nivel al lado derecho - MÁS ANCHO
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userSection: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userText: {
    flexDirection: 'column',
  },
  welcome: {
    fontSize: 14,
    color: '#666666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  // NUEVO: Badge de nivel en header derecho - MÁS ANCHO
  levelBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minWidth: 140,
  },
  levelIconHeader: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  levelIconText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  levelInfoHeader: {
    alignItems: 'flex-start',
    flex: 1,
  },
  levelNameHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  levelDiscountHeader: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  levelProgressCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  levelProgressHeader: {
    marginBottom: 15,
  },
  levelProgressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  levelProgressSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  progressContainer: {
    marginBottom: 5,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLevel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  progressNext: {
    fontSize: 12,
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
  },
  progressStat: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  quickActions: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'left',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtext: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  actionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  grid: {
    marginBottom: 30,
  },
  categoryCard: {
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryImage: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  categoryContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    minWidth: 140,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tokensCard: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tokensBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  tokensImage: {
    borderRadius: 16,
  },
  tokensOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(76, 175, 80, 0.85)',
    borderRadius: 16,
  },
  tokensContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  tokensHeader: {
    marginBottom: 15,
  },
  tokensTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tokensSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tokensInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tokenCount: {
    alignItems: 'center',
  },
  tokensNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tokensLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tokensNote: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomSpacer: {
    height: 40,
  },
});