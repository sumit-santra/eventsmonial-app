import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-swiper';
import publicApi from '../../services/publicApi';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FontFamily } from '../../theme/typography';
import NoDataComponent from '../../components/Global/NoDataComponent';
import ServiceInfoDisplay from '../../components/Global/ServiceInfoDisplay';
import RatingSummary from '../../components/Global/RatingSummary';
import FeaturedHorizontalSection from '../../components/Global/FeaturedHorizontalSection';

export interface Location {
  type: 'Point';
  coordinates: [number, number];
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface RatingDistribution {
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStars: number;
  totalReviews: number;
}

export interface Rating {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

export interface ServiceInfo {
  description?: string;
  inclusions?: string[];
  exclusions?: string[];
  gmaps_rating?: number;
  gmaps_reviews_count?: number;
}

export interface ServicePrice {
  price: number;
  unit?: string;
}

export interface VendorService {
  _id: string;
  businessId: string;
  vendorId: string;
  category: string;
  serviceInfo: ServiceInfo;
  prices: ServicePrice[];
}

export interface Business {
  _id: string;
  vendorId: string;
  name: string;
  slug: string;
  category: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  location: Location;
  travelAvailability: 'withincity' | 'outsidecity' | 'anywhere';

  images: string[];
  featuredImages: string[];
  portfolios: any[];

  languagesSpoken: string[];
  openingHours: OpeningHour[];

  serviceCount: number;
  rankingScore: number;

  viewCount: number;
  lastVendorLogin: string;

  isNew: boolean;
  isPopular: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isTopRated: boolean;
  isRecommended: boolean;
  isPremium: boolean;
  isVerified: boolean;
  isPublish: boolean;
  isHighlyActive: boolean;
  isMostSearched: boolean;
  hasNewLeads: boolean;
  hasServices: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  scoreUpdatedAt: string;

  __v: number;
}

export interface VendorDetails {
  business: Business;
  rating: Rating;
  service: VendorService[];
}

const VendorDetailsScreen = ({ navigation, route }: any) => {

  const { vendorId } = route.params;
  const [vendorsDetails, setVendorsDetails] = useState<VendorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [vendorsList, setVendorsList] = useState<any[]>([]);
  const [vendorsVenue, setVendorsVenue] = useState<any[]>([]);
  const [vendorsPhotography, setVendorsPhotography] = useState<any[]>([]);

  const reviews = [
    {
      id: '1',
      name: 'Kim Bordy',
      comment:
        'Amazing! The room is good than the picture. Thanks for amazing experience!',
      rating: 4.5,
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: '2',
      name: 'Mirai Kamazuki',
      comment:
        'The service is on point, and I really like the facilities. Good job!',
      rating: 5.0,
      avatar: 'https://i.pravatar.cc/150?img=32',
    },
    {
      id: '3',
      name: 'Jzenklen',
      comment:
        'The service is on point, and I really like the facilities. Good job!',
      rating: 5.0,
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
  ];

  useEffect(() => {
    fetchVendorsdetails();
    fetchVendorsList('venues');
    fetchVendorsList('photography');
  }, []);

  const fetchVendorsdetails = async () => {
    setLoading(true);
    try {
      const res = await publicApi.getVendorDetails(vendorId);
      // console.log('Vendors Response:', res);
      setVendorsDetails(res?.data || null);
      fetchVendorsList(res?.data?.business?.category || '');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorsList = async (val: string) => {
    try {
      const res = await publicApi.getAllBusinesses({ category: val });
      // console.log('Vendors Response:', res);
      if (val === 'venues') {
        setVendorsVenue(res?.data?.businesses || []);
        setVendorsList(res?.data?.businesses || []);
      } else if (val === 'photography') {
        setVendorsPhotography(res?.data?.businesses || []);
        setVendorsList(res?.data?.businesses || []);
      } else {
        setVendorsList(res?.data?.businesses || []);
      }
      
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



  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF0762" />
        <Text style={styles.loadingText}>Loading vendor details...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      <View style={styles.heroWrapper}>
        <Swiper
          style={styles.heroSwiper}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          paginationStyle={styles.pagination}
          autoplay={true}
          autoplayTimeout={3}
        >
          {vendorsDetails?.business?.images && vendorsDetails?.business?.images?.length > 0 ? 
              vendorsDetails?.business?.images?.slice(0, 5).map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.heroImage}
              />
          )):(
            <Image
              source={require('../../assets/images/default-image.webp')}
              style={styles.heroImage}
            />
          )}
        </Swiper>

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
          <MaterialIcons name="photo" size={20} color="#fff" />
          <Text style={styles.galleryText}>Gallery</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: '#F8F8F9', height: 20, marginTop: -15, borderTopStartRadius: 15, borderTopEndRadius: 15, width: '100%', borderRadius: 2, marginBottom: 10 }}></View>

      
      <View style={styles.content}>
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactCard}>
            <MaterialIcons name="call" size={18} color="#2ecc71" />
            <Text style={styles.contactText}>Get Contact</Text>
          </TouchableOpacity>
          
