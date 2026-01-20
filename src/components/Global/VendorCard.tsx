import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getVendorStartingPrice } from '../../utils/vendorPricingUtils';
import ImageSlider from './ImageSlider';
import { FontFamily } from '../../theme/typography';

interface VendorCardProps {
  item: any;
  categoryValue: string;
  navigation?: any;
}

type TagProps = {
  label: string;
  icon: string;
  color: string;
  bg?: string;
};

const Tag = ({ label, icon, color, bg }: TagProps) => {
  const getIconSource = (iconName: string) => {
    switch(iconName) {
      case 'fire': return require('../../assets/images/Trending.png');
      case 'star': return require('../../assets/images/Recommended.png');
      case 'check-decagram': return require('../../assets/images/Verified.png');
      case 'trophy': return require('../../assets/images/Top-Rated.png');
      case 'crown': return require('../../assets/images/EventmonialPro.png');
      case 'lightning-bolt': return require('../../assets/images/New.png');
      default: return require('../../assets/images/Recommended.png');
    }
  };

  return (
    <View style={[styles.tag, { borderColor: color, backgroundColor: bg || 'transparent' }]}>
      <Image source={getIconSource(icon)} style={styles.tagIcon} />
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
};

const VendorCard = ({ item, categoryValue, navigation }: VendorCardProps) => {
  const pricing = getVendorStartingPrice(item, categoryValue);
  const images = item?.images || [require('../../assets/images/default-image.webp')];
  
  const handleCardPress = () => {
    // Navigate to details page
    navigation?.navigate('VendorDetail', { vendorId: item.slug });
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress}>
        
        <View style={styles.imageWrapper}>
          <ImageSlider images={images} itemId={item?._id} />

          {/* Ratings */}
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
        </View>

       
        <View style={styles.info}>
          <Text style={styles.vendorName} numberOfLines={1}>
            {item?.name}
          </Text>

          <View style={styles.tagContainer}>
            {item?.isTrending && (
              <Tag label="Trending" icon="fire" color="#FE7207" />
            )}
            {item?.isRecommended && (
            <Tag label="Recommended" icon="star" color="#1CA9FF" />
            )}
            {item?.isVerified && (
              <Tag label="Verified" icon="check-decagram" color="#1CA9FF" />
            )}
            {item?.isTopRated && (
              <Tag label="Top Rated" icon="trophy" color="#FF0762" />
            )}
            {item?.isPremium && (
              <Tag label="Eventmonial Pro" icon="crown" color="#FC7702" />
            )}
            {item?.isPublish && (
              <Tag label="New" icon="lightning-bolt" color="#FF005D" />
            )}
          </View>

          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={16} color="#FF0762" />
            <Text style={styles.address} numberOfLines={1}>
              {item?.address}
            </Text>
          </View>

          <Text style={styles.priceLabel}>{pricing.displayName}:</Text>
          {pricing && pricing.price && pricing.price > 0 ? (
            <Text style={styles.price}>
              ₹{pricing.price.toLocaleString()} <Text style={styles.onwards}>{pricing.unit}</Text>
            </Text>
          ) : (
            <Text style={styles.conmtactPrice}>Contact for pricing</Text>
          )}
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
  },
  tagIcon: {
    width: 14,
    height: 14,
  },
  tagText: {
    marginLeft: 6,
    fontSize: 10,
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 0,
  },

  imageWrapper: {
    position: 'relative',
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

  info: {
    flex: 1,
    marginLeft: 12,
  },

  vendorName: {
    fontSize: 16,
    fontFamily: FontFamily.semibold,
    fontWeight: '700',
    marginBottom: 6,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  address: {
    fontSize: 12,
    color: '#666',
    fontFamily: FontFamily.regular,
    marginLeft: 4,
    flex: 1,
  },

  priceLabel: {
    fontSize: 12,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    color: '#777',
  },

  price: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    marginTop: 2,
  },

  conmtactPrice: {
    fontSize: 12,
    fontFamily: FontFamily.semibold,
    fontWeight: '700',
    marginTop: 2,
    color: '#505050',
  },

  onwards: {
    fontSize: 12,
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    color: '#777',
  },
});

export default VendorCard;