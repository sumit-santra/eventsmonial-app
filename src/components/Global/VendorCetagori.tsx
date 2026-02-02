import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { FontFamily } from '../../theme/typography';

interface VendorCetagoriProps {
  navigation: any;
  categories: any[];
  loading?: boolean;
}

const VendorCetagori = ({ navigation, categories = [], loading = false }: VendorCetagoriProps) => {

  const renderItem = ({ item }: any) => {
    const imageSource =
      typeof item.image === 'string'
        ? { uri: item.image }
        : require('../../assets/images/default-image.webp');

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('VendorList', {
            categoryValue: item.value,
          })
        }
      >
        <Image source={imageSource} style={styles.image} />
        <Text numberOfLines={1} style={styles.categoryTitle}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

 

    const renderSkeleton = () => {
        const skeletonData = Array(5).fill(0);
        
        return (
            <FlatList
                data={skeletonData}
                renderItem={() => (
                  <View style={styles.skeletonCard}>
                      <View style={styles.skeletonImage} />
                      <View style={styles.skeletonText} />
                  </View>
                )}
                keyExtractor={(_, index) => `skeleton-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        );
    };

  return (
    
    <View style={styles.container}>
     {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item?._id?.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
    
  );
};


export default VendorCetagori;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontFamily: FontFamily.bold,
    marginHorizontal: 20,
    marginVertical: 10,
  },

  listContent: {
    gap: 15,
  },

  card: {
    width: 90,
    marginLeft: 0,
    alignItems: 'center',
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    resizeMode: 'cover',
  },

  categoryTitle: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    color: '#1B1B1B',
  },

  skeletonCard: {
    width: 90,
    marginLeft: 0,
    alignItems: 'center',
  },

  skeletonImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },

  skeletonText: {
    width: 60,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 6,
  },

  
});

