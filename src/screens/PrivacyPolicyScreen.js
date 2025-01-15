import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  SafeAreaView,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  const handleEmailPress = () => {
    Linking.openURL('mailto:privacy@sparkfitness.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
    
      {/* Main content */}
      <ScrollView style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.updatedDate}>
            Last updated: {new Date().toLocaleDateString('en-GB')}
          </Text>
        </View>

        <View style={styles.contentSections}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionText}>
              We collect information that you provide directly to us, including name,
              contact information, and fitness-related data.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionText}>
              Your information is used to provide and improve our services, communicate
              with you, and ensure a personalized fitness experience.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Information Security</Text>
            <Text style={styles.sectionText}>
              We implement appropriate security measures to protect your personal information
              against unauthorized access or disclosure.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Payment Information</Text>
            <Text style={styles.sectionText}>
              All payment transactions are processed through secure payment gateway providers.
              We don't store your payment card details on our servers.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Contact Us</Text>
            <Text style={styles.sectionText}>
              If you have any questions about our Privacy Policy, please contact us at{' '}
              <Text onPress={handleEmailPress} style={styles.emailLink}>
                privacy@sparkfitness.com
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7c3aed',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  placeholder: {
    width: 40, // Same width as back button for center alignment
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  updatedDate: {
    fontSize: 14,
    color: '#718096',
  },
  contentSections: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#718096',
    lineHeight: 24,
  },
  emailLink: {
    color: '#4a90e2',
    textDecorationLine: 'underline',
  },
});

export default PrivacyPolicyScreen;