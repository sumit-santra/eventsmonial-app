import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddCeremonyModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (ceremony: { title: string; date: Date; time: Date }) => void;
}

const AddCeremonyModal: React.FC<AddCeremonyModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const isValid = useMemo(() => {
    return title.trim() !== '' && date !== null && time !== null;
  }, [title, date, time]);

  const handleSubmit = () => {
    if (isValid && date && time) {
      onSubmit({ title: title.trim(), date, time });
      setTitle('');
      setDate(null);
      setTime(null);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setDate(null);
    setTime(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add New Ceremony</Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Ceremony title */}
          <Text style={styles.label}>Ceremony title</Text>
          <TextInput
            placeholder="Select ceremony type"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          {/* Ceremony date */}
          <Text style={styles.label}>Ceremony date</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={date ? styles.valueText : styles.placeholder}>
              {date ? date.toLocaleDateString('en-GB') : 'dd-mm-yyyy'}
            </Text>
          </TouchableOpacity>

          {/* Ceremony time */}
          <Text style={styles.label}>Ceremony Time</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={time ? styles.valueText : styles.placeholder}>
              {time
                ? time.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Select ceremony time'}
            </Text>
          </TouchableOpacity>

          {/* Footer buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                !isValid && styles.disabledBtn,
              ]}
              disabled={!isValid}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Add Ceremony</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            accentColor="#FF0762"
            minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={time || new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            accentColor="#FF0762"
            onChange={(e, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) setTime(selectedTime);
            }}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
  },
  valueText: {
    color: '#333',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FF0762',
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#E5E7EB',
  },
  submitText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default AddCeremonyModal;