          <View style={styles.contactCard}>
            <MaterialIcons name="star" size={18} color="#ff2d55" />
            <Text style={styles.contactRatingText}>{vendorsDetails?.rating?.totalReviews || "0"}</Text>
            <Text style={styles.contactReviewText}>({vendorsDetails?.rating?.ratingDistribution?.totalReviews || "0"} Reviews)</Text>
          </View>
          
          <View style={styles.contactCard}>
            <Image
              source={require('../../assets/images/google.png')}
              style={styles.contactGoogleIcon}
            />
            <Text style={styles.contactRatingText}>{vendorsDetails?.service?.[0]?.serviceInfo?.gmaps_rating || "0.0"}</Text>
            <Text style={styles.contactReviewText}>{vendorsDetails?.service?.[0]?.serviceInfo?.gmaps_reviews_count || "0.0"} Reviews</Text>
          </View>
        </View>

        {/* TITLE & RATINGS */}
        <Text style={styles.vendorName}>
          {vendorsDetails?.business?.name}
        </Text>

        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.address}>
            {vendorsDetails?.business?.address}
          </Text>
        </View>

        
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.desc}>
          {showFullDescription 
            ? (vendorsDetails?.service?.[0]?.serviceInfo?.description || 'No description available.')
            : (vendorsDetails?.service?.[0]?.serviceInfo?.description?.substring(0, 100) || 'No description available.')}
          {!showFullDescription && vendorsDetails?.service?.[0]?.serviceInfo?.description && vendorsDetails?.service?.[0]?.serviceInfo?.description.length > 100 && '...'}
        </Text>
        {vendorsDetails?.service?.[0]?.serviceInfo?.description && vendorsDetails?.service?.[0]?.serviceInfo?.description.length > 100 && (
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={styles.readMore}>
              {showFullDescription ? 'Read Less' : 'Read More'}
            </Text>
          </TouchableOpacity>
        )}

        
        <Text style={styles.sectionTitle}>Service Information</Text>
        <ServiceInfoDisplay
          serviceInfo={vendorsDetails?.service?.[0]?.serviceInfo}
          category={vendorsDetails?.service?.[0]?.category || ''}
        />

        {/* PHOTO GALLERY */}
        <Text style={styles.sectionTitle}>Photo & Video</Text>

        {vendorsDetails?.business?.images && vendorsDetails?.business?.images?.length > 0 ? (
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            {vendorsDetails?.business?.images?.slice(0, 3).map((image, index) => {
              const totalImages = vendorsDetails.business.images.length;
              const remainingCount = totalImages - 3;

              return (
                <View key={index} style={styles.galleryImageBox}>
                  <Image
                    source={{ uri: image }}
                    style={styles.galleryImage}
                  />

                  {index === 2 && remainingCount > 0 && (
                    <View style={styles.overlay}>
                      <MaterialIcons name="photo" size={20} color="#fff" />
                      <Text style={styles.overlayText}>
                        + {remainingCount}
                      </Text>
                    </View>
                  )}
                </View>
              )
            })}
            
          </View>
        ) : (
          <NoDataComponent icon="photo" text="No images available." />
        )}
        

        {/* RATINGS */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Ratings & Reviews</Text>

          <TouchableOpacity>
            <Text style={{ color: '#FF0762', fontSize: 14, fontWeight: 'bold', marginTop: 20, marginBottom: 6, }}>
              Write a Review
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratingSummary}>
          <RatingSummary/>
        </View>

        <Text style={styles.sectionTitle}>Reviews (0)</Text>

        <View style={styles.reviewsList}>
          {reviews.map((item) => (
            <View key={item.id} style={styles.reviewItem}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />

              <View style={styles.reviewContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.comment}>{item.comment}</Text>
              </View>

              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={18} color="#FFB800" />
                <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
              </View>
            </View>
          ))}
          {/* <NoDataComponent icon="reviews" text="No reviews available." /> */}
        </View>
          

       

        <TouchableOpacity style={{ marginTop: 5, marginBottom: 20, alignItems: 'center' }}>
          <Text style={styles.viewAll}>View All Reviews</Text>
        </TouchableOpacity>


        <View>
          <FeaturedHorizontalSection
              title={`Similar ${vendorsDetails?.business?.category || ''}`}
              buttonText="View All"
              buttonColor="#FF0055"
              backgroundColor="#f4f3ec"
              items={vendorsList}
              onPressButton={() => navigation.navigate('VendorList', {
                categoryValue: vendorsDetails?.business?.category || '',
              })}
              navigation={navigation}
              loading={loading}
            />
        </View>


        <View>
          <FeaturedHorizontalSection
            title={`Popular ${vendorsDetails?.business?.category === 'venues' ? 'photography':'venues'}`}
            buttonText="View All"
            buttonColor="#FF0055"
            backgroundColor="#f4f3ec"
            items={vendorsDetails?.business?.category === 'venues' ?  vendorsPhotography : vendorsVenue}
            onPressButton={() => navigation.navigate('VendorList', {
              categoryValue: vendorsDetails?.business?.category === 'venues' ? 'photography' : 'venues',
            })}
            navigation={navigation}
            loading={loading}
          />
        </View>

        
      </View>
    </ScrollView>
  );
};

