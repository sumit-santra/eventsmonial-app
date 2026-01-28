import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useLocation } from '../../context/LocationContext';

import locations from '../../data/locations.json';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { getCurrentLocation, requestLocationPermission } from '../../utils/getCurrentLocation';

const ChangeLocationScreen = ({ navigation }: any) => {
  const { setLocation } = useLocation();
  const [loader, setLoader] = useState(false);

  const [cityOpen, setCityOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);

  const [citySearch, setCitySearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');

  const [selectedCity, setSelectedCity] = useState<any>(locations[0]);
  const [selectedArea, setSelectedArea] = useState<any>(locations[0].areas[0]);

  const filteredCities = useMemo(() => {
    return locations.filter(item =>
      item.city.toLowerCase().includes(citySearch.toLowerCase()),
    );
  }, [citySearch]);

  
  const filteredAreas = useMemo(() => {
    return selectedCity.areas.filter((item: any) =>
      item.name.toLowerCase().includes(areaSearch.toLowerCase()),
    );
  }, [areaSearch, selectedCity]);
  

  const selectLocation = () => {
    let address = `${selectedArea.name}, ${selectedArea.pincode}, ${selectedCity.city}`;
    setLocation({
      latitude: null,
      longitude: null,
      address,
    });
    navigation.goBack();
  };

  console.log('Selected City:', selectedCity);
  console.log('Selected Area:', selectedArea);

  const fetchLocation = async () => {
        setLoader(true);
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;
  
      try {
        const { lat, lng } = await getCurrentLocation();
  
        console.log('Current location:', lat, lng);
  
        // TEMP: you can replace this with Google Reverse Geocode API
        setLocation({
          latitude: lat,
          longitude: lng,
          address: 'Current Location',
        });
      } catch (err) {
        console.log('Location error', err);
      } finally {
        navigation.goBack();
        setLoader(false);
      }
    };

  return (
    <View style={styles.container}>

        <View style={{marginBottom: 20, flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity style={styles.iconTopLeft} onPress={() => navigation.goBack()}>
                <MaterialIcons name="west" size={22} color="#888888" />
            </TouchableOpacity>
            <Text style={styles.title}>Choose Location</Text>
        </View>

        <View style={{position: 'relative'}} >
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                setCityOpen(!cityOpen);
                setAreaOpen(false);
                }}
            >
                <MaterialIcons name="location-on" size={18} color="#666" />
                <Text style={styles.dropdownText}>{selectedCity.city}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={22} />
            </TouchableOpacity>

            {cityOpen && (
                <View style={styles.dropdownBox}>
                <View style={styles.searchBox}>
                    <MaterialIcons name="search" size={18} color="#aaa" />
                    <TextInput
                    placeholder="Search city..."
                    value={citySearch}
                    onChangeText={setCitySearch}
                    style={styles.input}
                    />
                </View>

                <FlatList
                    data={filteredCities}
                    keyExtractor={item => item.city}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                        styles.option,
                        item.city === selectedCity.city && styles.activeOption,
                        ]}
                        onPress={() => {
                        setSelectedCity(item);
                        setSelectedArea(item.areas[0]);
                        setCityOpen(false);
                        }}
                    >
                        <Text style={styles.optionText}>{item.city}</Text>
                        {item.city === selectedCity.city && (
                        <MaterialIcons name="check" size={20} color="#FF0762" />
                        )}
                    </TouchableOpacity>
                    )}
                />
                </View>
            )}
        </View>

        <View style={{position: 'relative', marginBottom: 20}}>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                setAreaOpen(!areaOpen);
                setCityOpen(false);
                }}
            >
                <MaterialIcons name="apartment" size={18} color="#666" />
                <Text style={styles.dropdownText}>{selectedArea.name}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={22} />
            </TouchableOpacity>

            {areaOpen && (
                <View style={styles.dropdownBox}>
                <View style={styles.searchBox}>
                    <MaterialIcons name="search" size={18} color="#aaa" />
                    <TextInput
                    placeholder="Search area..."
                    value={areaSearch}
                    onChangeText={setAreaSearch}
                    style={styles.input}
                    />
                </View>

                <FlatList
                    data={filteredAreas}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                        styles.option,
                        item.name === selectedArea.name && styles.activeOption,
                        ]}
                        onPress={() => {
                        setSelectedArea(item);
                        setAreaOpen(false);
                        }}
                    >
                        <Text style={styles.optionText}>{item.name}</Text>
                        {item.name === selectedArea.name && (
                        <MaterialIcons name="check" size={20} color="#FF0762" />
                        )}
                    </TouchableOpacity>
                    )}
                />
                </View>
            )}
        </View>

        <TouchableOpacity style={{backgroundColor: '#FF0762', paddingHorizontal: 12, paddingVertical: 15, borderRadius: 8}} onPress={() => selectLocation()}>
            <Text style={{color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>Use This Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor: '#fefefe', marginTop: 20, paddingHorizontal: 12, paddingVertical: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} onPress={() => fetchLocation()}>
            {loader ? (
                <ActivityIndicator animating={true} color="#ff0762" style={{ marginRight: 6 }} />
            ):(
                <MaterialIcons name="my-location" size={18} color="#ff0762" style={{ marginRight: 6}} />
            )}
            
            <Text style={{color: '#ff0762', fontWeight: 'bold'}}>Use Current Location</Text>
        </TouchableOpacity>
    </View>
  );
};

export default ChangeLocationScreen;


const styles = StyleSheet.create({

    iconTopLeft: {
        marginRight: 5,
        backgroundColor: 'rgb(255,255,255)',
        padding: 8,
        borderRadius: 20,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },

    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        gap: 8,
    },

    dropdownText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },

    dropdownBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        maxHeight: 300,
        zIndex: 1000,
    },

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    input: {
        flex: 1,
        height: 40,
        fontSize: 14,
        marginLeft: 6,
    },

    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        justifyContent: 'space-between',
    },

    activeOption: {
        backgroundColor: '#FFF1F4',
    },

    optionText: {
        fontSize: 14,
        color: '#333',
    },

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F8F9',
        paddingTop: 50,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        paddingLeft: 8,
    },
 
});
