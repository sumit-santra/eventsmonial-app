import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import publicApi from '../../services/publicApi';

const VendorDetailsScreen = ({ navigation, route }: any) => {

  const { vendorId } = route.params;
  const [vendorsDetails, setVendorsDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  console.log('Vendor ID:', vendorId);

  useEffect(() => {
    fetchVendorsdetails();
  }, []);

  const fetchVendorsdetails = async () => {
    setLoading(true);
    try {
      const res = await publicApi.getVendorDetails(vendorId);
      // console.log('Vendors Response:', res);
      setVendorsDetails(res?.data || null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVendorsdetails();
    setRefreshing(false);
  };

  console.log('Vendor Details:', vendorsDetails);


  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      {/* HERO IMAGE */}
      <View style={styles.heroWrapper}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e' }}
          style={styles.heroImage}
        />

        <TouchableOpacity style={styles.iconTopRight}>
          <MaterialIcons name="favorite-border" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconTopLeft} onPress={() => navigation.goBack()}>
          <MaterialIcons name="west" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBottomLeft}>
          <Text style={styles.galleryText}>Claim this profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBottomRight}>
          <MaterialIcons name="photo-library" size={20} color="#fff" />
          <Text style={styles.galleryText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>

        {/* TITLE & RATINGS */}
        <Text style={styles.vendorName}>Passionate Photography</Text>

        <View style={styles.ratingRow}>
          <View style={styles.badgePink}>
            <Text style={styles.badgeText}>★ 5.0</Text>
          </View>
          <View style={styles.badgeWhite}>
            <Text style={styles.badgeDark}>5.0 (86 Reviews)</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity style={styles.contactBtn}>
          <Text style={styles.contactText}>Get Contact</Text>
        </TouchableOpacity>

        {/* DESCRIPTION */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.desc}>
          Just capture moments and freeze memories. East Kolkata based
          wedding photography team capturing emotions with passion.
        </Text>

        {/* SERVICE INFO */}
        <Text style={styles.sectionTitle}>Service Information</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Package Starts</Text>
          <Text style={styles.infoValue}>₹35,000</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Photo + Video</Text>
          <Text style={styles.infoValue}>Available</Text>
        </View>

        {/* PHOTO GALLERY */}
        <Text style={styles.sectionTitle}>Photo & Video</Text>
        <FlatList
          data={[1, 2, 3, 4]}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={() => (
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e' }}
              style={styles.galleryImage}
            />
          )}
        />

        {/* RATINGS */}
        <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
        <View style={styles.ratingSummary}>
          <Text style={styles.bigRating}>4.4</Text>
          <Text style={styles.reviewCount}>Based on 532 reviews</Text>
        </View>

        {/* REVIEWS */}
        <View style={styles.reviewCard}>
          <Text style={styles.reviewer}>Kim Bordy ⭐ 4.5</Text>
          <Text style={styles.reviewText}>
            Thanks for amazing experience!
          </Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.viewAll}>View All Reviews</Text>
        </TouchableOpacity>

        {/* RELATED VENDORS */}
        <Text style={styles.sectionTitle}>Make Up Artist For Month</Text>
        <FlatList
          data={[1, 2]}
          horizontal
          renderItem={() => (
            <View style={styles.relatedCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2' }}
                style={styles.relatedImage}
              />
              <Text style={styles.relatedTitle}>Star Makeup Studio</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

export default VendorDetailsScreen;


const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },

  heroWrapper: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  iconTopRight: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },
  iconTopLeft: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },
  iconBottomRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  iconBottomLeft:{
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  galleryText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },

  content: {
    padding: 16,
  },

  vendorName: {
    fontSize: 20,
    fontWeight: '700',
  },

  ratingRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },

  badgePink: {
    backgroundColor: '#FF0762',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
  },

  badgeWhite: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  badgeDark: {
    fontSize: 12,
    color: '#333',
  },

  contactBtn: {
    backgroundColor: '#FF0762',
    padding: 14,
    borderRadius: 10,
    marginVertical: 14,
  },

  contactText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },

  desc: {
    color: '#666',
    lineHeight: 20,
  },

  infoCard: {
    backgroundColor: '#F8F8F9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  infoTitle: {
    fontSize: 12,
    color: '#888',
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },

  galleryImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginRight: 10,
  },

  ratingSummary: {
    alignItems: 'center',
    marginVertical: 10,
  },

  bigRating: {
    fontSize: 32,
    fontWeight: '700',
  },

  reviewCount: {
    fontSize: 12,
    color: '#666',
  },

  reviewCard: {
    backgroundColor: '#F8F8F9',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },

  reviewer: {
    fontWeight: '600',
  },

  reviewText: {
    color: '#666',
    marginTop: 4,
  },

  viewAll: {
    color: '#FF0762',
    fontWeight: '600',
  },

  relatedCard: {
    width: 160,
    marginRight: 12,
  },

  relatedImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },

  relatedTitle: {
    marginTop: 6,
    fontWeight: '600',
  },
});
