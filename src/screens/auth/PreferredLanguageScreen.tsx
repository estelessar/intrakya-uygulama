import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../types';

interface Language {
  id: string;
  name: string;
  code: string;
}

type PreferredLanguageScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'PreferredLanguage'
>;

type PreferredLanguageScreenRouteProp = RouteProp<
  AuthStackParamList,
  'PreferredLanguage'
>;

const PreferredLanguageScreen: React.FC = () => {
  const navigation = useNavigation<PreferredLanguageScreenNavigationProp>();
  const route = useRoute<PreferredLanguageScreenRouteProp>();
  const { firstName } = route.params;
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
  ];

  const handleNext = () => {
    navigation.navigate('ChooseInterests', {
      firstName,
      selectedLanguage: selectedLanguage || 'tr',
    });
  };

  const handleSkip = () => {
    navigation.navigate('ChooseInterests', {
      firstName,
      selectedLanguage: 'tr',
    });
  };

  const renderLanguageButton = (language: Language, index: number) => {
    const isSelected = selectedLanguage === language.id;
    const isFirstRow = index < 3;
    const isSecondRow = index >= 3 && index < 6;
    const isThirdRow = index >= 6;

    return (
      <TouchableOpacity
        key={language.id}
        style={[
          styles.languageButton,
          isSelected && styles.selectedLanguage,
        ]}
        onPress={() => setSelectedLanguage(language.id)}
      >
        <Text
          style={[
            styles.languageText,
            isSelected && styles.selectedLanguageText,
          ]}
        >
          {language.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Geç</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.greeting}>Merhaba, {firstName}</Text>
        <Text style={styles.subtitle}>
          Lütfen iletişimi kolaylaştırmak için tercih ettiğiniz dili seçin.
        </Text>
        <Text style={styles.description}>
          Bu ayar daha sonra profil ayarlarından değiştirilebilir. Seçiminiz uygulamanın dilini ve içerik önerilerini etkileyecektir.
        </Text>

        {/* Language Options */}
        <View style={styles.languageGrid}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageButton,
                selectedLanguage === language.code && styles.selectedLanguage,
              ]}
              onPress={() => setSelectedLanguage(language.code)}
            >
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === language.code && styles.selectedLanguageText,
                ]}
              >
                {language.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            selectedLanguage && styles.nextButtonActive
          ]} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#475569',
    lineHeight: 26,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  languageGrid: {
    gap: 16,
  },
  languageButton: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedLanguage: {
    backgroundColor: '#FFD700',
    borderColor: '#000000',
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
  },
  languageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  selectedLanguageText: {
    color: '#000000',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#94A3B8',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
});

export default PreferredLanguageScreen;