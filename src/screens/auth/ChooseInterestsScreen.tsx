import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Interest {
  id: string;
  name: string;
}

const interests: Interest[] = [
  { id: 'apparels', name: 'Giyim' },
  { id: 'laptops', name: 'Dizüstü Bilgisayar' },
  { id: 'tvs', name: 'Televizyon' },
  { id: 'belts', name: 'Kemer' },
  { id: 'footwear', name: 'Ayakkabı' },
  { id: 'beauty', name: 'Güzellik Ürünleri' },
  { id: 'watches', name: 'Saat' },
  { id: 'health', name: 'Sağlık Ürünleri' },
  { id: 'jewellery', name: 'Mücevher' },
  { id: 'books', name: 'Kitap' },
  { id: 'wallets', name: 'Cüzdan' },
  { id: 'handbags', name: 'El Çantası' },
  { id: 'mobile', name: 'Cep Telefonu' },
  { id: 'headbands', name: 'Saç Bandı' },
  { id: 'kitchen', name: 'Mutfak Eşyaları' },
  { id: 'baby', name: 'Bebek Bakımı' },
  { id: 'appliances', name: 'Ev Aletleri' },
  { id: 'toys', name: 'Oyuncak' },
  { id: 'games', name: 'Oyun' },
  { id: 'fitness', name: 'Fitness Ekipmanları' },
  { id: 'sports', name: 'Spor Malzemeleri' },
  { id: 'home', name: 'Ev Dekorasyonu' },
  { id: 'computer', name: 'Bilgisayar Aksesuarları' },
];

const ChooseInterestsScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['apparels', 'mobile', 'fitness']);
  const { firstName } = route.params || { firstName: 'Kullanıcı' };

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const handleNext = () => {
    if (selectedInterests.length < 3) {
      Alert.alert('Minimum Seçim', 'Devam etmek için en az 3 ilgi alanı seçmelisiniz.');
      return;
    }
    // Navigate to Account Created screen
    navigation.navigate('AccountCreated' as never);
  };

  const handleSkip = () => {
    // Skip to Account Created screen
    navigation.navigate('AccountCreated' as never);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderInterestButton = (interest: Interest) => {
    const isSelected = selectedInterests.includes(interest.id);
    
    return (
      <TouchableOpacity
        key={interest.id}
        style={[
          styles.interestButton,
          isSelected && styles.selectedInterestButton,
        ]}
        onPress={() => handleInterestToggle(interest.id)}
      >
        <Text
          style={[
            styles.interestText,
            isSelected && styles.selectedInterestText,
          ]}
        >
          {interest.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderInterestRow = (startIndex: number, count: number) => {
    const rowInterests = interests.slice(startIndex, startIndex + count);
    return (
      <View key={startIndex} style={styles.interestRow}>
        {rowInterests.map(interest => renderInterestButton(interest))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İlgi Alanları Seç</Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Geç</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.greeting}>
            Merhaba {firstName}! 🎉
          </Text>
          <Text style={styles.subtitle}>
            İlgilendiğiniz 3 veya daha fazla alan seçin
          </Text>
          <Text style={styles.description}>
            Seçimleriniz size özel ürün önerileri almak için kullanılacaktır. Bu ayarları daha sonra profil bölümünden değiştirebilirsiniz.
          </Text>
        </View>

        {/* Interests Grid */}
        <View style={styles.interestsContainer}>
          {Array.from({ length: Math.ceil(interests.length / 2) }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.interestRow}>
              {interests.slice(rowIndex * 2, rowIndex * 2 + 2).map((interest) => (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestButton,
                    selectedInterests.includes(interest.id) && styles.selectedInterestButton,
                  ]}
                  onPress={() => handleInterestToggle(interest.id)}
                >
                  <Text
                    style={[
                      styles.interestText,
                      selectedInterests.includes(interest.id) && styles.selectedInterestText,
                    ]}
                  >
                    {interest.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Selection Info */}
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            {selectedInterests.length}/3+ seçildi
          </Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity 
          style={[
            styles.nextButton,
            selectedInterests.length >= 3 && styles.nextButtonActive
          ]} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {selectedInterests.length >= 3 ? 'Tamamla' : `${3 - selectedInterests.length} daha seç`}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.indicator} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 18,
    color: '#475569',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#DBEAFE',
    marginHorizontal: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  interestsContainer: {
    marginBottom: 24,
  },
  interestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  interestButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedInterestButton: {
    backgroundColor: '#FFD700',
    borderColor: '#000000',
    borderWidth: 2,
    shadowColor: '#FFD700',
    shadowOpacity: 0.25,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  selectedInterestText: {
    color: '#000000',
  },
  selectionInfo: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  selectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#94A3B8',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  nextButtonActive: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  homeIndicator: {
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

export default ChooseInterestsScreen;