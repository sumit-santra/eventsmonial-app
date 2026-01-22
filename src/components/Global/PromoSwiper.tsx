import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';



const sliderData = [
  {
    id: '1',
    image: require('../../assets/images/banner-1.jpg'),
  },
  {
    id: '2',
    image: require('../../assets/images/banner-2.jpg'),
  },
  {
    id: '3',
    image: require('../../assets/images/banner-3.jpg'),
  },
];


const PromoSwiper = () => {
  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={4}
        loop
        showsPagination
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        paginationStyle={styles.pagination}
      >
        {sliderData.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

export default PromoSwiper;


const styles = StyleSheet.create({
  container: {
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
  },

  card: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  pagination: {
    bottom: 10,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginBottom: 0,
  },

  activeDot: {
    width: 14,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF0762',
    marginBottom: 0,
  },
});
