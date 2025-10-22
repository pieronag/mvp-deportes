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

/**
 * Datos de ejemplo del usuario
 */
const mockUserData = {
  name: 'Juan Pérez',
  monthlyTokens: 3,
  tokensUsed: 1,
  availableTokens: 2,
  totalReservations: 15,
  currentLevel: 'TITULAR'
};

/**
 * Packs de tokens disponibles para compra
 */
const TOKEN_PACKS = [
  {
    id: '5',
    name: 'Pack Básico',
    tokens: 5,
    price: 7500,
    popular: false,
    savings: '0%',
    description: 'Perfecto para empezar'
  },
  {
    id: '10',
    name: 'Pack Pro',
    tokens: 10,
    price: 12000,
    popular: true,
    savings: '20%',
    description: 'Más popular - Mejor valor'
  },
  {
    id: '20',
    name: 'Pack Elite',
    tokens: 20,
    price: 20000,
    popular: false,
    savings: '33%',
    description: 'Máximo ahorro'
  }
];

/**
 * Pantalla dedicada a tokens y sistema de recompensas
 */
export default function TokensScreen({ navigation }) {
  const [userData, setUserData] = useState(mockUserData);

  /**
   * Maneja la compra de tokens
   */
  const handleBuyTokens = (tokenPack) => {
    Alert.alert(
      `Comprar ${tokenPack.name}`,
      `¿Confirmas la compra de ${tokenPack.tokens} tokens por $${tokenPack.price.toLocaleString()}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Comprar',
          style: 'default',
          onPress: () => {
            // Simular compra exitosa
            const newAvailableTokens = userData.availableTokens + tokenPack.tokens;
            setUserData(prev => ({
              ...prev,
              availableTokens: newAvailableTokens
            }));
            
            Alert.alert(
              '✅ Compra Exitosa',
              `Has adquirido ${tokenPack.tokens} tokens. Ahora tienes ${newAvailableTokens} tokens disponibles.`,
              [{ text: 'Entendido', style: 'default' }]
            );
          }
        }
      ]
    );
  };

  /**
   * Calcula el ahorro potencial con tokens
   */
  const calculatePotentialSavings = () => {
    const avgPrice = 15000; // Precio promedio por reserva
    const discount = 0.10; // 10% descuento para nivel Titular
    return userData.availableTokens * (avgPrice * discount);
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
            <Text style={styles.infoItem}>• Tokens comprados no expiran</Text>
            <Text style={styles.infoItem}>• Máximo 6 tokens acumulables</Text>
          </View>
        </View>

        {/* Comprar Tokens Adicionales */}
        <View style={styles.purchaseSection}>
          <Text style={styles.sectionTitle}>🚀 Comprar Tokens Adicionales</Text>
          <Text style={styles.sectionSubtitle}>
            Amplía tus beneficios con tokens extra
          </Text>
          
          <View style={styles.tokenPacks}>
            {TOKEN_PACKS.map((pack) => (
              <TouchableOpacity
                key={pack.id}
                style={[
                  styles.tokenPack,
                  pack.popular && styles.popularPack
                ]}
                onPress={() => handleBuyTokens(pack)}
              >
                {pack.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>MÁS POPULAR</Text>
                  </View>
                )}
                
                <Text style={styles.packName}>{pack.name}</Text>
                <Text style={styles.packTokens}>{pack.tokens} Tokens</Text>
                
                <View style={styles.packPrice}>
                  <Text style={styles.priceAmount}>${pack.price.toLocaleString()}</Text>
                  <Text style={styles.pricePerToken}>
                    ${(pack.price / pack.tokens).toLocaleString()} por token
                  </Text>
                </View>
                
                {pack.savings !== '0%' && (
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsBadgeText}>Ahorras {pack.savings}</Text>
                  </View>
                )}
                
                <Text style={styles.packDescription}>{pack.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Historial de Tokens */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>📊 Historial Reciente</Text>
          
          <View style={styles.historyList}>
            <View style={styles.historyItem}>
              <Text style={styles.historyIcon}>🎯</Text>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>Token Mensual</Text>
                <Text style={styles.historyDate}>1 de Marzo 2024</Text>
              </View>
              <Text style={styles.historyTokens}>+1</Text>
            </View>
            
            <View style={styles.historyItem}>
              <Text style={styles.historyIcon}>⚽</Text>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>Reserva Cancha Central</Text>
                <Text style={styles.historyDate}>15 de Marzo 2024</Text>
              </View>
              <Text style={[styles.historyTokens, styles.usedTokens]}>-1</Text>
            </View>
            
            <View style={styles.historyItem}>
              <Text style={styles.historyIcon}>🛒</Text>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTitle}>Compra Pack Pro</Text>
                <Text style={styles.historyDate}>10 de Marzo 2024</Text>
              </View>
              <Text style={styles.historyTokens}>+10</Text>
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
                Los tokens mensuales expiran al final de cada mes. Los tokens comprados no tienen fecha de expiración.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>¿Puedo transferir tokens?</Text>
              <Text style={styles.faqAnswer}>
                No, los tokens son personales e intransferibles. Están vinculados a tu cuenta.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>¿Máximo de tokens?</Text>
              <Text style={styles.faqAnswer}>
                Puedes acumular hasta 6 tokens simultáneamente entre mensuales y comprados.
              </Text>
            </View>
          </View>
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
  purchaseSection: {
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
  tokenPacks: {
    gap: 12,
  },
  tokenPack: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    position: 'relative',
  },
  popularPack: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  packName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  packTokens: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 12,
  },
  packPrice: {
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  pricePerToken: {
    fontSize: 12,
    color: '#666666',
  },
  savingsBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  savingsBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  packDescription: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
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
  bottomSpacer: {
    height: 0,
  },
});