import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useRoute, useNavigation } from '@react-navigation/native';
import CleverTap from 'clevertap-react-native';

export default function LoanRegisterScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { loan } = route.params as any;

  const [accountNo, setAccountNo] = useState('');

  const handleRegister = () => {
    // ❇️ MOCK dữ liệu trạng thái khoản vay
    const loanData = {
      account_no: accountNo,
      loan_name: loan.title,
      loan_status: "approved", 
      current_loan_to_value: 65,
      loan_type: loan.type ?? "unsecured",
      interest_rate: loan.info.interest_value ?? 12.5,
      margin_rate: 2.5,
      limit: loan.info.maxAmount ?? 500000000,
      loan_tenure: loan.info.tenure ?? "12 months",
      loan_to_value_apply: 60,
      principal_amount: 120000000,
      interest_amount: 3500000,
      date_time: new Date().toISOString(),
      paid_percent: 20,
      upcoming_interest_date: 5,
      eligibility_rule: 75,
    };

    console.log("🔥 Loan register success:", loanData);

    // 📌 Gửi event CleverTap
    CleverTap.recordEvent("app_loan_register_success", loanData);

    // Điều hướng về lại home
    navigation.goBack();
  };

  return (
    <View style={tw`flex-1 bg-white p-5`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>
        Đăng ký khoản vay
      </Text>

      <Text style={tw`text-gray-600 mb-2`}>
        Số tài khoản khoản vay
      </Text>
      <TextInput
        value={accountNo}
        onChangeText={setAccountNo}
        placeholder="Nhập số tài khoản"
        style={tw`p-3 border border-gray-300 rounded-xl mb-5`}
      />

      <TouchableOpacity
        style={tw`bg-green-600 p-4 rounded-xl`}
        onPress={handleRegister}
      >
        <Text style={tw`text-center text-white text-lg font-semibold`}>
          Đăng ký ngay
        </Text>
      </TouchableOpacity>
    </View>
  );
}
