import React, { useEffect, useState, useRef } from 'react';
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
import HomeHeader from '../../components/Layout/HomeHeader';
import NoDataComponent from '../../components/Global/NoDataComponent';
import publicApi from '../../services/publicApi';
import { FontFamily } from '../../theme/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Template {
  _id: string;
  templateName: string;
  templateSlug: string;
  description: string;
  eventType: string;
  religion: string;
  community: string;
  isTrending: boolean;
  isActive: boolean;
  totalPages: number;
  previewImage: string;
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

const WebsiteScreen = ({ navigation }: any) => {

  const scrollViewRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<{ [key: string]: { x: number; width: number } }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showHeaderTitle, setShowHeaderTitle] = useState(true);
  const lastScrollY = useRef(0);

  const [card, setCard] = useState<any>([]);

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
    fetchWebList(1, false, filters);
  }, []);

  const fetchWebList = async (pageNo = 1, isLoadMore = false, currentFilters = filters) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await publicApi.getAllWebSite({ 
        page: pageNo, 
        limit: 20, 
        ...currentFilters 
      });
     
      const apiData = res?.data;

      console.log('Website Templates Response:', apiData);

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
    await fetchWebList(1);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (pagination?.hasNextPage && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchWebList(nextPage, true, filters);
    }
  };

  const handleCategoryChange = (category: string, index: number) => {
    setSelectedCategory(category);
    
    // Auto-scroll to selected category using measured position
    if (scrollViewRef.current && categoryRefs.current[category]) {
      const chipLayout = categoryRefs.current[category];
      const scrollPosition = chipLayout.x - 20; // Offset by 20 to add padding
      scrollViewRef.current.scrollTo({ x: Math.max(0, scrollPosition), animated: true });
    }
    
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
    fetchWebList(1, false, newFilters);
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY <= 0) {
      setShowHeaderTitle(true);
    } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      setShowHeaderTitle(false);
    } else if (currentScrollY < lastScrollY.current) {
      setShowHeaderTitle(true);
    }
    
    lastScrollY.current = currentScrollY;
  };

  const renderItem = ({ item }: any) => (
  
   <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('WebSiteDetailScreen', { webSlug: item.templateSlug })}
    >
      
      <View style={styles.imageWrapper}>
        {item.previewImage && (
          <Image
            source={{ uri: item.previewImage }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        
        <View style={styles.iconOverlay}>
         

          <TouchableOpacity style={styles.iconBtnSmall}>
            <MaterialIcons name="favorite-border" size={18} color="#656565" />
          </TouchableOpacity>
        </View>

      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.templateName}
        </Text>

        <Text style={styles.cardMeta}>
          {item.eventType}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      {showHeaderTitle && (
        <View style={[  styles.header, { paddingTop: 15 } ]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{`Explore templates`}</Text>
            
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
      )}

      <View style={styles.header}>
        <View style={{ flex: 1}}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryChip,
                  selectedCategory === item && styles.activeChip,
                ]}
                onPress={() => handleCategoryChange(item, index)}
                onLayout={(event) => {
                  const { x, width } = event.nativeEvent.layout;
                  categoryRefs.current[item] = { x, width };
                }}
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
    <LinearGradient colors={['#F8F8F9', '#F8F8F9']} style={styles.container}>
      {/* Fixed Header */}
      <HomeHeader navigation={navigation} showCategories={false} isCategories={false} />
      <View style={{ paddingHorizontal: 20, paddingBottom: 10, }}>
        {renderHeader()}
      </View>
      {loading ? (
        <View style={styles.content}>
          
          {renderSkeleton()}
        </View>
      ) : (
        <FlatList
          data={card}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          // ListHeaderComponent={renderHeader}
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


export default WebsiteScreen;

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
    paddingTop: 10,
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

 

  flatListContent: {
    paddingHorizontal: 20,
    gap: 8,
  },

  row:{
    justifyContent: 'space-between',
  },
  
  content: {
    // paddingTop: 15,
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
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },

  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    objectFit: 'cover',
    backgroundColor: '#E0E0E0',
    borderWidth: 1,
    borderColor: '#cccccc',
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