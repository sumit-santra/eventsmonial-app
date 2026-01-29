import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import HomeHeader from '../../components/Layout/HomeHeader';
import { FontFamily } from '../../theme/typography';




const WishlistScreen: React.FC = ({ navigation }: any) => {

    const scrollViewRef = useRef<ScrollView>(null);
    const categoryRefs = useRef<{ [key: string]: { x: number; width: number } }>({});

    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', 'Card', 'Website', 'Vendors'];

    const onRefresh = async () => {
        setRefreshing(true);
        // await fetchCardsList(1);
        setRefreshing(false);
    };

    const handleCategoryChange = (category: string, index: number) => {
        setSelectedCategory(category);
        
        // Auto-scroll to selected category using measured position
        if (scrollViewRef.current && categoryRefs.current[category]) {
            const chipLayout = categoryRefs.current[category];
            const scrollPosition = chipLayout.x - 20; // Offset by 20 to add padding
            scrollViewRef.current.scrollTo({ x: Math.max(0, scrollPosition), animated: true });
        }
        
        
        
       
    };

    return (
        <View style={styles.container}>

            <HomeHeader navigation={navigation} showCategories={false} isCategories={false} isBackButton={true}/>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10, paddingTop: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#333' }}>Wishlist</Text>
            </View>

            <View style={styles.header}>
                <View style={{ flex: 1}}>
                    <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryRow}
                    >
                    {categories.map((item, index) => (
                        <TouchableOpacity
                        key={item}
                        style={[
                            styles.categoryChip,
                            selectedCategory === item && styles.activeChip,
                        ]}
                        onPress={() => handleCategoryChange(item, index)}
                        onLayout={(event) => {
                            const { x, width } = event.nativeEvent.layout;
                            categoryRefs.current[item] = { x, width };
                        }}
                        >
                        <Text
                            style={[
                            styles.categoryText,
                            selectedCategory === item && styles.activeChipText,
                            ]}
                        >
                            {item}
                        </Text>
                        </TouchableOpacity>
                    ))}
                    </ScrollView>
                </View>
            </View>

           
        </View>
    );
};

export default WishlistScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F9',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
    paddingTop: 10,
    paddingHorizontal: 20,
  },

  categoryRow: {
    gap: 5,
  },


  categoryChip: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 5,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#E5E5E5',
    },
  
    activeChip: {
      backgroundColor: '#FFE5ED',
      borderColor: '#FFE5ED',
    },
  
    categoryText: {
      fontSize: 12,
      fontWeight: '600',
      fontFamily: FontFamily.semibold,
      color: '#555',
    },
  
    activeChipText: {
      color: '#FF0762',
      fontFamily: FontFamily.bold,
      fontWeight: '700',
    },


});
