import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert
} from 'react-native';

export default function NotificationsSettingsScreen({ navigation }) {
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: false,
    sms: false,
    promotions: true,
    eventReminders: true,
    friendActivities: false,
    newSports: true
  });

  const handleSettingChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = () => {
    Alert.alert('Éxito', 'Configuración de notificaciones guardada');
    navigation.goBack();
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
              🔔 Notificaciones
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveSettings}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Configuración General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Configuración General</Text>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notificaciones Push</Text>
                <Text style={styles.settingDescription}>Recibir notificaciones en tu dispositivo</Text>
              </View>
              <Switch
                value={notificationSettings.push}
                onValueChange={(value) => handleSettingChange('push', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={notificationSettings.push ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notificaciones por Email</Text>
                <Text style={styles.settingDescription}>Recibir notificaciones por correo electrónico</Text>
              </View>
              <Switch
                value={notificationSettings.email}
                onValueChange={(value) => handleSettingChange('email', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={notificationSettings.email ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notificaciones por SMS</Text>
                <Text style={styles.settingDescription}>Recibir notificaciones por mensaje de texto</Text>
              </View>
              <Switch
                value={notificationSettings.sms}
                onValueChange={(value) => handleSettingChange('sms', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={notificationSettings.sms ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Tipos de Notificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Tipos de Notificaciones</Text>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Promociones y Ofertas</Text>
                <Text style={styles.settingDescription}>Recibir ofertas especiales y promociones</Text>
              </View>
              <Switch
                value={notificationSettings.promotions}
                onValueChange={(value) => handleSettingChange('promotions', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={notificationSettings.promotions ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Recordatorios de Eventos</Text>
                <Text style={styles.settingDescription}>Notificaciones sobre tus eventos programados</Text>
              </View>
              <Switch
                value={notificationSettings.eventReminders}
                onValueChange={(value) => handleSettingChange('eventReminders', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={notificationSettings.eventReminders ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Actividades de Amigos</Text>
                <Text style={styles.settingDescription}>Notificaciones sobre actividades de tus amigos</Text>
              </View>
              <Switch
                value={notificationSettings.friendActivities}
                onValueChange={(value) => handleSettingChange('friendActivities', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={notificationSettings.friendActivities ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Nuevos Deportes</Text>
                <Text style={styles.settingDescription}>Notificaciones sobre nuevos deportes disponibles</Text>
              </View>
              <Switch
                value={notificationSettings.newSports}
                onValueChange={(value) => handleSettingChange('newSports', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={notificationSettings.newSports ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Información */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>💡 Información Importante</Text>
          <Text style={styles.infoBoxText}>
            Puedes personalizar qué notificaciones recibir según tus preferencias. Las notificaciones push requieren que tengas activadas las notificaciones del sistema.
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
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 16,
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
  settingsList: {
    gap: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});