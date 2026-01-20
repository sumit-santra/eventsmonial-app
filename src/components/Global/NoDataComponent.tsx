import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface NoDataComponentProps {
  icon: string;
  text: string;
}

const NoDataComponent = ({ icon, text }: NoDataComponentProps) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={32} color="#ccc" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  text: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default NoDataComponent;