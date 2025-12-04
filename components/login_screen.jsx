import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const BankingLoginScreen = ({ onLogin, onNavigateToSignup }) => {
  const navigation = useNavigation(); // ✅ must be inside component
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter both email/username and password');
      return;
    }

    try {
      if (onLogin) {
        await onLogin({ identifier, password });
      } else {
        Alert.alert('Login', 'Pretend login successful (pass a real onLogin prop).');
      }
    } catch (e) {
      Alert.alert('Login failed', e?.message || 'Unknown error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white justify-center px-6`}
    >
      <View style={tw`items-center mb-10`}>
        {/* <MaterialIcons name="account-balance" size={72} color="#0066CC" /> */}
        <Image
          source={require('../AppImages/logo_transparent.png')}
          style={tw`w-18 h-18`} // 72px tương đương 18 (72/4 = 18)
          resizeMode="contain"
        />
        <Text style={tw`text-2xl font-bold mt-4 text-gray-800`}>
          Welcome Back
        </Text>
        <Text style={tw`text-gray-500 mt-1`}>
          Login to your banking account
        </Text>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-700 mb-1`}>Email or Username</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-4 py-3`}
          placeholder="Enter your email or username"
          value={identifier}
          onChangeText={setIdentifier}
        />
      </View>

      <View style={tw`mb-6`}>
        <Text style={tw`text-gray-700 mb-1`}>Password</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-4 py-3`}
          placeholder="Enter your password"
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
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={tw`text-center text-blue-600 text-base`}>
          Don’t have an account?{' '}
          <Text style={tw`font-bold`}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default BankingLoginScreen;
