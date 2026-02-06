import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import protectedApi from '../../services/protectedApi';
import Toast from 'react-native-toast-message';

interface GuestModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  guest?: any;
}

const GuestModal: React.FC<GuestModalProps> = ({ visible, onClose, onSuccess, guest }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    guestType: '',
    dietaryPreference: '',
    notes: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [showGuestTypeDropdown, setShowGuestTypeDropdown] = useState(false);
  const [showDietaryDropdown, setShowDietaryDropdown] = useState(false);

  const guestTypes = ['family', 'friend', 'colleague', 'neighbour', 'other'];
  const dietaryPreferences = ['vegetarian', 'non-vegetarian', 'vegan', 'gluten-free', 'no-preference'];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateName = (name: string) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  };

  useEffect(() => {
    if (guest) {
      setFormData({
        firstName: guest.fullName?.split(' ')[0] || '',
        lastName: guest.fullName?.split(' ').slice(1).join(' ') || '',
        email: guest.email || '',
        phone: guest.phone || '',
        address: guest.address || '',
        guestType: guest.guestType || '',
        dietaryPreference: guest.dietaryPreference || '',
        notes: guest.notes || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        guestType: '',
        dietaryPreference: '',
        notes: '',
      });
    }
  }, [guest, visible]);

  const validateForm = () => {
    const newErrors = { firstName: '', lastName: '', email: '', phone: '' };
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = 'Must be at least 2 characters and contain only letters';
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName = 'Must be at least 2 characters and contain only letters';
      isValid = false;
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (minimum 10 digits)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;
      if (guest) {
        response = await protectedApi.updateContact(guest._id, formData);
      } else {
        response = await protectedApi.createContact(formData);
      }

      if (response?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: guest ? 'Guest updated successfully' : 'Guest created successfully',
        });
        onSuccess();
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response?.message || 'Failed to save guest',
        });
      }
    } catch (error) {
      console.error('Error saving guest:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save guest',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{guest ? 'Edit Guest' : 'Add Guest'}</Text>
            <TouchableOpacity onPress={() => { onClose(); setShowGuestTypeDropdown(false); setShowDietaryDropdown(false); }}>
              <MaterialIcons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                  style={[styles.input, errors.firstName && styles.inputError]}
                  value={formData.firstName}
                  onChangeText={(text) => {
                    setFormData({ ...formData, firstName: text });
                    if (errors.firstName) setErrors({ ...errors, firstName: '' });
                  }}
                  placeholder="Enter first name"
                />
                {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  value={formData.lastName}
                  onChangeText={(text) => {
                    setFormData({ ...formData, lastName: text });
                    if (errors.lastName) setErrors({ ...errors, lastName: '' });
                  }}
                  placeholder="Enter last name"
                />
                {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={formData.phone}
                onChangeText={(text) => {
                  setFormData({ ...formData, phone: text });
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="Enter address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Guest Type</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowGuestTypeDropdown(!showGuestTypeDropdown)}
              >
                <Text style={formData.guestType ? styles.selectText : styles.selectPlaceholder}>
                  {formData.guestType || 'Select guest type'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#6B7280" />
              </TouchableOpacity>
              {showGuestTypeDropdown && (
                <View style={styles.dropdownList}>
                  {guestTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, guestType: type });
                        setShowGuestTypeDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dietary Preference</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowDietaryDropdown(!showDietaryDropdown)}
              >
                <Text style={formData.dietaryPreference ? styles.selectText : styles.selectPlaceholder}>
                  {formData.dietaryPreference || 'Select dietary preference'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#6B7280" />
              </TouchableOpacity>
              {showDietaryDropdown && (
                <View style={styles.dropdownList}>
                  {dietaryPreferences.map((pref) => (
                    <TouchableOpacity
                      key={pref}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, dietaryPreference: pref });
                        setShowDietaryDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{pref}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Enter notes"
                multiline
                numberOfLines={4}
              />
            </View>
            <View style={{ height: 10 }} />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>{guest ? 'Update' : 'Create'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },

  modalBody: {
    padding: 20,
  },

  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },

  inputGroup: {
    marginBottom: 16,
    flex: 1,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
  },

  selectText: {
    fontSize: 14,
    color: '#1F2937',
    textTransform: 'capitalize',
  },

  selectPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  dropdownList: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    elevation: 3,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  dropdownItemText: {
    fontSize: 14,
    color: '#1F2937',
    textTransform: 'capitalize',
  },

  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },

  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },

  submitBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#FF0762',
    alignItems: 'center',
  },

  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  inputError: {
    borderColor: '#EF4444',
  },

  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});

export default GuestModal;
