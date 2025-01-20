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
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const RefundPolicyScreen = () => {
  const navigation = useNavigation();

  const openEmail = () => {
    Linking.openURL('mailto:sparkfitness2022@gmail.com');
  };

  const openPhone = () => {
    Linking.openURL('tel:+919875699726');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
    

      {/* Main content */}
      <ScrollView style={styles.content}>
        <Text style={styles.updatedDate}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>1. Membership Refund Policy</Text>
          <Text style={styles.sectionText}>
            SparkFitness is committed to providing a fair and transparent refund policy 
            for our membership services.
          </Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>2. Cancellation & Refund Terms</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Monthly memberships can be canceled at any time.</Text>
            <Text style={styles.bulletItem}>• Annual memberships are eligible for a pro-rated refund within 30 days of purchase.</Text>
            <Text style={styles.bulletItem}>• One-time initiation fees are non-refundable.</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>3. Refund Process</Text>
          <Text style={styles.sectionText}>
            To request a refund, please contact our customer support team with your 
            membership details and reason for cancellation.
          </Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>4. Exceptions</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• No refunds will be issued after 30 days of membership purchase.</Text>
            <Text style={styles.bulletItem}>• Partial month refunds are not provided.</Text>
            <Text style={styles.bulletItem}>• Special promotional or discounted memberships may have different refund terms.</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>5. Payment Method</Text>
          <Text style={styles.sectionText}>
            Refunds will be processed to the original method of payment within 5-10 
            business days of approval.
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <Text style={styles.contactText}>For any refund-related queries, please contact:</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
            <Icon name="mail" size={20} color="#6b46c1" />
            <Text style={styles.contactLink}>sparkfitness2022@gmail.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem} onPress={openPhone}>
            <Icon name="phone" size={20} color="#6b46c1" />
            <Text style={styles.contactText}>+91 98756 99726, +91 82828 81185</Text>
          </TouchableOpacity>
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
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  updatedDate: {
    fontSize: 14,
    color: '#718096',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 24,
  },
  contentSection: {
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
  bulletList: {
    marginTop: 8,
  },
  bulletItem: {
    fontSize: 16,
    color: '#718096',
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 8,
  },
  contactSection: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 24,
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactLink: {
    fontSize: 16,
    color: '#6b46c1',
    marginLeft: 12,
    textDecorationLine: 'underline',
  },
});

export default RefundPolicyScreen;