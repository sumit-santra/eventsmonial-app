import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import AddCeremonyModal from './AddCeremonyModal';
import protectedApi from '../../services/protectedApi';

const EventOverviewSlider = ({ data, progressSteps }: any) => {
  const [showCeremonyModal, setShowCeremonyModal] = useState(false);
  const [ceremonies, setCeremonies] = useState<Array<any>>([]);


  useEffect(() => {
    fetchCeremonies();
  }, [data?._id]);

  const fetchCeremonies = async () => {
    try {
      const response = await protectedApi.getEventCeremonies(data?._id || '');
      if (response && response.data && Array.isArray(response.data)) {
        setCeremonies(response.data);
      }
      // setCeremonies(response);
    } catch (error) {
      console.error('Error fetching ceremonies:', error);
    }
  };


  const handleAddCeremony = async (ceremony: { title: string; date: Date; time: Date }) => {
    const postData = {
      eventId: data?._id || '',
      workTime: ceremony.time.toTimeString().slice(0, 5),
      workTitle: ceremony.title,
      workingDate: ceremony.date.toISOString().split('T')[0]
    };

    try {
      const response = await protectedApi.addCeremony(postData);
      if(response && response.success && response.data) {
        fetchCeremonies();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Ceremony added successfully'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add ceremony'
      });
    } finally {
      setShowCeremonyModal(false);
    }
     
    // Send postData to your API
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Important Work */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Important work</Text>
        </View>

        <ScrollView 
          style={{maxHeight: 200}}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {progressSteps.filter((item: any) => !item.done).length > 0 ? (
            progressSteps.filter((item: any) => !item.done).map((item: any) => (
              <View key={item.id} style={styles.row}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepText}>{item.id}</Text>
                </View>
                <View style={{flexShrink: 1}}>
                  <Text style={styles.rowTitle}>{item.label}</Text>
                  <Text style={styles.rowDesc}>{item.description}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.empty}>
              <MaterialIcons name="check-circle" size={30} color="#4CAF50" style={{marginBottom: 10}} />
              <Text style={styles.emptyTitle}>Complete all work</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Ceremonies */}
      <View style={[styles.card, {backgroundColor: '#E8F5E9'}]}>
        <View style={styles.header}>
          <Text style={styles.title}>Ceremonies</Text>
          <TouchableOpacity onPress={() => setShowCeremonyModal(true)}>
            <Text style={styles.action}>+ Add a ceremony</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={{maxHeight: 200}}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {ceremonies.length > 0 ? (
            ceremonies.map((ceremony: any, index: number) => (
              <View key={index} style={styles.row}>
                <View style={styles.stepCircle}>
                  <MaterialIcons name="event" size={16} color="#fff" />
                </View>
                <View style={{flexShrink: 1}}>  
                  <Text style={styles.rowTitle}>{ceremony.workTitle}</Text>
                  <Text style={styles.rowDesc}>
                    {ceremony.workingDate} at {ceremony.workTime}
                  </Text>
                </View>
              </View>
            ))
          ) : (

          <View style={styles.empty}>
            <MaterialIcons name="event" size={30} color="rgb(71, 145, 234)" style={{marginBottom: 10}} />
            <Text style={styles.emptyTitle}>No ceremonies yet</Text>
            <Text style={styles.emptyDesc}>
              Click "Add a ceremony" to get started
            </Text>
          </View>
          )}

        </ScrollView>

        
      </View>

      {/* Notes */}
      <View style={[styles.card, styles.noteCard]}>
        <View style={styles.header}>
          <Text style={styles.title}>Notes</Text>
          <TouchableOpacity>
            <Text style={styles.action}>+ Add a note</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.empty}>
          <MaterialIcons name="note" size={30} color="#9CA3AF" style={{marginBottom: 10}} />
          <Text style={styles.emptyTitle}>No notes yet</Text>
          <Text style={styles.emptyDesc}>
            Click "Add a note" to get started
          </Text>
        </View>
      </View>

      <AddCeremonyModal
        visible={showCeremonyModal}
        onClose={() => setShowCeremonyModal(false)}
        onSubmit={handleAddCeremony}
      />
    </ScrollView>
  );
};

export default EventOverviewSlider;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 16,
    paddingVertical: 10,
  },

  card: {
    width: 310,
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    backgroundColor: '#e7eef3',
    
  },

  noteCard: {
    backgroundColor: '#FFF1F6',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },

  action: {
    color: '#FF0762',
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 14,
  },

  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF0762',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },

  stepText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  rowDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  emptyIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  emptyDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
});
