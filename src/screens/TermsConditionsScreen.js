import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const TermsConditionsScreen = () => {
  const navigation = useNavigation();

  const sections = [
    {
      title: '1. Membership Terms',
      content:
        'By purchasing a membership, you agree to follow all gym rules and regulations. Membership is non-transferable and subject to termination for violation of rules.',
    },
    {
      title: '2. Payment Terms',
      content:
        'Members agree to pay all fees associated with their chosen membership plan. Payments are processed securely through our payment gateway.',
    },
    {
      title: '3. Facility Usage',
      content:
        'Members must use equipment properly and follow gym etiquette. SparkFitness reserves the right to deny access to anyone violating these terms.',
    },
    {
      title: '4. Health & Safety',
      content:
        'Members are responsible for their own health and safety. Consult a physician before starting any exercise program.',
    },
    {
      title: '5. Membership Cancellation',
      content:
        'Cancellation policies vary by membership type. Refer to our Refund Policy for detailed information.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="#4a5568" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.contentHeader}>
          <Text style={styles.updatedDate}>
            Last updated: {new Date().toLocaleDateString('en-GB')}
          </Text>
        </View>

        <View style={styles.contentSections}>
          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionText}>{section.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#7c3aed',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 40, // Compensate for back button to center title
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#718096',
  },
});

export default TermsConditionsScreen;