import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../../components/Layout/HomeHeader';
import { FontFamily } from '../../theme/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import publicApi from '../../services/publicApi';
import VendorCard from '../../components/Global/VendorCard';
import VendorCardList from '../../components/Global/VendorCardList';

const VendorListScreen = ({ navigation, route }: any) => {
  const { categoryValue } = route.params;
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isGridView, setIsGridView] = useState(false);


  useEffect(() => {
    fetchVendorsList();
  }, []);

  const fetchVendorsList = async () => {
    setLoading(true);
    try {
      const res = await publicApi.getAllBusinesses({ category: categoryValue });
      // console.log('Vendors Response:', res);
      setVendors(res?.data?.businesses || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVendorsList();
    setRefreshing(false);
  };

  const renderItem = ({ item }: any) => (
    isGridView ? (
      <VendorCardList item={item} categoryValue={categoryValue} navigation={navigation} />
    ) : (
      <VendorCard item={item} categoryValue={categoryValue} navigation={navigation} />
    )
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>{categoryValue}</Text>
        <Text style={styles.subtitle}>
          Showing 12 Of 219 Results As Per Your Search Criteria
        </Text>
      </View>

      <View style={styles.iconGroup}>
        <TouchableOpacity 
          style={[styles.iconBtn, isGridView && styles.activeIcon]}
          onPress={() => setIsGridView(true)}
        >
          <MaterialIcons name="grid-view" size={20} color={isGridView ? "#FF0762" : "#555"} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.iconBtn, !isGridView && styles.activeIcon]}
          onPress={() => setIsGridView(false)}
        >
          <MaterialIcons name="format-list-bulleted" size={20} color={!isGridView ? "#FF0762" : "#555"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonText} />
        </View>
      ))}
    </View>
  );

  return (
    <LinearGradient colors={['#FAF2F2', '#F8F8F9']} style={styles.container}>
      <HomeHeader navigation={navigation} showCategories={false} isCategories={false} isBackButton={true}/>
      
      {loading ? (
        <View style={styles.content}>
          <Text style={styles.title}>{categoryValue}</Text>
          {renderSkeleton()}
        </View>
      ) : (
        <FlatList
          data={vendors}
          renderItem={renderItem}
          keyExtractor={(item) => item?._id?.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={isGridView ? styles.row : undefined}
          numColumns={isGridView ? 2 : 1}
          key={isGridView ? 'grid' : 'list'}
        />
      )}
    </LinearGradient>
  );
};

export default VendorListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
    paddingTop: 15,
  },

  title: {
    fontSize: 20,
    fontFamily: FontFamily.bold,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginBottom: 2,
    textAlign: 'left',
  },

  subtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    maxWidth: 260,
  },

  iconGroup: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 3,
  },

  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeIcon: {
    backgroundColor: '#fdf6f8',
  },

  flatListContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  row:{
    justifyContent: 'space-between',
  },
  
  content: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  skeletonContainer: {
    paddingTop: 10,
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  skeletonImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#E0E0E0',
  },
  skeletonText: {
    width: '60%',
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    margin: 12,
  },
})