export default VendorDetailsScreen;


const styles = StyleSheet.create({
  container: { backgroundColor: '#F8F8F9' },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontFamily: FontFamily.regular,
  },

  reviewsList:{
    paddingTop: 10,
    paddingBottom: 10,
  },

  reviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,  
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  reviewContent: {
    paddingRight: 8,
    flexShrink: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  comment: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    
  },
  ratingContainer: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    paddingLeft: 4,
    fontWeight: '600',
    color: '#111827',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
  },


  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  
  address: {
    fontSize: 12,
    color: '#666',
    fontFamily: FontFamily.regular,
    marginLeft: 4,
    flex: 1,
  },

  heroWrapper: {
    position: 'relative',
    height: 300,
  },

  heroSwiper: {
    height: 300,
  },

  heroImage: {
    width: '100%',
    height: 300,
  },

  pagination: {
    bottom: 30,
  },

  dot: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },

  activeDot: {
    backgroundColor: '#FF0762',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
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
    bottom: 23,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },

  iconBottomLeft:{
    position: 'absolute',
    bottom: 23,
    left: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },

  galleryText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F8F8F9'
  },

  vendorName: {
    fontSize: 22,
    fontWeight: '700',
    paddingBottom: 4,
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

  

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },

  desc: {
    color: '#666',
    lineHeight: 20,
  },

  readMore: {
    color: '#FF0762',
    fontWeight: '600',
    marginTop: 5,
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

  galleryImageBox: {
    marginRight: 10,
    width: '32%',
    height: 110,
    borderRadius: 10,
    overflow: 'hidden',
  },

  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 10,
  },

  ratingSummary: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
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


  contactContainer: {
    flexDirection: 'row',
    gap: 5,
    marginTop: -10,
    marginBottom: 10,
  },

  contactCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  contactText: {
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 12,
  },
  contactRatingText: {
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 12,
  },
  contactReviewText: {
    marginLeft: 2,
    fontSize: 10,
    color: '#666',
  },
  contactGoogleIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});
