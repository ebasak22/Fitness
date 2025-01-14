import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

function PaymentConfirmationScreen() {
  const route = useRoute();
  const { order_id, payment_id, amount } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payment Confirmation</Text>
      <Text style={styles.text}>Order ID: {order_id}</Text>
      <Text style={styles.text}>Payment ID: {payment_id}</Text>
      <Text style={styles.text}>Amount: ₹{amount / 100}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PaymentConfirmationScreen;