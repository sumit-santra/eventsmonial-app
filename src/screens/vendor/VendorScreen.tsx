import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../../components/Layout/HomeHeader';
import publicApi from '../../services/publicApi';
import { FontFamily } from '../../theme/typography';

const VendorScreen = ({ navigation }: any) => {

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await publicApi.getVendors();
      setCategories(res.data || res); 
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View style={styles.content}>
      <Text style={styles.title}>Vendor</Text>
      <Text style={styles.subtitle}>Discover amazing vendors for your events</Text>
    </View>
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('VendorList', { categoryValue: item.value })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />
      <Text style={styles.cetagoryTitle}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 9 }).map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonText} />
        </View>
      ))}
    </View>
  );

  return (
    
    <LinearGradient colors={['#FAF2F2', '#F8F8F9']} style={styles.container}>
     
      <HomeHeader navigation={navigation} showCategories={false} isCategories={false} />
      
      {loading ? (
        <View style={[styles.content, { paddingHorizontal: 20 }]}>
          <Text style={styles.title}>Vendor</Text>
          <Text style={styles.subtitle}>Discover amazing vendors for your events</Text>
          {renderSkeleton()}
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item?._id?.toString()}
          numColumns={3}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          scrollEventThrottle={10}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </LinearGradient>
    
  );
};


export default VendorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatListContent: {
    paddingHorizontal: 20,
  },

  content: {
    paddingTop: 15,
  },

  title: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'left',
  },

  cetagoryTitle: {
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    color: '#1B1B1B',
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
    fontFamily: FontFamily.regular,
    textAlign: 'left',
  },

  row: {
    justifyContent: 'space-between',
  },

  card: {
    width: '31%',
    marginBottom: 18,
  },

  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  skeletonCard: {
    width: '31%',
    marginBottom: 20,
  },

  skeletonImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },

  skeletonText: {
    width: '80%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'center',
  },

 
});
