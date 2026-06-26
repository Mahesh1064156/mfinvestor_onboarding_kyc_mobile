import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';

// TODO: Configure React Navigation in the project. Once configured, you can type props with:
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// or use the useNavigation hook.
interface UploadKycScreenProps {
  navigation?: {
    navigate: (screenName: string, params?: any) => void;
    goBack: () => void;
  };
}

const UploadKycScreen: React.FC<UploadKycScreenProps> = ({ navigation }) => {
  const [aadhaarFront, setAadhaarFront] = useState<string | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<string | null>(null);
  const [panCard, setPanCard] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // For future API spinner

  const isFormValid = !!(aadhaarFront && aadhaarBack);

  const simulateFilePicker = (docType: 'front' | 'back' | 'pan') => {
    const docName =
      docType === 'front'
        ? 'Aadhaar Front'
        : docType === 'back'
        ? 'Aadhaar Back'
        : 'PAN Card';

    // TODO: Replace this placeholder with actual document picker implementation.
    // E.g., using expo-document-picker or expo-image-picker:
    // const result = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
    // if (!result.canceled) { setDoc(result.assets[0].name); }

    Alert.alert(
      'Upload Document',
      `Would you like to simulate selecting a file for ${docName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Select File',
          onPress: () => {
            const mockExt = Math.random() > 0.3 ? 'jpg' : 'png';
            const mockName = `${docType === 'pan' ? 'pan' : 'aadhaar_' + docType}_img_${Math.floor(
              1000 + Math.random() * 9000
            )}.${mockExt}`;
            
            if (docType === 'front') {
              setAadhaarFront(mockName);
            } else if (docType === 'back') {
              setAadhaarBack(mockName);
            } else {
              setPanCard(mockName);
            }
          },
        },
      ]
    );
  };

  const handleClearFile = (docType: 'front' | 'back' | 'pan') => {
    if (docType === 'front') setAadhaarFront(null);
    else if (docType === 'back') setAadhaarBack(null);
    else setPanCard(null);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    // TODO: Integrate backend API call to upload document paths/blobs.
    // Example:
    // setIsSubmitting(true);
    // try {
    //   await uploadKycDocumentsApi({ aadhaarFront, aadhaarBack, panCard });
    //   navigation?.navigate('StatusScreen');
    // } catch (err) {
    //   Alert.alert('Submission Failed', err.message);
    // } finally {
    //   setIsSubmitting(false);
    // }

    if (navigation) {
      navigation.navigate('StatusScreen');
    } else {
      console.warn('Navigation is not yet configured. Redirecting to StatusScreen (TODO)');
      Alert.alert(
        'KYC Submitted',
        'Verification files processed locally. Navigation to StatusScreen is pending React Navigation configuration.',
        [{ text: 'OK' }]
      );
    }
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
          <Text style={styles.title}>Upload KYC Documents</Text>
          <Text style={styles.subtitle}>
            Upload the required identity documents to complete your KYC verification.
          </Text>
        </View>

        {/* Stepper Progress Indicator */}
        <View style={styles.stepperContainer}>
          <View style={styles.progressLineBg}>
            <View style={styles.progressLineActive} />
          </View>

          <View style={styles.stepsRow}>
            {/* Step 1: Registration */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
                <Text style={styles.stepCheckmark}>✓</Text>
              </View>
              <Text style={styles.stepLabelCompleted}>Register</Text>
            </View>

            {/* Step 2: PAN Verification */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCircleCompleted]}>
                <Text style={styles.stepCheckmark}>✓</Text>
              </View>
              <Text style={styles.stepLabelCompleted}>PAN</Text>
            </View>

            {/* Step 3: KYC Upload */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCircleActive]}>
                <Text style={styles.stepNumberActive}>3</Text>
              </View>
              <Text style={styles.stepLabelActive}>Upload</Text>
            </View>

            {/* Step 4: Verification Pending */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCircleUpcoming]}>
                <Text style={styles.stepNumberUpcoming}>4</Text>
              </View>
              <Text style={styles.stepLabelUpcoming}>Pending</Text>
            </View>
          </View>
        </View>

        {/* Upload Cards Section */}
        <View style={styles.section}>
          {/* Card 1: Aadhaar Front */}
          <View style={styles.uploadCard}>
            <View style={styles.uploadCardHeader}>
              <View style={styles.docIconContainer}>
                <Text style={styles.docIcon}>🆔</Text>
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>
                  Aadhaar Front <Text style={styles.requiredTag}>*</Text>
                </Text>
                {aadhaarFront ? (
                  <View style={styles.statusRow}>
                    <Text style={styles.statusTextSuccess}>✓ {aadhaarFront}</Text>
                    <TouchableOpacity onPress={() => handleClearFile('front')}>
                      <Text style={styles.clearBtnText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.statusTextPending}>No file selected</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.selectBtn, aadhaarFront && styles.selectBtnActive]}
              onPress={() => simulateFilePicker('front')}
              accessibilityRole="button"
            >
              <Text style={[styles.selectBtnText, aadhaarFront && styles.selectBtnTextActive]}>
                {aadhaarFront ? 'Change File' : 'Select File'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Card 2: Aadhaar Back */}
          <View style={styles.uploadCard}>
            <View style={styles.uploadCardHeader}>
              <View style={styles.docIconContainer}>
                <Text style={styles.docIcon}>📄</Text>
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>
                  Aadhaar Back <Text style={styles.requiredTag}>*</Text>
                </Text>
                {aadhaarBack ? (
                  <View style={styles.statusRow}>
                    <Text style={styles.statusTextSuccess}>✓ {aadhaarBack}</Text>
                    <TouchableOpacity onPress={() => handleClearFile('back')}>
                      <Text style={styles.clearBtnText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.statusTextPending}>No file selected</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.selectBtn, aadhaarBack && styles.selectBtnActive]}
              onPress={() => simulateFilePicker('back')}
              accessibilityRole="button"
            >
              <Text style={[styles.selectBtnText, aadhaarBack && styles.selectBtnTextActive]}>
                {aadhaarBack ? 'Change File' : 'Select File'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Card 3: PAN Card (Optional) */}
          <View style={styles.uploadCard}>
            <View style={styles.uploadCardHeader}>
              <View style={styles.docIconContainer}>
                <Text style={styles.docIcon}>📷</Text>
              </View>
              <View style={styles.docInfo}>
                <View style={styles.optionalHeaderRow}>
                  <Text style={styles.docTitle}>PAN Card</Text>
                  <Text style={styles.optionalTag}>Optional</Text>
                </View>
                {panCard ? (
                  <View style={styles.statusRow}>
                    <Text style={styles.statusTextSuccess}>✓ {panCard}</Text>
                    <TouchableOpacity onPress={() => handleClearFile('pan')}>
                      <Text style={styles.clearBtnText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.statusTextPending}>No file selected</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.selectBtn, panCard && styles.selectBtnActive]}
              onPress={() => simulateFilePicker('pan')}
              accessibilityRole="button"
            >
              <Text style={[styles.selectBtnText, panCard && styles.selectBtnTextActive]}>
                {panCard ? 'Change File' : 'Select File'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Safety & Constraints Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Requirements & Guidelines</Text>
          <View style={styles.infoLine}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.infoLabel}>Supported formats:</Text>
            <Text style={styles.infoVal}>JPG, PNG, PDF</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.infoLabel}>Maximum file size:</Text>
            <Text style={styles.infoVal}>5 MB per document</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.infoValFull}>
              Your identity documents are securely processed and stored using bank-grade encryption algorithms.
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
          disabled={!isFormValid || isSubmitting}
          onPress={handleSubmit}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isFormValid }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Documents</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadKycScreen;

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
  stepperContainer: {
    marginBottom: 28,
    position: 'relative',
  },
  progressLineBg: {
    position: 'absolute',
    top: 14,
    left: '12%',
    right: '12%',
    height: 3,
    backgroundColor: '#E2E8F0',
    zIndex: -1,
  },
  progressLineActive: {
    width: '66%', // Completes step 1 and 2, pointing to active step 3
    height: '100%',
    backgroundColor: '#10B981', // green line for completed progress
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  stepItem: {
    alignItems: 'center',
    width: '24%',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepCircleActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    // Active shadow halo effect
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  stepCircleUpcoming: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  stepCheckmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  stepNumberUpcoming: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  stepLabelCompleted: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 6,
  },
  stepLabelActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 6,
  },
  stepLabelUpcoming: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 6,
  },
  section: {
    marginBottom: 20,
  },
  uploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    // Soft shadow
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  uploadCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  docIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docIcon: {
    fontSize: 22,
  },
  docInfo: {
    flex: 1,
    marginLeft: 14,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  requiredTag: {
    color: '#EF4444',
  },
  optionalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionalTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusTextPending: {
    fontSize: 13,
    color: '#64748B',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 4,
  },
  statusTextSuccess: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  selectBtn: {
    height: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  selectBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  selectBtnTextActive: {
    color: '#2563EB',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginRight: 4,
  },
  infoVal: {
    fontSize: 13,
    color: '#64748B',
  },
  infoValFull: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    flex: 1,
  },
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
