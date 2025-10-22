// En src/hooks/useNotifications.js - Asegúrate de que esté así:
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { 
  getNotificationPreferences, 
  updateNotificationPreferences 
} from '../services/notificationService';

export const useNotifications = (userId) => {
  const [preferences, setPreferences] = useState({
    pushEnabled: true,
    emailEnabled: false,
    frequency: 'instant',
    categories: {
      newSports: true,
      eventReminders: true,
      promotions: false,
      friendActivities: true,
    }
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const loadPreferences = async () => {
    try {
      const prefs = await getNotificationPreferences(userId);
      if (prefs) {
        setPreferences(prefs);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading preferences:', error);
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);
      await updateNotificationPreferences(userId, updated);
      
      Alert.alert('Éxito', 'Preferencias actualizadas correctamente');
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Error', 'No se pudieron actualizar las preferencias');
      loadPreferences();
    }
  };

  const togglePushNotifications = async (enabled) => {
    await updatePreferences({ pushEnabled: enabled });
  };

  const toggleEmailNotifications = async (enabled) => {
    await updatePreferences({ emailEnabled: enabled });
  };

  const updateFrequency = async (frequency) => {
    await updatePreferences({ frequency });
  };

  const toggleCategory = async (category, enabled) => {
    await updatePreferences({
      categories: {
        ...preferences.categories,
        [category]: enabled
      }
    });
  };

  return {
    preferences,
    loading,
    togglePushNotifications,
    toggleEmailNotifications,
    updateFrequency,
    toggleCategory,
    updatePreferences
  };
};