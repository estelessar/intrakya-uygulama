import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomNavigation from '../../components/BottomNavigation';

type LeaveReviewScreenNavigationProp = StackNavigationProp<MainStackParamList>;

interface RouteParams {
  product?: {
    id: string;
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: string;
    image: string;
  };
}

const LeaveReviewScreen: React.FC = () => {
  const navigation = useNavigation<LeaveReviewScreenNavigationProp>();
  const route = useRoute();
  const { product } = (route.params as RouteParams) || {};
  
  const [rating, setRating] = useState(4);
  const [reviewText, setReviewText] = useState('Çok iyi ürün ve hızlı teslimat! 🔥');

  const defaultProduct = {
    id: '1',
    name: 'Preneum Kadın Şifon...',
    color: 'sarı',
    size: 'M',
    quantity: 1,
    price: '₺150.00',
    image: 'https://via.placeholder.com/120x120/F0F0F0/999999?text=Ürün'
  };

  const productData = product || defaultProduct;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color={i <= rating ? '#FFD700' : '#E0E0E0'}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handleSubmit = () => {
    // Handle review submission
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Değerlendirme Yap</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Product Section */}
          <View style={styles.productSection}>
            <Image source={{ uri: productData.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{productData.name}</Text>
              <Text style={styles.productDetails}>
                Renk: {productData.color}  |  Beden: {productData.size}  |  Adet: {productData.quantity}
              </Text>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>Tamamlandı</Text>
              </View>
              <Text style={styles.productPrice}>{productData.price}</Text>
            </View>
          </View>
          
          {/* Divider */}
          <View style={styles.sectionDivider} />
          
          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingTitle}>Siparişiniz nasıldı?</Text>
            <Text style={styles.ratingSubtitle}>Lütfen kursunuz için bir değerlendirme bırakın</Text>
            
            {/* Stars */}
            <View style={styles.starsContainer}>
              {renderStars()}
            </View>
          </View>
          
          {/* Review Text Section */}
          <View style={styles.reviewSection}>
            <TextInput
              style={styles.reviewInput}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              placeholder="Değerlendirmenizi yazın..."
              placeholderTextColor="#999999"
            />
            
            {/* Media Buttons */}
            <View style={styles.mediaButtonsContainer}>
              <TouchableOpacity style={styles.mediaButton}>
                <Ionicons name="image-outline" size={18} color="#707070" />
                <Text style={styles.mediaButtonText}>Resim Ekle</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.mediaButton}>
                <Ionicons name="videocam-outline" size={18} color="#707070" />
                <Text style={styles.mediaButtonText}>Video Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Gönder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
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
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  productSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    paddingTop: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 18,
    marginBottom: 8,
  },
  productDetails: {
    fontSize: 14,
    fontWeight: '500',
    color: '#707070',
    lineHeight: 20,
    marginBottom: 12,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 32,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ratingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 16,
  },
  ratingSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#707070',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starButton: {
    marginHorizontal: 4,
  },
  reviewSection: {
    marginBottom: 32,
  },
  reviewInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  mediaButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    width: '48%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#707070',
    marginLeft: 8,
    lineHeight: 18,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
  },
  submitButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
  },
  bottomIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 19,
    paddingHorizontal: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  bottomIndicator: {
    width: 135,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 5,
  },
});

export default LeaveReviewScreen;