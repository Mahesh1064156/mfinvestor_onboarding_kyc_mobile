import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

// TODO: Configure React Navigation in the project. Once configured, you can type props with:
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// or use the useNavigation hook.
interface PanScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
}

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const PanScreen: React.FC<PanScreenProps> = ({ navigation }) => {
  const [pan, setPan] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // For future API loading state

  const isValid = PAN_REGEX.test(pan);

  // Show validation feedback dynamically
  // If the user has entered exactly 10 characters, validate complete input.
  const showValidationError = pan.length === 10 && !isValid;
  const showValidationSuccess = pan.length === 10 && isValid;

  const handlePanChange = (text: string) => {
    // Automatically convert input to uppercase and strip non-alphanumeric characters
    const formattedText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setPan(formattedText);
  };

  const handleContinue = async () => {
    if (!isValid) return;

    // TODO: Integrate backend API call to verify PAN details.
    // Example:
    // setIsVerifying(true);
    // try {
    //   await verifyPanWithService(pan);
    //   navigation?.navigate('UploadKycScreen');
    // } catch (err) {
    //   Alert.alert('Verification Failed', err.message);
    // } finally {
    //   setIsVerifying(false);
    // }

    // Local validation passes, proceed to the next KYC step
    if (navigation) {
      navigation.navigate('UploadKycScreen');
    } else {
      console.warn('Navigation is not yet configured. Redirecting to UploadKycScreen (TODO)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>PAN Verification</Text>
            <Text style={styles.subtitle}>
              Enter your Permanent Account Number to continue your KYC process.
            </Text>
          </View>

          {/* PAN Input Card */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>PAN Number</Text>
            <View
              style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused,
                showValidationError && styles.inputContainerError,
                showValidationSuccess && styles.inputContainerSuccess,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="ABCDE1234F"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={10}
                value={pan}
                onChangeText={handlePanChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                accessibilityLabel="Enter PAN Number"
              />
            </View>

            {/* Validation Feedback & Example */}
            {showValidationError && (
              <Text style={styles.errorText}>✗ Invalid PAN format (e.g., ABCDE1234F)</Text>
            )}
            {showValidationSuccess && (
              <Text style={styles.successText}>✓ Valid PAN format</Text>
            )}
            {!showValidationError && !showValidationSuccess && (
              <Text style={styles.helperText}>Example: ABCDE1234F</Text>
            )}
          </View>

          {/* Safety & Information Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why verify PAN?</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🔒</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoText}>
                  <Text style={styles.boldText}>Secure Verification: </Text>
                  Your PAN details are securely stored and processed with bank-grade encryption.
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📄</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoText}>
                  <Text style={styles.boldText}>Mandatory Step: </Text>
                  PAN is mandatory for all mutual fund investments per SEBI guidelines.
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>⚙️</Text>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoText}>
                  <Text style={styles.boldText}>Verification Status: </Text>
                  Verification status will be processed immediately upon submission.
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            disabled={!isValid || isVerifying}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isValid }}
          >
            {isVerifying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PanScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginTop: Platform.OS === 'android' ? 16 : 8,
    marginBottom: 24,
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
    padding: 20,
    marginBottom: 24,
    // Soft shadow for card
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputContainer: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  inputContainerFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
  },
  inputContainerError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputContainerSuccess: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: 2,
    padding: 0, // Reset default padding for android compatibility
  },
  helperText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
    marginTop: 8,
  },
  successText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#F0F7FF', // Soft light blue highlight
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '600',
  },
  button: {
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
  buttonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
