import React, { useState, useContext } from 'react';
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

export default function UserProfileScreen({ navigation, route }) {
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    id: user?.id || 'user-123',
    name: user?.name || 'Usuario MVP',
    email: user?.email || 'usuario@mvpdeportes.com',
    joinDate: '2024-01-15',
    phone: '+56 9 1234 5678',
    favoriteSport: user?.favoriteSport || 'Fútbol',
    membership: user?.currentLevel || 'MVP Premium',
    totalReservations: user?.totalReservations || 15,
    availableTokens: user?.availableTokens || 3,
    streak: user?.streak || 8
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  const handleEditProfile = () => {
    Alert.alert(
      'Editar Perfil',
      'Funcionalidad de edición en desarrollo',
      [{ text: 'Entendido', style: 'default' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.navigate('Login');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          }
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
              👤 Mi Perfil
            </Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Información Principal del Usuario */}
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userMainInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userMembership}>{userData.membership}</Text>
              <Text style={styles.joinDate}>
                Miembro desde {formatDate(userData.joinDate)}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Estadísticas Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Mis Estadísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.totalReservations}</Text>
              <Text style={styles.statLabel}>Reservas Totales</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.availableTokens}</Text>
              <Text style={styles.statLabel}>Tokens Disponibles</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData.streak}</Text>
              <Text style={styles.statLabel}>Días de Racha</Text>
            </View>
          </View>
        </View>

        {/* Información de Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Información de Contacto</Text>
          
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{userData.phone}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Deporte Favorito</Text>
              <Text style={styles.infoValue}>{userData.favoriteSport}</Text>
            </View>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Acciones Rápidas</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Level')}
            >
              <View style={styles.actionContent}>
                <Text style={styles.actionIcon}>⭐</Text>
                <Text style={styles.actionText}>Mi Nivel</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Tokens')}
            >
              <View style={styles.actionContent}>
                <Text style={styles.actionIcon}>🎫</Text>
                <Text style={styles.actionText}>Mis Tokens</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('ActiveReservations')}
            >
              <View style={styles.actionContent}>
                <Text style={styles.actionIcon}>🎯</Text>
                <Text style={styles.actionText}>Reservas Activas</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Achievements')}
            >
              <View style={styles.actionContent}>
                <Text style={styles.actionIcon}>🏆</Text>
                <Text style={styles.actionText}>Mis Logros</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Configuración y Preferencias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Configuración</Text>
          
          <View style={styles.settingsList}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('NotificationsSettings')}
            >
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingText}>Notificaciones</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('PrivacySettings')}
            >
              <Text style={styles.settingIcon}>👁️</Text>
              <Text style={styles.settingText}>Privacidad</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('PaymentSettings')}
            >
              <Text style={styles.settingIcon}>💳</Text>
              <Text style={styles.settingText}>Métodos de Pago</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => navigation.navigate('HelpSupport')}
            >
              <Text style={styles.settingIcon}>❓</Text>
              <Text style={styles.settingText}>Ayuda y Soporte</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Información de la Cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Información de la Cuenta</Text>
          
          <View style={styles.accountInfo}>
            <View style={styles.accountItem}>
              <Text style={styles.accountLabel}>ID de Usuario</Text>
              <Text style={styles.accountValue}>{userData.id}</Text>
            </View>
            
            <View style={styles.accountItem}>
              <Text style={styles.accountLabel}>Estado de Cuenta</Text>
              <Text style={styles.accountValue}>Activa</Text>
            </View>
            
            <View style={styles.accountItem}>
              <Text style={styles.accountLabel}>Versión de la App</Text>
              <Text style={styles.accountValue}>MVP 2.0</Text>
            </View>
          </View>
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
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
    padding: 16,
  },
  profileCard: {
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
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userMainInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userMembership: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#666666',
  },
  editButton: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  actionContent: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  settingsList: {
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  settingText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
    flex: 1,
  },
  settingArrow: {
    fontSize: 18,
    color: '#666666',
    fontWeight: 'bold',
  },
  accountInfo: {
    gap: 12,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  accountLabel: {
    fontSize: 14,
    color: '#666666',
  },
  accountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  logoutButton: {
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53E3E',
  },
  bottomSpacer: {
    height: 20,
  },
});