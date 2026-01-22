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
import { FontFamily } from '../../theme/typography';
import Swiper from 'react-native-swiper';

type ItemType = {
  _id: string;
  thumbnailUrls: string[];
  rating: number;
  templateName: string;
  eventType: string;
  templateStyle: string;
  slug: string;
};

type Props = {
  title: string;
  buttonText: string;
  onPressButton?: () => void;
  backgroundColor?: string;
  buttonColor?: string;
  items: ItemType[];
  navigation: any;
};

const FeaturedHorizontalCardSection: React.FC<Props> = ({
  title,
  buttonText,
  onPressButton,
  backgroundColor = '#FFFFFF',
  buttonColor = '#FF0055',
  items,
  navigation,
  
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
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        renderItem={({ item }) => (
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
                      autoplay={true}
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
        )}
      />
    </View>
  );
};

export default FeaturedHorizontalCardSection;


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
    overflow: 'hidden',
    maxWidth: 200,
    marginHorizontal: 10,
  },
  
  imageWrapper: {
    position: 'relative',
    height: 250,
    width: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
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
    fontWeight: '700',
    color: '#222',
  },

  cardMeta: {
    fontSize: 10,
    color: '#5c5c5c',
    marginTop: 2,
    textTransform: 'capitalize',
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
