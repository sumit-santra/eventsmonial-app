import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EventOverviewSlider = () => {
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

        {[
          {
            step: 1,
            title: 'Design the ECard',
            desc: 'Create beautiful digital invitations for your guests.',
          },
          {
            step: 2,
            title: 'Pick the Vendor',
            desc: 'Because every celebration needs a soul.',
          },
          {
            step: 3,
            title: 'Launch Website',
            desc: 'Share your event details with everyone.',
          },
        ].map(item => (
          <View key={item.step} style={styles.row}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepText}>{item.step}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Ceremonies */}
      <View style={[styles.card, {backgroundColor: '#E8F5E9'}]}>
        <View style={styles.header}>
          <Text style={styles.title}>Ceremonies</Text>
          <TouchableOpacity>
            <Text style={styles.action}>+ Add a ceremony</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.empty}>
          <MaterialIcons name="event" size={30} color="#9CA3AF" style={{marginBottom: 10}} />
          <Text style={styles.emptyTitle}>No ceremonies yet</Text>
          <Text style={styles.emptyDesc}>
            Click "Add a ceremony" to get started
          </Text>
        </View>
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
