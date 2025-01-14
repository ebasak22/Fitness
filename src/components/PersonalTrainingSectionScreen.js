import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';

const trainers = [
  {
    id: 1,
    name: "Alex Johnson",
    experience: "8+ years",
    specialization: "Strength Training, HIIT, Weight Loss",
    certifications: ["ACE Certified Personal Trainer", "NASM Performance Enhancement Specialist"],
    bio: "Alex specializes in strength training and high-intensity workouts. With 8+ years of experience, he has helped hundreds of clients achieve their fitness goals through personalized training programs.",
    achievements: "Helped over 200 clients achieve their fitness goals, Former college athlete"
  },
  {
    id: 2,
    name: "Sarah Chen",
    experience: "6+ years",
    specialization: "Functional Training, Yoga, Nutrition",
    certifications: ["ISSA Certified Fitness Trainer", "RYT-200 Yoga Instructor"],
    bio: "Sarah combines functional training with holistic wellness approaches. Her expertise in nutrition and yoga helps clients achieve balanced, sustainable results.",
    achievements: "Featured in Fitness Magazine, Successfully trained 150+ clients"
  }
];

const TrainerModal = ({ visible, trainer, onClose }) => {
  if (!trainer) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>{trainer.name}</Text>
            
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Experience</Text>
              <Text style={styles.sectionText}>{trainer.experience}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Specialization</Text>
              <Text style={styles.sectionText}>{trainer.specialization}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {trainer.certifications.map((cert, index) => (
                <Text key={index} style={styles.sectionText}>• {cert}</Text>
              ))}
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <Text style={styles.sectionText}>{trainer.bio}</Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <Text style={styles.sectionText}>{trainer.achievements}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const PersonalTrainingSectionScreen = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [sessions, setSessions] = useState(1);
  
  const handleSessionChange = (change) => {
    setSessions(prev => Math.max(1, prev + change));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Training Sessions</Text>
      
      <View style={styles.trainersGrid}>
        {trainers.map(trainer => (
          <TouchableOpacity
            key={trainer.id}
            style={styles.trainerCard}
            onPress={() => setSelectedTrainer(trainer)}
          >
            <View style={styles.trainerHeader}>
              <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.trainerImage}
              />
              <View style={styles.trainerInfo}>
                <Text style={styles.trainerName}>{trainer.name}</Text>
                <Text style={styles.trainerSpecialization}>{trainer.specialization}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TrainerModal
        visible={!!selectedTrainer}
        trainer={selectedTrainer}
        onClose={() => setSelectedTrainer(null)}
      />

      <View style={styles.bookingSection}>
        <Text style={styles.bookingTitle}>Book Training Sessions</Text>
        
        <View style={styles.sessionCounter}>
          <View style={styles.counterControls}>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => handleSessionChange(-1)}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.sessionCount}>{sessions} Sessions</Text>
            
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => handleSessionChange(1)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Price per session</Text>
            <Text style={styles.price}>₹500</Text>
          </View>
        </View>
        
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>₹{(sessions * 500).toLocaleString()}</Text>
          </View>
          
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Sessions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  trainersGrid: {
    marginBottom: 24,
  },
  trainerCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  trainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trainerImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  trainerSpecialization: {
    fontSize: 14,
    color: '#666',
  },
  bookingSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sessionCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  sessionCount: {
    fontSize: 18,
    fontWeight: '500',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PersonalTrainingSectionScreen;