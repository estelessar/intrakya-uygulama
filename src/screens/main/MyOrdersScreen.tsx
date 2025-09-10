import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

type MyOrdersScreenNavigationProp = StackNavigationProp<MainStackParamList, 'MyOrders'>;

const MyOrdersScreen = () => {
  const navigation = useNavigation<MyOrdersScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState('completed');

  const ongoingOrders = [
    {
      id: 1,
      title: "Preneum Kadın Georgette...",
      color: 'tilt',
      size: 'M',
      quantity: 1,
      price: 150.00,
      status: 'Teslimatta',
      image: null,
    },
    {
      id: 2,
      title: 'Go Buzz Bluetooth Çağrı Sm...',
      color: 'siyah',
      size: null,
      quantity: 1,
      price: 150.00,
      status: 'Teslimatta',
      image: null,
    },
  ];

  const completedOrders = [
    {
      id: 1,
      title: "Fire-Boltt Phoenix Akıllı Saat...",
      color: 'sarı',
      quantity: 1,
      price: 150.00,
      status: 'Teslim Edildi',
      image: null,
    },
    {
      id: 2,
      title: "Kız Alaşım Rose Gold Kaplama K...",
      color: 'Rose',
      quantity: 1,
      price: 450.00,
      status: 'Teslim Edildi',
      image: null,
    },
  ];

  const renderOrderItem = (order: any) => (
    <TouchableOpacity 
      key={order.id} 
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetail', { orderId: order.id.toString() })}
    >
      <View style={styles.orderImageContainer}>
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Place{"\n"}Holder</Text>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderTitle}>{order.title}</Text>
        <View style={styles.orderInfo}>
           <Text style={styles.orderInfoText}>Renk: {order.color}</Text>
           {order.size && (
             <>
               <Text style={styles.orderInfoText}> | </Text>
               <Text style={styles.orderInfoText}>Beden: {order.size}</Text>
             </>
           )}
           <Text style={styles.orderInfoText}> | Adet: {order.quantity}</Text>
         </View>
        <Text style={styles.orderStatus}>{order.status}</Text>
        <View style={styles.orderFooter}>
          <Text style={styles.orderPrice}>${order.price.toFixed(2)}</Text>
          {activeTab === 'completed' ? (
            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('LeaveReview', {
                  productId: order.id.toString(),
                  productName: order.title,
                  sellerId: '1'
                });
              }}
            >
               <Text style={styles.reviewButtonText}>Değerlendirme Yap</Text>
             </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.trackButton}
              onPress={(e) => {
                e.stopPropagation();
                navigation.navigate('OrderTrack', { 
                  orderId: order.id.toString(),
                  trackingNumber: 'TK123456789TR'
                });
              }}
            >
               <Text style={styles.trackButtonText}>Siparişi Takip Et</Text>
             </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Siparişlerim</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
            Devam Eden
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Tamamlanan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'ongoing' ? (
          ongoingOrders.length > 0 ? (
            ongoingOrders.map(renderOrderItem)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Devam eden siparişiniz bulunmuyor</Text>
            </View>
          )
        ) : (
          completedOrders.length > 0 ? (
            completedOrders.map(renderOrderItem)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Tamamlanan siparişiniz bulunmuyor</Text>
            </View>
          )
        )}
      </ScrollView>
      
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
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  headerSpacer: {
    width: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
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
     fontSize: 16,
     fontWeight: '500',
     color: '#000000',
     fontFamily: 'System',
   },
  activeTabText: {
     color: '#000000',
     fontWeight: '600',
   },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
  },
  orderImageContainer: {
    marginRight: 16,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontFamily: 'System',
    fontWeight: '500',
  },
  orderDetails: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'System',
  },
  orderInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  orderInfoText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'System',
  },
  orderStatus: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontFamily: 'System',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'System',
  },
  trackButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  trackButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  reviewButton: {
      backgroundColor: '#FFD700',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    reviewButtonText: {
      color: '#000000',
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'System',
    },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
     fontSize: 16,
     color: '#666666',
     fontFamily: 'System',
   },
});

export default MyOrdersScreen;