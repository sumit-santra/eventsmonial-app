import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../../components/Layout/HomeHeader';
import FeaturedHorizontalSection from '../../components/Global/FeaturedHorizontalSection';
import FeaturedHorizontalCardSection from '../../components/Global/FeaturedHorizontalCardSection';
import PromoSwiper from '../../components/Global/PromoSwiper';
import VendorCetagori from '../../components/Global/VendorCetagori';
import publicApi from '../../services/publicApi';
import HomeVideoCard from '../../components/Global/HomeVideoCard';
import StartAssistantCard from '../../components/Global/StartAssistantCard';

const AuthHomeScreen = ({ navigation }: any) => {
  const [showCategories, setShowCategories] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [vendorCategories, setVendorCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [vendorsVenue, setVendorsVenue] = useState<any[]>([]);
  const [vendorsPhotography, setVendorsPhotography] = useState<any[]>([]);
  const [vendorsMakeup, setVendorsMakeup] = useState<any[]>([]);
  const [allCards, setAllCards] = useState<any[]>([]);

  useEffect(() => {
    fetchVendorCategories();
    fetchVendorCategoriesList('venue');
    fetchVendorCategoriesList('photography');
    fetchVendorCategoriesList('bridalmakeup');
    fetchCardsList();
  }, []);

  const fetchVendorCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await publicApi.getVendors();
      setVendorCategories(res.data || res);
    } catch (err) {
      console.log('Error fetching vendor categories:', err);
    } 
  };

  const fetchCardsList = async () => {
    try {
      const res = await publicApi.getAllcards({ 
        page: 1, 
        limit: 20, 
        cardType: null,
        community: null, 
        eventType: null,
        religion: null,
        search: '',
        templateStyle: null
      });
      
      const apiData = res?.data;      
      setAllCards(apiData.templates);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchVendorCategoriesList = async (val: any) => {
    try {
      const res = await publicApi.getAllBusinesses({ category: val });
      // console.log('Vendors Response:', res);
      if (val === 'photography') {
        setVendorsPhotography(res?.data?.businesses || []);
      }
      if (val === 'venue') {
        setVendorsVenue(res?.data?.businesses || []);
      }
      if (val === 'bridalmakeup') {
        setVendorsMakeup(res?.data?.businesses || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const isScrollingUp = scrollY < lastScrollY - 50;
    const isScrollingDown = scrollY > lastScrollY + 50;
    
    if (isScrollingUp || scrollY === 0) {
      setShowCategories(true);
    } else if (isScrollingDown) {
      setShowCategories(false);
    }
    
    setLastScrollY(scrollY);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVendorCategories();
    await fetchVendorCategoriesList('venue');
    await fetchVendorCategoriesList('photography');
    await fetchVendorCategoriesList('bridalmakeup');
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <LinearGradient colors={['#ffffff', '#F8F8F9']} style={styles.container}>
      {/* Fixed Header */}
      <HomeHeader navigation={navigation} showCategories={showCategories} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={10}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#FF0762']}
            tintColor="#FF0762"
          />
        }
      >

        {/* Content */}
        <View style={styles.content}>

          <View style={{ marginBottom: 20, paddingHorizontal: 20 }}>
            <PromoSwiper />
          </View>

          <View style={{ marginBottom: 20, paddingHorizontal: 0 }}>
            <VendorCetagori navigation={navigation} categories={vendorCategories} loading={loadingCategories} />
          </View>

          
          <View style={{ paddingHorizontal: 20 }}>
            <FeaturedHorizontalSection
                title="Popular Venue Searches"
                buttonText="View All"
                buttonColor="#FF0055"
                backgroundColor="#eef3f6"
                items={vendorsVenue}
                onPressButton={() => navigation.navigate('VendorList', {
                  categoryValue: 'venue',
                })}
                navigation={navigation}
                loading={loadingCategories}
              />
          </View>


          <View style={{ paddingHorizontal: 20 }}>
            <HomeVideoCard/>
          </View>


          <View style={{ paddingHorizontal: 20 }}>
            <FeaturedHorizontalSection
                title="Popular bridal makeup artists"
                buttonText="View All"
                buttonColor="#FF0055"
                backgroundColor="#f5eef1"
                items={vendorsMakeup}
                onPressButton={() => navigation.navigate('VendorList', {
                  categoryValue: 'bridalmakeup',
                })}
                navigation={navigation}
                loading={loadingCategories}
              />
          </View>

          
          <View>
            <StartAssistantCard navigation={navigation} />
          </View>


          <View style={{ paddingHorizontal: 20 }}>
            <FeaturedHorizontalCardSection
                title="Cards That Speak Celebration"
                buttonText="View All"
                buttonColor="#FF0055"
                backgroundColor="#eff5f2"
                items={allCards}
                navigation={navigation}
                onPressButton={() => navigation.navigate('E-Card')}
              />
          </View>



          <View style={{ paddingHorizontal: 20 }}>
            <FeaturedHorizontalSection
                title="Popular photography"
                buttonText="View All"
                buttonColor="#FF0055"
                backgroundColor="#f4f3ec"
                items={vendorsPhotography}
                onPressButton={() => navigation.navigate('VendorList', {
                  categoryValue: 'photography',
                })}
                navigation={navigation}
                loading={loadingCategories}
              />
          </View>


          


          
        </View>

        
      </ScrollView>
    </LinearGradient>
  );
};

export default AuthHomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    // marginTop: 180,
  },

  content: {
    paddingVertical: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#FF0762',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  logoutButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF0762',
    width: '100%',
    marginTop: 20,
  },

  logoutButtonText: {
    color: '#FF0762',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

