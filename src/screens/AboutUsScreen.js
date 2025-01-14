import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AboutUsScreen = () => {
  const navigation = useNavigation();

  const ValueCard = ({ icon, title, description }) => (
    <View style={styles.valueCard}>
      <View style={styles.valueContent}>
        <Ionicons name={icon} size={20} color="#4f46e5" style={styles.valueIcon} />
        <View style={styles.valueDetails}>
          <Text style={styles.valueTitle}>{title}</Text>
          <Text style={styles.valueDescription}>{description}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to SparkFitness</Text>
          <Text style={styles.welcomeText}>
            SparkFitness is dedicated to helping individuals achieve their fitness goals through 
            personalized training programs, expert guidance, and state-of-the-art facilities.
          </Text>
        </View>

        {/* Mission Section */}
        <View style={styles.missionSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness" size={24} color="#4f46e5" />
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.sectionText}>
            To inspire and empower people to lead healthier lives through fitness education, 
            personalized training, and a supportive community environment.
          </Text>
        </View>

        {/* Values Section */}
        <View style={styles.valuesSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={24} color="#4f46e5" />
            <Text style={styles.sectionTitle}>Our Values</Text>
          </View>
          
          <View style={styles.valuesGrid}>
            <ValueCard
              icon="star"
              title="Excellence in Training"
              description="Delivering top-tier fitness instruction and guidance."
            />
            
            <ValueCard
              icon="people"
              title="Personalized Attention"
              description="Tailored programs for each member's unique journey."
            />
            
            <ValueCard
              icon="people-circle"
              title="Community Support"
              description="Building a motivating and supportive fitness family."
            />
            
            <ValueCard
              icon="bulb"
              title="Continuous Innovation"
              description="Staying ahead with modern fitness programs."
            />
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
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: '#4f46e5',
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 24,
  },
  missionSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  valuesSection: {
    backgroundColor: '#ffffff',
    padding: 24,
  },
  valuesGrid: {
    marginTop: 16,
  },
  valueCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  valueContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  valueIcon: {
    marginTop: 4,
    marginRight: 12,
  },
  valueDetails: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  valueDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});

export default AboutUsScreen;