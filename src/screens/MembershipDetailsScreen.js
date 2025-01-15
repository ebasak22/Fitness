import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RazorpayCheckout from 'react-native-razorpay';

// Sample trainer data
const trainers = [
  {
    id: 1,
    name: 'John Smith',
    image: require('../assets/default-avatar.png'), // You'll need to add these images to your assets
    specialization: 'Strength & Conditioning',
    experience: '8 years',
    certifications: ['ACE Certified', 'CrossFit Level 2'],
    availableSlots: ['6:00 AM', '8:00 AM', '5:00 PM', '7:00 PM'],
    rating: 4.8,
    totalSessions: 1200,
    bio: 'Specializing in strength training and functional fitness, John has helped hundreds of clients achieve their fitness goals through personalized training programs.'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    image: require('../assets/default-avatar.png'), // You'll need to add these images to your assets
    specialization: 'Weight Loss & HIIT',
    experience: '6 years',
    certifications: ['NASM Certified', 'TRX Qualified'],
    availableSlots: ['7:00 AM', '9:00 AM', '4:00 PM', '6:00 PM'],
    rating: 4.9,
    totalSessions: 950,
    bio: 'Sarah is passionate about helping clients transform their lives through high-intensity interval training and proper nutrition guidance.'
  }
];

// ... [Previous membershipPlans array remains the same]

const MembershipDetailsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // ... [Previous useEffect and handlePayment functions remain the same]

  const handleBookSession = async (trainer, slot) => {
    try {
      const user = auth().currentUser;
      if (!user) {
        navigation.replace('Login');
        return;
      }
  
      setLoading(true);

      const userRef = firestore().collection('users').doc(user.phoneNumber);
    const ptSessionsRef = firestore().collection('ptSessions');


    const options = {
      description: `Personal Training Session with ${trainer.name}`,
      currency: 'INR',
      key: 'YOUR_RAZORPAY_KEY',
      amount: 500 * 100, // ₹500 per session
      name: 'SparkFitness',
      prefill: {
        email: userData?.email || '',
        contact: user.phoneNumber,
        name: userData?.name || ''
      },
      theme: { color: '#4CAF50' }
    };


      const data = await RazorpayCheckout.open(options);
      
      if (data.razorpay_payment_id) {
        // Start a batch write
        const batch = firestore().batch();
  
        // Create the PT session document
        const newSessionRef = ptSessionsRef.doc();
        batch.set(newSessionRef, {
          userId: user.phoneNumber,
          trainerId: trainer.id,
          trainerName: trainer.name,
          slot: slot,
          bookingDate: firestore.FieldValue.serverTimestamp(),
          sessionDate: new Date(), // You might want to add date selection
          status: 'scheduled',
          paymentId: data.razorpay_payment_id,
          amount: 500,
          paymentStatus: 'completed'
        });
  
        // Update user's sessions array
        batch.update(userRef, {
          'ptSessions': firestore.FieldValue.arrayUnion(newSessionRef.id)
        });
  
        // Commit the batch
        await batch.commit();
  
        Alert.alert(
          'Booking Successful',
          `Your session with ${trainer.name} has been scheduled for ${slot}.`
        );
        setSelectedSlot(null);
        setShowTrainerModal(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      let errorMessage = 'There was an error booking your session. Please try again.';
      
      // Handle specific error cases
      if (error.code === 'razorpay_cancelled') {
        errorMessage = 'Payment was cancelled. Please try again.';
      } else if (error.code === 'firestore/permission-denied') {
        errorMessage = 'You do not have permission to book sessions.';
      }
      
      Alert.alert('Booking Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Add a useEffect to fetch user data with proper cleanup
  useEffect(() => {
    let unsubscribe;
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          unsubscribe = firestore()
            .collection('users')
            .doc(user.phoneNumber)
            .onSnapshot(
              (doc) => {
                if (doc.exists) {
                  setUserData(doc.data());
                }
                setLoading(false);
              },
              (error) => {
                console.error('Firestore error:', error);
                setError(error.message);
                setLoading(false);
              }
            );
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchUserData();
  
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);
  const TrainerModal = ({ trainer, visible, onClose }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Image source={trainer.image} style={styles.trainerModalImage} />
            <Text style={styles.trainerModalName}>{trainer.name}</Text>
            <Text style={styles.trainerModalSpecialization}>{trainer.specialization}</Text>
            
            <View style={styles.trainerModalStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{trainer.experience}</Text>
                <Text style={styles.statLabel}>Experience</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{trainer.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{trainer.totalSessions}+</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.trainerBio}>{trainer.bio}</Text>

            <Text style={styles.sectionTitle}>Certifications</Text>
            {trainer.certifications.map((cert, index) => (
              <Text key={index} style={styles.certificationItem}>• {cert}</Text>
            ))}

            <Text style={styles.sectionTitle}>Available Slots</Text>
            <View style={styles.slotsContainer}>
              {trainer.availableSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.slotButton,
                    selectedSlot === slot && styles.selectedSlot
                  ]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text style={[
                    styles.slotText,
                    selectedSlot === slot && styles.selectedSlotText
                  ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.bookButton,
                !selectedSlot && styles.disabledButton
              ]}
              onPress={() => handleBookSession(trainer, selectedSlot)}
              disabled={!selectedSlot || loading}
            >
              <Text style={styles.bookButtonText}>
                {loading ? 'Processing...' : 'Book Session - ₹500'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // ... [Previous loading return statement remains the same]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership Plans</Text>
      </View>

      {/* ... [Previous error and current plan info sections remain the same] */}

      <ScrollView style={styles.scrollView}>
        {/* Membership Plans Section */}
        <Text style={styles.sectionHeader}>Choose Your Plan</Text>
        {membershipPlans.map((plan) => (
          <View 
            key={plan.id} 
            style={[styles.planCard, { backgroundColor: plan.color }]}
          >
            {/* ... [Previous plan card content remains the same] */}
          </View>
        ))}

        {/* Personal Training Section */}
        <Text style={styles.sectionHeader}>Personal Training</Text>
        <View style={styles.trainersContainer}>
          {trainers.map((trainer) => (
            <TouchableOpacity
              key={trainer.id}
              style={styles.trainerCard}
              onPress={() => {
                setSelectedTrainer(trainer);
                setShowTrainerModal(true);
              }}
            >
              <Image source={trainer.image} style={styles.trainerImage} />
              <Text style={styles.trainerName}>{trainer.name}</Text>
              <Text style={styles.trainerSpecialty}>{trainer.specialization}</Text>
              <View style={styles.trainerRating}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{trainer.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selectedTrainer && (
        <TrainerModal
          trainer={selectedTrainer}
          visible={showTrainerModal}
          onClose={() => {
            setShowTrainerModal(false);
            setSelectedTrainer(null);
            setSelectedSlot(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... [Previous styles remain the same]

  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 24,
    marginBottom: 16,
  },
  trainersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  trainerCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trainerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  trainerSpecialty: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  trainerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  trainerModalImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 16,
  },
  trainerModalName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  trainerModalSpecialization: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  trainerModalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  trainerBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  certificationItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    paddingLeft: 8,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  slotButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSlot: {
    backgroundColor: '#4CAF50',
  },
  slotText: {
    color: '#4CAF50',
    fontSize: 14,
  },
  selectedSlotText: {
    color: 'white',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
});

export default MembershipDetailsScreen;