import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';

interface DashboardScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
}

interface ActionCardProps {
  title: string;
  icon: string;
  onPress: () => void;
  badge?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, icon, onPress, badge }) => {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.actionIconContainer}>
        <Text style={styles.actionIcon}>{icon}</Text>
        {badge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  // TODO: Fetch onboarding status, progress, and user details dynamically from backend API in the future.
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.name}>Darshini</Text>
            <Text style={styles.subtitle}>Welcome to your Mutual Fund Investor Portal.</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>D</Text>
          </View>
        </View>

        {/* Welcome Onboarding Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Investor Onboarding</Text>
          <Text style={styles.welcomeDesc}>
            Complete your KYC process to activate your investor account.
          </Text>
          
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '75%' }]} />
            </View>
            <Text style={styles.progressText}>75% Complete</Text>
          </View>
        </View>

        {/* Quick Actions Title */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* 2x2 Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <ActionCard
              title="PAN Verification"
              icon="💳"
              onPress={() => navigation?.navigate('PanScreen')}
            />
            <ActionCard
              title="Upload KYC"
              icon="📤"
              onPress={() => navigation?.navigate('UploadKycScreen')}
            />
          </View>
          <View style={styles.gridRow}>
            <ActionCard
              title="Application Status"
              icon="📋"
              onPress={() => navigation?.navigate('StatusScreen')}
            />
            <ActionCard
              title="Notifications"
              icon="🔔"
              badge="2 New"
              onPress={() => navigation?.navigate('NotificationScreen')}
            />
          </View>
        </View>

        {/* Recent Update Card */}
        <View style={styles.updateCard}>
          <Text style={styles.updateHeader}>Latest Update</Text>
          <Text style={styles.updateDesc}>
            "Your KYC documents have been submitted successfully and are currently under review."
          </Text>
        </View>

        {/* Bottom Section - Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            // TODO: Clear local user tokens/session here in the future
            navigation?.navigate('Login');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 32 : 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  welcomeDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 14,
  },
  gridContainer: {
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  badgeContainer: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#2563EB',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  updateCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 28,
  },
  updateHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 6,
  },
  updateDesc: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  logoutButton: {
    borderWidth: 1.5,
    borderColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
