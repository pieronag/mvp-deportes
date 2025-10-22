import React, { useState } from 'react';
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

export default function PaymentSettingsScreen({ navigation }) {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'credit_card',
      name: 'Tarjeta de Crédito',
      lastFour: '1234',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2', 
      type: 'google_pay',
      name: 'Google Pay',
      email: 'juan@mvpdeportes.com',
      isDefault: false
    }
  ]);

  const setDefaultPayment = (id) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    Alert.alert('Éxito', 'Método de pago predeterminado actualizado');
  };

  const deletePaymentMethod = (id) => {
    Alert.alert(
      'Eliminar Método de Pago',
      '¿Estás seguro de que quieres eliminar este método de pago?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods => methods.filter(method => method.id !== id));
            Alert.alert('Éxito', 'Método de pago eliminado');
          }
        }
      ]
    );
  };

  const addPaymentMethod = () => {
    Alert.alert(
      'Agregar Método de Pago',
      'Funcionalidad en desarrollo',
      [{ text: 'Entendido', style: 'default' }]
    );
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
              💳 Métodos de Pago
            </Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Métodos de Pago Existentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Tus Métodos de Pago</Text>
          
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentMethod}>
              <View style={styles.paymentIcon}>
                <Text style={styles.paymentIconText}>
                  {method.type === 'credit_card' ? '💳' : '📱'}
                </Text>
              </View>
              
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>{method.name}</Text>
                <Text style={styles.paymentDescription}>
                  {method.type === 'credit_card' 
                    ? `**** **** **** ${method.lastFour} - Expira ${method.expiry}`
                    : method.email
                  }
                </Text>
                {method.isDefault && (
                  <Text style={styles.defaultBadge}>Predeterminado</Text>
                )}
              </View>
              
              <View style={styles.paymentActions}>
                {!method.isDefault && (
                  <TouchableOpacity 
                    style={styles.defaultButton}
                    onPress={() => setDefaultPayment(method.id)}
                  >
                    <Text style={styles.defaultButtonText}>Predeterminar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deletePaymentMethod(method.id)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Agregar Nuevo Método */}
        <TouchableOpacity 
          style={styles.addPaymentButton}
          onPress={addPaymentMethod}
        >
          <Text style={styles.addPaymentIcon}>+</Text>
          <View style={styles.addPaymentText}>
            <Text style={styles.addPaymentTitle}>Agregar Método de Pago</Text>
            <Text style={styles.addPaymentDescription}>Tarjeta, PayPal, Google Pay, etc.</Text>
          </View>
        </TouchableOpacity>

        {/* Información de Seguridad */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>🔒 Pago Seguro</Text>
          <Text style={styles.infoBoxText}>
            Todos los pagos están protegidos con encriptación de última generación. Nunca almacenamos los datos completos de tu tarjeta en nuestros servidores.
          </Text>
        </View>

        {/* Historial de Pagos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Historial Reciente</Text>
          
          <View style={styles.paymentHistory}>
            <View style={styles.paymentItem}>
              <View style={styles.paymentItemIcon}>
                <Text style={styles.paymentItemIconText}>⚽</Text>
              </View>
              <View style={styles.paymentItemInfo}>
                <Text style={styles.paymentItemTitle}>Reserva - Fútbol</Text>
                <Text style={styles.paymentItemDate}>Hace 2 días</Text>
              </View>
              <Text style={styles.paymentItemAmount}>$15.000</Text>
            </View>
            
            <View style={styles.paymentItem}>
              <View style={styles.paymentItemIcon}>
                <Text style={styles.paymentItemIconText}>🎾</Text>
              </View>
              <View style={styles.paymentItemInfo}>
                <Text style={styles.paymentItemTitle}>Reserva - Tenis</Text>
                <Text style={styles.paymentItemDate}>Hace 1 semana</Text>
              </View>
              <Text style={styles.paymentItemAmount}>$12.000</Text>
            </View>
          </View>
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
  headerPlaceholder: {
    width: 40,
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
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentIconText: {
    fontSize: 18,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  defaultBadge: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  paymentActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  defaultButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  defaultButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF5F5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#E53E3E',
    fontWeight: '600',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  addPaymentIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
    marginRight: 12,
    width: 40,
    textAlign: 'center',
  },
  addPaymentText: {
    flex: 1,
  },
  addPaymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  addPaymentDescription: {
    fontSize: 14,
    color: '#666666',
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
  paymentHistory: {
    gap: 12,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  paymentItemIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#E9ECEF',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentItemIconText: {
    fontSize: 16,
  },
  paymentItemInfo: {
    flex: 1,
  },
  paymentItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  paymentItemDate: {
    fontSize: 12,
    color: '#666666',
  },
  paymentItemAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bottomSpacer: {
    height: 20,
  },
});