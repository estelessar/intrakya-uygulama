import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../../components/BottomNavigation';

const OrderTrackScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const orderDetails = {
    id: orderId,
    title: 'Preneum Kadın Georgette...',
    color: 'tilt',
    size: 'M',
    quantity: 1,
    price: '$150.00',
    status: 'Teslimatta',
  };

  const trackingSteps = [
    {
      id: 1,
      title: 'Sipariş Yolda - 17 Nis',
      address: '32 Manchester Ave, Ringgold GA 30736',
      time: '02:30 PM',
      completed: true,
      current: true,
    },
    {
      id: 2,
      title: 'Sipariş ... Gümrük Limanı - 16 Nis',
      address: '4 Everygreen Street, lake Zurich, IL 60047',
      time: '11:45 AM',
      completed: true,
      current: false,
    },
    {
      id: 3,
      title: 'Sipariş ... Kargoya Verildi - 15 Nis',
      address: '32 Manchester Ave, Ringgold GA 30736',
      time: '05:20 PM',
      completed: true,
      current: false,
    },
    {
      id: 4,
      title: 'Sipariş Paketleniyor - 15 Nis',
      address: '891 Glen Ridge St. Gainesville, VA 20455',
      time: '10:25 AM',
      completed: true,
      current: false,
    },
    {
      id: 5,
      title: 'Ödeme Doğrulandı - 15 Nis',
      address: '55 Summerhouse Dr. Apopka, FL 32703',
      time: '08:30 AM',
      completed: true,
      current: false,
    },
  ];

  const renderTrackingStep = (step: any, index: number) => {
    const isLast = index === trackingSteps.length - 1;
    const stepFadeAnim = useRef(new Animated.Value(0)).current;
    const stepSlideAnim = useRef(new Animated.Value(30)).current;
    
    useEffect(() => {
      const delay = index * 150;
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(stepFadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(stepSlideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    }, [index]);
    
    return (
      <Animated.View 
        key={step.id} 
        style={[
          styles.trackingStep,
          {
            opacity: stepFadeAnim,
            transform: [{ translateX: stepSlideAnim }],
          },
        ]}
      >
        <View style={styles.stepIndicator}>
          <View style={[
            styles.stepCircle,
            step.completed && styles.stepCircleCompleted,
            step.current && styles.stepCircleCurrent
          ]}>
            {step.completed && (
              <Ionicons 
                name="checkmark" 
                size={16} 
                color={step.current ? "#000000" : "#FFD700"} 
              />
            )}
          </View>
          {!isLast && <View style={styles.stepLine} />}
        </View>
        
        <View style={styles.stepContent}>
          <View style={styles.stepHeader}>
            <Text style={[
              styles.stepTitle,
              step.current && styles.stepTitleCurrent
            ]}>
              {step.title}
            </Text>
            <Text style={styles.stepTime}>{step.time}</Text>
          </View>
          <Text style={styles.stepAddress}>{step.address}</Text>
        </View>
      </Animated.View>
    );
  };

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
        <Text style={styles.headerTitle}>Siparişi Takip Et</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.divider} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Info */}
        <Animated.View style={[
          styles.productSection,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ],
          },
        ]}>
          <View style={styles.productImageContainer}>
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Place{"\n"}Holder</Text>
            </View>
          </View>
          
          <View style={styles.productDetails}>
            <Text style={styles.productTitle}>{orderDetails.title}</Text>
            <Text style={styles.productInfo}>
              Renk: {orderDetails.color}  |  Beden: {orderDetails.size}  |  Adet: {orderDetails.quantity}
            </Text>
            
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{orderDetails.status}</Text>
            </View>
            
            <Text style={styles.productPrice}>{orderDetails.price}</Text>
          </View>
        </Animated.View>

        {/* Delivery Progress */}
        <Animated.View style={[
          styles.progressSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
          <View style={styles.progressBar}>
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <Ionicons name="cube-outline" size={20} color="#FFD700" />
            </View>
            <Animated.View style={[
              styles.progressLine,
              styles.progressLineActive,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]} />
            
            <View style={styles.progressStep}>
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <Ionicons name="car-outline" size={20} color="#FFD700" />
            </View>
            <Animated.View style={[
              styles.progressLine,
              styles.progressLineActive,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]} />
            
            <View style={styles.progressStep}>
              <View style={[styles.progressDot]} />
              <Ionicons name="home-outline" size={20} color="#CCCCCC" />
            </View>
            <View style={styles.progressLine} />
            
            <View style={styles.progressStep}>
              <View style={styles.progressDot} />
              <Ionicons name="checkmark-circle-outline" size={20} color="#CCCCCC" />
            </View>
          </View>
        </Animated.View>

        <View style={styles.sectionDivider} />

        {/* Order Status Details */}
        <Animated.View style={[
          styles.trackingSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
          <Text style={styles.sectionTitle}>Sipariş Durum Detayları</Text>
          
          <View style={styles.trackingList}>
            {trackingSteps.map((step, index) => renderTrackingStep(step, index))}
          </View>
        </Animated.View>
      </ScrollView>
      
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productSection: {
    flexDirection: 'row',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    paddingHorizontal: 16,
  },
  productImageContainer: {
    marginRight: 16,
  },
  placeholderImage: {
    width: 120,
    height: 120,
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
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'System',
    lineHeight: 18,
  },
  productInfo: {
    fontSize: 14,
    color: '#707070',
    marginBottom: 12,
    fontFamily: 'System',
    lineHeight: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  statusText: {
    fontSize: 12,
    color: '#000000',
    fontFamily: 'System',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'System',
  },
  progressSection: {
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 301,
    height: 62,
  },
  progressStep: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E5E5E5',
    position: 'absolute',
    top: 23,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  progressDotActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  progressLine: {
    height: 3,
    backgroundColor: '#E5E5E5',
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 1.5,
  },
  progressLineActive: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 24,
  },
  trackingSection: {
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    paddingHorizontal: 16,
     paddingTop: 24,
   },
   sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
    fontFamily: 'System',
  },
  trackingList: {
    paddingLeft: 16,
  },
  trackingStep: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  stepCircleCompleted: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  stepCircleCurrent: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  stepLine: {
    width: 2,
    height: 36,
    backgroundColor: '#FFD700',
    marginTop: 4,
    borderRadius: 1,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'System',
    flex: 1,
    marginRight: 8,
  },
  stepTitleCurrent: {
    fontWeight: '600',
  },
  stepTime: {
    fontSize: 10,
    fontWeight: '600',
    color: '#707070',
    fontFamily: 'System',
  },
  stepAddress: {
    fontSize: 10,
    fontWeight: '500',
    color: '#707070',
    fontFamily: 'System',
    marginTop: 4,
  },
  bottomIndicator: {
    alignItems: 'center',
    paddingVertical: 19,
    paddingHorizontal: 120,
    backgroundColor: '#ffffff',
  },
  indicator: {
    width: 135,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
});

export default OrderTrackScreen;