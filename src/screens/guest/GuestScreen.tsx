import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../../components/Layout/HomeHeader';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import protectedApi from '../../services/protectedApi';
import Toast from 'react-native-toast-message';
import GuestModal from '../../components/Global/GuestModal';
import CSVImportModal from '../../components/Global/CSVImportModal';

const GuestScreen = ({ navigation }: any) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [guests, setGuests] = useState([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await protectedApi.getAllGuests();

      if (response?.success && response?.data) {
        setGuests(response?.data?.contacts || []);
        setSummary(response?.data?.summary || null);
      } else {
        console.error('Failed to fetch guests:', response?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGuests();
    setRefreshing(false);
  };

  const toggleSelectAll = () => {
    if (selectedGuests.length === guests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(guests.map((g: any) => g._id));
    }
  };

  const toggleGuestSelection = (guestId: string) => {
    if (selectedGuests.includes(guestId)) {
      setSelectedGuests(selectedGuests.filter(id => id !== guestId));
    } else {
      setSelectedGuests([...selectedGuests, guestId]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedGuests.length === 0) return;

    Alert.alert(
      'Delete Guests',
      `Are you sure you want to delete ${selectedGuests.length} guest(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await protectedApi.deleteMultipleContacts({ contactIds: selectedGuests });
              
              if (response?.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: `${selectedGuests.length} guest(s) deleted successfully`,
                });
                setSelectedGuests([]);
                await fetchGuests();
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: response?.message || 'Failed to delete guests',
                });
              }
            } catch (error) {
              console.error('Error deleting guests:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete guests',
              });
            }
          },
        },
      ]
    );
  };

  const handleDeleteSingle = (guestId: string) => {
    Alert.alert(
      'Delete Guest',
      'Are you sure you want to delete this guest?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await protectedApi.deleteMultipleContacts({ contactIds: [guestId] });
              
              if (response?.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Guest deleted successfully',
                });
                await fetchGuests();
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: response?.message || 'Failed to delete guest',
                });
              }
            } catch (error) {
              console.error('Error deleting guest:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete guest',
              });
            }
          },
        },
      ]
    );
  };


  return (
    <LinearGradient colors={['#F8F8F9', '#F8F8F9']} style={styles.container}>
      
      <HomeHeader navigation={navigation} showCategories={false} isCategories={false} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        scrollEventThrottle={10}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF0762']}
            tintColor="#FF0762"
          />
        }
      >

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF0762" />
            <Text style={styles.loaderText}>Loading guests...</Text>
          </View>
        ) : (
          <>

            <View style={styles.content}>
              <Text style={styles.title}>Guest Management</Text>
      
              <View style={styles.statsCard}>

                <View style={styles.headerRow}>
                  <View style={styles.totalGuestsSection}>
                    <View style={styles.iconCircle}>
                      <MaterialIcons name="groups" size={24} color="#FF0762" />
                    </View>
                    <View>
                      <Text style={styles.totalGuestsNumber}>{summary?.totalContacts || 0}</Text>
                      <Text style={styles.totalGuestsLabel}>Total Guests</Text>
                    </View>
                  </View>

                  <View>
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => setShowAddMenu(!showAddMenu)}
                    >
                      <Text style={styles.addBtnText}>Add Guest</Text>
                      <MaterialIcons
                        name={showAddMenu ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={20}
                        color="#fff"
                      />
                    </TouchableOpacity>

                    {showAddMenu && (
                      <View style={styles.dropdown}>
                        <TouchableOpacity 
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedGuest(null);
                            setShowModal(true);
                            setShowAddMenu(false);
                          }}
                        >
                          <MaterialIcons name="person-add" size={18} color="#FF0762" />
                          <Text style={styles.dropdownText}>Add Guest Manually</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={styles.dropdownItem}
                          onPress={() => {
                            setShowCSVModal(true);
                            setShowAddMenu(false);
                          }}
                        >
                          <MaterialIcons name="upload-file" size={18} color="#FF0762" />
                          <Text style={styles.dropdownText}>Import CSV File</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.statsSubtitle}>Missing Information</Text>

                <View style={styles.statBadges}>
                  <View style={[styles.badge, styles.badgeOrange]}>
                    <View style={styles.badgeContent}>
                      <Text style={styles.badgeNumber}>{(summary?.totalContacts - summary?.hasEmail) || 0}</Text>
                      <Text style={styles.badgeLabel}>Email</Text>
                    </View>
                  </View>

                  <View style={[styles.badge, styles.badgeBlue]}>
                    <View style={styles.badgeContent}>
                      <Text style={styles.badgeNumber}>{(summary?.totalContacts - summary?.hasAddress) || 0}</Text>
                      <Text style={styles.badgeLabel}>Address</Text>
                    </View>
                  </View>

                  <View style={[styles.badge, styles.badgeGreen]}>
                    <View style={styles.badgeContent}>
                      <Text style={styles.badgeNumber}>{(summary?.totalContacts - summary?.hasPhone) || 0}</Text>
                      <Text style={styles.badgeLabel}>Phone</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.content}>
              <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Guest list</Text>
                <TouchableOpacity style={styles.inviteBtn}>
                  <Text style={styles.inviteText}>Invite Guest</Text>
                </TouchableOpacity>
              </View>
            
              <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                  <MaterialIcons name="search" size={20} color="#999" />
                  <TextInput
                    placeholder="Search guests by name, email, phone..."
                    style={styles.searchInput}
                  />
                </View>

                <TouchableOpacity style={styles.filterBtn}>
                  <MaterialIcons name="filter-list" size={22} color="#666" />
                </TouchableOpacity>
              </View>
            
              <View style={styles.selectRow}>
                <TouchableOpacity
                  style={[styles.checkbox, selectedGuests.length !== guests.length && styles.checkboxUnchecked]}
                  onPress={toggleSelectAll}
                >
                  {selectedGuests.length === guests.length && guests.length > 0 && <MaterialIcons name="check" size={14} color="#fff" />}
                </TouchableOpacity>

                <Text style={styles.selectText}>Select All</Text>

                {selectedGuests.length > 0 && (
                  <TouchableOpacity style={styles.deleteAllBtn} onPress={handleDeleteSelected}>
                    <Text style={styles.deleteAllText}>Delete ({selectedGuests.length})</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            
            <View style={styles.content}>
              {guests.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>
                  No guests found. Start by adding some!
                </Text>
              ) : (
                <>
                  {guests.map((guest: any) => (

                    <View key={guest._id} style={styles.guestCard}>
                      <View style={styles.cardHeader}>
                        <TouchableOpacity 
                          style={[styles.checkbox, !selectedGuests.includes(guest._id) && styles.checkboxUnchecked]}
                          onPress={() => toggleGuestSelection(guest._id)}
                        >
                          {selectedGuests.includes(guest._id) && <MaterialIcons name="check" size={14} color="#fff" />}
                        </TouchableOpacity>

                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>{guest.fullName?.charAt(0).toUpperCase()}</Text>
                        </View>

                        <View style={styles.guestMainInfo}>
                          <Text style={styles.guestName} numberOfLines={1}>{guest.fullName}</Text>
                          {guest.phone && (
                            <View style={styles.infoRow}>
                              <MaterialIcons name="call" size={14} color="#6B7280" />
                              <Text style={styles.guestDetail}>{guest.phone}</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.actionButtons}>
                          <TouchableOpacity 
                            style={styles.editBtn}
                            onPress={() => {
                              setSelectedGuest(guest);
                              setShowModal(true);
                            }}
                          >
                            <MaterialIcons name="edit" size={18} color="#828282" />
                          </TouchableOpacity>
                          <TouchableOpacity 
                            style={styles.deleteBtn}
                            onPress={() => handleDeleteSingle(guest._id)}
                          >
                            <MaterialIcons name="delete" size={18} color="#828282" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.cardDetails}>
                        
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Email</Text>
                            <View style={styles.detailValue}>
                              <MaterialIcons name="email" size={14} color="#6B7280" />
                              <Text style={styles.detailText} numberOfLines={1}>{guest.email || 'N/A'}</Text>
                            </View>
                          </View>
                        

                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Address</Text>
                            <View style={styles.detailValue}>
                              <MaterialIcons name="location-on" size={14} color="#6B7280" />
                              <Text style={styles.detailText} numberOfLines={1}>{guest.address || 'N/A'}</Text>
                            </View>
                          </View>
                        

                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Guest Type</Text>
                            <View style={styles.detailValue}>
                              <MaterialIcons name="person" size={14} color="#6B7280" />
                              <Text style={styles.detailText}>{guest.guestType || 'N/A'}</Text>
                            </View>
                          </View>
                        
                        
                          <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Dietary Preference</Text>
                            <View style={styles.detailValue}>
                              <MaterialIcons name="restaurant" size={14} color="#6B7280" />
                              <Text style={styles.detailText}>{guest.dietaryPreference || 'N/A'}</Text>
                            </View>
                          </View>
                      
                      </View>
                    </View>
                  ))}
                </>
              )}
            </View>

          </>
        )}

        
      </ScrollView>

      <GuestModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedGuest(null);
        }}
        onSuccess={fetchGuests}
        guest={selectedGuest}
      />

      <CSVImportModal
        visible={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        onSuccess={fetchGuests}
      />
    </LinearGradient>
  );
};


export default GuestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    // marginTop: 180,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  addBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF0762',
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    gap: 6,
  },

  addBtnText: { 
    color: '#fff', 
    fontWeight: '600' 
  },

  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 8,
    position: 'absolute',
    width: 200,
    zIndex: 10,
    right: 0,
    top: 40,
  },

  dropdownItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 10,
  },

  dropdownText: { fontSize: 14 },

  statsCard: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 18,
    borderRadius: 10,
    
  },

  totalGuestsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  totalGuestsNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    textTransform: 'capitalize',
  },

  totalGuestsLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: -2,
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 14,
  },

  statsSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  statBadges: {
    flexDirection: 'row',
    gap: 10,
  },

  badge: {
    flex: 1,
    flexDirection: 'column',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
  },

  badgeOrange: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },

  badgeBlue: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },

  badgeGreen: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },

  badgeContent: {
    alignItems: 'center',
  },

  badgeNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },

  badgeLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: { fontSize: 18, fontWeight: '700' },

  inviteBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF0762',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    gap: 6,
  },

  inviteText: { color: '#fff', fontWeight: '600' },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },

  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    flex: 1,
    height: 42,
  },

  searchInput: { flex: 1, marginLeft: 6 },

  filterBtn: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
  },

  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#FF0762',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0762',
  },

  checkboxUnchecked: {
    backgroundColor: 'transparent',
    borderColor: '#bebebe',
  },

  selectText: { 
    flex: 1,
    paddingVertical: 7,
  },

  deleteAllBtn: {
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#eaeaea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },

  deleteAllText: { 
    color: '#444444', 
    fontWeight: '600',
  },

  guestCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  guestMainInfo: {
    flex: 1,
    gap: 4,
  },

  cardDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  detailItem: {
    flex: 1,
    minWidth: '45%',
  },

  detailLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  detailText: {
    fontSize: 13,
    color: '#1F2937',
    flex: 1,
  },

  guestContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  guestHeader: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },

  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#FF0762',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  guestInfo: {
    flex: 1,
    gap: 6,
  },

  nameTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },

  guestName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },

  tag: {
    backgroundColor: '#FFF0F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },

  tagDiet: {
    backgroundColor: '#F0FDF4',
  },

  tagText: {
    fontSize: 10,
    color: '#FF0762',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  guestDetail: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },

  moreBtn: {
    padding: 4,
    alignItems: 'center',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 5,
  },

  editBtn: {
    padding: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
  },

  deleteBtn: {
    padding: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },

  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },

  guestSub: { fontSize: 12, color: '#555' },
  more: { textAlign: 'right', color: '#999' },

 
});