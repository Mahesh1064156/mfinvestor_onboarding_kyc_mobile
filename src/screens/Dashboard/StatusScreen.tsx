import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';

// TODO: Configure React Navigation in the project. Once configured, you can type props with:
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// or use the useNavigation hook.
interface StatusScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
}

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'upcoming';
}

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string;
}

const StatusScreen: React.FC<StatusScreenProps> = ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock Timeline Data
  const timelineData: TimelineStep[] = [
    {
      id: 1,
      title: 'Registration Completed',
      description: 'Your account was successfully created and verified.',
      timestamp: '24 Jun 2026 • 10:45 AM',
      status: 'completed',
    },
    {
      id: 2,
      title: 'PAN Verified',
      description: 'Your Permanent Account Number has been successfully verified.',
      timestamp: '24 Jun 2026 • 10:50 AM',
      status: 'completed',
    },
    {
      id: 3,
      title: 'KYC Documents Uploaded',
      description: 'Aadhaar Card Front and Back documents successfully uploaded.',
      timestamp: '24 Jun 2026 • 11:00 AM',
      status: 'completed',
    },
    {
      id: 4,
      title: 'Verification In Progress',
      description: 'Our verification team is reviewing your documents.',
      timestamp: '24 Jun 2026 • 11:05 AM',
      status: 'in_progress',
    },
    {
      id: 5,
      title: 'Account Activated',
      description: 'Your investment account will be ready to purchase mutual funds.',
      timestamp: 'Pending Verification',
      status: 'upcoming',
    },
  ];

  // Mock Recent Activity Data
  const recentActivities: ActivityItem[] = [
    {
      id: 1,
      title: 'Verification Started',
      description: 'Documents queued for verification review.',
      time: '24 Jun 2026 • 11:05 AM',
      icon: '⏳',
    },
    {
      id: 2,
      title: 'KYC Documents Uploaded',
      description: 'Aadhaar documents added to your application profile.',
      time: '24 Jun 2026 • 11:00 AM',
      icon: '📤',
    },
    {
      id: 3,
      title: 'PAN Verified Successfully',
      description: 'PAN validation checks completed.',
      time: '24 Jun 2026 • 10:50 AM',
      icon: '✓',
    },
    {
      id: 4,
      title: 'Registration Completed',
      description: 'New investor account initialized.',
      time: '24 Jun 2026 • 10:45 AM',
      icon: '👤',
    },
  ];

  const handleRefresh = () => {
    // TODO: Integrate actual API call here to fetch current KYC application status.
    // Example:
    // setIsRefreshing(true);
    // try {
    //   const updatedStatus = await fetchKycStatusApi();
    //   // update states...
    // } catch (err) {
    //   Alert.alert("Error", "Could not refresh status");
    // } finally {
    //   setIsRefreshing(false);
    // }

    // Simulating refresh interaction locally
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      Alert.alert('Status Updated', 'You are viewing the latest application status.', [
        { text: 'OK' },
      ]);
    }, 1500);
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@mutualfund.com').catch(() => {
      Alert.alert('Error', 'Unable to open mail client.');
    });
  };

  const handlePhoneSupport = () => {
    Linking.openURL('tel:1800-123-4567').catch(() => {
      Alert.alert('Error', 'Unable to open dialer.');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Application Status</Text>
          <Text style={styles.subtitle}>
            Track your onboarding and KYC verification progress.
          </Text>
        </View>

        {/* Progress Card */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Onboarding Progress</Text>
            <Text style={styles.progressPercent}>75%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.progressSubtext}>Completed 3 of 4 steps</Text>
        </View>

        {/* Current Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusCardHeader}>
            <Text style={styles.statusLabel}>Current Status</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Under Review</Text>
            </View>
          </View>
          <Text style={styles.statusDescription}>
            Your documents are currently being reviewed by our verification team. You will receive
            a notification once verification is complete.
          </Text>
        </View>

        {/* Estimated Processing Time Card */}
        <View style={styles.estimateCard}>
          <Text style={styles.estimateLabel}>Estimated Time</Text>
          <Text style={styles.estimateValue}>1–2 Business Days</Text>
        </View>

        {/* Verification Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Timeline</Text>
          <View style={styles.timelineContainer}>
            {timelineData.map((step, index) => {
              const isLast = index === timelineData.length - 1;
              let circleStyle = styles.timelineCircleUpcoming;
              let circleText = '';
              let textStyle = styles.timelineStepUpcoming;

              if (step.status === 'completed') {
                circleStyle = styles.timelineCircleCompleted;
                circleText = '✓';
                textStyle = styles.timelineStepCompleted;
              } else if (step.status === 'in_progress') {
                circleStyle = styles.timelineCircleInProgress;
                circleText = '⏳';
                textStyle = styles.timelineStepInProgress;
              }

              return (
                <View key={step.id} style={styles.timelineRow}>
                  {/* Timeline Left: Indicators and Connectors */}
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineCircle, circleStyle]}>
                      <Text style={styles.timelineCircleText}>{circleText}</Text>
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineConnector,
                          step.status === 'completed' && styles.timelineConnectorActive,
                        ]}
                      />
                    )}
                  </View>

                  {/* Timeline Right: Details */}
                  <View style={styles.timelineRight}>
                    <Text style={[styles.timelineStepTitle, textStyle]}>{step.title}</Text>
                    <Text style={styles.timelineStepDesc}>{step.description}</Text>
                    <Text style={styles.timelineStepTime}>{step.timestamp}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIconContainer}>
                  <Text style={styles.activityIcon}>{activity.icon}</Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDesc}>{activity.description}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Support Card */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportDesc}>
            If you have any questions regarding your onboarding, contact customer support.
          </Text>

          <View style={styles.supportActions}>
            <TouchableOpacity
              style={styles.supportLink}
              onPress={handleEmailSupport}
              accessibilityRole="button"
              accessibilityLabel="Email customer support"
            >
              <Text style={styles.supportLinkLabel}>Email:</Text>
              <Text style={styles.supportLinkValue}>support@mutualfund.com</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.supportLink}
              onPress={handlePhoneSupport}
              accessibilityRole="button"
              accessibilityLabel="Call customer support"
            >
              <Text style={styles.supportLinkLabel}>Phone:</Text>
              <Text style={styles.supportLinkValue}>1800-123-4567</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Refresh Button */}
        <TouchableOpacity
          style={[styles.refreshButton, isRefreshing && styles.refreshButtonDisabled]}
          disabled={isRefreshing}
          onPress={handleRefresh}
          accessibilityRole="button"
          accessibilityState={{ busy: isRefreshing }}
        >
          {isRefreshing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.refreshButtonText}>Refresh Status</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatusScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginTop: Platform.OS === 'android' ? 16 : 8,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    // Soft shadow for button
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Soft shadow
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  progressPercent: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    width: '100%',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    width: '75%', // 75% completion
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7', // Soft warning border
    // Soft shadow
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statusCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  badgeContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '700',
  },
  statusDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  estimateCard: {
    backgroundColor: '#EFF6FF', // Soft light blue
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  estimateLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  estimateValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },
  timelineContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    // Soft shadow
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 4,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
    marginRight: 12,
  },
  timelineCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  timelineCircleCompleted: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  timelineCircleInProgress: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  timelineCircleUpcoming: {
    borderColor: '#CBD5E1',
  },
  timelineCircleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineConnector: {
    position: 'absolute',
    top: 26,
    bottom: -16,
    left: 12,
    width: 2,
    backgroundColor: '#E2E8F0',
    zIndex: 1,
  },
  timelineConnectorActive: {
    backgroundColor: '#16A34A', // Connector turns green if previous step completed
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineStepTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  timelineStepCompleted: {
    color: '#16A34A',
  },
  timelineStepInProgress: {
    color: '#D97706',
  },
  timelineStepUpcoming: {
    color: '#64748B',
  },
  timelineStepDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 4,
  },
  timelineStepTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    // Soft shadow
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  supportDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  supportActions: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  supportLink: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
  },
  supportLinkLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    width: 60,
  },
  supportLinkValue: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '700',
  },
  refreshButton: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  refreshButtonDisabled: {
    backgroundColor: '#93C5FD',
    shadowOpacity: 0,
    elevation: 0,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
