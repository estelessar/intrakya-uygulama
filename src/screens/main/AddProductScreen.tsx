import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import * as ImagePicker from 'expo-image-picker';

type AddProductNavigationProp = StackNavigationProp<MainStackParamList, 'AddProduct'>;

interface ProductImage {
  id: string;
  uri: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

interface Brand {
  id: string;
  name: string;
  logo?: string;
}

interface CommissionInfo {
  rate: number;
  amount: number;
  netAmount: number;
}

const AddProductScreen: React.FC = () => {
  const navigation = useNavigation<AddProductNavigationProp>();
  
  // Form state
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState<'new' | 'used' | 'refurbished'>('new');
  const [images, setImages] = useState<ProductImage[]>([]);
  const [tags, setTags] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [warranty, setWarranty] = useState('');
  const [shippingInfo, setShippingInfo] = useState('');
  
  // Dynamic data
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [commission, setCommission] = useState<CommissionInfo | null>(null);
  
  // UI state
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showBrandPicker, setShowBrandPicker] = useState(false);
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Load categories and brands from API
  useEffect(() => {
    loadCategoriesAndBrands();
  }, []);

  // Calculate commission when price changes
  useEffect(() => {
    if (price && !isNaN(Number(price))) {
      calculateCommission(Number(price));
    } else {
      setCommission(null);
    }
  }, [price]);

  const loadCategoriesAndBrands = async () => {
    try {
      setIsLoadingData(true);
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock categories data
      const categoriesData: Category[] = [
        {
          id: '1',
          name: 'Elektronik',
          subcategories: ['Telefon & Aksesuar', 'Bilgisayar', 'TV & Ses Sistemi', 'Kamera', 'Oyun Konsolu']
        },
        {
          id: '2',
          name: 'Moda',
          subcategories: ['Kadın Giyim', 'Erkek Giyim', 'Ayakkabı', 'Çanta', 'Aksesuar']
        },
        {
          id: '3',
          name: 'Ev & Yaşam',
          subcategories: ['Mobilya', 'Dekorasyon', 'Mutfak', 'Banyo', 'Bahçe']
        },
        {
          id: '4',
          name: 'Spor & Outdoor',
          subcategories: ['Fitness', 'Futbol', 'Basketbol', 'Koşu', 'Kamp & Doğa']
        }
      ];
      
      // Mock brands data
      const brandsData: Brand[] = [
        { id: '1', name: 'Apple' },
        { id: '2', name: 'Samsung' },
        { id: '3', name: 'Nike' },
        { id: '4', name: 'Adidas' },
        { id: '5', name: 'Zara' },
        { id: '6', name: 'H&M' },
        { id: '7', name: 'IKEA' },
        { id: '8', name: 'Sony' },
        { id: '9', name: 'LG' },
        { id: '10', name: 'Xiaomi' },
        { id: '11', name: 'Huawei' },
        { id: '12', name: 'Puma' },
        { id: '13', name: 'Under Armour' },
        { id: '14', name: 'Mango' },
        { id: '15', name: 'LC Waikiki' }
      ];
      
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      Alert.alert('Hata', 'Kategoriler ve markalar yüklenirken bir hata oluştu.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const calculateCommission = (productPrice: number) => {
    // Commission rate: 8% for marketplace
    const commissionRate = 0.08;
    const commissionAmount = productPrice * commissionRate;
    const netAmount = productPrice - commissionAmount;
    
    setCommission({
      rate: commissionRate * 100,
      amount: commissionAmount,
      netAmount: netAmount
    });
  };
  
  const conditions = [
    { value: 'new', label: 'Sıfır' },
    { value: 'used', label: 'İkinci El' },
    { value: 'refurbished', label: 'Yenilenmiş' }
  ];

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert('Uyarı', 'En fazla 5 fotoğraf ekleyebilirsiniz.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri erişim izni gereklidir.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newImage: ProductImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
      };
      setImages([...images, newImage]);
    }
  };

