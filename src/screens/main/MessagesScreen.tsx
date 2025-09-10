import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import BottomNavigation from '../../components/BottomNavigation';

type MessagesNavigationProp = StackNavigationProp<MainStackParamList, 'Messages'>;

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  productId?: string;
  productName?: string;
  productImage?: string;
}

const MessagesScreen: React.FC = () => {
  const navigation = useNavigation<MessagesNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  // Demo messages data
  const [messages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'seller1',
      senderName: 'TechStore',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      lastMessage: 'iPhone 14 Pro Max için kargo ücreti ücretsizdir.',
      timestamp: '14:30',
      unreadCount: 2,
      isOnline: true,
      productId: '1',
      productName: 'iPhone 14 Pro Max',
      productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300'
    },
    {
      id: '2',
      senderId: 'seller2',
      senderName: 'FashionHub',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      lastMessage: 'Ürün stoklarımızda mevcut, hemen sipariş verebilirsiniz.',
      timestamp: '12:15',
      unreadCount: 0,
      isOnline: false,
      productId: '2',
      productName: 'Kadın Elbise',
      productImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300'
    },
    {
      id: '3',
      senderId: 'seller3',
      senderName: 'HomeDecor',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      lastMessage: 'Teşekkürler! Siparişiniz hazırlanıyor.',
      timestamp: 'Dün',
      unreadCount: 1,
      isOnline: true,
      productId: '3',
      productName: 'Dekoratif Vazo',
      productImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300'
    },
    {
      id: '4',
      senderId: 'seller4',
      senderName: 'SportZone',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      lastMessage: 'Spor ayakkabı için hangi numarayı tercih edersiniz?',
      timestamp: '2 gün önce',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '5',
      senderId: 'seller5',
      senderName: 'BookWorld',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      lastMessage: 'Kitap siparişiniz kargoya verildi.',
      timestamp: '3 gün önce',
      unreadCount: 0,
      isOnline: true
    }
  ]);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && message.unreadCount > 0);
    return matchesSearch && matchesTab;
  });

  const handleMessagePress = (message: Message) => {
    navigation.navigate('ChatDetail', {
      sellerId: message.senderId,
      sellerName: message.senderName,
      sellerAvatar: message.senderAvatar,
      productId: message.productId,
      productName: message.productName,
      productImage: message.productImage,
    });
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity 
      style={styles.messageItem}
      onPress={() => handleMessagePress(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.senderAvatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{item.senderName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        {item.productName && (
          <View style={styles.productInfo}>
            <Image source={{ uri: item.productImage }} style={styles.productImage} />
            <Text style={styles.productName}>{item.productName}</Text>
          </View>
        )}
        
        <View style={styles.lastMessageContainer}>
          <Text 
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={2}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Mesajlar</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Mesajlarda ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            Tümü ({messages.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
            Okunmamış ({messages.filter(m => m.unreadCount > 0).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      {filteredMessages.length > 0 ? (
        <FlatList
          data={filteredMessages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>
            {searchQuery ? 'Mesaj bulunamadı' : 'Henüz mesajınız yok'}
          </Text>
          <Text style={styles.emptyStateText}>
            {searchQuery 
              ? 'Arama kriterlerinize uygun mesaj bulunamadı.'
              : 'Satıcılarla iletişime geçtiğinizde mesajlar burada görünecek.'
            }
          </Text>
        </View>
      )}

      <BottomNavigation />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: 'System',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    fontFamily: 'System',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  messageItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  productImage: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },
  productName: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'System',
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'System',
  },
  unreadMessage: {
    color: '#000',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'System',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 78,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'System',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'System',
  },
});

export default MessagesScreen;