// src/screens/login.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Linking,
  useColorScheme,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrackingStatus, getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';
import CleverTap from 'clevertap-react-native';
import appsFlyer from 'react-native-appsflyer';
import tw from 'twrnc';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * 🔑 Khai báo kiểu props cho navigation
 * (đổi RootStackParamList theo app của bạn)
 */
type RootStackParamList = {
  Login: undefined;
  SignupScreen: any;
  MainTabs: { identifier: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const os = Platform.OS;

  const [trackingStatus, setTrackingStatus] =
    useState<TrackingStatus | '(loading)'>('(loading)');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('abc');

  const [referralCodeOnInstall, setReferralCodeOnInstall] = useState('');
  const [referralUserIdOnInstall, setReferralUserIdOnInstall] = useState('');
  const [referralCodeOnDeeplink, setReferralCodeOnDeeplink] = useState('');
  const [referralUserIdOnDeeplink, setReferralUserIdOnDeeplink] = useState('');

  // ===============================
  // 🎯 AUTO EVENT HANDLER
  // ===============================
  const handleAutoEvent = (payload: any) => {
    if (!payload || payload.type !== 'event') return;
    if (!payload.event_name) return;

    const properties: Record<string, any> = {};
    Object.keys(payload).forEach((key) => {
      if (key !== 'type' && key !== 'event_name') {
        properties[key] = payload[key];
      }
    });

    CleverTap.recordEvent(payload.event_name, properties);
  };

  // ===============================
  // 🎯 INIT SDKs
  // ===============================
  useEffect(() => {
    const init = async () => {
      try {
        const status = await getTrackingStatus();
        setTrackingStatus(status);

        const newStatus = await requestTrackingPermission();
        setTrackingStatus(newStatus);

        CleverTap.registerForPush();

        CleverTap.addListener(
          CleverTap.CleverTapPushNotificationClicked,
          handleAutoEvent
        );
      } catch (e: any) {
        Alert.alert('Error', e?.toString?.() ?? 'Unknown error');
      }
    };

    init();
  }, []);

  // ===============================
  // 🎯 APPSFLYER INIT
  // ===============================
  useEffect(() => {
    appsFlyer.initSdk(
      {
        devKey: 'cYmtVpJCBSET23rRv4GWXa',
        appId: '6754323492',
        isDebug: true,
        onInstallConversionDataListener: true,
        onDeepLinkListener: true,
      },
      console.log,
      console.error
    );
  }, []);

  // ===============================
  // 🔐 LOGIN
  // ===============================
  const validatePhone = (phone: string) => /^\84\d{8,10}$/.test(phone);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter phone number and password');
      return;
    }

    if (!validatePhone(identifier)) {
      Alert.alert('Error', 'Số điện thoại phải ở dạng 84xxxxxxxx');
      return;
    }

    try {
      const userJson = await AsyncStorage.getItem(`user_${identifier}`);
      if (!userJson) {
        Alert.alert('Error', 'Số điện thoại chưa được đăng ký');
        return;
      }

      const user = JSON.parse(userJson);
      if (user.password !== password) {
        Alert.alert('Error', 'Sai mật khẩu');
        return;
      }

      CleverTap.onUserLogin({
        Identity: identifier,
        Phone: identifier,
        'MSG-push': true,
      });

      appsFlyer.setCustomerUserId(identifier);

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { identifier } }],
      });
    } catch (e: any) {
      Alert.alert('Login failed', e?.message || 'Unknown error');
    }
  };

  // ===============================
  // 🧩 UI
  // ===============================
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white justify-center px-6`}
    >
      <View style={tw`items-center mb-10`}>
        <Image
          source={require('../AppImages/logo_transparent.png')}
          style={tw`w-18 h-18`}
          resizeMode="contain"
        />
        <Text style={tw`text-2xl font-bold mt-4 text-gray-800`}>
          Welcome Back
        </Text>
      </View>

      <View style={tw`mb-4`}>
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-4 py-3`}
          placeholder="+84xxxxxxxx"
          keyboardType="phone-pad"
          value={identifier}
          onChangeText={setIdentifier}
        />
      </View>

      <View style={tw`mb-6`}>
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-4 py-3`}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={tw`bg-blue-600 py-3 rounded-xl`}
      >
        <Text style={tw`text-white text-center text-lg font-semibold`}>
          Log In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`mt-6`}
        onPress={() => navigation.navigate('SignupScreen')}
      >
        <Text style={tw`text-center text-blue-600`}>
          Don’t have an account? <Text style={tw`font-bold`}>Sign Up</Text>
        </Text>
      </TouchableOpacity>

      <View style={tw`items-center mt-4`}>
        <Text>Tracking Status: {trackingStatus}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
