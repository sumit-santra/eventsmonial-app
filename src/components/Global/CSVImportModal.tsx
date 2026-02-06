import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import protectedApi from '../../services/protectedApi';
import Toast from 'react-native-toast-message';

interface CSVImportModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CSVImportModal: React.FC<CSVImportModalProps> = ({ visible, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleFilePicker = async () => {
    const options = {
      mediaType: 'mixed' as const,
      includeBase64: false,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }
      if (response.assets && response.assets[0]) {
        const file = response.assets[0];
        const fileName = file.fileName || '';
        
        if (!fileName.toLowerCase().endsWith('.csv')) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Only CSV files are allowed',
          });
          return;
        }
        
        if (file.fileSize && file.fileSize > 5 * 1024 * 1024) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'File size exceeds 5 MB',
          });
          return;
        }
        
        setSelectedFile({
          name: fileName,
          uri: file.uri,
          type: file.type || 'text/csv',
          size: file.fileSize,
        });
      }
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a CSV file',
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.name,
      } as any);
      
      const response = await protectedApi.uploadCSV(formData);
      
      if (response?.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'CSV file uploaded successfully',
        });
        onSuccess();
        onClose();
        setSelectedFile(null);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response?.message || 'Failed to upload CSV file',
        });
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to upload CSV file',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Import CSV File</Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>Upload a Spreadsheet (CSV)</Text>
              
              <TouchableOpacity style={styles.filePickerBtn} onPress={handleFilePicker}>
                <MaterialIcons name="upload-file" size={24} color="#6B7280" />
                <Text style={styles.filePickerText}>
                  {selectedFile ? selectedFile.name : 'Choose file'}
                </Text>
              </TouchableOpacity>

              {selectedFile && (
                <View style={styles.fileInfo}>
                  <MaterialIcons name="insert-drive-file" size={20} color="#FF0762" />
                  <Text style={styles.fileName}>{selectedFile.name}</Text>
                  <TouchableOpacity onPress={() => setSelectedFile(null)}>
                    <MaterialIcons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity style={styles.exampleLink}>
                <Text style={styles.exampleLinkText}>Example format</Text>
                <MaterialIcons name="download" size={16} color="#FF0762" />
              </TouchableOpacity>
            </View>

            <View style={styles.guidelinesSection}>
              <Text style={styles.guidelinesTitle}>
                Follow the guidelines below to adapt an existing spreadsheet.
              </Text>

              <View style={styles.guidelineItem}>
                <MaterialIcons name="check-circle" size={20} color="#FF0762" />
                <Text style={styles.guidelineText}>Only CSV format is accepted.</Text>
              </View>

              <View style={styles.guidelineItem}>
                <MaterialIcons name="check-circle" size={20} color="#FF0762" />
                <Text style={styles.guidelineText}>Maximum file size: 5 MB.</Text>
              </View>

              <View style={styles.guidelineItem}>
                <MaterialIcons name="check-circle" size={20} color="#FF0762" />
                <Text style={styles.guidelineText}>
                  Ensure the file has clear column headers (e.g., First Name, Last Name, Email, Phone).
                </Text>
              </View>

              <View style={styles.guidelineItem}>
                <MaterialIcons name="check-circle" size={20} color="#FF0762" />
                <Text style={styles.guidelineText}>
                  Do not include duplicate entries — our system will auto-detect duplicates.
                </Text>
              </View>

              <View style={styles.guidelineItem}>
                <MaterialIcons name="check-circle" size={20} color="#FF0762" />
                <Text style={styles.guidelineText}>
                  You can edit or add guests manually after upload.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} disabled={loading || !selectedFile}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.uploadBtnText}>Upload</Text>
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
    marginTop: 0,
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
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

  uploadSection: {
    marginBottom: 24,
  },

  uploadLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },

  filePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },

  filePickerText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },

  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF0F6',
    borderRadius: 8,
  },

  fileName: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },

  exampleLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },

  exampleLinkText: {
    fontSize: 14,
    color: '#FF0762',
    fontWeight: '600',
  },

  guidelinesSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
  },

  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },

  guidelineItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
  },

  guidelineText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
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

  uploadBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#FF0762',
    alignItems: 'center',
  },

  uploadBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  csvInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
});

export default CSVImportModal;
