import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MapPin, Phone, Mail, Clock } from 'lucide-react-native';

const ContactUsScreen = () => {
  const navigation = useNavigation();

  const handlePhoneCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const ContactCard = ({ icon: Icon, title, children }) => (
    <View style={styles.contactCard}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Icon size={24} color="#4f46e5" />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>{title}</Text>
          {children}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
   

      <ScrollView style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Get in Touch</Text>
          <Text style={styles.welcomeText}>
            We're here to help! Reach out to us through any of the following channels:
          </Text>
        </View>

        {/* Contact Cards */}
        <View style={styles.contactGrid}>
          <ContactCard icon={MapPin} title="Address">
            <Text style={styles.contactText}>
              76/b/9/3 Rai Mohan Banerjee Road, Kolkata-700108,{'\n'}
              West Bengal, India
            </Text>
          </ContactCard>

          <ContactCard icon={Phone} title="Phone">
            <View style={styles.phoneNumbers}>
              <TouchableOpacity onPress={() => handlePhoneCall('+919875699726')}>
                <Text style={styles.contactLink}>+91 98756 99726</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePhoneCall('+918282881185')}>
                <Text style={styles.contactLink}>+91 82828 81185</Text>
              </TouchableOpacity>
            </View>
          </ContactCard>

          <ContactCard icon={Mail} title="Email">
            <TouchableOpacity
              onPress={() => handleEmail('sparkfitness2022@gmail.com')}
            >
              <Text style={styles.contactLink}>sparkfitness2022@gmail.com</Text>
            </TouchableOpacity>
          </ContactCard>

          <ContactCard icon={Clock} title="Business Hours">
            <View style={styles.businessHours}>
              <Text style={styles.contactText}>Monday - Saturday:</Text>
              <Text style={styles.hours}>6:00 AM - 10:00 PM</Text>
            </View>
          </ContactCard>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#7c3aed',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 16,
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 32,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    backgroundColor: '#4f46e5',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 24,
  },
  contactGrid: {
    gap: 16,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 16,
  },
  iconContainer: {
    padding: 12,
    backgroundColor: '#eef2ff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  contactText: {
    color: '#4b5563',
    lineHeight: 24,
  },
  contactLink: {
    color: '#4f46e5',
    lineHeight: 24,
  },
  phoneNumbers: {
    gap: 8,
  },
  businessHours: {
    gap: 4,
  },
  hours: {
    color: '#4b5563',
    fontWeight: '500',
    lineHeight: 24,
  },
});

export default ContactUsScreen;