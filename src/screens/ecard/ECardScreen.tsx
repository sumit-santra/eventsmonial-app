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

const ECardScreen = ({ navigation }: any) => {
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
      <HomeHeader showCategories={false} isCategories={false} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={10}
      >

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>E-Invites Cards</Text>
          <Text style={styles.subtitle}>Choose from beautifully designed 300+ templates</Text>

          
        </View>

        
      </ScrollView>
    </LinearGradient>
  );
};


export default ECardScreen;

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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
  },

  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 40,
    textAlign: 'left',
  },

 
});