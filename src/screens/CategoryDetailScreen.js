import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StatusBar
} from 'react-native';

/**
 * Imágenes por defecto unificadas para cada categoría
 * Se usan las mismas imágenes para todos los establecimientos de una categoría
 */
const defaultImages = {
  futbol: 'https://cdn.pixabay.com/photo/2020/02/16/17/38/football-4854305_1280.jpg',
  padel: 'https://cdn.pixabay.com/photo/2021/09/10/06/47/paddle-tennis-6612340_1280.jpg',
  tenis: 'https://cdn.pixabay.com/photo/2020/06/29/20/37/asphalt-tennis-court-5354328_1280.jpg',
  basquetbol: 'https://cdn.pixabay.com/photo/2018/07/30/03/56/basketball-3571730_1280.jpg'
};

/**
 * Datos de ejemplo para establecimientos
 * Cada categoría tiene su array de establecimientos con información detallada
 */
const establishmentsData = {
  futbol: [
    {
      id: 1,
      name: 'Cancha Central Fútbol',
      address: 'Av. Deportiva 123, Rancagua',
      rating: 4.8,
      distance: '2.1 km',
      price: '$15.000',
      image: defaultImages.futbol,
      features: ['11vs11', 'Cesped natural', 'Vestuarios', 'Iluminación'],
      tokenDiscount: '15%'
    },
    {
      id: 2,
      name: 'Estadio Moderno',
      address: 'Calle Deportes 456, Rancagua',
      rating: 4.6,
      distance: '3.2 km',
      price: '$18.000',
      image: defaultImages.futbol,
      features: ['7vs7', 'Cesped sintético', 'Estacionamiento'],
      tokenDiscount: '15%'
    },
    {
      id: 3,
      name: 'Campo Deportivo',
      address: 'Av. Central 789, Rancagua',
      rating: 4.7,
      distance: '1.8 km',
      price: '$16.000',
      image: defaultImages.futbol,
      features: ['5vs5', 'Cesped artificial', 'Bar'],
      tokenDiscount: '15%'
    }
  ],
  padel: [
    {
      id: 1,
      name: 'Pádel Premium',
      address: 'Av. Deportiva 789, Rancagua',
      rating: 4.9,
      distance: '1.5 km',
      price: '$20.000',
      image: defaultImages.padel,
      features: ['Cristal', 'Iluminación LED', 'Vestuarios', 'Aire acondicionado'],
      tokenDiscount: '15%'
    },
    {
      id: 2,
      name: 'Pádel Club',
      address: 'Calle Deportes 321, Rancagua',
      rating: 4.8,
      distance: '2.3 km',
      price: '$22.000',
      image: defaultImages.padel,
      features: ['Cristal', 'Bar', 'Estacionamiento techado'],
      tokenDiscount: '15%'
    }
  ],
  tenis: [
    {
      id: 1,
      name: 'Tenis Club',
      address: 'Av. Deportiva 321, Rancagua',
      rating: 4.7,
      distance: '2.8 km',
      price: '$25.000',
      image: defaultImages.tenis,
      features: ['Polvo ladrillo', 'Profesional', 'Clases', 'Tienda'],
      tokenDiscount: '20%'
    },
    {
      id: 2,
      name: 'Canchas Tenis Pro',
      address: 'Calle Central 654, Rancagua',
      rating: 4.6,
      distance: '3.1 km',
      price: '$23.000',
      image: defaultImages.tenis,
      features: ['Césped', 'Iluminación', 'Vestuarios premium'],
      tokenDiscount: '20%'
    }
  ],
  basquetbol: [
    {
      id: 1,
      name: 'Básquet Arena',
      address: 'Calle Deportes 654, Rancagua',
      rating: 4.5,
      distance: '1.2 km',
      price: '$12.000',
      image: defaultImages.basquetbol,
      features: ['Techado', 'Professional', 'Alquiler balones', 'Gradas'],
      tokenDiscount: '10%'
    },
    {
      id: 2,
      name: 'Cancha Básquet Central',
      address: 'Av. Principal 987, Rancagua',
      rating: 4.4,
      distance: '2.5 km',
      price: '$10.000',
      image: defaultImages.basquetbol,
      features: ['Descubierto', 'Iluminación', 'Estacionamiento'],
      tokenDiscount: '10%'
    }
  ]
};

/**
 * Pantalla de detalle de categoría
 * Muestra todos los establecimientos de una categoría específica
 */
