import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FontFamily } from '../../theme/typography';
import publicApi from '../../services/publicApi';
import HomeHeader from '../../components/Layout/HomeHeader';

const { width } = Dimensions.get('window');

interface ECardDetailScreenProps {
  navigation: any;
  route: any;
}

const ECardDetailScreen = ({ navigation, route }: ECardDetailScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { cardId, cardData } = route.params || {};

  const [cardDetails, setCardDetails] = useState(cardData || null);

  useEffect(() => {
    fetchCardDetails();
  }, [cardId, cardData]);

  const fetchCardDetails = async () => {
    setLoading(true);
    try {
      const res = await publicApi.getCardDetails(cardId);
      console.log('Card Details Response:', res);
      setCardDetails(res?.data);
    } catch (err) {
      console.log('Error fetching card details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleCustomize = () => {
    // Navigate to customization screen
    console.log('Navigate to customize');
  };

  const handleShare = async () => {
    try {
      const shareMessage = `Check out this beautiful ${cardDetails?.eventType || 'invitation'} card: ${cardDetails?.templateName || 'E-Card'}\n\nStyle: ${cardDetails?.templateStyle || 'N/A'}\nPages: ${cardDetails?.totalPages || 'N/A'}\n\nView more at Eventsmonial!`;
      
      const result = await Share.share({
        message: shareMessage,
        title: cardDetails?.templateName || 'E-Card',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Card shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to share card');
      console.log('Share error:', error.message);
    }
  };

  return (
    <LinearGradient colors={['#FAF2F2', '#F8F8F9']} style={styles.container}>
      
      <HomeHeader navigation={navigation} showCategories={false} isCategories={false} isBackButton={true}/>

      {loading || !cardDetails ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF0762" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
         
          <View style={styles.sliderContainer}>
            <Swiper
              dotStyle={styles.dot}
              activeDotStyle={styles.activeDot}
              paginationStyle={styles.pagination}
              autoplay={false}
            >
              {cardDetails.thumbnailUrls?.map((imageUrl: string, index: number) => (
                <View key={index} style={styles.slideWrapper}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.slideImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Swiper>

            {/* Favorite Button */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleFavorite}
            >
              <MaterialIcons
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isFavorite ? '#FF0762' : '#656565'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
            >
              <MaterialIcons
                name="share"
                size={24}
                color="#656565"
              />
            </TouchableOpacity>

           
            <View style={styles.premiumBadge}>
              <MaterialIcons name="workspace-premium" size={18} color="#fce00a" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          </View>

          
          <View style={styles.infoContainer}>
            <Text style={styles.cardTitle}>{cardDetails.templateName}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Text style={styles.metaText}>{cardDetails.eventType}</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaText}>{cardDetails.templateStyle}</Text>
              </View>
              <View style={styles.metaChip}>
                <Text style={styles.metaText}>{cardDetails.totalPages} Pages</Text>
              </View>
            </View>


            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{cardDetails.description}</Text>
            </View>

            

            {/* Additional Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Card Type:</Text>
                <Text style={styles.detailValue}>{cardDetails.cardType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Religion:</Text>
                <Text style={styles.detailValue}>{cardDetails.religion}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Community:</Text>
                <Text style={styles.detailValue}>{cardDetails.community}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

     
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.customizeButton}
          onPress={handleCustomize}
        >
          <Text style={styles.customizeButtonText}>Customize This Card</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ECardDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    color: '#333',
  },

  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingBottom: 100,
  },

  sliderContainer: {
    height: 500,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
  },

  slideWrapper: {
    flex: 1,
  },

  slideImage: {
    width: '100%',
    height: '100%',
  },

  pagination: {
    bottom: 15,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },

  activeDot: {
    backgroundColor: '#FF0762',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },

  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    zIndex: 10,
  },

  shareButton:{
    position: 'absolute',
    top: 15,
    right: 65,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    zIndex: 10,
  },

  premiumBadge: {
    position: 'absolute',
    top: 20,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
    zIndex: 10,
  },

  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: FontFamily.semibold,
    fontWeight: '600',
  },

  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  cardTitle: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },

  metaChip: {
    backgroundColor: '#FFE5ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  metaText: {
    fontSize: 12,
    color: '#FF0762',
    fontFamily: FontFamily.semibold,
    fontWeight: '600',
  },



  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
    fontFamily: FontFamily.regular,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },

  featureText: {
    fontSize: 14,
    color: '#333',
    fontFamily: FontFamily.regular,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  detailLabel: {
    fontSize: 14,
    color: '#777',
    fontFamily: FontFamily.regular,
  },

  detailValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: FontFamily.semibold,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 5,
  },

  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF0762',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 10,
  },

  customizeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: FontFamily.bold,
    fontWeight: '700',
  },
});
