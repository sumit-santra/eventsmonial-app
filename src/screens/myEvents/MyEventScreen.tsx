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
  ImageBackground,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../../components/Layout/HomeHeader';
import NoDataComponent from '../../components/Global/NoDataComponent';
import { FontFamily } from '../../theme/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import protectedApi from '../../services/protectedApi';


const EVENT_IMAGES: Record<string, any> = {
  wedding: require('../../assets/images/wedding.jpg'),
  anniversary: require('../../assets/images/Anniversary.jpg'),
  engagement: require('../../assets/images/Engagement.jpg'),
  birthday: require('../../assets/images/Birthday.jpg'),
  puja: require('../../assets/images/pooja.jpg'),
  other: require('../../assets/images/party.jpg'),
};

const EVENT_GRADIENTS: Record<string, string[]> = {
  wedding: ['rgba(255,241,252,0.0)', '#fff9f0'],
  anniversary: ['rgba(229,236,253,0.0)', '#fff5fa'],
  engagement: ['rgba(254,243,229,0.0)', '#f8ecf9'],
  birthday: ['rgba(206,255,230,0.0)', '#edf2fe'],
  puja: ['rgba(252,239,211,0.0)', '#faf4e6'],
  other: ['rgba(0,0,0,0.0)', '#f3f2eb'],
};

const EVENT_DAY_COLORS: Record<string, string> = {
  wedding: '#fd910d',
  anniversary: '#ff0285',
  engagement: '#EA02FB',
  birthday: '#0648e2',
  puja: '#FFBB00',
  other: '#454107',
};


