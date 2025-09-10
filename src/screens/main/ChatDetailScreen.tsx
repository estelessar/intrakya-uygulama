import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';

type ChatDetailRouteProp = RouteProp<MainStackParamList, 'ChatDetail'>;
type ChatDetailNavigationProp = StackNavigationProp<MainStackParamList, 'ChatDetail'>;

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isFromUser: boolean;
  messageType: 'text' | 'image' | 'product';
  productInfo?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

const ChatDetailScreen: React.FC = () => {
  const navigation = useNavigation<ChatDetailNavigationProp>();
  const route = useRoute<ChatDetailRouteProp>();
  const { sellerId, sellerName, sellerAvatar, productId, productName, productImage } = route.params;
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Merhaba! Ürününüzle ilgili sorularım var.',
      timestamp: new Date(Date.now() - 3600000),
      isFromUser: true,
      messageType: 'text'
    },
    {
      id: '2',
      text: 'Merhaba! Tabii ki, size nasıl yardımcı olabilirim?',
      timestamp: new Date(Date.now() - 3500000),
      isFromUser: false,
      messageType: 'text'
    },
    {
      id: '3',
      text: 'Bu ürün hakkında daha fazla bilgi alabilir miyim?',
      timestamp: new Date(Date.now() - 3400000),
      isFromUser: true,
      messageType: 'text'
    },
    {
      id: '4',
      text: 'Elbette! İşte ürün detayları:',
      timestamp: new Date(Date.now() - 3300000),
      isFromUser: false,
      messageType: 'text'
    }
  ]);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Add product info message if product details are provided
    if (productId && productName && !messages.some(m => m.messageType === 'product')) {
      const productMessage: ChatMessage = {
        id: 'product-' + productId,
        text: '',
        timestamp: new Date(Date.now() - 3200000),
        isFromUser: false,
        messageType: 'product',
        productInfo: {
          id: productId,
          name: productName,
          price: 45000, // Demo price
          image: productImage || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300'
        }
      };
      setMessages(prev => [...prev, productMessage]);
    }
  }, [productId, productName, productImage]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        timestamp: new Date(),
        isFromUser: true,
        messageType: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate seller response after 2 seconds
      setTimeout(() => {
        const responses = [
          'Teşekkürler! Size yardımcı olmaktan mutluluk duyarım.',
          'Ürünümüz hakkında başka sorunuz var mı?',
          'Bu konuda size daha detaylı bilgi verebilirim.',
          'Siparişinizi hemen hazırlayabiliriz.',
          'Kargo ücretsiz olacaktır.'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const sellerMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          timestamp: new Date(),
          isFromUser: false,
          messageType: 'text'
        };
        
        setMessages(prev => [...prev, sellerMessage]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleProductPress = (productInfo: any) => {
    navigation.navigate('ProductDetail', {
      productId: productInfo.id,
      productName: productInfo.name,
      productPrice: productInfo.price,
      productImage: productInfo.image,
      sellerId: sellerId
    });
  };

  const handleSellerProfile = () => {
    navigation.navigate('SellerProfile', {
      sellerId,
      sellerName
    });
  };

  const handleCallSeller = () => {
    Alert.alert(
      'Satıcıyı Ara',
      `${sellerName} ile telefon görüşmesi başlatılsın mı?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Ara', onPress: () => Alert.alert('Arama', 'Arama başlatıldı...') }
      ]
    );
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.messageType === 'product' && item.productInfo) {
      return (
        <View style={[styles.messageContainer, styles.sellerMessageContainer]}>
          <TouchableOpacity 
            style={styles.productCard}
            onPress={() => handleProductPress(item.productInfo)}
          >
            <Image source={{ uri: item.productInfo.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.productInfo.name}</Text>
              <Text style={styles.productPrice}>₺{item.productInfo.price.toLocaleString()}</Text>
              <View style={styles.productActions}>
                <Text style={styles.viewProductText}>Ürünü Görüntüle</Text>
                <Ionicons name="chevron-forward" size={16} color="#FFD700" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.messageContainer,
        item.isFromUser ? styles.userMessageContainer : styles.sellerMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          item.isFromUser ? styles.userMessage : styles.sellerMessage
        ]}>
          <Text style={[
            styles.messageText,
            item.isFromUser ? styles.userMessageText : styles.sellerMessageText
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sellerInfo}
          onPress={handleSellerProfile}
        >
          <Image source={{ uri: sellerAvatar }} style={styles.sellerAvatar} />
          <View style={styles.sellerDetails}>
            <Text style={styles.sellerName}>{sellerName}</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.onlineText}>Çevrimiçi</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.callButton}
          onPress={handleCallSeller}
        >
          <Ionicons name="call" size={20} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Message Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color="#666" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Mesajınızı yazın..."
            placeholderTextColor="#666"
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              message.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={message.trim() ? "#000" : "#ccc"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sellerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 12,
    color: '#4CAF50',
    fontFamily: 'System',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  sellerMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: '#FFD700',
    borderBottomRightRadius: 4,
  },
  sellerMessage: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'System',
  },
  userMessageText: {
    color: '#000',
  },
  sellerMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: 'System',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'System',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 8,
    fontFamily: 'System',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProductText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
    marginRight: 4,
    fontFamily: 'System',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    fontFamily: 'System',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#FFD700',
  },
  sendButtonInactive: {
    backgroundColor: '#f0f0f0',
  },
});

export default ChatDetailScreen;