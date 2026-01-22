import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const StartAssistantCard = ({
  onFindVendors,
  onCreateEcard,
  onSend,
}: any) => {
  return (
    <LinearGradient
      colors={['#EEF3FF', '#FFE4F1']}
      style={styles.container}
    >
      {/* Sparkles */}
      <View style={styles.sparklesContainer}>
        <MaterialIcons name="auto-awesome" size={30} color="#ff2d55" />
      </View>

      <View style={styles.helloContainer}>
        <Text style={styles.waveEmoji}>👋</Text>
        <Text style={styles.hello}>Hello, there!</Text>
      </View>
      <Text style={styles.title}>Where should we start?</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onFindVendors}>
          <Text style={styles.actionEmoji}>📍</Text>
          <Text style={styles.actionText}>Find vendors</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onCreateEcard}>
          <Text style={styles.actionEmoji}>🎫</Text>
          <Text style={styles.actionText}>Create event plan</Text>
        </TouchableOpacity>
      </View>

      {/* Input */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Help me create an event"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <MaterialIcons name="mic" size={18} color="#999" />

        <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
          <MaterialIcons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default StartAssistantCard;


const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },

  sparklesContainer: {
    alignItems: 'center',
    marginBottom: 6,
  },

  helloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  waveEmoji: {
    fontSize: 18,
  },

  hello: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },

  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 5,
    color: '#1B1B1B',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginHorizontal: 6,
  },

  actionEmoji: {
    marginRight: 6,
    fontSize: 16,
  },

  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  input: {
    flex: 1,
    fontSize: 13,
    color: '#000',
  },

  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF2F6E',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
