import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import Swiper from 'react-native-swiper';

interface ImageSliderProps {
  images: string[];
  itemId: string;
  width?: number | 'full';
}

const ImageSlider = ({ images, itemId, width = 150 }: ImageSliderProps) => {
  const limitedImages = images.slice(0, 3);
  const getWidth = () => width === 'full' ? '100%' : width;

  return (
    <View style={[styles.sliderContainer, { width: width === 'full' ? '100%' : width }]}>
      <Swiper
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        paginationStyle={styles.pagination}
        autoplay
        autoplayTimeout={3}
      >
        {limitedImages.map((item, index) => (
          <View key={index} style={{ width: getWidth(), height: 130, overflow: 'hidden' }}>
            <Image source={{ uri: item }} style={[styles.sliderImage, { width:'100%' }]} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 130,
    borderRadius: 10,
    overflow: 'hidden',
  },

  sliderImage: {
    height: '100%',
    resizeMode: 'cover',
  },

  pagination: {
    bottom: 8,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 2,
  },

  activeDot: {
    backgroundColor: '#FF0762',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});

export default ImageSlider;