// En src/components/NotificationSettings.js - CORREGIDO
import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

const NotificationSettings = ({ userId }) => {
  const {
    preferences,
    loading,
    togglePushNotifications,
    toggleEmailNotifications,
    updateFrequency,
    toggleCategory
  } = useNotifications(userId);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando preferencias...</Text>
      </View>
    );
  }

  const frequencyOptions = [
    { label: 'Instantáneas', value: 'instant' },
    { label: 'Resumen diario', value: 'daily' },
    { label: 'Resumen semanal', value: 'weekly' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Notificaciones Push */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones Push</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Activar notificaciones push</Text>
          <Switch
            value={preferences.pushEnabled}
            onValueChange={togglePushNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={preferences.pushEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Notificaciones por Email */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones por Email</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Activar notificaciones por email</Text>
          <Switch
            value={preferences.emailEnabled}
            onValueChange={toggleEmailNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={preferences.emailEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Frecuencia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frecuencia de Notificaciones</Text>
        {frequencyOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.frequencyOption,
              preferences.frequency === option.value && styles.frequencySelected
            ]}
            onPress={() => updateFrequency(option.value)}
          >
            <Text style={[
              styles.frequencyText,
              preferences.frequency === option.value && styles.frequencyTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categorías */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos de Notificaciones</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Nuevos deportes disponibles</Text>
          <Switch
            value={preferences.categories.newSports}
            onValueChange={(value) => toggleCategory('newSports', value)}
            disabled={!preferences.pushEnabled && !preferences.emailEnabled}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Recordatorios de eventos</Text>
          <Switch
            value={preferences.categories.eventReminders}
            onValueChange={(value) => toggleCategory('eventReminders', value)}
            disabled={!preferences.pushEnabled && !preferences.emailEnabled}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Promociones y ofertas</Text>
          <Switch
            value={preferences.categories.promotions}
            onValueChange={(value) => toggleCategory('promotions', value)}
            disabled={!preferences.pushEnabled && !preferences.emailEnabled}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Actividades de amigos</Text>
          <Switch
            value={preferences.categories.friendActivities}
            onValueChange={(value) => toggleCategory('friendActivities', value)}
            disabled={!preferences.pushEnabled && !preferences.emailEnabled}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1C1C1E',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
    marginRight: 16,
  },
  frequencyOption: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  frequencySelected: {
    backgroundColor: '#007AFF',
  },
  frequencyText: {
    fontSize: 16,
  },
  frequencyTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default NotificationSettings;