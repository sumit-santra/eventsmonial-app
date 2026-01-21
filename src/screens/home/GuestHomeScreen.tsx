import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../../components/Layout/HomeHeader';
import FeaturedHorizontalSection from '../../components/Global/FeaturedHorizontalSection';

const GuestHomeScreen = ({ navigation }: any) => {
  const [showCategories, setShowCategories] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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


  return (
    <LinearGradient colors={['#FAF2F2', '#F8F8F9']} style={styles.container}>
      {/* Fixed Header */}
      <HomeHeader navigation={navigation} showCategories={showCategories} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={10}
      >

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back! </Text>
          <Text style={styles.subtitle}>You are logged in</Text>

          <View>
          <FeaturedHorizontalSection
              title="Similar Catering Services"
              buttonText="View All"
              buttonColor="#FF0055"
              backgroundColor="#EDFDE0"
              items={[
                {
                  id: '1',
                  image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
                  rating: 5.0,
                  views: '46K',
                  title: '4 Star & Above Wedding Hotels',
                  location: 'Kolkata Wedding Venues',
                },
                {
                  id: '2',
                  image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6',
                  rating: 4.8,
                  views: '32K',
                  title: 'Premium Bridal Makeover',
                  location: 'Kolkata Wedding Venues',
                },
              ]}
            />
        </View>


        <View>
          <FeaturedHorizontalSection
              title="You May Also Like Bartenders"
              buttonText="View All"
              buttonColor="#FF0055"
              backgroundColor="#FFFFE7"
              items={[
                {
                  id: '1',
                  image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
                  rating: 5.0,
                  views: '46K',
                  title: 'Experienced Bartenders',
                  location: 'Kolkata Wedding Venues',
                },
                {
                  id: '2',
                  image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6',
                  rating: 4.8,
                  views: '32K',
                  title: 'Premium Bridal Makeover',
                  location: 'Kolkata Wedding Venues',
                },
              ]}
            />
        </View>


        <View>
          <FeaturedHorizontalSection
              title="Similar Catering Services"
              buttonText="View All"
              buttonColor="#FF0055"
              backgroundColor="#EDFDE0"
              items={[
                {
                  id: '1',
                  image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
                  rating: 5.0,
                  views: '46K',
                  title: '4 Star & Above Wedding Hotels',
                  location: 'Kolkata Wedding Venues',
                },
                {
                  id: '2',
                  image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6',
                  rating: 4.8,
                  views: '32K',
                  title: 'Premium Bridal Makeover',
                  location: 'Kolkata Wedding Venues',
                },
              ]}
            />
        </View>


        <View>
          <FeaturedHorizontalSection
              title="You May Also Like Bartenders"
              buttonText="View All"
              buttonColor="#FF0055"
              backgroundColor="#FFFFE7"
              items={[
                {
                  id: '1',
                  image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
                  rating: 5.0,
                  views: '46K',
                  title: 'Experienced Bartenders',
                  location: 'Kolkata Wedding Venues',
                },
                {
                  id: '2',
                  image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6',
                  rating: 4.8,
                  views: '32K',
                  title: 'Premium Bridal Makeover',
                  location: 'Kolkata Wedding Venues',
                },
              ]}
            />
        </View>


        <View>
          <FeaturedHorizontalSection
              title="Similar Catering Services"
              buttonText="View All"
              buttonColor="#FF0055"
              backgroundColor="#EDFDE0"
              items={[
                {
                  id: '1',
                  image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
                  rating: 5.0,
                  views: '46K',
                  title: '4 Star & Above Wedding Hotels',
                  location: 'Kolkata Wedding Venues',
                },
                {
                  id: '2',
                  image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6',
                  rating: 4.8,
                  views: '32K',
                  title: 'Premium Bridal Makeover',
                  location: 'Kolkata Wedding Venues',
                },
              ]}
            />
        </View>


        <View>
          <FeaturedHorizontalSection
              title="You May Also Like Bartenders"
              buttonText="View All"
              buttonColor="#FF0055"
              backgroundColor="#FFFFE7"
              items={[
                {
                  id: '1',
                  image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
                  rating: 5.0,
                  views: '46K',
                  title: 'Experienced Bartenders',
                  location: 'Kolkata Wedding Venues',
                },
                {
                  id: '2',
                  image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6',
                  rating: 4.8,
                  views: '32K',
                  title: 'Premium Bridal Makeover',
                  location: 'Kolkata Wedding Venues',
                },
              ]}
            />
        </View>
        </View>

        
      </ScrollView>
    </LinearGradient>
  );
};


export default GuestHomeScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    // marginTop: 180,
  },

  content: {
    padding: 20,
    paddingTop: 30,
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
