import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZsNtPJ845IT-meefXBG9F89J47I8mJC8",
    authDomain: "spark-fitness-2f0d5.firebaseapp.com",
    projectId: "spark-fitness-2f0d5",
    storageBucket: "spark-fitness-2f0d5.firebasestorage.app",
    messagingSenderId: "1064813394531",
    appId: "1:1064813394531:web:7404a67569d64eab4e5656"
    // Note: measurementId is not needed for React Native
};

// No need to initialize with config in React Native Firebase
// The initialization happens automatically when you put google-services.json in place

// Export the Firebase services you need
export const firebaseAuth = auth;
export const firebaseFirestore = firestore;