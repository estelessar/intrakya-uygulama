import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert, Share, FlatList, Dimensions, TextInput, Modal } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MainStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart as addToCartAction } from '../../store/slices/cartSlice';
import { createOffer } from '../../store/slices/offerSlice';
import { fetchProductComments, createComment, createCommentReply } from '../../store/slices/commentSlice';
import { Product, ProductVariant, Seller, Category } from '../../types';
import type { RootState } from '../../store';
import { scaleWidth, scaleHeight, scaleFont } from '../../utils/responsive';

const { width: screenWidth } = Dimensions.get('window');

type ProductDetailScreenRouteProp = RouteProp<MainStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = StackNavigationProp<MainStackParamList, 'ProductDetail'>;

interface Props {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
}

const ProductDetailScreen: React.FC<Props> = () => {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const dispatch = useDispatch();
  
  const { productId, productName, productPrice, productImage } = route.params;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      userId: 'user1',
      userName: 'Ahmet Yılmaz',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      rating: 5,
      comment: 'Çok memnun kaldım, kaliteli ürün. Hızlı kargo ve güvenli paketleme.',
      date: '2024-01-15',
      replies: [
        {
          id: 'reply1',
          userId: 'seller1',
          userName: 'Premium Mağaza',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          comment: 'Teşekkür ederiz! Memnuniyetiniz bizim için çok önemli.',
          date: '2024-01-16',
          isSeller: true
        }
      ]
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Fatma Demir',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      rating: 4,
      comment: 'Ürün güzel ama beden biraz büyük geldi. Kalite iyi.',
      date: '2024-01-10',
      replies: []
    }
  ]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  
  // Mock product data
  const productForCart: Product = {
    id: productId,
    name: productName || 'Örnek Ürün',
    price: productPrice || 100,
    images: [
      productImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&crop=center'
    ],
    description: 'Bu, mükemmel özellikler ve modern tasarıma sahip yüksek kaliteli bir üründür.',
    categoryId: '1',
    category: { id: '1', name: 'Moda', icon: 'shirt-outline' },
    seller: {
      id: '1',
      name: 'Premium Mağaza',
      rating: 4.8,
      reviewCount: 1250,
      isVerified: true,
      commissionRate: 0.08,
      totalEarnings: 50000,
      totalCommissionPaid: 4000,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    sellerId: '1',
    stock: 50,
    specifications: {
      'Malzeme': '%95 Pamuk',
      'Menşei': 'AB',
      'Bakım': 'Makinede yıkanabilir'
    },
    variants: [
      { id: '1', name: 'Renk', value: 'Kırmızı', price: 100, stock: 10 },
      { id: '2', name: 'Renk', value: 'Mavi', price: 100, stock: 15 },
      { id: '3', name: 'Renk', value: 'Siyah', price: 100, stock: 8 },
      { id: '4', name: 'Renk', value: 'Beyaz', price: 100, stock: 12 }
    ],
    rating: 4.7,
    reviewCount: 234,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const colors = ['Kırmızı', 'Mavi', 'Siyah', 'Beyaz'];
  const sizes = ['S', 'M', 'L', 'XL'];

  const handleImagePress = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity(prev => Math.min(prev + 1, productForCart.stock));
    } else {
      setQuantity(prev => Math.max(prev - 1, 1));
    }
  };

  const handleMakeOffer = () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir teklif miktarı girin.');
      return;
    }
    
    dispatch(createOffer({
      productId: productForCart.id,
      offeredPrice: parseFloat(offerAmount),
      quantity: quantity,
      message: `${productForCart.name} için teklif`
    }) as any);
    
    Alert.alert('Başarılı', 'Teklifiniz satıcıya gönderildi!');
    setShowOfferModal(false);
    setOfferAmount('');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${productName} - ₺${productPrice} | Türkiye Marketplace'te satışta!`,
        url: 'https://turkiyemarketplace.com',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddToCart = () => {
    if (productForCart) {
      dispatch(addToCartAction({
        product: productForCart,
        quantity: 1
      }));
      Alert.alert('Başarılı', 'Ürün sepete eklendi!');
    }
  };

  const handleBuyNow = () => {
    if (productForCart) {
      dispatch(addToCartAction({
        product: productForCart,
        quantity: 1
      }));
      navigation.navigate('Cart');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageGalleryContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={scaleFont(24)} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
              <Ionicons name="bag-outline" size={scaleFont(24)} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={scaleFont(24)} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentImageIndex(index);
            }}
          >
            {productForCart.images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
                <Image source={{ uri: image }} style={styles.productImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.imageIndicators}>
            {productForCart.images.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleImagePress(index)}
                style={[
                  styles.indicator,
                  currentImageIndex === index && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>

        {/* Price and Share */}
        <View style={styles.priceShareContainer}>
          <Text style={styles.price}>₺{(productPrice ?? 0).toLocaleString()}</Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={scaleFont(24)} color={isFavorite ? '#FFD700' : '#000'} />
          </TouchableOpacity>
        </View>

        {/* Product Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.productDescription}>
            {productForCart.description}
          </Text>
        </View>

        {/* Color Selection */}
        <View style={styles.variationsContainer}>
          <Text style={styles.sectionTitle}>Renk Seçimi</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.colorContainer}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    selectedColor === color && styles.selectedColorOption
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text style={[
                    styles.colorText,
                    selectedColor === color && styles.selectedColorText
                  ]}>{color}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Size Selection */}
        <View style={styles.variationsContainer}>
          <Text style={styles.sectionTitle}>Beden Seçimi</Text>
          <View style={styles.sizeContainer}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeOption,
                  selectedSize === size && styles.selectedSizeOption
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedSizeText
                ]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quantity Selection */}
        <View style={styles.variationsContainer}>
          <Text style={styles.sectionTitle}>Miktar</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => handleQuantityChange(false)}
            >
              <Ionicons name="remove" size={scaleFont(20)} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => handleQuantityChange(true)}
            >
              <Ionicons name="add" size={scaleFont(20)} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Specifications */}
        <View style={styles.specificationsContainer}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Malzeme</Text>
            <Text style={styles.specValue}>%95 Pamuk</Text>
          </View>
        </View>

        {/* Origin */}
        <View style={styles.originContainer}>
          <Text style={styles.sectionTitle}>Menşei</Text>
          <Text style={styles.originValue}>AB</Text>
        </View>

        {/* Size Guide */}
        <TouchableOpacity style={styles.sizeGuideContainer} onPress={() => setShowSizeGuide(true)}>
          <Text style={styles.sizeGuideText}>Beden Rehberi</Text>
          <Ionicons name="chevron-forward" size={scaleFont(20)} color="#000" />
        </TouchableOpacity>

        {/* Delivery */}
        <View style={styles.deliveryContainer}>
          <Text style={styles.sectionTitle}>Teslimat</Text>
          <View style={styles.deliveryOption}>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryType}>Standart</Text>
              <Text style={styles.deliveryTime}>5-7 gün</Text>
            </View>
            <Text style={styles.deliveryPrice}>₺15.00</Text>
          </View>
          <View style={styles.deliveryOption}>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryType}>Hızlı</Text>
              <Text style={styles.deliveryTime}>1-2 gün</Text>
            </View>
            <Text style={styles.deliveryPrice}>₺35.00</Text>
          </View>
        </View>

        {/* Seller Info */}
        <View style={styles.sellerContainer}>
          <Text style={styles.sectionTitle}>Satıcı Bilgileri</Text>
          <View style={styles.sellerCard}>
            <View style={styles.sellerHeader}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' }} style={styles.sellerAvatar} />
              <View style={styles.sellerInfo}>
                <View style={styles.sellerNameRow}>
                  <Text style={styles.sellerName}>{productForCart.seller.name}</Text>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={scaleFont(16)} color="#FFD700" />
                    <Text style={styles.verifiedText}>Doğrulanmış</Text>
                  </View>
                </View>
                <View style={styles.sellerStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{productForCart.seller.rating}</Text>
                    <Text style={styles.statLabel}>Puan</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{productForCart.seller.reviewCount}</Text>
                    <Text style={styles.statLabel}>Değerlendirme</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>2.5K</Text>
                    <Text style={styles.statLabel}>Satış</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.sellerActions}>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="chatbubble-outline" size={scaleFont(16)} color="#000" />
                <Text style={styles.contactText}>Mesaj Gönder</Text>
                </TouchableOpacity>
              <TouchableOpacity 
                style={styles.viewStoreButton}
                onPress={() => navigation.navigate('SellerProfile', { 
                  sellerId: productForCart.seller.id,
                  sellerName: productForCart.seller.name 
                })}
              >
                <Text style={styles.viewStoreText}>Mağazayı Görüntüle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Rating & Reviews */}
        <View style={styles.ratingContainer}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Değerlendirme ve Yorumlar ({comments.length})</Text>
            <TouchableOpacity 
              style={styles.addReviewButton}
              onPress={() => setShowCommentModal(true)}
            >
              <Ionicons name="add" size={scaleFont(16)} color="#000" />
              <Text style={styles.addReviewText}>Yorum Yaz</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.ratingHeader}>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star" size={scaleFont(16)} color="#FFD700" />
              ))}
            </View>
            <Text style={styles.ratingText}>4.5/5</Text>
            <Text style={styles.ratingCount}>({comments.length} değerlendirme)</Text>
          </View>

          {/* Comments List */}
          <View style={styles.commentsList}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Image source={{ uri: comment.userAvatar }} style={styles.reviewerAvatar} />
                  <View style={styles.commentInfo}>
                    <Text style={styles.reviewerName}>{comment.userName}</Text>
                    <View style={styles.commentRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons 
                          key={star} 
                          name={star <= comment.rating ? "star" : "star-outline"} 
                          size={scaleFont(12)} 
                          color="#FFD700" 
                        />
                      ))}
                      <Text style={styles.commentDate}>{comment.date}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.commentText}>{comment.comment}</Text>
                
                {/* Reply Button */}
                <TouchableOpacity 
                  style={styles.replyButton}
                  onPress={() => {
                    setReplyingTo(comment.id);
                    setReplyText('');
                  }}
                >
                  <Ionicons name="chatbubble-outline" size={scaleFont(14)} color="#666" />
                  <Text style={styles.replyButtonText}>Cevapla</Text>
                </TouchableOpacity>

                {/* Replies */}
                {comment.replies.map((reply) => (
                  <View key={reply.id} style={styles.replyItem}>
                    <View style={styles.replyHeader}>
                      <Image source={{ uri: reply.userAvatar }} style={styles.replyAvatar} />
                      <View style={styles.replyInfo}>
                        <View style={styles.replyNameRow}>
                          <Text style={styles.replyUserName}>{reply.userName}</Text>
                          {reply.isSeller && (
                            <View style={styles.sellerBadge}>
                              <Text style={styles.sellerBadgeText}>Satıcı</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.replyDate}>{reply.date}</Text>
                      </View>
                    </View>
                    <Text style={styles.replyText}>{reply.comment}</Text>
                  </View>
                ))}

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <View style={styles.replyInputContainer}>
                    <TextInput
                      style={styles.replyInput}
                      placeholder="Cevabınızı yazın..."
                      value={replyText}
                      onChangeText={setReplyText}
                      multiline
                    />
                    <View style={styles.replyActions}>
                      <TouchableOpacity 
                        style={styles.cancelReplyButton}
                        onPress={() => setReplyingTo(null)}
                      >
                        <Text style={styles.cancelReplyText}>İptal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.sendReplyButton}
                        onPress={() => {
                          if (replyText.trim()) {
                            const newReply = {
                              id: `reply_${Date.now()}`,
                              userId: 'current_user',
                              userName: 'Siz',
                              userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
                              comment: replyText,
                              date: new Date().toISOString().split('T')[0],
                              isSeller: false
                            };
                            setComments(prev => prev.map(c => 
                              c.id === comment.id 
                                ? { ...c, replies: [...c.replies, newReply] }
                                : c
                            ));
                            setReplyingTo(null);
                            setReplyText('');
                          }
                        }}
                      >
                        <Text style={styles.sendReplyText}>Gönder</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Most Popular */}
        <View style={styles.mostPopularContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>En Popüler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { id: 1, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=120&h=120&fit=crop&crop=center', price: 25 },
              { id: 2, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&h=120&fit=crop&crop=center', price: 50 },
              { id: 3, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop&crop=center', price: 75 }
            ].map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.popularItem}
                onPress={() => navigation.navigate('ProductDetail', {
                  productId: `popular_${item.id}`,
                  productName: `Popüler Ürün ${item.id}`,
                  productPrice: item.price,
                  productImage: item.image
                })}
              >
                <Image source={{ uri: item.image }} style={styles.popularImage} />
                <Text style={styles.popularPrice}>₺{item.price.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* You Might Like */}
        <View style={styles.youMightLikeContainer}>
          <Text style={styles.sectionTitle}>Beğenebilecekleriniz</Text>
          <View style={styles.likeGrid}>
            {[
              { id: 1, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=150&h=150&fit=crop&crop=center', price: 30, description: 'Şık ve rahat günlük giyim' },
              { id: 2, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=150&h=150&fit=crop&crop=center', price: 60, description: 'Zarif ve modern tasarım' },
              { id: 3, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=150&h=150&fit=crop&crop=center', price: 90, description: 'Premium kalite malzeme' },
              { id: 4, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop&crop=center', price: 120, description: 'Trend ve konforlu' }
            ].map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.likeItem}
                onPress={() => navigation.navigate('ProductDetail', {
                  productId: `suggested_${item.id}`,
                  productName: item.description,
                  productPrice: item.price,
                  productImage: item.image
                })}
              >
                <Image source={{ uri: item.image }} style={styles.likeImage} />
                <Text style={styles.likeDescription}>{item.description}</Text>
                <Text style={styles.likePrice}>₺{item.price.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.offerButton} onPress={() => setShowOfferModal(true)}>
          <Text style={styles.offerButtonText}>Teklif Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Sepete Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Hemen Al</Text>
        </TouchableOpacity>
      </View>

      {/* Size Guide Modal */}
      <Modal
        visible={showSizeGuide}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSizeGuide(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Beden Rehberi</Text>
              <TouchableOpacity onPress={() => setShowSizeGuide(false)}>
                <Ionicons name="close" size={scaleFont(24)} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.sizeGuideContent}>
              <View style={styles.sizeGuideTable}>
                <View style={styles.sizeGuideRow}>
                  <Text style={styles.sizeGuideHeader}>Beden</Text>
                  <Text style={styles.sizeGuideHeader}>Göğüs (cm)</Text>
                  <Text style={styles.sizeGuideHeader}>Bel (cm)</Text>
                </View>
                <View style={styles.sizeGuideRow}>
                  <Text style={styles.sizeGuideCell}>S</Text>
                  <Text style={styles.sizeGuideCell}>86-90</Text>
                  <Text style={styles.sizeGuideCell}>70-74</Text>
                </View>
                <View style={styles.sizeGuideRow}>
                  <Text style={styles.sizeGuideCell}>M</Text>
                  <Text style={styles.sizeGuideCell}>90-94</Text>
                  <Text style={styles.sizeGuideCell}>74-78</Text>
                </View>
                <View style={styles.sizeGuideRow}>
                  <Text style={styles.sizeGuideCell}>L</Text>
                  <Text style={styles.sizeGuideCell}>94-98</Text>
                  <Text style={styles.sizeGuideCell}>78-82</Text>
                </View>
                <View style={styles.sizeGuideRow}>
                  <Text style={styles.sizeGuideCell}>XL</Text>
                  <Text style={styles.sizeGuideCell}>98-102</Text>
                  <Text style={styles.sizeGuideCell}>82-86</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCommentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yorum Yaz</Text>
              <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                <Ionicons name="close" size={scaleFont(24)} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.commentModalContent}>
              <Text style={styles.ratingLabel}>Puanınız</Text>
              <View style={styles.ratingSelector}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setNewRating(star)}
                  >
                    <Ionicons 
                      name={star <= newRating ? "star" : "star-outline"} 
                      size={scaleFont(24)} 
                      color="#FFD700" 
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.commentLabel}>Yorumunuz</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
                numberOfLines={4}
              />
              <TouchableOpacity 
                style={styles.submitCommentButton}
                onPress={() => {
                  if (newComment.trim()) {
                    const comment = {
                      id: `comment_${Date.now()}`,
                      userId: 'current_user',
                      userName: 'Siz',
                      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
                      rating: newRating,
                      comment: newComment,
                      date: new Date().toISOString().split('T')[0],
                      replies: []
                    };
                    setComments(prev => [comment, ...prev]);
                    setShowCommentModal(false);
                    setNewComment('');
                    setNewRating(5);
                    Alert.alert('Başarılı', 'Yorumunuz eklendi!');
                  }
                }}
              >
                <Text style={styles.submitCommentText}>Yorum Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Offer Modal */}
      <Modal
        visible={showOfferModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOfferModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Teklif Ver</Text>
              <TouchableOpacity onPress={() => setShowOfferModal(false)}>
                <Ionicons name="close" size={scaleFont(24)} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.offerContent}>
              <Text style={styles.offerLabel}>Ürün: {productForCart.name}</Text>
              <Text style={styles.offerLabel}>Mevcut Fiyat: ₺{productForCart.price.toLocaleString()}</Text>
              <Text style={styles.offerInputLabel}>Teklif Miktarınız (₺):</Text>
              <TextInput
                style={styles.offerInput}
                value={offerAmount}
                onChangeText={setOfferAmount}
                placeholder="Teklif miktarını girin"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <View style={styles.offerButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setShowOfferModal(false)}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.submitOfferButton} 
                  onPress={handleMakeOffer}
                >
                  <Text style={styles.submitOfferButtonText}>Teklif Gönder</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageGalleryContainer: {
    position: 'relative',
    height: scaleHeight(400),
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    position: 'absolute',
    top: scaleHeight(50),
    left: scaleWidth(20),
    zIndex: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: scaleWidth(20),
    padding: scaleWidth(8),
  },
  headerActions: {
    position: 'absolute',
    top: scaleHeight(50),
    right: scaleWidth(20),
    zIndex: 10,
    flexDirection: 'row',
    gap: scaleWidth(10),
  },
  cartButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: scaleWidth(20),
    padding: scaleWidth(8),
  },
  shareButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: scaleWidth(20),
    padding: scaleWidth(8),
  },
  productImage: {
    width: screenWidth,
    height: '100%',
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: scaleHeight(20),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: scaleWidth(8),
    height: scaleWidth(8),
    borderRadius: scaleWidth(4),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: scaleWidth(4),
  },
  activeIndicator: {
    backgroundColor: '#FFD700',
  },
  priceShareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleHeight(20),
  },
  price: {
    fontSize: scaleFont(24),
    fontWeight: 'bold',
    color: '#000',
  },
  favoriteButton: {
    padding: scaleWidth(8),
  },
  descriptionContainer: {
    paddingHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
  },
  productDescription: {
    fontSize: scaleFont(14),
    color: '#666',
    lineHeight: scaleFont(20),
  },
  variationsContainer: {
    paddingHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
  },
  variationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scaleHeight(10),
  },
  variationLabel: {
    fontSize: scaleFont(14),
    color: '#666',
  },
  variationValue: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#000',
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: scaleHeight(10),
  },
  specificationsContainer: {
    paddingHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scaleHeight(5),
  },
  specLabel: {
    fontSize: scaleFont(14),
    color: '#666',
  },
  specValue: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#000',
  },
  originContainer: {
    paddingHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
  },
  originValue: {
    fontSize: scaleFont(14),
    color: '#666',
    marginTop: scaleHeight(5),
  },
  sizeGuideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleHeight(15),
    marginHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
    backgroundColor: '#FFD700',
    borderRadius: scaleWidth(8),
  },
  sizeGuideText: {
    fontSize: scaleFont(14),
    color: '#000',
  },
  deliveryContainer: {
    paddingHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
  },
  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleHeight(10),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryType: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#000',
  },
  deliveryTime: {
    fontSize: scaleFont(12),
    color: '#666',
    marginTop: scaleHeight(2),
  },
  deliveryPrice: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#FFD700',
  },
  ratingContainer: {
    paddingHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleHeight(15),
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: scaleWidth(10),
  },
  ratingText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#000',
  },
  reviewItem: {
    paddingVertical: scaleHeight(10),
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: scaleWidth(40),
    height: scaleWidth(40),
    borderRadius: scaleWidth(20),
    marginRight: scaleWidth(12),
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#000',
  },
  reviewDate: {
    fontSize: scaleFont(12),
    color: '#666',
    marginTop: scaleHeight(2),
  },
  mostPopularContainer: {
    paddingHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleHeight(15),
  },
  seeAllText: {
    fontSize: scaleFont(14),
    color: '#FFD700',
    fontWeight: '600',
  },
  popularItem: {
    marginRight: scaleWidth(15),
    alignItems: 'center',
  },
  popularImage: {
    width: scaleWidth(120),
    height: scaleWidth(120),
    borderRadius: scaleWidth(8),
    marginBottom: scaleHeight(8),
  },
  popularPrice: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#000',
  },
  youMightLikeContainer: {
    paddingHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
  },
  likeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  likeItem: {
    width: '48%',
    marginBottom: scaleHeight(20),
  },
  likeImage: {
    width: '100%',
    height: scaleHeight(150),
    borderRadius: scaleWidth(8),
    marginBottom: scaleHeight(8),
  },
  likeDescription: {
    fontSize: scaleFont(12),
    color: '#666',
    marginBottom: scaleHeight(5),
    lineHeight: scaleFont(16),
  },
  likePrice: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#000',
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleHeight(15),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: scaleWidth(8),
  },
  offerButton: {
    flex: 0.8,
    backgroundColor: '#FFD700',
    paddingVertical: scaleHeight(15),
    borderRadius: scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  offerButtonText: {
    color: '#000',
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: scaleHeight(15),
    borderRadius: scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: scaleHeight(15),
    borderRadius: scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  buyNowText: {
    color: '#000',
    fontSize: scaleFont(16),
    fontWeight: '600',
  },
  sellerContainer: {
    paddingHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
  },
  sellerCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: scaleWidth(12),
    padding: scaleWidth(16),
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scaleHeight(12),
  },
  sellerAvatar: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    borderRadius: scaleWidth(25),
    marginRight: scaleWidth(12),
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleHeight(8),
  },
  sellerName: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#000',
    marginRight: scaleWidth(8),
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: scaleWidth(6),
    paddingVertical: scaleHeight(2),
    borderRadius: scaleWidth(12),
  },
  verifiedText: {
    fontSize: scaleFont(10),
    color: '#000',
    marginLeft: scaleWidth(2),
    fontWeight: '500',
  },
  sellerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: scaleFont(12),
    color: '#666',
    marginTop: scaleHeight(2),
  },
  sellerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scaleWidth(10),
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: scaleHeight(10),
    borderRadius: scaleWidth(8),
  },
  contactText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#000',
    marginLeft: scaleWidth(6),
  },
  viewStoreButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: scaleHeight(10),
    borderRadius: scaleWidth(8),
  },
  viewStoreText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#FFD700',
  },
  // Comment System Styles
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleHeight(15),
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(6),
    borderRadius: scaleWidth(6),
  },
  addReviewText: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: '#000',
    marginLeft: scaleWidth(4),
  },
  ratingCount: {
    fontSize: scaleFont(12),
    color: '#666',
    marginLeft: scaleWidth(8),
  },
  commentsList: {
    marginTop: scaleHeight(15),
  },
  commentItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: scaleWidth(8),
    padding: scaleWidth(12),
    marginBottom: scaleHeight(12),
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scaleHeight(8),
  },
  commentInfo: {
    flex: 1,
    marginLeft: scaleWidth(8),
  },
  commentRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleHeight(2),
  },
  commentDate: {
    fontSize: scaleFont(10),
    color: '#666',
    marginLeft: scaleWidth(8),
  },
  commentText: {
    fontSize: scaleFont(14),
    color: '#333',
    lineHeight: scaleFont(20),
    marginBottom: scaleHeight(8),
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  replyButtonText: {
    fontSize: scaleFont(12),
    color: '#666',
    marginLeft: scaleWidth(4),
  },
  replyItem: {
    backgroundColor: '#fff',
    borderRadius: scaleWidth(6),
    padding: scaleWidth(10),
    marginTop: scaleHeight(8),
    marginLeft: scaleWidth(20),
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scaleHeight(6),
  },
  replyAvatar: {
    width: scaleWidth(30),
    height: scaleWidth(30),
    borderRadius: scaleWidth(15),
    marginRight: scaleWidth(8),
  },
  replyInfo: {
    flex: 1,
  },
  replyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyUserName: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: '#000',
  },
  sellerBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: scaleWidth(6),
    paddingVertical: scaleHeight(2),
    borderRadius: scaleWidth(10),
    marginLeft: scaleWidth(6),
  },
  sellerBadgeText: {
    fontSize: scaleFont(8),
    fontWeight: '600',
    color: '#000',
  },
  replyDate: {
    fontSize: scaleFont(10),
    color: '#666',
    marginTop: scaleHeight(2),
  },
  replyText: {
    fontSize: scaleFont(12),
    color: '#333',
    lineHeight: scaleFont(16),
  },
  replyInputContainer: {
    marginTop: scaleHeight(8),
    marginLeft: scaleWidth(20),
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scaleWidth(6),
    padding: scaleWidth(10),
    fontSize: scaleFont(12),
    backgroundColor: '#fff',
    minHeight: scaleHeight(60),
    textAlignVertical: 'top',
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: scaleHeight(8),
    gap: scaleWidth(8),
  },
  cancelReplyButton: {
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(6),
    borderRadius: scaleWidth(4),
    backgroundColor: '#f0f0f0',
  },
  cancelReplyText: {
    fontSize: scaleFont(12),
    color: '#666',
  },
  sendReplyButton: {
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(6),
    borderRadius: scaleWidth(4),
    backgroundColor: '#FFD700',
  },
  sendReplyText: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: '#000',
  },
  // Comment Modal Styles
  commentModalContent: {
    padding: scaleWidth(20),
  },
  ratingLabel: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: scaleHeight(10),
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: scaleHeight(20),
    gap: scaleWidth(8),
  },
  commentLabel: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: scaleHeight(10),
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scaleWidth(8),
    padding: scaleWidth(12),
    fontSize: scaleFont(14),
    backgroundColor: '#f8f8f8',
    minHeight: scaleHeight(100),
    textAlignVertical: 'top',
    marginBottom: scaleHeight(20),
  },
  submitCommentButton: {
    backgroundColor: '#FFD700',
    paddingVertical: scaleHeight(12),
    borderRadius: scaleWidth(8),
    alignItems: 'center',
  },
  submitCommentText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000',
  },
  colorContainer: {
    flexDirection: 'row',
    paddingRight: scaleWidth(20),
  },
  colorOption: {
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleHeight(8),
    marginRight: scaleWidth(10),
    borderRadius: scaleWidth(20),
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  selectedColorOption: {
    backgroundColor: '#FFD700',
    borderColor: '#000',
  },
  colorText: {
    fontSize: scaleFont(14),
    color: '#000',
  },
  selectedColorText: {
    fontWeight: '600',
    color: '#000',
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scaleWidth(10),
  },
  sizeOption: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    borderRadius: scaleWidth(8),
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSizeOption: {
    backgroundColor: '#FFD700',
    borderColor: '#000',
  },
  sizeText: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000',
  },
  selectedSizeText: {
    color: '#000',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(15),
  },
  quantityButton: {
    width: scaleWidth(40),
    height: scaleWidth(40),
    borderRadius: scaleWidth(20),
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  quantityText: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#000',
    minWidth: scaleWidth(30),
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: scaleWidth(12),
    padding: scaleWidth(20),
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleHeight(20),
    paddingBottom: scaleHeight(10),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#000',
  },
  sizeGuideContent: {
    maxHeight: scaleHeight(300),
  },
  sizeGuideTable: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scaleWidth(8),
  },
  sizeGuideRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sizeGuideHeader: {
    flex: 1,
    padding: scaleWidth(12),
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#FFD700',
    textAlign: 'center',
  },
  sizeGuideCell: {
    flex: 1,
    padding: scaleWidth(12),
    fontSize: scaleFont(14),
    color: '#000',
    textAlign: 'center',
  },
  offerContent: {
    gap: scaleHeight(15),
  },
  offerLabel: {
    fontSize: scaleFont(16),
    color: '#000',
    fontWeight: '500',
  },
  offerInputLabel: {
    fontSize: scaleFont(14),
    color: '#000',
    fontWeight: '600',
    marginTop: scaleHeight(10),
  },
  offerInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scaleWidth(8),
    padding: scaleWidth(12),
    fontSize: scaleFont(16),
    color: '#000',
    backgroundColor: '#f8f8f8',
  },
  offerButtons: {
    flexDirection: 'row',
    gap: scaleWidth(10),
    marginTop: scaleHeight(20),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: scaleHeight(12),
    borderRadius: scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: scaleFont(16),
    color: '#000',
    fontWeight: '600',
  },
  submitOfferButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: scaleHeight(12),
    borderRadius: scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  submitOfferButtonText: {
    fontSize: scaleFont(16),
    color: '#000',
    fontWeight: '600',
  },
});

export default ProductDetailScreen;