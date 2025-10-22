import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert
} from 'react-native';

export default function HelpSupportScreen({ navigation }) {
  const contactMethods = [
    {
      icon: '💬',
      title: 'Chat en Vivo',
      description: 'Habla con nuestro equipo de soporte',
      action: () => Alert.alert('Chat en Vivo', 'Funcionalidad en desarrollo')
    },
    {
      icon: '📧',
      title: 'Email de Soporte',
      description: 'soporte@mvpdeportes.com',
      action: () => Linking.openURL('mailto:soporte@mvpdeportes.com')
    },
    {
      icon: '📞',
      title: 'Llámanos',
      description: '+56 2 2345 6789',
      action: () => Linking.openURL('tel:+56223456789')
    },
    {
      icon: '📍',
      title: 'Oficina Central',
      description: 'Av. Principal 123, Santiago',
      action: () => Alert.alert('Dirección', 'Av. Principal 123, Santiago, Chile')
    }
  ];

  const faqItems = [
    {
      question: '¿Cómo uso mis tokens?',
      answer: 'Los tokens se usan automáticamente al hacer reservas. Cada reserva consume 1 token.'
    },
    {
      question: '¿Puedo cancelar una reserva?',
      answer: 'Sí, puedes cancelar hasta 2 horas antes sin penalización.'
    },
    {
      question: '¿Cómo subo de nivel?',
      answer: 'Los niveles suben automáticamente según tu actividad y frecuencia de uso.'
    },
    {
      question: '¿Los tokens expiran?',
      answer: 'Los tokens no expiran y se acumulan mes a mes.'
    }
  ];

  const openHelpCenter = () => {
    Alert.alert('Centro de Ayuda', 'Redirigiendo al centro de ayuda en línea...');
    // Aquí podrías abrir una URL web
    // Linking.openURL('https://ayuda.mvpdeportes.com');
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
              ❓ Ayuda y Soporte
            </Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Centro de Ayuda */}
        <TouchableOpacity 
          style={styles.helpCenterButton}
          onPress={openHelpCenter}
        >
          <Text style={styles.helpCenterIcon}>📖</Text>
          <View style={styles.helpCenterText}>
            <Text style={styles.helpCenterTitle}>Centro de Ayuda</Text>
            <Text style={styles.helpCenterDescription}>
              Encuentra respuestas a preguntas frecuentes y guías paso a paso
            </Text>
          </View>
          <Text style={styles.helpCenterArrow}>›</Text>
        </TouchableOpacity>

        {/* Métodos de Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contáctanos</Text>
          
          <View style={styles.contactList}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.contactItem}
                onPress={method.action}
              >
                <Text style={styles.contactIcon}>{method.icon}</Text>
                <View style={styles.contactText}>
                  <Text style={styles.contactTitle}>{method.title}</Text>
                  <Text style={styles.contactDescription}>{method.description}</Text>
                </View>
                <Text style={styles.contactArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preguntas Frecuentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Preguntas Frecuentes</Text>
          
          <View style={styles.faqList}>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Información de Contacto */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>🕒 Horario de Atención</Text>
          <Text style={styles.infoBoxText}>
            Lunes a Viernes: 9:00 - 18:00 hrs{'\n'}
            Sábados: 10:00 - 14:00 hrs{'\n'}
            Domingos: Cerrado
          </Text>
        </View>

        {/* Reportar Problema */}
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => Alert.alert('Reportar Problema', 'Funcionalidad en desarrollo')}
        >
          <Text style={styles.reportButtonText}>🚨 Reportar un Problema</Text>
        </TouchableOpacity>

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
  helpCenterButton: {
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
  },
  helpCenterIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 40,
    textAlign: 'center',
  },
  helpCenterText: {
    flex: 1,
  },
  helpCenterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  helpCenterDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  helpCenterArrow: {
    fontSize: 20,
    color: '#666666',
    fontWeight: 'bold',
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
  contactList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#666666',
  },
  contactArrow: {
    fontSize: 18,
    color: '#666666',
    fontWeight: 'bold',
  },
  faqList: {
    gap: 16,
  },
  faqItem: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
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
  reportButton: {
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginBottom: 16,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E53E3E',
  },
  bottomSpacer: {
    height: 20,
  },
});