const MyEventScreen = ({ navigation }: any) => {

  const scrollViewRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<{ [key: string]: { x: number; width: number } }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showHeaderTitle, setShowHeaderTitle] = useState(true);
  const lastScrollY = useRef(0);
  const [allEvent, setAllEvent] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Anniversary', 'Birthday', 'Engagement', 'Wedding'];


  useEffect(() => {
    fetchEventsList(selectedCategory);
  }, []);

  const fetchEventsList = async (categories: string) => {
  
    setLoading(true);
    let filter = categories == 'All' ? '':categories;

    try {
      const res = await protectedApi.allEvents(filter);

      const apiData = res?.data?.events || [];
      const sortedData = [...apiData].sort((a: any, b: any) => {
        const now = new Date().getTime();

        const timeA = new Date(a.eventDate).getTime();
        const timeB = new Date(b.eventDate).getTime();

        const isAUpcoming = timeA >= now;
        const isBUpcoming = timeB >= now;

        if (isAUpcoming && !isBUpcoming) return -1;
        if (!isAUpcoming && isBUpcoming) return 1;

        if (isAUpcoming && isBUpcoming) {
          return timeA - timeB;
        }
        return timeB - timeA;
      });

      setAllEvent(sortedData);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEventsList(selectedCategory);
    setRefreshing(false);
  };

  const handleCategoryChange = (category: string, index: number) => {
    setSelectedCategory(category);
    
    if (scrollViewRef.current && categoryRefs.current[category]) {
      const chipLayout = categoryRefs.current[category];
      const scrollPosition = chipLayout.x - 20;
      scrollViewRef.current.scrollTo({ x: Math.max(0, scrollPosition), animated: true });
    }
    
    setAllEvent([]);
    fetchEventsList(category);
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

  const getBgImage = (type: string) => {
    return EVENT_IMAGES[type?.toLowerCase()] || EVENT_IMAGES.other;
  };

  const getEventStatus = (eventDate: string) => {
    const today = new Date();
    const event = new Date(eventDate);

    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);

    return event >= today ? 'Upcoming' : 'Completed';
  };

  const handleDeleteEvent = async (eventId: string) => {
  Alert.alert(
    'Delete Event',
    'Are you sure you want to delete this event?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await protectedApi.deleteEvent(eventId);

            setAllEvent((prev: any) =>
              prev.filter((event: any) => event._id !== eventId)
            );
          } catch (err) {
            console.log('Delete error', err);
          }
        },
      },
    ],
  );
};



  const getGradientColors = (eventType: string) => EVENT_GRADIENTS[eventType] || EVENT_GRADIENTS.other;
  const getDayColor = (eventType: string) =>  EVENT_DAY_COLORS[eventType] || EVENT_DAY_COLORS.other;

  const renderItem = ({ item }: any) => (
    
    <TouchableOpacity 
      style={[styles.card, {opacity: getEventStatus(item.eventDate) === 'Upcoming' ? 1:0.5}]}
      onPress={() => navigation.navigate('EventDetails', { cardData: item })}
    >
      <LinearGradient
        colors={getGradientColors(item.eventType)}
        start={{ x: 2, y: 2 }}
        end={{ x: 0, y: 1 }}
        style={styles.cardWrapper}
      >
        <View style={styles.imageBox}>
          <Image
            source={getBgImage(item.eventType)}
            style={styles.eventIcon}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => handleDeleteEvent(item._id)}
          >
            <MaterialIcons name="delete-outline" size={16} color="#fff" />
          </TouchableOpacity>

          <View
            style={[
              styles.statusTag,
              getEventStatus(item.eventDate) === 'Upcoming'
                ? styles.upcomingTag
                : styles.completedTag,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                getEventStatus(item.eventDate) === 'Upcoming'
                  ? styles.upcomingText
                  : styles.completedText,
              ]}
            >
              {getEventStatus(item.eventDate)}
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.displayName || 'My Event'}
          </Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.dateBox}>
            <Text style={styles.month}>
              {new Date(item.eventDate)
                .toLocaleString('en-US', { month: 'short' })
                .toUpperCase()}
            </Text>
            <Text style={[
              styles.day,
              { color: getDayColor(item.eventType) },
            ]}>
              {new Date(item.eventDate).getDate()}
            </Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.city} numberOfLines={1}>
              {item.eventCity}
            </Text>

            <View style={{flexDirection: 'row'}}>
              <View style={{ backgroundColor: getDayColor(item.eventType), borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={styles.eventTypeText}>
                  {item.eventType}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
     
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      {showHeaderTitle && (
        <View style={[  styles.header, { paddingTop: 15 } ]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{`My Events`}</Text>
          </View>
        </View>
      )}

      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 10 }}>
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
     
      <HomeHeader navigation={navigation} showCategories={false} isCategories={false} isBackButton={true} />

      <View style={{ paddingHorizontal: 20, paddingBottom: 10, }}>
        {renderHeader()}
      </View>

      {loading ? (

        <View style={styles.content}>
          {renderSkeleton()}
        </View>

      ) : (

        <FlatList
          data={allEvent}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
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
          onEndReachedThreshold={0.5}
          numColumns={2}
          key={'row'}
          
        />
      )}
    </LinearGradient>
  );
};


export default MyEventScreen;

const styles = StyleSheet.create({

  deleteIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },


  statusTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  upcomingTag: {
    backgroundColor: '#ffffff',
  },

  upcomingText: {
    color: '#1E9A5A',
  },

  completedTag: {
    backgroundColor: '#ffffff',
  },

  completedText: {
    color: '#D93025',
  },

  row:{
    justifyContent: 'space-between',
  },

  eventTypeText:{
    textTransform: 'capitalize',
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',  
  },

  imageBox:{
    width: '100%',
    height: 100,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },

  eventIcon: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    objectFit: 'cover'
  },

  cardWrapper: {
    padding: 8,
  },

  eventTitle:{
    paddingTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textTransform: 'capitalize',
  },

  card: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
    maxWidth: '49%',
    flex: 1,
  },


  eventType: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: FontFamily.bold,
    marginBottom: 4,
  },

  date: {
    color: '#ddd',
    fontSize: 18,
    marginTop: 6,
  },

  cardImage: {
    borderRadius: 15,
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },

  dateBox: {
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 5,
    minWidth: 45,
  },

  month: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7A7A7A',
    marginBottom: 5,
  },

  day: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    lineHeight: 20,
  },

  info: {
    flex: 1,
  },

  city: {
    fontSize: 12,
    color: '#6c6c6c',
    marginBottom: 6
  },

  categoryRow: {
    gap: 5,
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
    paddingBottom: 30,
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

  flatListContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  
  content: {
    paddingHorizontal: 20,
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