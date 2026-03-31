import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
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

/* -----------------------
   STEP 1: SIGNUP FORM SCREEN
------------------------ */
const Step1SignupForm: React.FC<{
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  activeReferralCode: string;
  onNameChange: (text: string) => void;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onPhoneChange: (text: string) => void;
  onNext: () => void;
  onLogin: () => void;
}> = ({
  name,
  email,
  password,
  phoneNumber,
  activeReferralCode,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onPhoneChange,
  onNext,
  onLogin,
}) => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={tw`flex-1 bg-white px-6`}
      >
        <ScrollView showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={tw`px-6 pt-40 pb-8`}>
          {/* Header */}
          <View style={tw`mb-10`}>
            <Text style={tw`text-3xl font-bold text-gray-900 mb-2`}>
              Create Account
            </Text>
            <Text style={tw`text-gray-500`}>
              Step 1 of 3 · Personal Information
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={tw`mb-8`}>
            <View style={tw`flex-row h-1.5 bg-gray-200 rounded-full overflow-hidden`}>
              <View style={tw`w-1/3 bg-blue-600`} />
            </View>
          </View>


          {/* Name */}
          <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-3 mb-4 w-full`}>
            <MaterialIcons name="person" size={22} color="#555" />
            <TextInput
              style={tw`flex-1 ml-2`}
              placeholder="Full Name"
              value={name}
              onChangeText={onNameChange}
            />
          </View>

          {/* Email */}
          <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-3 mb-4 w-full`}>
            <MaterialIcons name="email" size={22} color="#555" />
            <TextInput
              style={tw`flex-1 ml-2`}
              placeholder="Email"
              autoCapitalize="none"
              value={email}
              onChangeText={onEmailChange}
            />
          </View>

          {/* Phone */}
          <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-3 mb-4 w-full`}>
            <MaterialIcons name="phone" size={22} color="#555" />
            <TextInput
              style={tw`flex-1 ml-2`}
              placeholder="Phone number (84...)"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={onPhoneChange}
            />
          </View>

          {/* Password */}
          <View style={tw`flex-row items-center border border-gray-300 rounded-lg px-3 py-3 mb-6 w-full`}>
            <MaterialIcons name="lock" size={22} color="#555" />
            <TextInput
              style={tw`flex-1 ml-2`}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={onPasswordChange}
            />
          </View>

          {/* Referral Code */}
          {activeReferralCode && (
            <View style={tw`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6`}>
              <View style={tw`flex-row items-center justify-between`}>
                <View>
                  <Text style={tw`text-blue-600 text-xs font-semibold mb-1`}>
                    Referral Code
                  </Text>
                  <Text style={tw`text-blue-900 font-bold text-lg`}>
                    {activeReferralCode}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => Clipboard.setString(activeReferralCode)}
                  style={tw`p-2`}
                >
                  <FontAwesome name="clipboard" size={20} color="#2756A2" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Next Button */}
          <TouchableOpacity
            style={tw`bg-blue-600 rounded-lg w-full py-4 mb-3`}
            onPress={onNext}
          >
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              Next
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity onPress={onLogin} style={tw`py-2`}>
            <Text style={tw`text-gray-600 text-center`}>
              Already have an account?{' '}
              <Text style={tw`text-blue-600 font-semibold`}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

/* -----------------------
   STEP 2: FACE ID VERIFICATION
------------------------ */
const Step2FaceIDVerification: React.FC<{
  isLoading: boolean;
  onCapture: () => void;
  onNext: () => void;
}> = ({ isLoading, onCapture, onNext }) => {
  const [isFaceVerified, setIsFaceVerified] = useState(false);

  const handleCapture = async () => {
    await onCapture();
    setIsFaceVerified(true);
  };

  return (
    <ScrollView
      contentContainerStyle={tw`flex-grow justify-center items-center bg-white px-6 py-8`}
    >
      {/* Header */}
      <View style={tw`mb-8 w-full`}>
        <Text style={tw`text-2xl font-bold text-blue-600 mb-2`}>
          Face ID Verification
        </Text>
        <Text style={tw`text-gray-600`}>Step 2 of 3 - NFC Verification</Text>
      </View>

      {/* Progress Bar */}
      <View style={tw`mb-8 flex-row gap-2 w-full`}>
        <View style={tw`flex-1 h-1 bg-blue-600 rounded-full`} />
        <View style={tw`flex-1 h-1 bg-blue-600 rounded-full`} />
        <View style={tw`flex-1 h-1 bg-gray-300 rounded-full`} />
      </View>

      {/* Camera Placeholder */}
      <View
        style={[
          tw`w-full rounded-lg border-2 border-dashed border-gray-300 items-center justify-center mb-8`,
          { height: 320 },
        ]}
      >
        {isFaceVerified ? (
          <View style={tw`items-center`}>
            <MaterialIcons name="face" size={100} color="#27ae60" />
            <Text style={tw`text-green-600 font-bold text-lg mt-4`}>
              Face Verified ✓
            </Text>
          </View>
        ) : (
          <View style={tw`items-center`}>
            <MaterialIcons name="camera-front" size={80} color="#999" />
            <Text style={tw`text-gray-600 mt-3 text-base font-semibold`}>
              Camera Placeholder
            </Text>
            <Text style={tw`text-gray-500 mt-1 text-xs`}>
              Mock Face ID Verification
            </Text>
          </View>
        )}
      </View>

      {/* Instructions */}
      <View style={tw`bg-blue-50 rounded-lg p-4 mb-8 w-full`}>
        <Text style={tw`text-blue-900 font-semibold mb-3`}>
          📋 Instructions:
        </Text>
        <Text style={tw`text-blue-800 text-sm mb-2`}>
          • Ensure good lighting
        </Text>
        <Text style={tw`text-blue-800 text-sm mb-2`}>
          • Face must be clearly visible
        </Text>
        <Text style={tw`text-blue-800 text-sm mb-2`}>
          • Remove glasses/masks if possible
        </Text>
        <Text style={tw`text-blue-800 text-sm`}>
          • Stay within the frame
        </Text>
      </View>

      {/* Capture Button */}
      <TouchableOpacity
        style={[
          tw`bg-blue-600 rounded-lg w-full py-4 mb-3`,
          (isLoading || isFaceVerified) && tw`opacity-50`,
        ]}
        onPress={handleCapture}
        disabled={isLoading || isFaceVerified}
      >
        {isLoading ? (
          <View style={tw`flex-row items-center justify-center gap-2`}>
            <ActivityIndicator size="small" color="white" />
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              Capturing...
            </Text>
          </View>
        ) : (
          <Text style={tw`text-white text-center text-lg font-semibold`}>
            {isFaceVerified ? 'Face Captured' : 'Capture Face'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Next Button */}
      {isFaceVerified && (
        <TouchableOpacity
          style={tw`bg-green-600 rounded-lg w-full py-4`}
          onPress={onNext}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>
            Continue
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

/* -----------------------
   STEP 3: ID CARD VERIFICATION
------------------------ */
const Step3IDCardVerification: React.FC<{
  isLoading: boolean;
  onCapture: () => void;
  onNext: () => void;
}> = ({ isLoading, onCapture, onNext }) => {
  const [isIDVerified, setIsIDVerified] = useState(false);

  const handleCapture = async () => {
    await onCapture();
    setIsIDVerified(true);
  };

  return (
    <ScrollView
      contentContainerStyle={tw`flex-grow justify-center items-center bg-white px-6 py-8`}
    >
      {/* Header */}
      <View style={tw`mb-8 w-full`}>
        <Text style={tw`text-2xl font-bold text-blue-600 mb-2`}>
          ID Card Verification
        </Text>
        <Text style={tw`text-gray-600`}>
          Step 3 of 3 - Scan your ID card
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={tw`mb-8 flex-row gap-2 w-full`}>
        <View style={tw`flex-1 h-1 bg-blue-600 rounded-full`} />
        <View style={tw`flex-1 h-1 bg-blue-600 rounded-full`} />
        <View style={tw`flex-1 h-1 bg-blue-600 rounded-full`} />
      </View>

      {/* Camera Placeholder */}
      <View
        style={[
          tw`w-full rounded-lg border-2 border-dashed border-gray-300 items-center justify-center mb-8`,
          { height: 320 },
        ]}
      >
        {isIDVerified ? (
          <View style={tw`items-center`}>
            <MaterialIcons name="credit-card" size={100} color="#27ae60" />
            <Text style={tw`text-green-600 font-bold text-lg mt-4`}>
              ID Verified ✓
            </Text>
          </View>
        ) : (
          <View style={tw`items-center`}>
            <MaterialIcons name="camera" size={80} color="#999" />
            <Text style={tw`text-gray-600 mt-3 text-base font-semibold`}>
              ID Card Placeholder
            </Text>
            <Text style={tw`text-gray-500 mt-1 text-xs`}>
              Mock ID Card Scanning
            </Text>
          </View>
        )}
      </View>

      {/* Instructions */}
      <View style={tw`bg-blue-50 rounded-lg p-4 mb-8 w-full`}>
        <Text style={tw`text-blue-900 font-semibold mb-3`}>
          📋 What to scan:
        </Text>
        <Text style={tw`text-blue-800 text-sm mb-2`}>
          • Căn Cước Công Dân (Citizen ID Card)
        </Text>
        <Text style={tw`text-blue-800 text-sm mb-2`}>
          • All information must be clearly visible
        </Text>
        <Text style={tw`text-blue-800 text-sm mb-2`}>
          • Avoid glare and shadows
        </Text>
        <Text style={tw`text-blue-800 text-sm`}>
          • Scan front side only
        </Text>
      </View>

      {/* Capture Button */}
      <TouchableOpacity
        style={[
          tw`bg-blue-600 rounded-lg w-full py-4 mb-3`,
          (isLoading || isIDVerified) && tw`opacity-50`,
        ]}
        onPress={handleCapture}
        disabled={isLoading || isIDVerified}
      >
        {isLoading ? (
          <View style={tw`flex-row items-center justify-center gap-2`}>
            <ActivityIndicator size="small" color="white" />
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              Scanning...
            </Text>
          </View>
        ) : (
          <Text style={tw`text-white text-center text-lg font-semibold`}>
            {isIDVerified ? 'ID Captured' : 'Scan ID Card'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Next Button */}
      {isIDVerified && (
        <TouchableOpacity
          style={tw`bg-green-600 rounded-lg w-full py-4`}
          onPress={onNext}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>
            Complete Registration
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

/* -----------------------
   MAIN SIGNUP SCREEN
------------------------ */
const SignupScreen: React.FC<Props> = ({ route, navigation }) => {
  /* -----------------------
     State
  ------------------------ */
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  useEffect(() => {
    appsFlyer.logEvent(
      'af_signupscreen',
      {
        af_screenid: '2',
        af_screenname: `Signup Screen - Step ${currentStep}`,
        af_deeplink: 'SignupScreen',
      },
      () => { },
      () => { },
    );
  }, [currentStep]);

  /* -----------------------
     CleverTap tracking
  ------------------------ */
  useEffect(() => {
    CleverTap.recordEvent(`app_signup_step_${currentStep}_opened`, {
      screen_name: `Signup Step ${currentStep}`,
      referral_code: activeReferralCode || null,
      timestamp: new Date().toISOString(),
    });
  }, [currentStep]);

  /* -----------------------
     Step 1: Validation & Next
  ------------------------ */
  const handleStep1Next = () => {
    if (!name || !email || !password || !phoneNumber) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    if (!phoneNumber.startsWith('84')) {
      Alert.alert('Invalid phone', 'Phone number must start with 84');
      return;
    }

    // Track step 1 complete
    CleverTap.recordEvent('app_signup_step_1_completed', {
      name,
      email,
      phone: phoneNumber,
      timestamp: new Date().toISOString(),
    });

    setCurrentStep(2);
  };

  /* -----------------------
     Step 2: Face Capture
  ------------------------ */
  const handleFaceCapture = async () => {
    setIsLoading(true);
    // Simulate capture
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    CleverTap.recordEvent('app_signup_face_captured', {
      timestamp: new Date().toISOString(),
    });
  };

  const handleStep2Next = () => {
    setCurrentStep(3);
  };

  /* -----------------------
     Step 3: ID Card Capture
  ------------------------ */
  const handleIDCapture = async () => {
    setIsLoading(true);
    // Simulate capture
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    CleverTap.recordEvent('app_signup_id_captured', {
      timestamp: new Date().toISOString(),
    });
  };

  /* -----------------------
     Step 3: Complete Signup
  ------------------------ */
  const handleStep3Complete = async () => {
    setIsLoading(true);

    try {
      // Create customer_id
      const digits = phoneNumber.replace(/\D/g, '');
      const last3 = digits.slice(-3);
      const customer_id = `${email}_${last3}`;

      // Save user locally (mock signup)
      await AsyncStorage.setItem(
        `user_${phoneNumber}`,
        JSON.stringify({
          name,
          email,
          phoneNumber,
          password,
          customer_id,
          signup_completed_at: new Date().toISOString(),
        }),
      );

      /* -----------------------
         CleverTap identify
      ------------------------ */
      CleverTap.onUserLogin({
        Name: name,
        Identity: customer_id,
        Email: email,
        Phone: `+${phoneNumber}`,
        mobile: phoneNumber,
        Gender: 'M',
        DOB: new Date('2003-03-15T06:35:31'),
        'MSG-email': true,
        'MSG-push': true,
        'MSG-sms': false,
        'MSG-whatsapp': true,
      });

      CleverTap.recordEvent('app_signup_completed', {
        name,
        email,
        phone: phoneNumber,
        customer_id,
        referral_code: activeReferralCode || null,
        referral_user_id: activeReferralUserId || null,
        timestamp: new Date().toISOString(),
      });

      // AppsFlyer
      appsFlyer.setCustomerUserId(customer_id, () => { });

      // Save current user
      await AsyncStorage.setItem('currentUser', JSON.stringify({
        name,
        email,
        phoneNumber,
        customer_id,
      }));

      // Navigate to app
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs', params: { name } }],
      });
    } catch (e: any) {
      Alert.alert('Signup failed', e?.message || 'Unknown error');
      setIsLoading(false);
    }
  };

  /* -----------------------
     Render based on step
  ------------------------ */
  switch (currentStep) {
    case 1:
      return (
        <Step1SignupForm
          name={name}
          email={email}
          password={password}
          phoneNumber={phoneNumber}
          activeReferralCode={activeReferralCode}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onPhoneChange={setPhoneNumber}
          onNext={handleStep1Next}
          onLogin={() => navigation.navigate('LoginScreen')}
        />
      );

    case 2:
      return (
        <Step2FaceIDVerification
          isLoading={isLoading}
          onCapture={handleFaceCapture}
          onNext={handleStep2Next}
        />
      );

    case 3:
      return (
        <Step3IDCardVerification
          isLoading={isLoading}
          onCapture={handleIDCapture}
          onNext={handleStep3Complete}
        />
      );

    default:
      return null;
  }
};

export default SignupScreen;