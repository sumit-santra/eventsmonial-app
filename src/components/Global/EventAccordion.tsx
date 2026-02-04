import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type AccordionItem = {
  title: string;
  content: string;
};

type Props = {
  data: AccordionItem[];
};

const EventAccordion = ({ data }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <View style={styles.container}>
       

        {data.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
            <View key={index} style={styles.card}>
                <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleItem(index)}
                style={styles.header}
                >
                <Text style={styles.title}>{item.title}</Text>
                <MaterialIcons
                    name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color="#FF0762"
                />
                </TouchableOpacity>

                {isOpen && (
                <View style={styles.body}>
                    <Text style={styles.content}>{item.content}</Text>
                </View>
                )}
            </View>
            );
        })}

    </View>
  );
};

export default EventAccordion;



const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },

  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  content: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
});
