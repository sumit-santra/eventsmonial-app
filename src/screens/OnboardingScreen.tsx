import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Swiper from 'react-native-swiper';

const slides = [
  {
    image: require('../assets/images/onboarding1.jpg'),
    title: 'We Curate Experiences Worth a Lifetime.',
    subtitle: 'Semper in cursus magna et eu varius nunc adipiscing. Elementum justo, laoreet id sem . ',
  },
  {
    image: require('../assets/images/onboarding2.jpg'),
    title: 'We Curate Experiences Worth a Lifetime.',
    subtitle: 'Semper in cursus magna et eu varius nunc adipiscing. Elementum justo, laoreet id sem . ',
  },
  {
    image: require('../assets/images/onboarding3.jpg'),
    title: 'We Curate Experiences Worth a Lifetime.',
    subtitle: 'Semper in cursus magna et eu varius nunc adipiscing. Elementum justo, laoreet id sem . ',
    last: true,
  },
];

const OnboardingScreen = ({ navigation }: any) => {
  const swiperRef = React.useRef<Swiper>(null);

  return (
    <Swiper
      ref={swiperRef}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
      paginationStyle={{ bottom: 30 }}
    >
      {slides.map((item, index) => (
        <ImageBackground
          key={index}
          source={item.image}
          style={styles.slide}
        >
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                item.last
                  ? navigation.replace('Login')
                  : swiperRef.current?.scrollBy(1)
              }
            >
              <Text style={styles.buttonText}>
                {item.last ? 'Get Started' : 'Continue'}
              </Text>
            </TouchableOpacity>

            {item.last && (
              <View style={styles.footerBox}>
                <Text style={styles.footer}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={{ color: '#ff0066', fontSize: 16, fontWeight: '600' }}>Register</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ImageBackground>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontWeight: '600',
  },
 
  content: {
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 5,
  },
  subtitle: {
    color: '#ddd',
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingBottom: 5,
  },
  button: {
    backgroundColor: '#ff0066',
    paddingVertical: 16,
    paddingHorizontal: 70,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  footer: {
    color: '#ccc',
    fontSize: 16,
  },
  footerBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    paddingBottom: 5,
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ff0066',
    width: 20,
    height: 8,
    borderRadius: 4,
  },
});

export default OnboardingScreen;
