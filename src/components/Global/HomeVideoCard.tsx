import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const HomeVideoCard = ({ onPressExplore, onPressPlay }: any) => {
  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>

        <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>
            Get Your 
            </Text>
            <Text style={styles.headerText}>
             <Text style={styles.highlight}>Video Card</Text> Today!
            </Text>
        </View>
        

        <TouchableOpacity style={styles.exploreBtn} onPress={onPressExplore}>
          <Text style={styles.exploreText}>Explore All</Text>
        </TouchableOpacity>
      </View>

      {/* Card */}
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <Image
          source={require('../../assets/images/default-image.webp')} // replace with API image
          style={styles.image}
        />

        {/* Play Button */}
        <TouchableOpacity style={styles.playBtn} onPress={onPressPlay}>
          <View style={styles.playCircle}>
            <View style={styles.playTriangle} />
          </View>
        </TouchableOpacity>

        {/* Bottom Gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.title}>3D Rice Ceremony</Text>
          <Text style={styles.subtitle}>By Eventmonial</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default HomeVideoCard;


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFE1E1',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },

  headerText: {
    fontSize: 26,
    fontWeight: '300',
    paddingRight: 10,
    color: '#1B1B1B',
    flex: 1,
  },

  highlight: {
    color: '#FF2F6E',
    fontWeight: '600',
  },

  exploreBtn: {
    backgroundColor: '#FF2F6E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 5,
    width: 90,
    alignItems: 'center',
  },

  exploreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  card: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  image: {
    width: '100%',
    height: 320,
    resizeMode: 'cover',
  },

  playBtn: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },

  playCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playTriangle: {
    width: 0,
    height: 0,
    marginLeft: 4,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FF2F6E',
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  subtitle: {
    color: '#E0E0E0',
    fontSize: 12,
    marginTop: 4,
  },
});

