import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';

interface NotificationScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Registration Successful',
    description: 'Your investor account has been successfully created.',
    time: '24 Jun 2026 • 10:30 AM',
    icon: 'CHECK_CIRCLE',
    isRead: true,
  },
  {
    id: '2',
    title: 'PAN Verified',
    description: 'Your PAN details have been verified successfully.',
    time: '24 Jun 2026 • 11:15 AM',
    icon: 'SHIELD_CHECK',
    isRead: true,
  },
  {
    id: '3',
    title: 'KYC Documents Uploaded',
    description: 'Your Aadhaar documents have been received for verification.',
    time: '24 Jun 2026 • 11:45 AM',
    icon: 'DOCUMENT',
    isRead: true,
  },
  {
    id: '4',
    title: 'Verification In Progress',
    description: 'Your documents are currently being reviewed by our verification team.',
    time: '25 Jun 2026 • 09:10 AM',
    icon: 'CLOCK',
    isRead: false,
  },
  {
    id: '5',
    title: 'Application Approved',
    description: 'Congratulations! Your onboarding has been completed successfully and your investor account is now active.',
    time: '26 Jun 2026 • 02:00 PM',
    icon: 'SUCCESS_BADGE',
    isRead: false,
  },
];

const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    // TODO: Connect to backend API to fetch real investor notifications in the future.
    // Example:
    // setRefreshing(true);
    // try {
    //   const data = await fetchNotificationsApi();
    //   setNotifications(data);
    // } catch (err) {
    //   Alert.alert("Error", "Could not fetch updates.");
    // } finally {
    //   setRefreshing(false);
    // }

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setNotifications(INITIAL_NOTIFICATIONS);
    }, 1200);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all in-app notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'CHECK_CIRCLE':
        return (
          <View style={[styles.iconBg, { backgroundColor: '#DCFCE7', borderColor: '#BBF7D0' }]}>
            <Text style={[styles.iconEmoji, { color: '#16A34A' }]}>✓</Text>
          </View>
        );
      case 'SHIELD_CHECK':
        return (
          <View style={[styles.iconBg, { backgroundColor: '#DBEAFE', borderColor: '#BFDBFE' }]}>
            <Text style={[styles.iconEmoji, { color: '#2563EB' }]}>🛡️</Text>
          </View>
        );
      case 'DOCUMENT':
        return (
          <View style={[styles.iconBg, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
            <Text style={[styles.iconEmoji, { color: '#475569' }]}>📄</Text>
          </View>
        );
      case 'CLOCK':
        return (
          <View style={[styles.iconBg, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
            <Text style={[styles.iconEmoji, { color: '#D97706' }]}>⏳</Text>
          </View>
        );
      case 'SUCCESS_BADGE':
        return (
          <View style={[styles.iconBg, { backgroundColor: '#D1FAE5', borderColor: '#A7F3D0' }]}>
            <Text style={[styles.iconEmoji, { color: '#059669' }]}>🎉</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.iconBg, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
            <Text style={styles.iconEmoji}>🔔</Text>
          </View>
        );
    }
  };

  const renderReadBadge = (isRead: boolean) => {
    return (
      <View style={[styles.readBadge, isRead ? styles.readBadgeRead : styles.readBadgeUnread]}>
        <Text style={[styles.readBadgeText, isRead ? styles.readBadgeTextRead : styles.readBadgeTextUnread]}>
          {isRead ? 'Read' : 'New'}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.isRead && styles.unreadCard,
        ]}
        onPress={() => handleToggleRead(item.id)}
        activeOpacity={0.85}
        accessibilityRole="button"
      >
        <View style={styles.cardLayout}>
          {/* Status Icon */}
          {renderIcon(item.icon)}

          {/* Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.cardTitle, !item.isRead && styles.unreadTitleText]}>
                {item.title}
              </Text>
              {!item.isRead && <View style={styles.blueDot} />}
            </View>
            <Text style={styles.cardDesc}>{item.description}</Text>
            
            <View style={styles.cardFooterRow}>
              <Text style={styles.cardTime}>{item.time}</Text>
              {renderReadBadge(item.isRead)}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
        </View>
        <Text style={styles.emptyTitle}>No Notifications Yet</Text>
        <Text style={styles.emptyDesc}>
          You'll receive updates here whenever your onboarding status changes.
        </Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleRefresh}>
          <Text style={styles.resetButtonText}>Reset Mock Data</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalCount = notifications.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          {notifications.length > 0 && (
            <TouchableOpacity style={styles.clearAllBtn} onPress={handleClearAll}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          Stay updated with your onboarding and KYC application progress.
        </Text>
      </View>

      {/* Summary Card */}
      {notifications.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { borderColor: '#DBEAFE' }]}>
            <View style={[styles.summaryIconBg, { backgroundColor: '#EFF6FF' }]}>
              <Text style={{ fontSize: 14 }}>🔵</Text>
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLbl}>Unread Notifications</Text>
              <Text style={styles.summaryVal}>{unreadCount}</Text>
            </View>
          </View>

          <View style={[styles.summaryCard, { borderColor: '#E2E8F0' }]}>
            <View style={[styles.summaryIconBg, { backgroundColor: '#F1F5F9' }]}>
              <Text style={{ fontSize: 14 }}>📊</Text>
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryLbl}>Total Notifications</Text>
              <Text style={styles.summaryVal}>{totalCount}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Notifications List / Empty State */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.listEmptyStyle,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#2563EB"
            colors={['#2563EB']}
          />
        }
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 32 : 16,
    paddingBottom: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backArrow: {
    fontSize: 20,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  clearAllBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    marginHorizontal: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLbl: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  listEmptyStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  cardLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
  },
  unreadTitleText: {
    color: '#1E293B',
    fontWeight: '800',
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  readBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  readBadgeRead: {
    backgroundColor: '#F1F5F9',
  },
  readBadgeUnread: {
    backgroundColor: '#DBEAFE',
  },
  readBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  readBadgeTextRead: {
    color: '#64748B',
  },
  readBadgeTextUnread: {
    color: '#2563EB',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
});
