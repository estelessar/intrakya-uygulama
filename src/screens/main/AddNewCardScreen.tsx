import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../../components/BottomNavigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';

type AddNewCardScreenNavigationProp = StackNavigationProp<MainStackParamList, 'AddNewCard'>;

const AddNewCardScreen = () => {
  const navigation = useNavigation<AddNewCardScreenNavigationProp>();
  const [cardName, setCardName] = useState('Jessica Smith');
  const [cardNumber, setCardNumber] = useState('2672 4789 1452 0890');
  const [expiryDate, setExpiryDate] = useState('07/26');
  const [cvv, setCvv] = useState('787');

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (text: string) => {
    const formatted = formatExpiryDate(text);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) {
      setCvv(cleaned);
    }
  };

  const maskCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.length >= 4) {
      const lastFour = cleaned.slice(-4);
      return '**** **** **** ' + lastFour;
    }
    return number;
  };

  const handleAddCard = () => {
    // Kart ekleme işlemi
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Kart Ekle</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.divider} />

      {/* Card Preview */}
      <View style={styles.cardPreviewContainer}>
        <View style={styles.cardPreview}>
          <Text style={styles.visaLogo}>VISA</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardNumberPreview}>{maskCardNumber(cardNumber)}</Text>
            <View style={styles.cardBottomRow}>
              <Text style={styles.cardNamePreview}>{cardName.toUpperCase()}</Text>
              <Text style={styles.cardExpiryPreview}>{expiryDate}</Text>
              <Text style={styles.cardCvvPreview}>**{cvv.slice(-1)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Card Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>KART SAHİBİ</Text>
          <TextInput
            style={styles.textInput}
            value={cardName}
            onChangeText={setCardName}
            placeholder="Jessica Smith"
            placeholderTextColor="#999999"
          />
        </View>

        {/* Card Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>KART NUMARASI</Text>
          <TextInput
            style={styles.textInput}
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            placeholder="2672 4789 1452 0890"
            placeholderTextColor="#999999"
            keyboardType="numeric"
            maxLength={19}
          />
        </View>

        {/* Expiry Date and CVV */}
        <View style={styles.rowInputs}>
          <View style={styles.halfInputGroup}>
            <Text style={styles.inputLabel}>SON KULLANMA TARİHİ</Text>
            <TextInput
              style={styles.textInput}
              value={expiryDate}
              onChangeText={handleExpiryDateChange}
              placeholder="07/26"
              placeholderTextColor="#999999"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          
          <View style={styles.halfInputGroup}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.textInput}
              value={cvv}
              onChangeText={handleCvvChange}
              placeholder="787"
              placeholderTextColor="#999999"
              keyboardType="numeric"
              maxLength={3}
              secureTextEntry
            />
          </View>
        </View>
      </View>

      {/* Add Card Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
        <Text style={styles.addButtonText}>Kartımı Ekle</Text>
      </TouchableOpacity>

      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 54,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  cardPreviewContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
    alignItems: 'center',
  },
  cardPreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#D2691E',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  visaLogo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'System',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 32,
  },
  cardNumberPreview: {
    fontSize: 24,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: 1.2,
    fontFamily: 'System',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardNamePreview: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.8,
    fontFamily: 'System',
  },
  cardExpiryPreview: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.8,
    fontFamily: 'System',
  },
  cardCvvPreview: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.8,
    fontFamily: 'System',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'System',
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    fontFamily: 'System',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputGroup: {
    flex: 0.48,
  },
  addButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
  },
  bottomIndicator: {
    alignItems: 'center',
    paddingVertical: 19,
    paddingBottom: 10,
  },
  indicator: {
    width: 135,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
});

export default AddNewCardScreen;