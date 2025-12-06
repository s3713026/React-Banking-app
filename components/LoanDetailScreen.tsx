import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useRoute, useNavigation } from '@react-navigation/native';
import CleverTap from 'clevertap-react-native';



export default function LoanDetailScreen() {
  const route = useRoute();
  const { loan } = route.params as any;
  const navigation = useNavigation();

  //Track khi user vào trang Loan Detail
  useEffect(() => {
    CleverTap.recordEvent('app_loan_select', {
      loan_name: loan.title,
      loan_type: loan.loan_type ?? 'unknown',
      date_time: new Date().toISOString(),
    });
  }, []);

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <Image
        source={{ uri: loan.image }}
        style={tw`w-full h-60`}
        resizeMode="cover"
      />

      <View style={tw`p-5`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>
          {loan.title}
        </Text>

        <Text style={tw`text-gray-600 text-base mt-2`}>
          {loan.desc}
        </Text>

        {/* Loan Information */}
        <View style={tw`mt-6 p-4 bg-white rounded-xl shadow`}>
          <Text style={tw`text-lg font-semibold text-gray-700 mb-2`}>
            Loan Information
          </Text>

          <Text style={tw`text-gray-600`}>
            • Interest rate: {loan.info.interest}
          </Text>

          <Text style={tw`text-gray-600`}>
            • Tenure: {loan.info.tenure}
          </Text>

          <Text style={tw`text-gray-600`}>
            • Max amount: {loan.info.maxAmount}
          </Text>

          <Text style={tw`text-gray-600`}>
            • Approval time: {loan.info.approval}
          </Text>
        </View>
        <TouchableOpacity
          style={tw`mt-6 bg-blue-600 p-4 rounded-xl`}
          onPress={() => navigation.navigate('LoanRegister', { loan })}
        >
          <Text style={tw`text-center text-white text-lg font-semibold`}>
            Đăng ký khoản vay
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
