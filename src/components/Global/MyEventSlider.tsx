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

interface eventProps {
  navigation: any;
  events: any[];
  loading?: boolean;
}

const EVENT_IMAGES: Record<string, any> = {
  wedding: require('../../assets/images/wedding.jpg'),
  anniversary: require('../../assets/images/Anniversary.jpg'),
  engagement: require('../../assets/images/Engagement.jpg'),
  birthday: require('../../assets/images/Birthday.jpg'),
  puja: require('../../assets/images/pooja.jpg'),
  other: require('../../assets/images/others-event.jpg'),
};

const EVENT_BG_COLORS: Record<string, string> = {
  wedding: '#fff1fc',      // soft pink
  anniversary: '#e5ecfd',  // soft blue
  engagement: '#fef3e5',   // peach
  birthday: '#ceffe6',     // yellow tint
  puja: '#fcefd3',         // light green
  other: '#eeeff2',        // default
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const SPACING = 16;

// const { width } = Dimensions.get('window');

const MyEventSlider = ({ navigation, events = [], loading = false }: eventProps) => {

  const getBgImage = (type: string) => {
    return EVENT_IMAGES[type?.toLowerCase()] || EVENT_IMAGES.other;
  };

  const getCardBgColor = (type: string) => {
    return EVENT_BG_COLORS[type?.toLowerCase()] || EVENT_BG_COLORS.other;
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.cardWrapper}>
        <View style={[styles.card, { backgroundColor: getCardBgColor(item.eventType) }]}>
          {/* IMAGE */}
          <Image
            source={getBgImage(item.eventType)}
            style={styles.cardImage}
          />

          <View style={styles.cardContent}>
            <View style={styles.dateBox}>
              <Text style={styles.month}>
                {new Date(item.eventDate).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
              </Text>
              <Text style={styles.day}>
                {new Date(item.eventDate).getDate()}
              </Text>
            </View>

            
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>
                {item.displayName || 'My Event'}
              </Text>

              <Text style={styles.city} numberOfLines={1}>
                {item.eventCity}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };


  console.log('events', events);


  return (
    
    <View>
    
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
    
  );
};


export default MyEventSlider;

const styles = StyleSheet.create({
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: 16,
  },

  card: {
    height: 300,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 10,
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
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 15,
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  dateBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F4F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  month: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7A7A7A',
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

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  city: {
    fontSize: 13,
    color: '#7A7A7A',
    marginTop: 4,
  },
});


