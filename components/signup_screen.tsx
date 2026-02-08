import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FontAwesome } from "@react-native-vector-icons/fontawesome";
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import appsFlyer from 'react-native-appsflyer';
import CleverTap from 'clevertap-react-native';
import tw from 'twrnc';

/* -----------------------
   Navigation types
------------------------ */
type RootStackParamList = {
  SignupScreen: {
    referralCodeOnInstall?: string;
    referralUserIdOnInstall?: string;
    referralCodeOnDeeplink?: string;
    referralUserIdOnDeeplink?: string;
  };
  LoginScreen: undefined;
  MainTabs: { name?: string };
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'SignupScreen'
>;

const SignupScreen: React.FC<Props> = ({ route, navigation }) => {
  /* -----------------------
     State
  ------------------------ */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  /* -----------------------
     Referral handling
  ------------------------ */
  const referralCodeOnInstall = route.params?.referralCodeOnInstall || '';
  const referralUserIdOnInstall =
    route.params?.referralUserIdOnInstall || '';

  const referralCodeOnDeeplink =
    route.params?.referralCodeOnDeeplink || '';
  const referralUserIdOnDeeplink =
    route.params?.referralUserIdOnDeeplink || '';

  const activeReferralCode =
    referralCodeOnDeeplink || referralCodeOnInstall || '';
  const activeReferralUserId =
    referralUserIdOnDeeplink || referralUserIdOnInstall || '';

  /* -----------------------
     AppsFlyer screen tracking
  ------------------------ */
  appsFlyer.logEvent(
    'af_signupscreen',
    {
      af_screenid: '2',
      af_screenname: 'Signup Screen',
      af_deeplink: 'SignupScreen',
    },
    () => {},
    () => {},
  );

  /* -----------------------
     Handle Signup
  ------------------------ */
  const handleSignup = async () => {
    if (!name || !email || !password || !phoneNumber) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (!phoneNumber.startsWith('84')) {
      Alert.alert('Invalid phone', 'Phone number must start with 84');
      return;
    }

    // Create customer_id
    const digits = phoneNumber.replace(/\D/g, '');
    const last3 = digits.slice(-3);
    const customer_id = `${email}_${last3}`;

    try {
      // Save user locally (mock signup)
      await AsyncStorage.setItem(
        `user_${phoneNumber}`,
        JSON.stringify({
          name,
          email,
          phoneNumber,
          password,
          customer_id,
        }),
      );

      /* -----------------------
         CleverTap identify
      ------------------------ */
      CleverTap.onUserLogin({
        Name: name,
        Identity: customer_id,
        Email: email,
        Phone: `+${phoneNumber}`, // ✅ FIX BUG ở đây
        mobile: phoneNumber,
        Gender: 'M',
        DOB: new Date('2003-03-15T06:35:31'),
        'MSG-email': true,
        'MSG-push': true,
        'MSG-sms': false,
        'MSG-whatsapp': true,
      });

      CleverTap.recordEvent('register_success', {
        name,
        email,
        phone: phoneNumber,
        customer_id,
        referral_code: activeReferralCode || null,
        referral_user_id: activeReferralUserId || null,
      });

      // AppsFlyer
      appsFlyer.setCustomerUserId(customer_id, () => {});

      // Navigate to app
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { name } }],
      });
    } catch (e: any) {
      Alert.alert('Signup failed', e?.message || 'Unknown error');
    }
  };

  /* -----------------------
     UI
  ------------------------ */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 justify-center items-center bg-white px-6`}
    >
      <Text style={tw`text-2xl font-bold text-blue-600 mb-6`}>
        Create Account
      </Text>

      {/* Name */}
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full`}>
        <MaterialIcons name="person" size={22} color="#555" />
        <TextInput
          style={tw`flex-1 ml-2`}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email */}
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full`}>
        <MaterialIcons name="email" size={22} color="#555" />
        <TextInput
          style={tw`flex-1 ml-2`}
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Phone */}
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full`}>
        <MaterialIcons name="phone" size={22} color="#555" />
        <TextInput
          style={tw`flex-1 ml-2`}
          placeholder="Phone number (84...)"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* Password */}
      <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-6 w-full`}>
        <MaterialIcons name="lock" size={22} color="#555" />
        <TextInput
          style={tw`flex-1 ml-2`}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Referral */}
      {activeReferralCode ? (
        <View style={tw`flex-row items-center mb-3`}>
          <Text>
            Referral Code:{' '}
            <Text style={tw`font-bold text-blue-600`}>
              {activeReferralCode}
            </Text>
          </Text>
          <TouchableOpacity
            onPress={() => Clipboard.setString(activeReferralCode)}
            style={tw`ml-3`}
          >
            <FontAwesome name="clipboard" size={18} color="#2756A2" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Signup Button */}
      <TouchableOpacity
        style={tw`bg-blue-600 rounded-lg w-full py-3`}
        onPress={handleSignup}
      >
        <Text style={tw`text-white text-center text-lg font-semibold`}>
          Sign Up
        </Text>
      </TouchableOpacity>

      {/* Login */}
      <TouchableOpacity
        onPress={() => navigation.navigate('LoginScreen')}
        style={tw`mt-4`}
      >
        <Text style={tw`text-gray-600`}>
          Already have an account?{' '}
          <Text style={tw`text-blue-600 font-semibold`}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
