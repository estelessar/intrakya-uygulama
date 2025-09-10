import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchProductsBySeller } from '../../store/slices/productSlice';
import { Product } from '../../types';

interface ProductSelectionScreenProps {
  navigation: any;
}

const ProductSelectionScreen: React.FC<ProductSelectionScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProductsBySeller(user.id));
    }
  }, [dispatch, user?.id]);

  const sellerProducts = products.filter(product => product.sellerId === user?.id);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleContinue = () => {
    if (!selectedProduct) {
      Alert.alert('Uyarı', 'Lütfen reklam vermek istediğiniz ürünü seçin.');
      return;
    }

    navigation.navigate('AdvertisementPackages', {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
    });
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isSelected = selectedProduct?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.productCard,
          isSelected && styles.selectedProductCard,
        ]}
        onPress={() => handleProductSelect(item)}
      >
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productPrice}>₺{item.price.toFixed(2)}</Text>
          <Text style={styles.productStock}>Stok: {item.stock || 0}</Text>
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ürün Seç</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Ürünler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ürün Seç</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Ionicons name="information-circle" size={20} color="#FFD700" />
          <Text style={styles.infoText}>
            Reklam vermek istediğiniz ürünü seçin
          </Text>
        </View>

        {sellerProducts.length > 0 ? (
          <FlatList
            data={sellerProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            style={styles.productsList}
            contentContainerStyle={styles.productsContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="#CCC" />
            <Text style={styles.emptyTitle}>Ürün Bulunamadı</Text>
            <Text style={styles.emptyDescription}>
              Reklam verebilmek için önce ürün eklemeniz gerekiyor.
            </Text>
            <TouchableOpacity
              style={styles.addProductButton}
              onPress={() => navigation.navigate('AddProduct')}
            >
              <Ionicons name="add" size={20} color="#000000" />
              <Text style={styles.addProductButtonText}>Ürün Ekle</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {sellerProducts.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedProduct && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!selectedProduct}
          >
            <Text style={styles.continueButtonText}>Devam Et</Text>
            <Ionicons name="arrow-forward" size={20} color="#000000" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFD700',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFBF0',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  infoText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  productsList: {
    flex: 1,
  },
  productsContent: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedProductCard: {
    borderColor: '#FFD700',
    backgroundColor: '#FFFBF0',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 12,
    color: '#666',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addProductButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});

export default ProductSelectionScreen;