import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ListRenderItem,
  RefreshControl,
} from 'react-native';
import HomeHeader from '../../components/Layout/HomeHeader';
import NoDataComponent from '../../components/Global/NoDataComponent';
import MaterialIcons from '@react-native-vector-icons/material-icons';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  type: 'message' | 'appointment' | 'update';
  createdAt: string; // ISO date
  read: boolean;
};

const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Message',
    description: 'You received a new message from Admin.',
    type: 'message',
    createdAt: '2026-01-29T10:15:00',
    read: false,
  },
  {
    id: '2',
    title: 'Appointment Confirmed',
    description: 'Your appointment is confirmed for tomorrow.',
    type: 'appointment',
    createdAt: '2026-01-29T09:00:00',
    read: true,
  },
  {
    id: '3',
    title: 'Update Available',
    description: 'A new version of the app is available.',
    type: 'update',
    createdAt: '2026-01-28T18:30:00',
    read: true,
  },
  {
    id: '4',
    title: 'New Message',
    description: 'You received a new message from Admin.',
    type: 'message',
    createdAt: '2026-01-29T10:15:00',
    read: false,
  },
  {
    id: '5',
    title: 'Appointment Confirmed',
    description: 'Your appointment is confirmed for tomorrow.',
    type: 'appointment',
    createdAt: '2026-01-29T09:00:00',
    read: true,
  },
  {
    id: '6',
    title: 'Update Available',
    description: 'A new version of the app is available.',
    type: 'update',
    createdAt: '2026-01-28T18:30:00',
    read: true,
  },
  {
    id: '7',
    title: 'New Message',
    description: 'You received a new message from Admin.',
    type: 'message',
    createdAt: '2026-01-29T10:15:00',
    read: false,
  },
  {
    id: '8',
    title: 'Appointment Confirmed',
    description: 'Your appointment is confirmed for tomorrow.',
    type: 'appointment',
    createdAt: '2026-01-29T09:00:00',
    read: true,
  },
  {
    id: '9',
    title: 'Update Available',
    description: 'A new version of the app is available.',
    type: 'update',
    createdAt: '2026-01-28T18:30:00',
    read: true,
  },
];



const formatDateTime = (date: string) => {
  const d = new Date(date);

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  }) + ' • ' +
  d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const NotificationScreen: React.FC = ({ navigation }: any) => {

    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    

    const renderItem: ListRenderItem<NotificationItem> = ({ item }) => {

      return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.notificationCard,
              !item.read && styles.unreadCard,
            ]}
          >
            
          {!item.read ? (
            <View style={styles.iconWrapper}></View>
          ):(
            <View style={{ width: 7, height: 7, marginRight: 12, marginTop: 7 }} />
          )}

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                !item.read && styles.unreadTitle,
              ]}
            >
              {item.title}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>

            <Text style={styles.dateTime}>
              {formatDateTime(item.createdAt)}
            </Text>
          </View>

        </TouchableOpacity>
      );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // await fetchCardsList(1);
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>

            <HomeHeader navigation={navigation} showCategories={false} isCategories={false} isBackButton={true}/>

            <View style={{ paddingHorizontal: 20, paddingBottom: 10, paddingTop: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#333' }}>Notifications</Text>
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.emptyContainer}
                ListEmptyComponent={
                <NoDataComponent 
                icon="notifications-active" 
                text="No notifications found."
                />
                }

                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }

                ListFooterComponent={
                    loadingMore ? <Text style={{ textAlign: 'center' }}>Loading...</Text> : null
                }
            />
        </View>
    );
};

export default NotificationScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F9',
  },

  notificationCard: {
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBlockColor: '#eaeaea',
    borderBottomWidth: 1,
  },

  unreadCard: {
    backgroundColor: '#ffffff',
  },

  textContainer: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },

  unreadTitle: {
    color: '#000',
  },

  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  time: {
    fontSize: 12,
    color: '#999',
  },

  emptyContainer: {
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 16,
    color: '#999',
  },

  iconWrapper: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: '#FF0762',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 7,
  },

  dateTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },

});