export default function CategoryDetailScreen({ route, navigation }) {
  const { category } = route.params;
  
  /**
   * Mapea los nombres de categoría para que coincidan con las keys del objeto establishmentsData
   * @param {string} categoryName - Nombre de la categoría
   * @returns {string} - Key correspondiente en establishmentsData
   */
  const getCategoryKey = (categoryName) => {
    const mapping = {
      'Fútbol': 'futbol',
      'Pádel': 'padel', 
      'Tenis': 'tenis',
      'Básquetbol': 'basquetbol'
    };
    return mapping[categoryName] || categoryName.toLowerCase();
  };
  
  const categoryKey = getCategoryKey(category.name);
  const establishments = establishmentsData[categoryKey] || [];

  /**
   * Maneja el clic en un establecimiento
   * @param {Object} establishment - Establecimiento seleccionado
   */
  const handleEstablishmentPress = (establishment) => {
    console.log('Establecimiento seleccionado:', establishment.name);
    // Aquí se puede agregar más funcionalidad como ver detalles del establecimiento
  };

  /**
   * Maneja el clic en el botón de reserva
   * Navega a la pantalla de reserva con los datos del establecimiento y categoría
   * @param {Object} establishment - Establecimiento a reservar
   */
  const handleReservePress = (establishment) => {
    console.log('Navegando a reserva:', establishment.name);
    navigation.navigate('Reservation', { 
      establishment, 
      category 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={category.color} barStyle="light-content" />
      
      {/* Encabezado con imagen de categoría y botón de volver */}
      <ImageBackground
        source={{ uri: category.image }}
        style={styles.categoryHeader}
        imageStyle={styles.categoryHeaderImage}
      >
        {/* Overlay con color de la categoría para mejor legibilidad */}
        <View style={[styles.headerOverlay, { backgroundColor: `${category.color}CC` }]} />
        
        <View style={styles.headerContent}>
          {/* Botón para volver a la pantalla anterior */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          {/* Información de la categoría */}
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <Text style={styles.establishmentsCount}>
              {establishments.length} establecimientos disponibles
            </Text>
            <Text style={styles.tokenDiscount}>
              🎫 {category.tokenDiscount} de descuento con tokens
            </Text>
          </View>
        </View>
      </ImageBackground>

      {/* Lista de establecimientos desplazable */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.establishmentsList}>
          {establishments.map((establishment) => (
            <TouchableOpacity
              key={establishment.id}
              style={styles.establishmentCard}
              onPress={() => handleEstablishmentPress(establishment)}
              activeOpacity={0.9}
            >
              <ImageBackground
                source={{ uri: establishment.image }}
                style={styles.establishmentBackground}
                imageStyle={styles.establishmentImage}
              >
                {/* Overlay oscuro para mejor contraste del texto */}
                <View style={styles.establishmentOverlay} />
                
                {/* Contenido de la tarjeta de establecimiento */}
                <View style={styles.establishmentContent}>
                  {/* Información principal: nombre, dirección, rating y distancia */}
                  <View style={styles.establishmentHeader}>
                    <View style={styles.establishmentInfo}>
                      <Text style={styles.establishmentName}>{establishment.name}</Text>
                      <Text style={styles.establishmentAddress}>{establishment.address}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.rating}>⭐ {establishment.rating}</Text>
                      <Text style={styles.distance}>{establishment.distance}</Text>
                    </View>
                  </View>

                  {/* Características del establecimiento */}
                  <View style={styles.featuresContainer}>
                    {establishment.features.map((feature, index) => (
                      <View key={index} style={styles.featureTag}>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Beneficio con token */}
                  <View style={styles.tokenBenefit}>
                    <Text style={styles.tokenBenefitText}>
                      🎫 {establishment.tokenDiscount} descuento con token MVP
                    </Text>
                  </View>

                  {/* Pie de tarjeta: precio y botón de reserva */}
                  <View style={styles.footer}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{establishment.price}/hora</Text>
                      <Text style={styles.tokenPrice}>
                        Con token: ${(parseInt(establishment.price.replace(/[$.]/g, '')) * 0.85).toLocaleString()}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.reserveButton}
                      onPress={() => handleReservePress(establishment)}
                    >
                      <Text style={styles.reserveButtonText}>Reservar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mensaje mostrado cuando no hay establecimientos */}
        {establishments.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Próximamente disponible</Text>
            <Text style={styles.emptyStateText}>
              Estamos trabajando para agregar más establecimientos de {category.name}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos de la pantalla de detalle de categoría
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Encabezado con imagen de categoría
  categoryHeader: {
    height: 180,
    justifyContent: 'flex-end',
  },
  categoryHeaderImage: {
    // Estilos para la imagen de fondo
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 0,
  },
  headerContent: {
    padding: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  backButton: {
    marginRight: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  establishmentsCount: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 4,
  },
  tokenDiscount: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    flex: 1,
  },
  establishmentsList: {
    padding: 16,
  },
  // Tarjeta de establecimiento individual
  establishmentCard: {
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  establishmentBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  establishmentImage: {
    borderRadius: 16,
  },
  establishmentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
  },
  establishmentContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  establishmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  establishmentInfo: {
    flex: 1,
  },
  establishmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  establishmentAddress: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  distance: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  // Contenedor de características/etiquetas
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  featureTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featureText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  // Beneficio con token
  tokenBenefit: {
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tokenBenefitText: {
    fontSize: 11,
    color: '#000000',
    fontWeight: 'bold',
  },
  // Pie de tarjeta con precio y botón
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  tokenPrice: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginTop: 2,
  },
  reserveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  reserveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Estado vacío (sin establecimientos)
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    margin: 16,
    borderRadius: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});