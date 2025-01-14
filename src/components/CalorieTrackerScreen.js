import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CalorieTrackerScreen = () => {
  const [calories, setCalories] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);

  const handleSubmit = () => {
    const caloriesNum = parseInt(calories, 10);
    if (!isNaN(caloriesNum)) {
      setTotalCalories(prevTotal => prevTotal + caloriesNum);
      setCalories('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputSection}>
        <Text style={styles.label}>Calories Consumed</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter calories"
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Track Calories</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.displaySection}>
        <Text style={styles.totalText}>
          <Text style={styles.bold}>Today's Total:</Text> {totalCalories} calories
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  displaySection: {
    marginTop: 20,
  },
  totalText: {
    fontSize: 16,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default CalorieTrackerScreen;