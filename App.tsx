import { Platform, Linking } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Switch,
  FlatList,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import tw from 'twrnc';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import appsFlyer from 'react-native-appsflyer';
import CleverTap from 'clevertap-react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import LoginScreen from './components/login_screen';
import SignupScreen from './components/signup_screen';
import StockTradingApp from './components/stock';

import {
  getTrackingStatus,
  requestTrackingPermission,
  TrackingStatus,
} from 'react-native-tracking-transparency';

// Loan Screen;
import LoanDetailScreen from './components/LoanDetailScreen';
import { useNavigation } from '@react-navigation/native';
import LoanRegisterScreen from './components/LoanRegisterScreen';
// End Loan Screen
//login
import AsyncStorage from '@react-native-async-storage/async-storage';
//login


type SectionProps = PropsWithChildren<{
  title: string;
}>;

type MainTabsParamList = {
  Home: undefined;
  Payments: undefined;
  Insights: undefined;
  Profile: undefined;
};

type RootStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  BillPaymentsScreen: undefined;
  HistoriesScreen: undefined;
  DepositScreen: undefined;
  MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
};

const os = Platform.OS;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();




const HomeScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? '#111' : '#f8f9fa' };

  const [inviteLink, setInviteLink] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const notifications = [
    { id: '1', title: 'Transfer Successful', message: 'Your transfer of $250 was successful.', date: 'Oct 28, 2025' },
    { id: '2', title: 'Loan Payment Reminder', message: 'Your loan payment is due tomorrow.', date: 'Oct 29, 2025' },
    { id: '3', title: 'Security Update', message: 'We’ve updated our security policy for your safety.', date: 'Oct 27, 2025' },
  ];

  const ads = [
    {
      id: '1',
      image: 'https://f88.vn/images/root/home/home-image-4.webp?w=1920&q=75&?fm=webp',
      title: 'Vay Theo Lương',
      type: 'Unsecured',
      desc: 'Khách hàng được hỗ trợ vay số tiền gấp 6 lần thu nhập hàng tháng, tối đa là 60,000,000 vnd',
      // Gom tất cả thông tin định danh và tài chính vào đây
      account_no: "VTL-8899102",
      loan_status: "approved",
      current_loan_to_value: 0,
      margin_rate: 0.5,
      principal_amount: 30000000,
      interest_amount: 337500,
      date_time: "2025-12-27T10:00:00Z",
      paid_percent: 0,
      upcoming_interest_date: 5,
      eligibility_rule: 80,
      loan_to_value_apply: 0,
      info: {
        interest: '1.125% / tháng',
        interest_value: 1.125, // Dạng số để tính toán
        tenure: '12 – 24 tháng',
        maxAmount: '60,000,000 VND',
        limit: 60000000,
        approval: '5 phút',
      },
    },
    {
      id: '2',
      image: 'https://f88.vn/images/root/home/home-image-1.jpeg?w=1920&q=75&?fm=webp',
      title: 'Vay Đăng Ký Xe Máy',
      type: 'Secured',
      desc: 'Gói vay bằng đăng ký xe máy. Hỗ trợ vay tiền nhanh trong ngày...',
      account_no: "VXM-2233445",
      loan_status: "approved",
      current_loan_to_value: 65,
      margin_rate: 1.5,
      principal_amount: 15000000,
      interest_amount: 690000,
      date_time: "2025-12-27T10:15:00Z",
      paid_percent: 10,
      upcoming_interest_date: 15,
      eligibility_rule: 75,
      loan_to_value_apply: 60,
      info: {
        interest: '4.6%/tháng',
        interest_value: 4.6,
        tenure: '3 – 18 tháng',
        maxAmount: '30,000,000 VND',
        limit: 30000000,
        approval: '15 phút',
      },
    },
    {
      id: '3',
      image: 'https://f88.vn/images/root/home/home-image-3.jpeg?w=1920&q=75&?fm=webp',
      title: 'Vay Đăng Ký Ô Tô',
      type: 'Secured',
      desc: 'Gói vay tiền không cần để lại ô tô. Hỗ trợ vay tiền nhanh trong ngày...',
      account_no: "VOT-1122334",
      loan_status: "approved",
      current_loan_to_value: 70,
      margin_rate: 2.5,
      principal_amount: 500000000,
      interest_amount: 23000000,
      date_time: "2025-12-27T10:30:00Z",
      paid_percent: 5,
      upcoming_interest_date: 20,
      eligibility_rule: 85,
      loan_to_value_apply: 65,
      info: {
        interest: '4.6%/tháng',
        interest_value: 4.6,
        tenure: '3 – 18 tháng',
        maxAmount: '2,000,000,000 VND',
        limit: 2000000000,
        approval: '15 phút',
      },
    }
  ];

  const handleCopyInvite = () => {
    if (inviteLink) {
      Clipboard.setString(inviteLink);
      Alert.alert('Copied!', 'Invite link copied to clipboard.');
    }
  };

  const { identifier, name } = route.params || {};
  const displayUser = identifier || name || "Guest";

  // Track event
  const eventName = 'af_homescreen';
  const eventValues = {
    af_screenid: '0',
    af_screenname: 'Home Screen',
    af_deeplink: 'HomeScreen',
  };
  appsFlyer.logEvent(
    eventName,
    eventValues,
    (res) => console.log(eventName + ' triggered ' + res),
    (err) => console.error(err)
  );

  // --- Notification Detail inline screen ---
  const NotificationDetailScreen = ({ notification }) => (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
        <TouchableOpacity onPress={() => setSelectedNotification(null)}>
          <FontAwesome name="times-circle" size={26} color="#2756A2" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold ml-3 text-gray-800`}>Notification Detail</Text>
      </View>
      <View style={tw`p-5`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>{notification.title}</Text>
        <Text style={tw`text-gray-500 mb-4`}>{notification.date}</Text>
        <Text style={tw`text-base text-gray-700 leading-6`}>{notification.message}</Text>
      </View>
    </View>
  );

  // --- Main Home Content ---
  const renderHomeContent = () => (
    <>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-5 pt-6`}>
        <View>
          <Text style={tw`text-gray-500 text-base`}>Welcome back,</Text>
          <Text style={tw`text-2xl font-bold text-blue-700 mt-1`}>
            {displayUser}
          </Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity style={tw`relative`} onPress={() => setShowModal(true)}>
          <FontAwesome name="bell-o" size={30} color="#2756A2" />
          {notifications.length > 0 && (
            <View
              style={tw`absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center`}
            >
              <Text style={tw`text-white text-xs font-bold`}>
                {notifications.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Scrollable body */}
      <ScrollView contentContainerStyle={tw`pb-10`}>
        {/* Account Card */}
        <LinearGradient
          colors={['#0052D4', '#4364F7', '#6FB1FC']}
          style={tw`mx-5 my-6 p-5 rounded-2xl shadow-md`}
        >
          <Text style={tw`text-white text-sm`}>Available Balance</Text>
          <Text style={tw`text-white text-3xl font-semibold mt-2`}>$25,480.92</Text>
          <View style={tw`flex-row justify-between mt-4`}>
            <Text style={tw`text-white/80`}>Account No:</Text>
            <Text style={tw`text-white font-medium`}>1234 5678 9001</Text>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={tw`px-5`}>
          <Text style={tw`text-base font-semibold mb-3 text-gray-700`}>Quick Actions</Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {/* Send Money */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('Payments')}
            >
              <FontAwesome name="money" size={26} color="#2756A2" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Send Money</Text>
            </TouchableOpacity>

            {/* Pay Bills */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('BillPaymentsScreen', { identifier, name })}
            >
              <FontAwesome name="list" size={26} color="#2756A2" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Pay Bills</Text>
            </TouchableOpacity>

            {/* Deposit */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('DepositScreen', { identifier, name })}
            >
              <FontAwesome name="get-pocket" size={26} color="#2756A2" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Deposit</Text>
            </TouchableOpacity>

            {/* History */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('HistoriesScreen', { identifier, name })}
            >
              <FontAwesome name="history" size={26} color="#2756A2" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>History</Text>
            </TouchableOpacity>

            {/* Apply Card */}
            <TouchableOpacity
              style={tw`w-[48%] bg-white p-4 mb-3 rounded-xl shadow-sm flex-row items-center`}
              onPress={() => navigation.navigate('CardApplyScreen', { identifier, name })}
            >
              <FontAwesome name="credit-card" size={26} color="#2756A2" />
              <Text style={tw`ml-3 text-gray-800 font-medium`}>Apply Card</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite Section */}
        <View style={tw`px-5 mt-6`}>
          <Text style={tw`text-base font-semibold text-gray-700 mb-2`}>
            Invite Friends
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-600 py-3 rounded-xl`}
            onPress={() => {
              appsFlyer.setAppInviteOneLinkID('HkUB', (res) => {
                console.log("setAppInviteOneLinkID: ", res)
                fetch('https://script.google.com/macros/s/AKfycbwtc4Gn367FMyA4s3owITC0xagHqbymYWtf-CL_4A6X06PSW33lzehWRV4hy2s5xLg/exec', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    os: os,
                    af_method: "setAppInviteOneLinkID",
                    data: res,
                  }),
                })
                  .then(res => res.text())
                  .then(console.log)
                  .catch(console.error);
              });
              appsFlyer.generateInviteLink(
                {
                  channel: 'AKA Banking Application',
                  campaign: 'AKA_Invite_App',
                  customerID: displayUser,
                  brandDomain: 'uat.akadigital.net',
                  baseDeepLink: 'aka://banking/SignupScreen',
                  userParams: {
                    deep_link_value: 'SignupScreen',
                    org_id: 'AKA',
                    account_id: 'AKADIGITAL',
                    referral_code: 'F59E0B',
                    af_sub1: 'C00134',
                    af_sub2: displayUser,
                    deep_link_sub2: '0066CC',
                    deep_link_sub3: displayUser,
                    af_force_deeplink: true,
                    af_dp: 'aka://banking/SignupScreen',
                    is_retargeting: true
                  },
                },
                (link) => setInviteLink(link),
                (err) => console.log(err)
              );
            }}
          >
            <Text style={tw`text-white text-center text-base font-semibold`}>
              Generate Invite Link
            </Text>
          </TouchableOpacity>

          {inviteLink ? (
            <View style={tw`mt-3 bg-white p-3 rounded-xl shadow-sm flex-row items-center`}>
              <Text
                style={tw`text-blue-600 flex-1`}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {inviteLink}
              </Text>
              <TouchableOpacity onPress={handleCopyInvite}>
                <FontAwesome name="clipboard" size={22} color="#2756A2" />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        {/* 🔥 Carousel Ads Section */}
        <View style={tw`mt-8`}>
          <Text style={tw`text-base font-semibold text-gray-700 px-5 mb-3`}>
            Latest Offers
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`px-5`}
          >
            {ads.map((loan) => (
              <TouchableOpacity
                key={loan.id}
                style={tw`mr-4 w-72 bg-white rounded-2xl shadow-md overflow-hidden`}
                onPress={() => navigation.navigate("LoanDetail", { loan })}
              >
                <Image
                  source={{ uri: loan.image }}
                  style={tw`w-full h-40`}
                  resizeMode="cover"
                />
                <View style={tw`p-4`}>
                  <Text style={tw`text-lg font-bold text-gray-800`}>
                    {loan.title}
                  </Text>
                  <Text style={tw`text-gray-600 mt-1`}>{loan.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Notification Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl p-5 h-[60%] shadow-lg`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-800`}>
                Notifications
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <FontAwesome name="times-circle" size={24} color="#2756A2" />
              </TouchableOpacity>
            </View>

            {notifications.length > 0 ? (
              notifications.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  style={tw`border-b border-gray-200 pb-3 mb-3`}
                  onPress={() => {
                    setShowModal(false);
                    setSelectedNotification(n);
                  }}
                >
                  <Text style={tw`text-base font-semibold text-gray-800`}>
                    {n.title}
                  </Text>
                  <Text style={tw`text-gray-600 mt-1`} numberOfLines={1}>
                    {n.message}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={tw`text-gray-500 text-center mt-10`}>
                No new notifications
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );

  return (
    <SafeAreaView style={[backgroundStyle, tw`flex-1`]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {selectedNotification ? (
        <NotificationDetailScreen notification={selectedNotification} />
      ) : (
        renderHomeContent()
      )}
    </SafeAreaView>
  );
};

const PaymentsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bg = isDarkMode ? '#111' : '#f8f9fa';
  const textColor = isDarkMode ? '#fff' : '#222';

  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // Log screen view
  const eventName = 'af_paymentsscreen';
  const eventValues = {
    af_screenid: '0',
    af_screenname: 'Payments Screen',
    af_deeplink: 'PaymentsScreen',
  };
  appsFlyer.logEvent(
    eventName,
    eventValues,
    (res) => console.log(eventName + ' triggered ' + res),
    (err) => console.error(err)
  );

  const handleConfirm = () => {
    if (!accountNumber || !amount) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }
    Alert.alert(
      'Payment Successful 🎉',
      `You sent ${amount}₫ to ${accountNumber}`,
      [{ text: 'OK' }]
    );

    // You can later add API call or AppsFlyer event here
    appsFlyer.logEvent(
      'af_payment_success',
      { af_amount: amount, af_account: accountNumber },
      () => console.log('Payment success logged'),
      (err) => console.error(err)
    );

    // Reset form
    setAccountNumber('');
    setAmount('');
    setNote('');
  };

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: bg }]}
      contentContainerStyle={tw`p-5`}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[tw`text-2xl font-bold mb-4`, { color: textColor }]}>
        Payments & Transfers
      </Text>

      <View style={tw`mb-4`}>
        <Text style={[tw`text-sm mb-2`, { color: textColor }]}>
          Recipient Account Number
        </Text>
        <View
          style={tw`flex-row items-center bg-white rounded-xl px-3 py-2 shadow-sm`}
        >
          <FontAwesome name="id-card-o" size={20} color="#2756A2" />
          <TextInput
            style={tw`flex-1 ml-2 text-base`}
            placeholder="Enter account number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={tw`mb-4`}>
        <Text style={[tw`text-sm mb-2`, { color: textColor }]}>Amount</Text>
        <View
          style={tw`flex-row items-center bg-white rounded-xl px-3 py-2 shadow-sm`}
        >
          <FontAwesome name="money" size={20} color="#2756A2" />
          <TextInput
            style={tw`flex-1 ml-2 text-base`}
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={tw`mb-6`}>
        <Text style={[tw`text-sm mb-2`, { color: textColor }]}>Note</Text>
        <View
          style={tw`flex-row items-center bg-white rounded-xl px-3 py-2 shadow-sm`}
        >
          <FontAwesome name="comment-o" size={20} color="#2756A2" />
          <TextInput
            style={tw`flex-1 ml-2 text-base`}
            placeholder="Optional note"
            value={note}
            onChangeText={setNote}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleConfirm}
        style={tw`bg-[#2756A2] py-4 rounded-2xl items-center shadow-md`}
      >
        <Text style={tw`text-white text-lg font-semibold`}>Confirm Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const fakeInsights = [
  { category: 'Food & Dining', amount: 3200000, color: '#FF8C00' },
  { category: 'Transportation', amount: 1800000, color: '#00BFFF' },
  { category: 'Shopping', amount: 2500000, color: '#FF69B4' },
  { category: 'Bills & Utilities', amount: 1400000, color: '#32CD32' },
  { category: 'Entertainment', amount: 900000, color: '#9370DB' },
];

const InsightsScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bg = isDarkMode ? '#111' : '#f8f9fa';
  const textColor = isDarkMode ? '#fff' : '#222';

  // Track event
  const eventName = 'af_insightsscreen';
  const eventValues = {
    af_screenid: '0',
    af_screenname: 'Insights Screen',
    af_deeplink: 'InsightsScreen',
  };
  appsFlyer.logEvent(
    eventName,
    eventValues,
    (res) => console.log(eventName + ' triggered ' + res),
    (err) => console.error(err)
  );

  const totalSpending = fakeInsights.reduce((sum, i) => sum + i.amount, 0);

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: bg }]}
      contentContainerStyle={tw`p-5`}
    >
      <Text style={[tw`text-2xl font-bold mb-4`, { color: textColor }]}>
        Spending Insights
      </Text>

      <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-5`}>
        <Text style={tw`text-gray-500 mb-2`}>This Month's Total Spending</Text>
        <Text style={tw`text-3xl font-bold text-[#2756A2] mb-3`}>
          {totalSpending.toLocaleString('vi-VN')}₫
        </Text>
        <Text style={tw`text-gray-500`}>Compared to last month: +12%</Text>
      </View>

      <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-5`}>
        <Text style={tw`text-lg font-semibold mb-4`}>Category Breakdown</Text>
        {fakeInsights.map((item, index) => {
          const barWidth = (item.amount / totalSpending) * 100;
          return (
            <View key={index} style={tw`mb-4`}>
              <View style={tw`flex-row justify-between mb-1`}>
                <Text style={tw`text-gray-700`}>{item.category}</Text>
                <Text style={tw`text-gray-600`}>
                  {item.amount.toLocaleString('vi-VN')}₫
                </Text>
              </View>
              <View style={tw`w-full h-3 bg-gray-200 rounded-full`}>
                <View
                  style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    backgroundColor: item.color,
                    borderRadius: 8,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>

      <View style={tw`bg-white rounded-2xl p-5 shadow-sm mb-5`}>
        <Text style={tw`text-lg font-semibold mb-4`}>Smart Tips</Text>

        <View style={tw`flex-row items-center mb-3`}>
          <FontAwesome name="lightbulb-o" size={34} color="#FFD700" />
          <Text style={tw`ml-2 text-gray-700 flex-1`}>
            You spent 30% more on Food this month — consider setting a meal
            budget next month.
          </Text>
        </View>

        <View style={tw`flex-row items-center mb-3`}>
          <FontAwesome name="home" size={22} color="#32CD32" />
          <Text style={tw`ml-2 text-gray-700 flex-1`}>
            You could save ₫500,000/month by switching to digital bills.
          </Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <FontAwesome name="credit-card" size={20} color="#2756A2" />
          <Text style={tw`ml-2 text-gray-700 flex-1`}>
            Most shopping happens on weekends — plan big purchases earlier for
            cashback deals.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const ProfileScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? '#111' : '#f8f9fa' };
  const textColor = isDarkMode ? '#fff' : '#222';

  const { identifier, name } = route.params || {};
  const displayUser = identifier || name || "Guest";

  // Track event
  const eventName = 'af_profilescreen';
  const eventValues = {
    af_screenid: '0',
    af_screenname: 'Profile Screen',
    af_deeplink: 'ProfileScreen',
  };
  appsFlyer.logEvent(
    eventName,
    eventValues,
    (res) => console.log(eventName + ' triggered ' + res),
    (err) => console.error(err)
  );

  // User Info State
  const [username, setUsername] = useState(displayUser);
  const [mobile, setMobile] = useState('0123456789');
  const [email, setEmail] = useState('cuong.truong@akadigital.vn');
  const [pushOptOut, setPushOptOut] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = () => {
    setModalVisible(false);
    Alert.alert(
      'Profile Updated',
      `✅ Name: ${username}\n📱 Mobile: ${mobile}\n📧 Email: ${email}\n🔕 Push Opt-Out: ${pushOptOut ? 'Yes' : 'No'}`
    );
  };

  return (
    <View style={[tw`flex-1 p-5`, backgroundStyle]}>
      <Text style={[tw`text-2xl font-bold mb-6`, { color: textColor }]}>
        Profile
      </Text>

      {/* User Info Card */}
      <View style={tw`bg-white rounded-2xl p-4 mb-6 shadow-sm`}>
        <Text style={tw`text-lg font-semibold text-gray-800 mb-2`}>
          {username}
        </Text>
        <Text style={tw`text-gray-600`}>{email}</Text>
        <Text style={tw`text-gray-600`}>{mobile}</Text>
      </View>

      {/* Settings */}
      <TouchableOpacity
        style={tw`flex-row items-center mb-4`}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome name="cog" size={24} color="#2756A2" />
        <Text style={tw`ml-3 text-base text-gray-700`}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center mb-4`}
        onPress={() => Alert.alert('Support', 'Pretend calling successful.')}
      >
        <FontAwesome name="users" size={22} color="#2756A2" />
        <Text style={tw`ml-3 text-base text-gray-700`}>Support</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <FontAwesome name="sign-out" size={24} color="#FF3B30" />
        <Text style={tw`ml-3 text-base text-red-600`}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl p-5`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-800`}>
                Edit Profile
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome name="times-circle" size={24} color="#2756A2" />
              </TouchableOpacity>
            </View>

            <Text style={tw`text-gray-700 mb-1`}>Full Name</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter name"
            />

            <Text style={tw`text-gray-700 mb-1`}>Mobile</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
              value={mobile}
              onChangeText={setMobile}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />

            <Text style={tw`text-gray-700 mb-1`}>Email</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-2 mb-3`}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
            />

            <View
              style={tw`flex-row items-center justify-between mt-2 mb-5 border-t border-gray-200 pt-3`}
            >
              <Text style={tw`text-gray-700 text-base`}>Push Notifications</Text>
              <Switch
                value={!pushOptOut}
                onValueChange={(val) => setPushOptOut(!val)}
                trackColor={{ false: '#ccc', true: '#2756A2' }}
              />
            </View>

            <TouchableOpacity
              style={tw`bg-blue-600 py-3 rounded-xl mb-3`}
              onPress={handleSave}
            >
              <Text style={tw`text-white text-center text-base font-semibold`}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const billPayments = [
  { id: '1', title: 'Electricity Bill', amount: '₫1,200,000', date: 'Oct 25, 2025', icon: 'bolt', color: '#F59E0B' },
  { id: '2', title: 'Water Bill', amount: '₫420,000', date: 'Oct 23, 2025', icon: 'tint', color: '#3B82F6' },
  { id: '3', title: 'Internet', amount: '₫350,000', date: 'Oct 18, 2025', icon: 'rss', color: '#10B981' },
];

const BillPaymentsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const { identifier, name } = route.params || {};
  const displayUser = identifier || name || "Guest";

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePayAll = () => {
    if (selected.length === 0) {
      Alert.alert('No bills selected', 'Please select at least one bill to pay.');
      return;
    }
    const selectedTitles = billPayments
      .filter((b) => selected.includes(b.id))
      .map((b) => b.title)
      .join(', ');
    Alert.alert('✅ Payment Successful', `Paid: ${selectedTitles}`);
    setSelected([]);
  };

  const handlePayOne = (item: any) => {
    Alert.alert('✅ Payment Successful', `Paid: ${item.title} (${item.amount})`);
    setSelected((prev) => prev.filter((x) => x !== item.id));
  };

  const renderItem = ({ item }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 5,
          elevation: 3,
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: item.color + '25',
            marginRight: 16,
          }}
        >
          <FontAwesome name={item.icon} size={26} color={item.color} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{item.title}</Text>
          <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{item.date}</Text>
        </View>

        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>{item.amount}</Text>

        {isSelected && (
          <FontAwesome
            name="check-circle"
            size={24}
            color="#10B981"
            style={{ marginLeft: 10 }}
          />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 }}>
        My Payments
      </Text>

      <FlatList
        data={billPayments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        onPress={handlePayAll}
        style={{
          backgroundColor: '#2756A2',
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          {selected.length > 0
            ? `Pay ${selected.length} Selected Bill${selected.length > 1 ? 's' : ''}`
            : 'Select Bills to Pay'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("MainTabs", { screen: 'Home', params: { identifier, name } })}
        style={{
          backgroundColor: selected.length > 0 ? '#2563EB' : '#9CA3AF',
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const historyData = [
  { id: '1', title: 'Coffee Shop', amount: '-₫75,000', date: 'Oct 26, 2025', icon: 'coffee', color: '#D97706' },
  { id: '2', title: 'Salary', amount: '+₫15,000,000', date: 'Oct 20, 2025', icon: 'money', color: '#16A34A' },
  { id: '3', title: 'Grocery Store', amount: '-₫560,000', date: 'Oct 18, 2025', icon: 'shopping-cart', color: '#2563EB' },
];

const HistoriesScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { identifier, name } = route.params || {};
  const displayUser = identifier || name || "Guest";
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: item.color + '25',
          marginRight: 16,
        }}
      >
        <FontAwesome name={item.icon} size={26} color={item.color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{item.title}</Text>
        <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{item.date}</Text>
      </View>

      <Text style={[{ fontSize: 15, fontWeight: '700', color: '#111827' }, { color: item.amount.startsWith('+') ? '#16A34A' : '#DC2626' }]}>{item.amount}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 }}>Transaction History</Text>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("MainTabs", { screen: 'Home', params: { identifier, name } })}
        style={{
          backgroundColor: '#2756A2',
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const DepositScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const [termMonth, setTermMonth] = useState<number | null>(null);
  const [interestRate, setInterestRate] = useState<number | null>(null);
  const [finalAmount, setFinalAmount] = useState<number | null>(null);
  const [interestType, setInterestType] = useState("Lãi cuối kỳ");

  const [showTermDropdown, setShowTermDropdown] = useState(false);
  const [showInterestTypeDropdown, setShowInterestTypeDropdown] = useState(false);

  // Coupon
  const [coupon, setCoupon] = useState('');
  const [bonusRate, setBonusRate] = useState<number>(0);

  const startedRef = useRef(false);

  const { identifier, name } = route.params || {};
  const displayUser = identifier || name || "Guest";

  // Track when user first interacts
  const trackSavingOpen = () => {
    if (startedRef.current) return;

    startedRef.current = true;

    CleverTap.recordEvent("app_saving_open", {
      saving_amount: amount ? parseFloat(amount) : null,
      saving_term: termMonth || null,
      product_type: "Tiết kiệm online",
      interest_type: interestType,
      currency: "VND",
      auto_renew_preference: false,
    });
  };

  // Term options
  const TERM_OPTIONS = [
    { label: "3 tháng", value: 3, interest: 5.2 },
    { label: "6 tháng", value: 6, interest: 5.8 },
    { label: "12 tháng", value: 12, interest: 7.2 },
  ];

  const INTEREST_TYPES = ["Lãi cuối kỳ", "Lãi định kỳ", "Lãi trả trước"];

  // Tính tiền cuối kỳ
  const calculateFinal = (input: string, term: number | null) => {
    const v = parseFloat(input);
    if (!v || !term) return;

    const selected = TERM_OPTIONS.find(t => t.value === term);
    if (!selected) return;

    const totalInterest = selected.interest + bonusRate;

    setInterestRate(totalInterest);

    const total = v + (v * (totalInterest / 100) * (term / 12));
    setFinalAmount(total);
  };

  useEffect(() => {
    calculateFinal(amount, termMonth);
  }, [amount, termMonth, bonusRate]);

  // Áp dụng coupon
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    let bonus = 0;

    switch (code) {
      case "VIP5":
        bonus = 0.5;
        break;
      case "SAVE10":
        bonus = 1.0;
        break;
      case "SAVEBONUS":
        bonus = 0.3;
        break;
      default:
        bonus = 0;
        Alert.alert("Sai mã", "Coupon không hợp lệ");
        break;
    }

    setBonusRate(bonus);

    // CleverTap.recordEvent("app_saving_coupon_applied", {
    //   coupon_code: code,
    //   bonus_interest: bonus,
    //   saving_amount: parseFloat(amount) || null,
    //   saving_term: termMonth
    // });

    if (bonus > 0) {
      Alert.alert("Thành công", `Bạn được cộng thêm ${bonus}% lãi suất!`);
    }

    calculateFinal(amount, termMonth);
  };

  // Submit giao dịch
  const handleDeposit = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0 || !termMonth) {
      Alert.alert('Missing information', 'Please enter full deposit information.');
      return;
    }
    const code = coupon.trim().toUpperCase()

    const savingId = "SV" + Date.now();
    const startDate = new Date();
    const maturityDate = new Date();
    maturityDate.setMonth(startDate.getMonth() + termMonth);

    // Track success
    CleverTap.recordEvent("app_saving_success", {
      saving_id: savingId,
      product_type: "Tiết kiệm online",
      saving_amount: value,
      currency: "VND",
      interest_rate: interestRate,
      term_month: termMonth,
      interest_type: interestType,
      coupon_bonus_rate: bonusRate,
      start_date: startDate.toISOString(),
      maturity_date: maturityDate.toISOString(),
      coupon_code: code
    });

    Alert.alert("Deposit Successful", `You deposited ${value} đ`);

    setAmount('');
    setBonusRate(0);
    setCoupon('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB', padding: 16, justifyContent: 'space-between' }}>

      <View>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 }}>
          Deposit Funds
        </Text>

        {/* Amount */}
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 }}
          keyboardType="numeric"
          placeholder="Enter amount"
          value={amount}
          onChangeText={(v) => {
            setAmount(v);
            trackSavingOpen();
          }}
        />

        {/* TERM DROPDOWN BUTTON */}
        <TouchableOpacity
          onPress={() => {
            setShowTermDropdown(true);
            trackSavingOpen();
          }}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 }}
        >
          <Text>{termMonth ? `${termMonth} tháng` : "Chọn kỳ hạn gửi"}</Text>
        </TouchableOpacity>

        {/* TERM DROPDOWN MODAL */}
        <Modal visible={showTermDropdown} transparent animationType="fade">
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'center', padding: 20 }}
            onPress={() => setShowTermDropdown(false)}
            activeOpacity={1}
          >
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
              {TERM_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={{ paddingVertical: 12 }}
                  onPress={() => {
                    setTermMonth(opt.value);
                    setShowTermDropdown(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* INTEREST TYPE SELECT */}
        <TouchableOpacity
          onPress={() => setShowInterestTypeDropdown(true)}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 }}
        >
          <Text>{interestType}</Text>
        </TouchableOpacity>

        {/* INTEREST TYPE MODAL */}
        <Modal visible={showInterestTypeDropdown} transparent animationType="fade">
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'center', padding: 20 }}
            onPress={() => setShowInterestTypeDropdown(false)}
            activeOpacity={1}
          >
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
              {INTEREST_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={{ paddingVertical: 12 }}
                  onPress={() => {
                    setInterestType(t);
                    setShowInterestTypeDropdown(false);
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Coupon input */}
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12
          }}
          placeholder="Nhập coupon (VIP5, SAVE10...)"
          value={coupon}
          onChangeText={setCoupon}
        />

        <TouchableOpacity
          onPress={applyCoupon}
          style={{
            backgroundColor: '#2756A2',
            paddingVertical: 10,
            borderRadius: 8,
            marginBottom: 16,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            Áp dụng Coupon
          </Text>
        </TouchableOpacity>

        {/* Auto values */}
        {interestRate && (
          <Text style={{ marginTop: 8, fontSize: 16 }}>
            Lãi suất: <Text style={{ fontWeight: 'bold' }}>{interestRate}%/năm</Text>
          </Text>
        )}

        {bonusRate > 0 && (
          <Text style={{ marginTop: 4, fontSize: 15, color: 'green' }}>
            + Ưu đãi coupon: {bonusRate}%/năm
          </Text>
        )}

        {finalAmount && (
          <Text style={{ marginTop: 8, fontSize: 16 }}>
            Tổng tiền cuối kỳ: <Text style={{ fontWeight: 'bold' }}>{finalAmount.toFixed(0)} đ</Text>
          </Text>
        )}

        {/* Submit */}
        <TouchableOpacity
          onPress={handleDeposit}
          style={{
            backgroundColor: '#2756A2',
            paddingVertical: 14,
            borderRadius: 12,
            marginTop: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Deposit
          </Text>
        </TouchableOpacity>
      </View>

      {/* HOME BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate("MainTabs", { screen: 'Home', params: { identifier, name } })}
        style={{
          backgroundColor: '#2756A2',
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const cardTypes = [
  {
    id: "debit",
    name: "Debit Card",
    desc: "Spend with the current balance in the account.",
    image: require('./AppImages/debit_card.png')
  },
  {
    id: "credit",
    name: "Credit Card",
    desc: "Buy now – pay later with credit limit.",
    image: require('./AppImages/credit_card.png')
  },
  {
    id: "virtual",
    name: "Virtual Card",
    desc: "Safe and fast online payment.",
    image: require('./AppImages/virtual_card.png')
  },
  {
    id: "prepaid",
    name: "Prepaid Card",
    desc: "Top up before use, no account required.",
    image: require('./AppImages/prepaid_card.png')
  }
];

const CardApplyScreen = ({ navigation, route }) => {
  const { identifier, name } = route?.params || {};
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={tw`flex-1 bg-gray-100 p-5`}>
      <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>
        Select Card
      </Text>

      <FlatList
        data={cardTypes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelected(item.id)}
            style={[
              tw`rounded-2xl mb-5 overflow-hidden`,
              {
                backgroundColor: "#fff",
                borderWidth: selected === item.id ? 2 : 0,
                borderColor: selected === item.id ? "#3B82F6" : "transparent",
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 4 },
                elevation: 5,
              }
            ]}
          >
            {/* Card Image */}
            <Image
              source={item.image}
              style={{ width: 380, height: 200, borderRadius: 16, marginLeft: -15 }}
            />

            {/* Card Text */}
            <View style={tw`p-4`}>
              <Text style={tw`text-xl font-bold text-gray-900`}>{item.name}</Text>
              <Text style={tw`text-gray-600 mt-1`}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Register Button */}
      <TouchableOpacity
        onPress={() => {
          if (!selected) return alert("Select one card.");
          alert(`Apply ${selected.toUpperCase()} successfully!`);
        }}
        style={{
          backgroundColor: '#2756A2',
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Apply Card
        </Text>
      </TouchableOpacity>

      {/* Back to Home */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("MainTabs", {
            screen: "Home",
            params: { identifier, name }
          })
        }
        style={{
          backgroundColor: '#9CA3AF',
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const TabNavigator = ({ route }: any) => {
  const { identifier, name } = route.params || {};
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#2756A2',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          borderTopWidth: 0.5,
          borderColor: '#ddd',
          backgroundColor: '#fff',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Payments') iconName = 'money';
          else if (route.name === 'Insights') iconName = 'bar-chart';
          else if (route.name === 'Stock') iconName = 'line-chart';
          else iconName = 'user';
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ identifier, name }} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Stock" component={StockTradingApp}/>
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ identifier, name }} />
    </Tab.Navigator>
  )
};

const App: React.FC = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth flow */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="BillPaymentsScreen" component={BillPaymentsScreen} />
        <Stack.Screen name="HistoriesScreen" component={HistoriesScreen} />
        <Stack.Screen name="DepositScreen" component={DepositScreen} />
        <Stack.Screen name="CardApplyScreen" component={CardApplyScreen} />
        <Stack.Screen
          name="LoanDetail"
          component={LoanDetailScreen}
          options={{
            title: "Loan Details",
            headerTitleStyle: { fontSize: 18, fontWeight: "600" },
            // headerShadowVisible: false,
            headerShown: true,                  // Chỉ bật cho LoanDetail
          }}
        />

        {/* Main app with bottom tabs */}
        <Stack.Screen
          name="LoanRegister"
          component={LoanRegisterScreen}
          options={{ title: "Đăng ký khoản vay" }}
        />

        <Stack.Screen name="MainTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginTop: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
});

export default App;
