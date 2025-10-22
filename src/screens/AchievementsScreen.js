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
 * Pantalla de logros y recompensas del usuario
 */
export default function AchievementsScreen({ navigation }) {
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Primera Reserva',
      description: 'Completa tu primera reserva en la plataforma y comienza tu journey deportivo',
      icon: '🎯',
      reward: '500 puntos + 1 token de bienvenida',
      completed: true,
      progress: 100,
      category: 'inicio'
    },
    {
      id: 2,
      title: 'Deportista Activo',
      description: 'Realiza 10 reservas en un mes calendario consecutivo',
      icon: '⚽',
      reward: '1 token adicional permanente',
      completed: false,
      progress: 70,
      category: 'frecuencia'
    },
    {
      id: 3,
      title: 'Explorador Deportivo',
      description: 'Reserva en 3 deportes diferentes y expande tus horizontes',
      icon: '🌍',
      reward: '2 tokens + acceso a canchas premium',
      completed: false,
      progress: 66,
      category: 'variedad'
    },
    {
      id: 4,
      title: 'Líder de Equipo',
      description: 'Invita a 5 amigos diferentes a jugar contigo',
      icon: '👥',
      reward: '3 tokens + badge de líder en perfil',
      completed: false,
      progress: 40,
      category: 'social'
    },
    {
      id: 5,
      title: 'Maestro de Tokens',
      description: 'Usa 10 tokens en reservas y maximiza tus ahorros',
      icon: '🎫',
      reward: 'Token dorado permanente + 15% descuento extra',
      completed: false,
      progress: 30,
      category: 'tokens'
    },
    {
      id: 6,
      title: 'Campeón MVP',
      description: 'Alcanza el nivel MVP con más de 60 reservas completadas',
      icon: '🏆',
      reward: 'Descuento permanente 25% + prioridad en reservas',
      completed: false,
      progress: 45,
      category: 'nivel'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: '📊' },
    { id: 'inicio', name: 'Inicio', icon: '🎯' },
    { id: 'frecuencia', name: 'Frecuencia', icon: '⚽' },
    { id: 'variedad', name: 'Variedad', icon: '🌍' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'tokens', name: 'Tokens', icon: '🎫' },
    { id: 'nivel', name: 'Nivel', icon: '🏆' }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(ach => ach.category === selectedCategory);

  const completedCount = achievements.filter(ach => ach.completed).length;
  const totalCount = achievements.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header CORREGIDO - título en una línea */}
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
              🏆 Logros MVP
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
        
        {/* Progreso general */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Tu Progreso General</Text>
            <Text style={styles.progressCount}>
              {completedCount}/{totalCount} completados
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(completedCount / totalCount) * 100}%` }
              ]} 
            />
          </View>
          
          <View style={styles.rewardsSummary}>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardNumber}>{completedCount}</Text>
              <Text style={styles.rewardLabel}>Logros</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardNumber}>3</Text>
              <Text style={styles.rewardLabel}>Tokens Ganados</Text>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardNumber}>1500</Text>
              <Text style={styles.rewardLabel}>Puntos</Text>
            </View>
          </View>
        </View>

        {/* Filtros por categoría */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonSelected
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryName,
                selectedCategory === category.id && styles.categoryNameSelected
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de logros */}
        <View style={styles.achievementsList}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Todos los Logros' : 
             categories.find(cat => cat.id === selectedCategory)?.name + ' - Logros'}
          </Text>
          
          {filteredAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              
              {/* Icono y estado */}
              <View style={styles.achievementIconContainer}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                {achievement.completed && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>✓</Text>
                  </View>
                )}
              </View>

              {/* Información del logro - MÁS ESPACIO */}
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription} numberOfLines={3}>
                  {achievement.description}
                </Text>
                
                {/* Barra de progreso */}
                <View style={styles.achievementProgress}>
                  <View style={styles.progressContainer}>
                    <View 
                      style={[
                        styles.progressAchievement, 
                        { width: `${achievement.progress}%` },
                        achievement.completed && styles.progressCompleted
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{achievement.progress}%</Text>
                </View>

                {/* Recompensa - MÁS ESPACIO */}
                <View style={styles.rewardContainer}>
                  <Text style={styles.rewardLabel}>Recompensa:</Text>
                  <Text style={styles.rewardValue} numberOfLines={2}>
                    {achievement.reward}
                  </Text>
                </View>
              </View>

              {/* Estado */}
              <View style={styles.achievementStatus}>
                {achievement.completed ? (
                  <View style={styles.completedStatus}>
                    <Text style={styles.completedStatusText}>Completado</Text>
                  </View>
                ) : (
                  <View style={styles.pendingStatus}>
                    <Text style={styles.pendingStatusText}>En Progreso</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Información de recompensas - MEJORADO */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💎 Sistema de Recompensas MVP</Text>
          <Text style={styles.infoText} numberOfLines={6}>
            • Los logros te otorgan tokens mensuales adicionales{"\n"}
            • Los puntos acumulados se canjean por beneficios exclusivos{"\n"}
            • Los tokens proporcionan descuentos inmediatos en reservas{"\n"}
            • Los badges de nivel desbloquean prioridades especiales{"\n"}
            • ¡Completa todos los logros para convertirte en Leyenda MVP!
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
  // HEADER CORREGIDO - título en una línea
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
    minHeight: 44, // Altura mínima consistente
  },
  backButton: {
    padding: 8,
    width: 40, // Ancho fijo
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
    marginHorizontal: 10, // Espacio a los lados
  },
  headerTitle: {
    fontSize: 18, // Tamaño optimizado
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    includeFontPadding: false, // Elimina padding interno de la fuente
  },
  headerPlaceholder: {
    width: 40, // Mismo ancho que el botón de back para balance
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30, // Más espacio al final
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  progressCount: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  rewardsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardItem: {
    alignItems: 'center',
    flex: 1,
  },
  rewardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 4,
  },
  rewardLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 4, // Padding para que no se pegue a los bordes
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12, // Más alto
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minHeight: 44, // Altura mínima consistente
  },
  categoryButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  categoryNameSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  achievementsList: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start', // Alineación mejorada
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 120, // Altura mínima para consistencia
  },
  achievementIconContainer: {
    position: 'relative',
    marginRight: 16,
    marginTop: 4, // Mejor alineación vertical
  },
  achievementIcon: {
    fontSize: 32,
  },
  completedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4CAF50',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  achievementInfo: {
    flex: 1,
    marginRight: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  achievementDescription: {
    fontSize: 13, // Un poco más grande
    color: '#666666',
    marginBottom: 10,
    lineHeight: 18, // Mejor interlineado
    flexShrink: 1, // Permite que se ajuste
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressAchievement: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 3,
  },
  progressCompleted: {
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '500',
    minWidth: 30,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Mejor alineación
    flexWrap: 'wrap',
  },
  rewardLabel: {
    fontSize: 12, // Un poco más grande
    color: '#666666',
    marginRight: 6,
    fontWeight: '500',
  },
  rewardValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9800',
    flex: 1,
    flexWrap: 'wrap',
  },
  achievementStatus: {
    marginLeft: 12,
    marginTop: 4, // Mejor alineación
  },
  completedStatus: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 6, // Un poco más de padding
    borderRadius: 8,
  },
  completedStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pendingStatus: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 6, // Un poco más de padding
    borderRadius: 8,
  },
  pendingStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  infoSection: {
    backgroundColor: '#E3F2FD',
    padding: 20, // Más padding
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
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