import React, { useState, useEffect } from 'react';
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
  DimensionValue,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { fetchKycStatusApi } from '../../services/kycService';

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
  const [kycData, setKycData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authContext = useAuth();
  const userId = authContext?.userId || null;

  const loadKycStatus = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setIsLoading(true);
    try {
      const activeUserId = userId || 1; // Fallback user ID for testing
      const response = await fetchKycStatusApi(activeUserId);
      if (response && response.kyc) {
        setKycData(response.kyc);
      }
    } catch (error) {
      console.log('Failed to fetch KYC status from backend:', error);
      // Keep kycData null if not submitted yet or server error
    } finally {
      if (showLoadingSpinner) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKycStatus();
  }, [userId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const activeUserId = userId || 1;
      const response = await fetchKycStatusApi(activeUserId);
      if (response && response.kyc) {
        setKycData(response.kyc);
      }
      Alert.alert(
        'Status Updated',
        'Successfully retrieved the latest status from the server.',
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        'Refresh Failed',
        err.error || err.message || 'Could not fetch updates from server.'
      );
    } finally {
      setIsRefreshing(false);
    }
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

  // Determine Dynamic Progress and Badge Details
  let progressWidth: DimensionValue = '25%';
  let progressPercent = '25%';
  let progressSubtext = 'Completed 1 of 4 steps';
  let badgeLabel = 'Not Submitted';
  let badgeBgColor = '#E2E8F0';
  let badgeTextColor = '#475569';
  let statusDescription =
    'Your application has not been submitted yet. Please complete PAN verification and upload your KYC documents.';

  if (kycData) {
    const kycStatus = kycData.kyc_status; // SUBMITTED, VERIFIED, REJECTED
    
    if (kycStatus === 'VERIFIED') {
      progressWidth = '100%';
      progressPercent = '100%';
      progressSubtext = 'Completed 4 of 4 steps';
      badgeLabel = 'Activated';
      badgeBgColor = '#DCFCE7';
      badgeTextColor = '#16A34A';
      statusDescription =
        'Your documents have been verified and your account is fully activated. You are ready to start investing!';
    } else if (kycStatus === 'SUBMITTED') {
      progressWidth = '75%';
      progressPercent = '75%';
      progressSubtext = 'Completed 3 of 4 steps';
      badgeLabel = 'Under Review';
      badgeBgColor = '#FEF3C7';
      badgeTextColor = '#D97706';
      statusDescription =
        'Your documents are currently being reviewed by our verification team. You will receive a notification once verification is complete.';
    } else if (kycStatus === 'REJECTED') {
      progressWidth = '50%';
      progressPercent = '50%';
      progressSubtext = 'Completed 2 of 4 steps (Rejected)';
      badgeLabel = 'Rejected';
      badgeBgColor = '#FEE2E2';
      badgeTextColor = '#DC2626';
      statusDescription =
        'Your KYC verification has been rejected. Please review your document uploads and verify your PAN details again.';
    }
  }

  // Dynamic Timeline Steps based on kycData
  const hasSubmittedKyc = !!kycData;
  const isKycVerified = kycData?.kyc_status === 'VERIFIED';
  const isKycSubmitted = kycData?.kyc_status === 'SUBMITTED';
  const isPanVerified = kycData?.pan_status === 'VERIFIED';
  const isPanPending = kycData?.pan_status === 'PENDING';

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
      description: isPanVerified
        ? 'Your Permanent Account Number has been successfully verified.'
        : isPanPending
        ? 'PAN verification check is pending backend validation.'
        : 'Your PAN details are pending verification.',
      timestamp: isPanVerified ? '24 Jun 2026 • 10:50 AM' : isPanPending ? 'Checking...' : 'Pending',
      status: isPanVerified ? 'completed' : isPanPending ? 'in_progress' : 'upcoming',
    },
    {
      id: 3,
      title: 'KYC Documents Uploaded',
      description: hasSubmittedKyc
        ? 'Aadhaar Card Front and Back documents successfully uploaded.'
        : 'Aadhaar Card Front/Back and PAN uploads are required.',
      timestamp: hasSubmittedKyc ? '24 Jun 2026 • 11:00 AM' : 'Pending',
      status: hasSubmittedKyc ? 'completed' : 'upcoming',
    },
    {
      id: 4,
      title: 'Verification In Progress',
      description: 'Our verification team is reviewing your documents.',
      timestamp: isKycVerified ? 'Verified' : isKycSubmitted ? 'In Progress' : 'Pending',
      status: isKycVerified ? 'completed' : isKycSubmitted ? 'in_progress' : 'upcoming',
    },
    {
      id: 5,
      title: 'Account Activated',
      description: 'Your investment account will be ready to purchase mutual funds.',
      timestamp: isKycVerified ? 'Activated' : 'Pending Verification',
      status: isKycVerified ? 'completed' : 'upcoming',
    },
  ];

  // Mock Recent Activity Data
  const recentActivities: ActivityItem[] = [
    {
      id: 1,
      title: hasSubmittedKyc ? 'Verification Started' : 'Onboarding Pending',
      description: hasSubmittedKyc
        ? 'Documents queued for verification review.'
        : 'Please submit your PAN details to get started.',
      time: hasSubmittedKyc ? '24 Jun 2026 • 11:05 AM' : 'Today',
      icon: '⏳',
    },
    {
      id: 2,
      title: 'KYC Documents Uploaded',
      description: hasSubmittedKyc
        ? 'Aadhaar documents added to your application profile.'
        : 'Aadhaar and PAN card documents not uploaded yet.',
      time: hasSubmittedKyc ? '24 Jun 2026 • 11:00 AM' : 'Pending',
      icon: '📤',
    },
    {
      id: 3,
      title: isPanVerified ? 'PAN Verified Successfully' : 'PAN Verification Initiated',
      description: isPanVerified ? 'PAN validation checks completed.' : 'Verification pending submission.',
      time: isPanVerified ? '24 Jun 2026 • 10:50 AM' : 'Pending',
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Fetching current application status...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.progressPercent}>{progressPercent}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressSubtext}>{progressSubtext}</Text>
        </View>

        {/* Current Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusCardHeader}>
            <Text style={styles.statusLabel}>Current Status</Text>
            <View style={[styles.badgeContainer, { backgroundColor: badgeBgColor }]}>
              <Text style={[styles.badgeText, { color: badgeTextColor }]}>{badgeLabel}</Text>
            </View>
          </View>
          <Text style={styles.statusDescription}>{statusDescription}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
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
    borderColor: '#E2E8F0',
    // Soft shadow
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
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
