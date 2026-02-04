import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import protectedApi from '../../services/protectedApi';
import EventOverviewSlider from '../../components/Global/EventOverviewSlider';
import EventAccordion from '../../components/Global/EventAccordion';

const EVENT_IMAGES: Record<string, any> = {
  wedding: require('../../assets/images/weddingEventImage.jpg'),
  anniversary: require('../../assets/images/anniversaryEventImage.jpg'),
  engagement: require('../../assets/images/engagementEventImage.jpg'),
  birthday: require('../../assets/images/birthdayEventImage.jpg'),
  puja: require('../../assets/images/pooja.jpg'),
  other: require('../../assets/images/partyEventImage.jpg'),
};

const EVENT_GRADIENTS: Record<string, string[]> = {
  wedding: ['rgba(255,241,252,0.0)', '#171420'],
  anniversary: ['rgba(229,236,253,0.0)', '#171420'],
  engagement: ['rgba(254,243,229,0.0)', '#171420'],
  birthday: ['rgba(206,255,230,0.0)', '#171420'],
  puja: ['rgba(252,239,211,0.0)', '#171420'],
  other: ['rgba(0,0,0,0.0)', '#171420'],
};

const EventDetailsScreen = ({ route, navigation }: any) => {
  const { cardData } = route.params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const eventType = cardData?.eventType?.toLowerCase() || 'other';

  const isUpcoming = new Date(cardData.eventDate).getTime() > Date.now();

  const progressSteps = [
    { id: 1, label: 'Design the ECard', done: false },
    { id: 2, label: 'Lock the Venue', done: true },
    { id: 3, label: 'Create Guest List', done: true },
    { id: 4, label: 'Pick the Vendor', done: false },
    { id: 5, label: 'Launch Website', done: false },
  ];


  useEffect(() => {
    fetchEventDetails();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEventDetails();
    setRefreshing(false);
  };

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const response = await protectedApi.getEventDetails(cardData._id);

      if(response.data){
        setEventDetails(response.data);
      } else {
        setEventDetails(null);
        navigation.goBack();
        return;
      }
      
    } catch (error) {
      console.error('Error fetching event details:', error);
      navigation.goBack();
      return;
    } finally {
      setLoading(false);
    }
  };

  const getCountdown = () => {
    const diff = new Date(cardData.eventDate).getTime() - Date.now();
    if (diff <= 0) return 'Today';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} Days left`;
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
          onPress: async () => {
            try {
              await protectedApi.deleteEvent(cardData._id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting event:', error);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF0762" />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  const data = eventDetails || {};

  const accordionData = [
    {
      title: 'Create your invitation card to share with family & friends.',
      content: 'Create beautiful digital invitations for your guests.',
    },
    {
      title: 'Look for venues and save the ones you like. ',
      content: 'Because every celebration needs a soul.',
    },
    {
      title: 'Make a list ! Add names of family members and friends.',
      content: 'Share your event details with everyone.',
    },
    {
      title: 'Find and save vendors for your event.',
      content: 'Share your event details with everyone.',
    },
    {
      title: 'Create a website with all your event details.',
      content: 'Share your event details with everyone.',
    },
  ];

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={['#FF0762']}
          tintColor="#FF0762"
        />
      }
    >
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
            <MaterialIcons name="west" size={22} color="#ffffff" />
          </TouchableOpacity>


          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>

            <View style={{flex: 1, marginRight: 20}}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {isUpcoming ? 'Upcoming' : 'Completed'}
                </Text>
              </View>

              <Text style={styles.title}>{data.eventParticipants?.brideName && data.eventParticipants?.groomName ? `${data.eventParticipants.brideName} & ${data.eventParticipants.groomName}` : cardData.displayName}</Text>
              <Text style={styles.city}>{data.eventCity || cardData.eventCity}</Text>
            </View>

            <View style={styles.CountdownBox}>
              <Text style={styles.countdownText}>{getCountdown()}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{position: 'absolute', bottom: 0, right: 0, height: 20, borderTopRightRadius: 15, borderTopLeftRadius: 15,  left: 0, backgroundColor: '#F8F8F9', padding: 8,}}>
        </View>
      </ImageBackground>

      {/* CONTENT */}
      <View style={styles.content}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 20}}>
          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={22} color="#FF0762" />
            <Text style={styles.infoText}>
              {new Date(data.eventDate || cardData.eventDate).toDateString()}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={22} color="#FF0762" />
            <Text style={styles.infoText}>{data.eventCity || cardData.eventCity}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="people" size={22} color="#FF0762" />
            <Text style={styles.infoText}>{data.guestCount || 'N/A'} Guests</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="account-balance-wallet" size={22} color="#FF0762" />
            <Text style={styles.infoText}>
              ₹{data?.budget != null
                ? Number(data.budget).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="category" size={22} color="#FF0762" />
            <Text style={styles.infoText}>{data.religion || 'N/A'} • {data.ethnicity || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="family-restroom" size={22} color="#FF0762" />
            <Text style={styles.infoText}>{data.eventParticipants?.serviceSide || 'N/A'}</Text>
          </View>

          
        </View>

        <View>
          <Text style={styles.sectionTitle}>
            Birthday Preparation Progress
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {progressSteps.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.progressPill,
                  item.done ? styles.progressActive : styles.progressInactive,
                ]}
                // onPress={() => handleCategoryChange(item, index)}
               
              >
                <Text
                  style={[
                    styles.progressText,
                    item.done
                      ? styles.progressTextActive
                      : styles.progressTextInactive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
            <EventOverviewSlider />
        </View>

        <View>

          <Text style={styles.sectionTitle}>
            Recommendation for you
          </Text>

          <EventAccordion data={accordionData} />
        </View>




        {/* ACTIONS */}
        <View style={styles.actions}>
          <View>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <MaterialIcons name="delete-outline" size={18} color="#6e6e6e" />
              <Text style={styles.deleteText}>Delete Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EventDetailsScreen;


const styles = StyleSheet.create({
  categoryRow: {
    paddingTop: 10,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },

  progressPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 5,
    marginBottom: 10,
  },

  progressActive: {
    backgroundColor: '#FF0762',
  },

  progressInactive: {
    backgroundColor: '#F2F2F2',
  },

  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },

  progressTextActive: {
    color: '#FFFFFF',
  },

  progressTextInactive: {
    color: '#000000',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8F8F9',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F9',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },

  hero: {
    height: 320,
  },

  countdownText:{
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  CountdownBox:{
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },

  heroOverlay: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 30,
    justifyContent: 'flex-end',
  },

  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    textTransform: 'capitalize',
  },

  city: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '50%',
    paddingRight: 10,
    
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
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  deleteText: {
    color: '#6e6e6e',
    marginLeft: 6,
    fontWeight: '600',
  },
});
