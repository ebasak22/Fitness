import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const TrainerCard = ({ name, specialty, bio, image, certifications, socialLinks }) => (
  <View style={styles.trainerCard}>
    <Image
      source={image}
      style={styles.trainerImage}
      defaultSource={require('../assets/default-avatar.png')} // Make sure to add this image
    />
    <View style={styles.trainerInfo}>
      <Text style={styles.trainerName}>{name}</Text>
      <Text style={styles.trainerSpecialty}>{specialty}</Text>
      <Text style={styles.trainerBio}>{bio}</Text>
      
      {certifications && (
        <View style={styles.certificationBadges}>
          {certifications.map((cert, index) => (
            <View key={index} style={styles.certificationBadge}>
              <Text style={styles.certificationText}>{cert}</Text>
            </View>
          ))}
        </View>
      )}

      {socialLinks && (
        <View style={styles.socialLinks}>
          {socialLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.socialLink}
              onPress={() => Linking.openURL(link.url)}
            >
              <Ionicons name={link.icon} size={20} color="#6c757d" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  </View>
);

const AboutTrainers = () => {
  const trainers = [
    {
      name: 'John Doe',
      specialty: 'Strength Training & Conditioning',
      bio: 'Specialized in helping clients achieve their strength goals through personalized training programs.',
      image:require('../assets/default-avatar.png'), // Add your trainer images
      certifications: ['NASM CPT', 'CrossFit L2'],
      socialLinks: [
        { icon: 'logo-instagram', url: 'https://instagram.com' },
        { icon: 'logo-twitter', url: 'https://twitter.com' },
      ],
    },
    {
      name: 'Jane Smith',
      specialty: 'Cardio & HIIT Workouts',
      bio: 'Expert in designing high-intensity interval training programs for maximum results.',
      image: require('../assets/default-avatar.png'), // Add your trainer images
      certifications: ['ACE Certified', 'HIIT Specialist'],
      socialLinks: [
        { icon: 'logo-instagram', url: 'https://instagram.com' },
        { icon: 'logo-facebook', url: 'https://facebook.com' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.mainTitle}>Meet Our Trainers and Owners</Text>
        
        <Text style={styles.sectionTitle}>Trainers</Text>
        <View style={styles.trainersGrid}>
          {trainers.map((trainer, index) => (
            <TrainerCard key={index} {...trainer} />
          ))}
        </View>

        <View style={styles.ownersSection}>
          <Text style={styles.sectionTitle}>Owners</Text>
          <Text style={styles.ownerText}>
            Spark Fitness was founded by passionate fitness enthusiasts who believe in the 
            transformative power of a healthy lifestyle. Our owners are committed to providing 
            a community that inspires and empowers individuals to achieve their fitness aspirations.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0d6efd',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e9ecef',
  },
  trainersGrid: {
    gap: 20,
  },
  trainerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trainerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  trainerInfo: {
    padding: 20,
  },
  trainerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  trainerSpecialty: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 12,
  },
  trainerBio: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 12,
  },
  certificationBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  certificationBadge: {
    backgroundColor: '#e9ecef',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  certificationText: {
    fontSize: 12,
    color: '#495057',
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 15,
  },
  socialLink: {
    padding: 8,
  },
  ownersSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ownerText: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default AboutTrainers;