  const removeImage = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const validateForm = () => {
    if (!productName.trim()) {
      Alert.alert('Hata', 'Ürün adı gereklidir.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Hata', 'Ürün açıklaması gereklidir.');
      return false;
    }
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Hata', 'Geçerli bir fiyat giriniz.');
      return false;
    }
    if (!stock.trim() || isNaN(Number(stock))) {
      Alert.alert('Hata', 'Geçerli bir stok miktarı giriniz.');
      return false;
    }
    if (!category) {
      Alert.alert('Hata', 'Kategori seçiniz.');
      return false;
    }
    if (images.length === 0) {
      Alert.alert('Hata', 'En az bir ürün fotoğrafı ekleyiniz.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Başarılı',
        'Ürününüz başarıyla eklendi. İnceleme sonrası yayınlanacaktır.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategoryData = categories.find(cat => cat.name === category);

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ürün Ekle</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Kategoriler ve markalar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ürün Ekle</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ürün Fotoğrafları *</Text>
          <Text style={styles.sectionSubtitle}>En az 1, en fazla 5 fotoğraf ekleyebilirsiniz</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
            {images.map((image) => (
              <View key={image.id} style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={styles.productImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(image.id)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF4444" />
                </TouchableOpacity>
              </View>
            ))}
            
            {images.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Ionicons name="camera" size={32} color="#666" />
                <Text style={styles.addImageText}>Fotoğraf Ekle</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ürün Adı *</Text>
            <TextInput
              style={styles.textInput}
              value={productName}
              onChangeText={setProductName}
              placeholder="Ürün adını giriniz"
              maxLength={100}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Açıklama *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ürün açıklamasını giriniz"
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Marka</Text>
            <TouchableOpacity 
              style={styles.pickerButton}
              onPress={() => setShowBrandPicker(!showBrandPicker)}
            >
              <Text style={[styles.pickerText, !brand && styles.placeholderText]}>
                {brand || 'Marka seçiniz'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            
            {showBrandPicker && (
              <View style={styles.pickerContainer}>
                <ScrollView style={styles.brandScrollView}>
                  {brands.map((brandItem) => (
                    <TouchableOpacity
                      key={brandItem.id}
                      style={styles.pickerItem}
                      onPress={() => {
                        setBrand(brandItem.name);
                        setShowBrandPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{brandItem.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori *</Text>
          
          <TouchableOpacity 
            style={styles.pickerButton}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={[styles.pickerText, !category && styles.placeholderText]}>
              {category || 'Kategori seçiniz'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          
          {showCategoryPicker && (
            <View style={styles.pickerContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.pickerItem}
                  onPress={() => {
                    setCategory(cat.name);
                    setSubcategory('');
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {selectedCategoryData && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Alt Kategori</Text>
              <View style={styles.subcategoryContainer}>
                {selectedCategoryData.subcategories.map((sub, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.subcategoryChip,
                      subcategory === sub && styles.selectedSubcategoryChip
                    ]}
                    onPress={() => setSubcategory(subcategory === sub ? '' : sub)}
                  >
                    <Text style={[
                      styles.subcategoryText,
                      subcategory === sub && styles.selectedSubcategoryText
                    ]}>
                      {sub}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Durum *</Text>
          
          <View style={styles.conditionContainer}>
            {conditions.map((cond) => (
              <TouchableOpacity
                key={cond.value}
                style={[
                  styles.conditionChip,
                  condition === cond.value && styles.selectedConditionChip
                ]}
                onPress={() => setCondition(cond.value as any)}
              >
                <Text style={[
                  styles.conditionText,
                  condition === cond.value && styles.selectedConditionText
                ]}>
                  {cond.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fiyatlandırma</Text>
          
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.inputLabel}>Satış Fiyatı * (₺)</Text>
              <TextInput
                style={styles.textInput}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.inputGroup, styles.flex1, styles.marginLeft]}>
              <Text style={styles.inputLabel}>Piyasa Fiyatı (₺)</Text>
              <TextInput
                style={styles.textInput}
                value={originalPrice}
                onChangeText={setOriginalPrice}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>
          
          {/* Commission Info */}
          {commission && (
            <View style={styles.commissionContainer}>
              <View style={styles.commissionHeader}>
                <Ionicons name="information-circle" size={20} color="#FFD700" />
                <Text style={styles.commissionTitle}>Komisyon Bilgileri</Text>
              </View>
              
              <View style={styles.commissionRow}>
                <Text style={styles.commissionLabel}>Komisyon Oranı:</Text>
                <Text style={styles.commissionValue}>%{commission.rate.toFixed(1)}</Text>
              </View>
              
              <View style={styles.commissionRow}>
                <Text style={styles.commissionLabel}>Komisyon Tutarı:</Text>
                <Text style={styles.commissionValue}>₺{commission.amount.toFixed(2)}</Text>
              </View>
              
              <View style={[styles.commissionRow, styles.netAmountRow]}>
                <Text style={styles.netAmountLabel}>Hesabınıza Geçecek:</Text>
                <Text style={styles.netAmountValue}>₺{commission.netAmount.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Stock & Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stok ve Detaylar</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Stok Miktarı *</Text>
            <TextInput
              style={styles.textInput}
              value={stock}
              onChangeText={setStock}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ağırlık (kg)</Text>
            <TextInput
              style={styles.textInput}
              value={weight}
              onChangeText={setWeight}
              placeholder="0.0"
              keyboardType="decimal-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Boyutlar (cm)</Text>
            <TextInput
              style={styles.textInput}
              value={dimensions}
              onChangeText={setDimensions}
              placeholder="Uzunluk x Genişlik x Yükseklik"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Garanti Süresi</Text>
            <TextInput
              style={styles.textInput}
              value={warranty}
              onChangeText={setWarranty}
              placeholder="Örn: 2 yıl"
            />
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ek Bilgiler</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Etiketler</Text>
            <TextInput
              style={styles.textInput}
              value={tags}
              onChangeText={setTags}
              placeholder="Virgülle ayırarak etiket ekleyiniz"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kargo Bilgileri</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={shippingInfo}
              onChangeText={setShippingInfo}
              placeholder="Kargo ile ilgili özel bilgiler"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
    textAlign: 'center',
    fontFamily: 'System',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'System',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'System',
  },
  imageContainer: {
    flexDirection: 'row',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  addImageText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'System',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'System',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
    fontFamily: 'System',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'System',
  },
  placeholderText: {
    color: '#999',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 8,
    maxHeight: 200,
  },
  pickerItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerItemText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'System',
  },
  subcategoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  subcategoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedSubcategoryChip: {
    backgroundColor: '#FFD700',
  },
  subcategoryText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  selectedSubcategoryText: {
    color: '#000',
    fontWeight: '500',
  },
  conditionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  conditionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
    marginBottom: 8,
  },
  selectedConditionChip: {
    backgroundColor: '#FFD700',
  },
  conditionText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  selectedConditionText: {
    color: '#000',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 12,
  },
  submitContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'System',
  },
  brandScrollView: {
    maxHeight: 150,
  },
  commissionContainer: {
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  commissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commissionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
    fontFamily: 'System',
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commissionLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  commissionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'System',
  },
  netAmountRow: {
    borderTopWidth: 1,
    borderTopColor: '#FFD700',
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0,
  },
  netAmountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
  },
  netAmountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    fontFamily: 'System',
  },
});

export default AddProductScreen;