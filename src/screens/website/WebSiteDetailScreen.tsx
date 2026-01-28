import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  Alert,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FontFamily } from '../../theme/typography';
import publicApi from '../../services/publicApi';
import HomeHeader from '../../components/Layout/HomeHeader';
import { WebView } from 'react-native-webview';


interface ECardDetailScreenProps {
  navigation: any;
  route: any;
}

interface Template {
  _id: string;
  templateName: string;
  templateSlug: string;
  templateDescription: string;
  eventType: string;
  previewImage: string;
  isTrending: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isFeatured: boolean;
  htmlContent: string;
  editableFields: any[];
  usageCount: number;
  views: number;
  lastTrendingUpdate: string;
}

const WebSiteDetailScreen = ({ navigation, route }: ECardDetailScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { webSlug } = route.params || {};
  const [webDetails, setWebDetails] = useState<Template | null>(null);

  const [webViewHeight, setWebViewHeight] = useState(400);

  const webViewRef = useRef<WebView>(null);
 

  useEffect(() => {
    fetchCardDetails();
  }, [webSlug]);

  const fetchCardDetails = async () => {
    setLoading(true);
    try {
      const res = await publicApi.getWebSiteDetails(webSlug);
      console.log('Card Details Response:', res);
      setWebDetails(res?.data);
    } catch (err) {
      console.log('Error fetching card details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCardDetails();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCustomize = () => {
    
  };

  const handleShare = async () => {
    try {
      const shareMessage = `Check out this beautiful ${webDetails?.eventType || 'wedding'} template: ${webDetails?.templateName || 'Template'}\n\nViews: ${webDetails?.views || 0}\nUsed by: ${webDetails?.usageCount || 0} people\n\nView more at Eventsmonial!`;
      
      const result = await Share.share({
        message: shareMessage,
        title: webDetails?.templateName || 'Template',
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

  const getHeightJS = `
    (function() {
      const body = document.body;
      const html = document.documentElement;

      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      window.ReactNativeWebView.postMessage(String(height));
    })();
    true;
  `;


  console.log('Web Details:', webViewHeight);

  return (
    <LinearGradient colors={['#F8F8F9', '#F8F8F9']} style={styles.container}>
      
      <HomeHeader navigation={navigation} showCategories={false} isCategories={false} isBackButton={true}/>

      {loading || !webDetails ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF0762" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#FF0762']}
              tintColor="#FF0762"
            />
          }
        >
         
          <View style={styles.sliderContainer}>
            {webDetails?.htmlContent && (
              <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: webDetails.htmlContent }}
                style={{ height: webViewHeight, width: '100%' }}
                javaScriptEnabled
                domStorageEnabled
                scrollEnabled={false}
                showsVerticalScrollIndicator={true}
                onLoadEnd={() => {
                  setTimeout(() => {
                    webViewRef.current?.injectJavaScript(getHeightJS);
                  }, 600);
                }}
                onMessage={(event) => {
                  const height = Number(event.nativeEvent.data);
                  console.log('WebView height:', height);
                  if (height > 0) {
                    setWebViewHeight(height);
                  }
                }}
              />
            )}

          </View>
          
          <View style={styles.infoContainer}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.cardTitle}>
                  {webDetails.templateName} 
                  
                </Text>
                <View style={{ marginLeft: 8}}>
                    <MaterialIcons name="workspace-premium" size={28} color="#f79205" />
                  </View>
              </View>
              

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
              </View>
            </View>


            <View style={styles.metaRow}>

              <View style={styles.metaChip}>
                <Text style={styles.metaText}>{webDetails.eventType}</Text>
              </View>

              {webDetails.isTrending && (
                <View style={[styles.metaChip, { backgroundColor: '#fff5ec' }]}>
                  <MaterialIcons name="trending-up" size={15} color="#ff7300" />
                  <Text style={[styles.metaText, { color: '#ff7300' }]}>Trending</Text>
                </View>
              )}
            </View>


            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{webDetails.templateDescription}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Stats</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Views</Text>
                <Text style={styles.detailValue}>{webDetails.views}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Used By</Text>
                <Text style={styles.detailValue}>{webDetails.usageCount} people</Text>
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
          <Text style={styles.customizeButtonText}>Customize Template</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default WebSiteDetailScreen;

const styles = StyleSheet.create({
  webView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },

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
    paddingBottom: 80,
  },

  sliderContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
    overflow: 'hidden',
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  shareButton:{
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: FontFamily.semibold,
    fontWeight: '600',
  },

  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  cardTitle: {
    fontSize: 24,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    color: '#222',
    marginBottom: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: 12,
    color: '#FF0762',
    fontFamily: FontFamily.semibold,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
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
