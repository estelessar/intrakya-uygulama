import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SellerStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addProduct } from '../../store/slices/productSlice';

type AddProductScreenNavigationProp = StackNavigationProp<SellerStackParamList, 'AddProduct'>;
type AddProductScreenRouteProp = RouteProp<SellerStackParamList, 'AddProduct'>;

interface AddProductScreenProps {
  navigation: AddProductScreenNavigationProp;
  route: AddProductScreenRouteProp;
}

const AddProductScreen: React.FC<AddProductScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.products);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    condition: 'new',
    images: [] as string[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = async () => {
    if (!formData.title || !formData.price || !formData.category) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun.');
      return;
    }

    try {
      await dispatch(addProduct({
        ...formData,
        price: parseFloat(formData.price),
        category: { id: formData.category, name: formData.category, icon: 'cube-outline' },
      })).unwrap();
      
      Alert.alert('Başarılı', 'Ürün başarıyla eklendi!', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Ürün eklenirken bir hata oluştu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ürün Ekle</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.title}>Yeni Ürün Ekle</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ürün Adı *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            placeholder="Ürün adını girin"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Ürün açıklamasını girin"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fiyat (₺) *</Text>
          <TextInput
            style={styles.input}
            value={formData.price}
            onChangeText={(value) => handleInputChange('price', value)}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kategori *</Text>
          <TextInput
            style={styles.input}
            value={formData.category}
            onChangeText={(value) => handleInputChange('category', value)}
            placeholder="Kategori seçin"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Marka</Text>
          <TextInput
            style={styles.input}
            value={formData.brand}
            onChangeText={(value) => handleInputChange('brand', value)}
            placeholder="Marka adını girin"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Durum</Text>
          <View style={styles.conditionContainer}>
            <TouchableOpacity
              style={[
                styles.conditionButton,
                formData.condition === 'new' && styles.conditionButtonActive
              ]}
              onPress={() => handleInputChange('condition', 'new')}
            >
              <Text style={[
                styles.conditionText,
                formData.condition === 'new' && styles.conditionTextActive
              ]}>Yeni</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.conditionButton,
                formData.condition === 'used' && styles.conditionButtonActive
              ]}
              onPress={() => handleInputChange('condition', 'used')}
            >
              <Text style={[
                styles.conditionText,
                formData.condition === 'used' && styles.conditionTextActive
              ]}>İkinci El</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleAddProduct}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Ekleniyor...' : 'Ürünü Ekle'}
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  conditionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  conditionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  conditionButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  conditionText: {
    fontSize: 16,
    color: '#333',
  },
  conditionTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddProductScreen;