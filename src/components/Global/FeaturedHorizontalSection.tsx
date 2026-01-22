import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { FontFamily } from '../../theme/typography';

type ItemType = {
  _id: string;
  images: string[];
  name: string;
  address?: string;
  city?: string;
  location?: any;
  rating: any;
  slug: string;
  services: any[];
};

type Props = {
  title: string;
  buttonText: string;
  onPressButton?: () => void;
  backgroundColor?: string;
  buttonColor?: string;
  items: ItemType[];
  navigation: any;
  loading?: boolean;
};

const FeaturedHorizontalSection: React.FC<Props> = ({
  title,
  buttonText,
  onPressButton,
  backgroundColor = '#FFFFFF',
  buttonColor = '#FF0055',
  items,
  navigation,
  loading = false,
}) => {

  const renderSkeleton = () => (
    <FlatList
      data={Array.from({ length: 3 })}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => `skeleton-${index}`}
      contentContainerStyle={{ paddingHorizontal: 4 }}
      renderItem={() => (
        <View style={styles.card}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonLocation} />
        </View>
      )}
    />
  );



  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity onPress={onPressButton}>
          <Text style={[styles.viewAll, { color: buttonColor }]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal List */}
      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={items}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          renderItem={({ item }) => {
            const imageSource = item.images && item.images.length > 0 && item.images[0]
              ? { uri: item.images[0] }
              : require('../../assets/images/default-image.webp');
            
            return (
              <TouchableOpacity 
                style={styles.card} 
                onPress={() => {
                  if (navigation && item.slug) {
                    navigation.push('VendorDetail', { vendorId: item.slug });
                  }
                }}
              >
                
                <Image source={imageSource} style={styles.image} />

              
                <View style={styles.ratingRow}>
                  <View style={styles.googleBadge}>
                    <Image source={require('../../assets/images/google.png')} style={styles.googleIcon} />
                    <Text style={styles.badgeText}>
                      {item?.services[0]?.serviceInfo?.gmaps_rating || '0.0'}
                    </Text>
                  </View>
      
                  <View style={styles.starBadge}>
                    <MaterialIcons name="star" size={14} color="#fff" />
                    <Text style={styles.starText}>
                      {item?.rating?.totalReviews?.toFixed(1) || 'N/A'}
                    </Text>
                  </View>
                </View>

              
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>

                <View style={styles.locationRow}>
                    <MaterialIcons
                        name="location-on"
                        size={14}
                        color="#6B7280"
                        style={styles.locationIcon}
                    />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {item.address || item.city || 'Location not available'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
        }}
      />
      )}
    </View>
  );
};

export default FeaturedHorizontalSection;


const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    width: 220,
    marginHorizontal: 8,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },

  ratingRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
  },
  
  googleBadge: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    alignItems: 'center',
  },

  googleIcon: {
    width: 14,
    height: 14,
  },

  badgeText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,  
    marginLeft: 4,
    fontWeight: '600',
  },

  starBadge: {
    flexDirection: 'row',
    backgroundColor: '#FF0762',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
  },

  starText: {
    fontSize: 11,
    color: '#fff',
    fontFamily: FontFamily.medium,
    marginLeft: 4,
    fontWeight: '600',
  },

  overlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingBadge: {
    backgroundColor: '#FF0055',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewBadge: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewText: {
    color: '#fff',
    fontSize: 12,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    paddingRight: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    paddingRight: 16,
  },

  skeletonImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },

  skeletonTitle: {
    width: '80%',
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 8,
  },

  skeletonLocation: {
    width: '60%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 4,
  },
});
