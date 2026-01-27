import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Image,
  ImageBackground,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import publicApi from '../../services/publicApi';

const SearchScreen = ({ navigation }: { navigation: any }) => {
  const searchInputRef = useRef<TextInput>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [areaSearch, setAreaSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Get user location
  const getUserLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (!hasPermission) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return null;
        }
      }

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          error => {
            reject(error);
          }
        );
      });
    } catch (error) {
      console.log('Error getting location:', error);
      return null;
    }
  };

  
  const globalSearch = async (keywords: string, limit = 10) => {
    try {
      let location: { latitude: number; longitude: number } | null = null;
      try {
        location = await getUserLocation();
      } catch (locationError) {
        
        console.log('Location not available, searching without coordinates');
      }

      console.log(location);

      const response = await publicApi.globalSearch(
        keywords,
        location?.latitude,
        location?.longitude,
        areaSearch + ', ' + selectedCity
      );
      console.log('Global Search Response:', response);
      return response;
    } catch (error) {
      console.error('Error performing global search:', error);
      throw error;
    }
  };

  // Auto-focus the search input when screen mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await globalSearch(query);
      const results = response?.data?.results || response?.results || [];
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    // setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const handelNavigate = (slug: string, type: string) => {
    if (type === 'card') {
      navigation.push('ECardDetailScreen', { cardId: slug });
    } else if (type === 'business') {
      navigation.push('VendorDetail', { vendorId: slug });
    } else if(type === 'website'){
      navigation.push('WebSiteDetailScreen', { webSlug: slug });
    } else {
      console.log('Unknown entity type:', type);
    }
  };

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => handelNavigate( item.slug, item.entityType)}
    >
      <Image
        source={{
          uri: item.thumbnail || '../../assets/images/default-image.webp',
        }}
        defaultSource={require('../../assets/images/default-image.webp')}
        style={styles.resultImage}
      />
      <View style={styles.resultContent}>
        <Text style={styles.resultName} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.resultCategory} numberOfLines={1}>
          {item.category} • {item.city}
        </Text>
        {item.description && (
          <Text style={styles.resultDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../assets/images/header-bg.png')}
        style={styles.headerBg}
      >
        <View style={styles.searchHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="west" size={22} color="#888888" />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <MaterialIcons name="search" size={20} color="#999" />
            <TextInput
              ref={searchInputRef}
              placeholder='Search vendors, categories...'
              placeholderTextColor="#999"
              style={styles.input}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClear}>
                <MaterialIcons name="close" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>

     
      {searchQuery.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search" size={64} color="#ddd" />
          <Text style={styles.emptyText}>Start searching for vendors</Text>
          <Text style={styles.emptySubText}>
            Find photographers, caterers, decorators and more
          </Text>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF0762" />
        </View>
      ) : searchResults.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={64} color="#ddd" />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubText}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={styles.resultsList}
        />
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerBg: {
    borderBottomColor: 'rgba(255, 7, 98, 0.2)',
    borderBottomWidth: 1,
  },

  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  backButton: {
    marginRight: 5,
    backgroundColor: 'rgb(255,255,255)',
    padding: 8,
    borderRadius: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
    height: 44,
    borderColor: '#ececec',
    borderWidth: 1,
  },

  input: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#ffffff',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },

  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resultsList: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
  },

  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },

  resultContent: {
    flex: 1,
    justifyContent: 'center',
  },

  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  resultCategory: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    textTransform: 'capitalize',
  },

  resultDescription: {
    fontSize: 10,
    color: '#b7b7b7',
    marginTop: 1,
  },
});
