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

// TODO: Configure React Navigation in the project. Once configured, you can type props with:
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// or use the useNavigation hook.
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
  badge?: string;
  badgeType?: 'success' | 'warning' | 'info';
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Registration Successful',
    description: 'Your investor account has been created successfully.',
    time: '24 Jun 2026 • 10:30 AM',
    icon: '👤',
    badge: 'Success',
    badgeType: 'success',
    isRead: true,
  },
  {
    id: '2',
    title: 'PAN Verification Completed',
    description: 'Your PAN details have been verified successfully.',
    time: '24 Jun 2026 • 11:15 AM',
    icon: '✓',
    badge: 'Completed',
    badgeType: 'success',
    isRead: true,
  },
  {
    id: '3',
    title: 'KYC Documents Uploaded',
    description: 'Your Aadhaar documents have been received for verification.',
    time: '24 Jun 2026 • 11:45 AM',
    icon: '📤',
    badge: 'Uploaded',
    badgeType: 'info',
    isRead: true,
  },
  {
    id: '4',
    title: 'Verification In Progress',
    description: 'Our verification officer is reviewing your submitted documents.',
    time: '25 Jun 2026 • 09:15 AM',
    icon: '⏳',
    badge: 'In Progress',
    badgeType: 'warning',
    isRead: false,
  },
  {
    id: '5',
    title: 'Application Approved',
    description: 'Congratulations! Your onboarding has been completed successfully.',
    time: '26 Jun 2026 • 02:00 PM',
    icon: '🎉',
    badge: 'Approved',
    badgeType: 'success',
    isRead: false,
  },
];

const NotificationScreen: React.FC<NotificationScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    // TODO: Integrate actual API call here to fetch client notifications.
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

    // Simulate network pull-to-refresh
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setNotifications(INITIAL_NOTIFICATIONS);
    }, 1500);
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

  const renderBadge = (badge: string, type?: 'success' | 'warning' | 'info') => {
    let badgeStyle = styles.badgeInfo;
    let badgeTextStyle = styles.badgeTextInfo;

    if (type === 'success') {
      badgeStyle = styles.badgeSuccess;
      badgeTextStyle = styles.badgeTextSuccess;
    } else if (type === 'warning') {
      badgeStyle = styles.badgeWarning;
      badgeTextStyle = styles.badgeTextWarning;
    }

    return (
      <View style={[styles.badge, badgeStyle]}>
        <Text style={[styles.badgeText, badgeTextStyle]}>{badge}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
        onPress={() => handleToggleRead(item.id)}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <View style={styles.cardLayout}>
          {/* Status Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.statusIcon}>{item.icon}</Text>
            {!item.isRead && <View style={styles.unreadIndicator} />}
          </View>

          {/* Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.badge && renderBadge(item.badge, item.badgeType)}
            </View>
            <Text style={styles.cardDesc}>{item.description}</Text>
            <Text style={styles.cardTime}>{item.time}</Text>
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
    paddingBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    // Soft shadow
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
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
    // Soft shadow
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  cardLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 14,
    position: 'relative',
  },
  statusIcon: {
    fontSize: 18,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  detailsContainer: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
  },
  badgeTextSuccess: {
    color: '#16A34A',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  badgeTextWarning: {
    color: '#D97706',
  },
  badgeInfo: {
    backgroundColor: '#DBEAFE',
  },
  badgeTextInfo: {
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
