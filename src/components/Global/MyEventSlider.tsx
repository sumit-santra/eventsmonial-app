import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { FontFamily } from '../../theme/typography';
import LinearGradient from 'react-native-linear-gradient';

interface eventProps {
  navigation: any;
  events: any[];
  loading?: boolean;
  title: string;
  buttonText?: string;
  buttonColor?: string;
  onPressButton?: () => void;
}

const EVENT_IMAGES: Record<string, any> = {
  wedding: require('../../assets/images/wedding.jpg'),
  anniversary: require('../../assets/images/Anniversary.jpg'),
  engagement: require('../../assets/images/Engagement.jpg'),
  birthday: require('../../assets/images/Birthday.jpg'),
  puja: require('../../assets/images/pooja.jpg'),
  other: require('../../assets/images/party.jpg'),
};

const EVENT_GRADIENTS: Record<string, string[]> = {
  wedding: ['rgba(255,241,252,0.0)', '#d50d28'],
  anniversary: ['rgba(229,236,253,0.0)', '#d50671'],
  engagement: ['rgba(254,243,229,0.0)', '#c405d2'],
  birthday: ['rgba(206,255,230,0.0)', '#0c4f9c'],
  puja: ['rgba(252,239,211,0.0)', '#d19b04'],
  other: ['rgba(0,0,0,0.0)', '#454107'],
};
const EVENT_DAY_COLORS: Record<string, string> = {
  wedding: '#d50d28',
  anniversary: '#d50671',
  engagement: '#c405d2',
  birthday: '#0c4f9c',
  puja: '#d19b04',
  other: '#454107',
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const SPACING = 16;

// const { width } = Dimensions.get('window');

const MyEventSlider = ({ navigation, events = [], loading = false, title, buttonText, buttonColor, onPressButton }: eventProps) => {

  const getBgImage = (type: string) => {
    return EVENT_IMAGES[type?.toLowerCase()] || EVENT_IMAGES.other;
  };

  const getCountdown = (eventDate: string) => {
    const now = new Date().getTime();
    const eventTime = new Date(eventDate).getTime();
    let diff = eventTime - now;

    if (diff <= 0) return 'Today';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff %= 1000 * 60 * 60 * 24;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff %= 1000 * 60 * 60;

    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}Day ${hours}:${minutes}`;
    if (hours > 0) return `${hours}:${minutes}`;
    return `00:${minutes}`;
  };


  const getGradientColors = (eventType: string) => EVENT_GRADIENTS[eventType] || EVENT_GRADIENTS.other;

  const getDayColor = (eventType: string) =>  EVENT_DAY_COLORS[eventType] || EVENT_DAY_COLORS.other;

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity style={styles.cardWrapper} onPress={() => navigation.navigate('EventDetails', { cardData: item })}>
        <ImageBackground
          source={getBgImage(item.eventType)}
          style={styles.card}
          imageStyle={styles.cardImage} // for borderRadius etc
        >

          <View style={styles.countdownBadge}>
            <Text style={styles.countdownText}>
              {getCountdown(item.eventDate)}
            </Text>
          </View>

          <LinearGradient
            colors={getGradientColors(item.eventType)}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.cardContent}
          >
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
              <Text style={styles.title} numberOfLines={2}>
                {item.displayName || 'My Event'}
              </Text>

              <Text style={styles.city} numberOfLines={1}>
                {item.eventCity}
              </Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const SkeletonCard = () => {
    return (
      <View style={styles.cardWrapper}>
        <View style={[styles.card, styles.skeletonCard]}>
          <View style={styles.skeletonBadge} />

          <View style={styles.skeletonContent}>
            <View style={styles.skeletonDateBox} />

            <View style={{ flex: 1 }}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonCity} />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderSkeleton = () => (
    <FlatList
      data={[1, 2, 3]}
      keyExtractor={(item) => item.toString()}
      renderItem={() => <SkeletonCard />}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + SPACING}
      decelerationRate="fast"
    />
  );


  return (
    
    <View>

      {loading ? (
        renderSkeleton()
      ) : events && events.length > 0 ? ( 
        <View>
     
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>

            <TouchableOpacity onPress={onPressButton}>
              <Text style={[styles.viewAll, { color: buttonColor }]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={events}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + SPACING}
            decelerationRate="fast"
          />
        </View>
      ):(
        <ImageBackground
          source={require('../../assets/images/event-create.jpg')} // change path
          style={styles.noEventCard}
          imageStyle={styles.noEventBgImage}
        >
          <Text style={{fontSize: 28, color: '#000000', paddingBottom: 1, textAlign: 'center'}}>
            Let's create it together.
          </Text>

          <Text style={styles.noEventCardTitle}>
            <Text style={{fontWeight:'bold', color: '#FF0055'}} >Your story deserves</Text> the perfect celebration.
          </Text>

          <View style={{paddingHorizontal: 20, paddingTop: 10, alignItems: 'center'}}>
            <TouchableOpacity style={{backgroundColor:'#FF0055', paddingHorizontal:20, paddingVertical:10, borderRadius:8, marginTop:10}}>
              <Text style={{fontSize: 14, fontWeight:'600', color:'white', textAlign: 'center'}}>Start your event journey</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
     
    </View>
    
  );
};


export default MyEventSlider;

const styles = StyleSheet.create({

  noEventCard: {
    borderRadius: 16,
    overflow: 'hidden', 
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 30
  },

  noEventBgImage: {
    borderRadius: 16,
    resizeMode: 'cover',
  },

  noEventCardTitle:{
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 5,
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },

  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },

  countdownBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },

  countdownText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: SPACING,
  },

  card: {
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },

  image: {
    resizeMode: 'cover',
  },

  overlay: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 16,
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
    paddingHorizontal: 16,
    paddingTop: 150,
    paddingBottom: 16,
  },

  dateBox: {
    width: 55,
    height: 65,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  month: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7A7A7A',
    marginBottom: 5,
  },

  day: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    lineHeight: 20,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },

  city: {
    fontSize: 13,
    color: '#ffffff',
    marginTop: 2,
  },


  skeletonCard: {
    backgroundColor: '#E5E7EB',
  },

  skeletonBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 70,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
  },

  skeletonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 150,
    paddingBottom: 16,
  },

  skeletonDateBox: {
    width: 55,
    height: 65,
    borderRadius: 8,
    backgroundColor: '#D1D5DB',
    marginRight: 12,
  },

  skeletonTitle: {
    height: 18,
    width: '80%',
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
    marginBottom: 8,
  },

  skeletonCity: {
    height: 14,
    width: '50%',
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
  },
});


