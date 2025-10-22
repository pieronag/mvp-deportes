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

export default function PrivacySettingsScreen({ navigation }) {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    activityVisible: true,
    showOnlineStatus: true,
    showLocation: false,
    allowFriendRequests: true,
    showJoinDate: true
  });

  const handleSettingChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = () => {
    Alert.alert('Éxito', 'Configuración de privacidad guardada');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
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
              👁️ Privacidad
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
        
        {/* Visibilidad del Perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Visibilidad del Perfil</Text>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Perfil Público</Text>
                <Text style={styles.settingDescription}>Permitir que otros usuarios vean tu perfil</Text>
              </View>
              <Switch
                value={privacySettings.profileVisible}
                onValueChange={(value) => handleSettingChange('profileVisible', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={privacySettings.profileVisible ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Actividad Visible</Text>
                <Text style={styles.settingDescription}>Mostrar tu actividad reciente a otros usuarios</Text>
              </View>
              <Switch
                value={privacySettings.activityVisible}
                onValueChange={(value) => handleSettingChange('activityVisible', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={privacySettings.activityVisible ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Estado en Línea</Text>
                <Text style={styles.settingDescription}>Mostrar cuando estás en línea</Text>
              </View>
              <Switch
                value={privacySettings.showOnlineStatus}
                onValueChange={(value) => handleSettingChange('showOnlineStatus', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={privacySettings.showOnlineStatus ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Configuraciones Adicionales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Configuraciones Adicionales</Text>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Mostrar Ubicación</Text>
                <Text style={styles.settingDescription}>Compartir tu ubicación aproximada</Text>
              </View>
              <Switch
                value={privacySettings.showLocation}
                onValueChange={(value) => handleSettingChange('showLocation', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={privacySettings.showLocation ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Solicitudes de Amistad</Text>
                <Text style={styles.settingDescription}>Permitir que otros usuarios te envíen solicitudes</Text>
              </View>
              <Switch
                value={privacySettings.allowFriendRequests}
                onValueChange={(value) => handleSettingChange('allowFriendRequests', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={privacySettings.allowFriendRequests ? '#007AFF' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Mostrar Fecha de Ingreso</Text>
                <Text style={styles.settingDescription}>Mostrar cuándo te uniste a MVP Deportes</Text>
              </View>
              <Switch
                value={privacySettings.showJoinDate}
                onValueChange={(value) => handleSettingChange('showJoinDate', value)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={privacySettings.showJoinDate ? '#007AFF' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Información */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>🔒 Tu Privacidad es Importante</Text>
          <Text style={styles.infoBoxText}>
            Controla qué información compartes con la comunidad MVP Deportes. Puedes ajustar estas configuraciones en cualquier momento según tu comodidad.
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