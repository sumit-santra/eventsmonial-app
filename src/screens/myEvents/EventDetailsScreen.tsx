import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EVENT_IMAGES: Record<string, any> = {
  wedding: require('../../assets/images/wedding.jpg'),
  anniversary: require('../../assets/images/Anniversary.jpg'),
  engagement: require('../../assets/images/Engagement.jpg'),
  birthday: require('../../assets/images/Birthday.jpg'),
  puja: require('../../assets/images/pooja.jpg'),
  other: require('../../assets/images/party.jpg'),
};

const EVENT_GRADIENTS: Record<string, string[]> = {
  wedding: ['rgba(0,0,0,0)', '#FF1837'],
  anniversary: ['rgba(0,0,0,0)', '#ff0285'],
  engagement: ['rgba(0,0,0,0)', '#EA02FB'],
  birthday: ['rgba(0,0,0,0)', '#0648e2'],
  puja: ['rgba(0,0,0,0)', '#FFBB00'],
  other: ['rgba(0,0,0,0)', '#333'],
};

const EventDetailsScreen = ({ route, navigation }: any) => {
  const { cardData } = route.params;
  const eventType = cardData?.eventType?.toLowerCase() || 'other';

  const isUpcoming = new Date(cardData.eventDate).getTime() > Date.now();

  const getCountdown = () => {
    const diff = new Date(cardData.eventDate).getTime() - Date.now();
    if (diff <= 0) return 'Today';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // call delete API here
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HERO IMAGE */}
      <ImageBackground
        source={EVENT_IMAGES[eventType]}
        style={styles.hero}
      >
        <LinearGradient
          colors={EVENT_GRADIENTS[eventType]}
          style={styles.heroOverlay}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {isUpcoming ? 'Upcoming' : 'Completed'}
            </Text>
          </View>

          <Text style={styles.title}>{cardData.displayName}</Text>
          <Text style={styles.city}>{cardData.eventCity}</Text>
        </LinearGradient>
      </ImageBackground>

      {/* CONTENT */}
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <MaterialIcons name="event" size={22} color="#FF0762" />
          <Text style={styles.infoText}>
            {new Date(cardData.eventDate).toDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={22} color="#FF0762" />
          <Text style={styles.infoText}>{cardData.eventCity}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="schedule" size={22} color="#FF0762" />
          <Text style={styles.infoText}>{getCountdown()}</Text>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryText}>View E-Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <MaterialIcons name="delete-outline" size={18} color="#fff" />
            <Text style={styles.deleteText}>Delete Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EventDetailsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F9',
  },

  hero: {
    height: 280,
  },

  heroOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },

  backBtn: {
    position: 'absolute',
    top: 30,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },

  statusText: {
    color: '#FF0762',
    fontSize: 12,
    fontWeight: '700',
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },

  city: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },

  content: {
    padding: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },

  actions: {
    marginTop: 20,
  },

  primaryBtn: {
    backgroundColor: '#FF0762',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  primaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  deleteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 10,
  },

  deleteText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
});
