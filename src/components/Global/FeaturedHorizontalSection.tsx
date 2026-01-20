import MaterialIcons from '@react-native-vector-icons/material-icons';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

type ItemType = {
  id: string;
  image: string;
  rating: number;
  views: string;
  title: string;
  location: string;
};

type Props = {
  title: string;
  buttonText: string;
  onPressButton?: () => void;
  backgroundColor?: string;
  buttonColor?: string;
  items: ItemType[];
};

const FeaturedHorizontalSection: React.FC<Props> = ({
  title,
  buttonText,
  onPressButton,
  backgroundColor = '#FFFFFF',
  buttonColor = '#FF0055',
  items,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity onPress={onPressButton}>
          <Text style={[styles.viewAll, { color: buttonColor }]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal List */}
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Image */}
            <Image source={{ uri: item.image }} style={styles.image} />

            {/* Top Overlay */}
            <View style={styles.overlay}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {item.rating}</Text>
              </View>

              <View style={styles.viewBadge}>
                <Text style={styles.viewText}>👁 {item.views}</Text>
              </View>
            </View>

            {/* Info */}
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>

            <View style={styles.locationRow}>
                <MaterialIcons
                    name="location-on"
                    size={14}
                    color="#6B7280"
                    style={styles.locationIcon}
                />
              <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default FeaturedHorizontalSection;


const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    width: 220,
    marginHorizontal: 8,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingBadge: {
    backgroundColor: '#FF0055',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewBadge: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewText: {
    color: '#fff',
    fontSize: 12,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
