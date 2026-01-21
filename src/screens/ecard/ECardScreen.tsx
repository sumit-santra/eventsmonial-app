import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import HomeHeader from '../../components/Layout/HomeHeader';
import NoDataComponent from '../../components/Global/NoDataComponent';
import publicApi from '../../services/publicApi';
import { FontFamily } from '../../theme/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Template {
  _id: string;
  templateName: string;
  slug: string;
  description: string;
  eventType: string;
  cardType: string;
  templateStyle: string;
  religion: string;
  community: string;
  isTrending: boolean;
  isActive: boolean;
  totalPages: number;
  thumbnailUrls: string[];
}

interface Filters {
  eventType: string | null;
  cardType: string | null;
  templateStyle: string | null;
  religion: string | null;
  community: string | null;
  search: string | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const ECardScreen = ({ navigation }: any) => {

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCardType, setIsCardType] = useState<'card' | 'video'>('card');

  const [card, setCard] = useState<any>([]);
  const [videoCard, setVideoCard] = useState<any>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Anniversary', 'Birthday', 'Engagement', 'Wedding'];

  const [filters, setFilters] = useState<Filters | null>({
    cardType: null,
    community: null, 
    eventType: null,
    religion: null,
    search: '',
    templateStyle: null
  });
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);


  useEffect(() => {
    fetchCardsList(1, false, filters);
  }, []);

  const fetchCardsList = async (pageNo = 1, isLoadMore = false, currentFilters = filters) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await publicApi.getAllcards({ 
        page: pageNo, 
        limit: 20, 
        ...currentFilters 
      });
     
      const apiData = res?.data;

      // setFilters(apiData?.filters);
      setPagination(apiData?.pagination);

      setCard((prev: Template[]) => [...prev, ...(apiData.templates as Template[])]);

    } catch (err) {
      console.log(err);
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchCardsList(1);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (pagination?.hasNextPage && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCardsList(nextPage, true, filters);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newFilters: Filters = {
      cardType: filters?.cardType ?? null,
      community: filters?.community ?? null,
      religion: filters?.religion ?? null,
      search: filters?.search ?? null,
      templateStyle: filters?.templateStyle ?? null,
      eventType: category === 'All' ? null : category.toLowerCase(),
    };
    
    setFilters(newFilters);
    setCard([]);
    setPage(1);
    fetchCardsList(1, false, newFilters);
  };

  const renderItem = ({ item }: any) => (
  
   <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ECardDetailScreen', { cardId: item.slug, cardData: item })}
    >
      
      <View style={styles.imageWrapper}>
        {item.thumbnailUrls.length > 1 ? (
          <Swiper
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
            paginationStyle={styles.pagination}
            autoplay
            autoplayTimeout={3}
          >
            {item.thumbnailUrls.map((imageUrl: string, index: number) => (
              <View key={index} style={styles.slideWrapper}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        ) : (
          <Image
            source={{ uri: item.thumbnailUrls[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        
        <View style={styles.iconOverlay}>
          {item.thumbnailUrls.length > 1 && (
            <TouchableOpacity style={styles.iconBtnSmall}>
              <MaterialIcons name="layers" size={18} color="#FF0762" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.iconBtnSmall}>
            <MaterialIcons name="favorite-border" size={18} color="#656565" />
          </TouchableOpacity>
        </View>

        <View style={styles.leftIconOverlay}>
          <TouchableOpacity style={styles.rightIconBtnSmall}>
            <MaterialIcons name="workspace-premium" size={18} color="#fce00a" />
          </TouchableOpacity>
        </View>

      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.templateName}
        </Text>

        <Text style={styles.cardMeta}>
          {item.eventType} | {item.templateStyle}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{`E-Invites Cards`}</Text>
          <Text style={styles.subtitle}>
            Choose from beautifully designed <Text style={{ color: "#FF0762" }}> 300+</Text> templates
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialIcons name="sort" size={18} color="#333" />
            <Text style={styles.actionText}>Sort</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <MaterialIcons name="filter-list" size={18} color="#333" />
            <Text style={styles.actionText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryChip,
                  selectedCategory === item && styles.activeChip,
                ]}
                onPress={() => handleCategoryChange(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item && styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.iconGroup}>
          <TouchableOpacity 
            style={[styles.iconBtn, isCardType === 'video' && styles.activeIcon]}
            onPress={() => setIsCardType('video')}
          >
            <MaterialIcons name="ondemand-video" size={20} color={isCardType === 'video' ? "#ffffff" : "#555"} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconBtn, isCardType === 'card' && styles.activeIcon]}
            onPress={() => setIsCardType('card')}
          >
            <MaterialIcons name="photo" size={20} color={isCardType === 'card' ? "#ffffff" : "#555"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonText} />
        </View>
      ))}
    </View>
  );


  return (
    <LinearGradient colors={['#FAF2F2', '#F8F8F9']} style={styles.container}>
      {/* Fixed Header */}
      <HomeHeader navigation={navigation} showCategories={false} isCategories={false} />
      
      {loading ? (
        <View style={styles.content}>
          <Text style={styles.title}>{`E-Invites Cards`}</Text>
          {renderSkeleton()}
        </View>
      ) : (
        <FlatList
          data={isCardType === 'card' ? card : videoCard}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <NoDataComponent 
              icon="card-giftcard" 
              text="No cards found. Try adjusting your filters."
            />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.row}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          numColumns={2}
          key={'grid'}
          ListFooterComponent={
            loadingMore ? <Text style={{ textAlign: 'center' }}>Loading...</Text> : null
          }
        />
      )}
    </LinearGradient>
  );
};


export default ECardScreen;

const styles = StyleSheet.create({

  categoryRow: {
    gap: 5,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 5,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },

  actionText: {
    fontSize: 13,
    color: '#333',
  },

  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  activeChip: {
    backgroundColor: '#FFE5ED',
    borderColor: '#FFE5ED',
  },

  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: FontFamily.semibold,
    color: '#555',
  },

  activeChipText: {
    color: '#FF0762',
    fontFamily: FontFamily.bold,
    fontWeight: '700',
  },

  container: {
    flex: 1,
    paddingBottom: 10,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
    paddingTop: 15,
  },

  title: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginBottom: 2,
    textAlign: 'left',
  },

  subtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    maxWidth: 260,
  },

  iconGroup: {
    flexDirection: 'row',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 3,
    marginLeft: 5,
    gap: 5,
  },

  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  activeIcon: {
    backgroundColor: '#FF0762',
    borderColor: '#FF0762',
  },

  flatListContent: {
    paddingHorizontal: 20,
    gap: 8,
  },

  row:{
    justifyContent: 'space-between',
  },
  
  content: {
    paddingTop: 15,
    paddingHorizontal: 20,
  },

  card: {
    marginBottom: 10,
    overflow: 'hidden',
    maxWidth: '48%',
    flex: 1,
  },


  imageWrapper: {
    position: 'relative',
    height: 250,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },

  iconOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },

  iconBtnSmall: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  rightIconBtnSmall:{
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  leftIconOverlay:{
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 6,
  },

  cardContent: {
    paddingTop: 5,
  },

  cardTitle: {
    fontSize: 14,
    fontFamily: FontFamily.semibold,
    fontWeight: '600',
    color: '#222',
  },

  cardMeta: {
    fontSize: 10,
    color: '#777',
    marginTop: 2,
    textTransform: 'capitalize',
  },

  skeletonContainer: {
    paddingTop: 10,
  },

  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },

  skeletonImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E0E0E0',
  },

  skeletonText: {
    width: '60%',
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    margin: 12,
  },

  slideWrapper: {
    width: '100%',
    height: 250,
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