import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { useRoute, useNavigation } from '@react-navigation/native';
import CleverTap from 'clevertap-react-native';

export default function LoanRegisterScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { loan } = route.params as any;

  const [accountNo, setAccountNo] = useState('');
  // 1. Thêm state cho số tiền khách muốn vay
  const [amountInput, setAmountInput] = useState(loan.principal_amount?.toString() ?? '10000000');

  // 2. Lấy lãi suất và kỳ hạn từ data (giả định 12 tháng nếu không có)
  const interestRatePerMonth = (loan.info?.interest_value ?? 1.125) / 100;
  const tenureMonths = 12; 

  // 3. Tự động tính toán số tiền hàng tháng bằng useMemo
  const calculation = useMemo(() => {
    const principal = parseFloat(amountInput) || 0;
    
    // Công thức tính lãi đơn giản hàng tháng: (Gốc / Kỳ hạn) + (Gốc * Lãi suất)
    const monthlyPrincipal = principal / tenureMonths;
    const monthlyInterest = principal * interestRatePerMonth;
    const monthlyPayment = monthlyPrincipal + monthlyInterest;
    
    const totalPayment = monthlyPayment * tenureMonths;
    const totalInterest = monthlyInterest * tenureMonths;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principal
    };
  }, [amountInput, interestRatePerMonth]);

  const handleRegister = () => {
    const loanData = {
      account_no: accountNo,
      loan_name: loan.title,
      loan_status: "approved",
      interest_rate: loan.info?.interest_value,
      principal_amount: calculation.principal, // Số tiền thực tế khách nhập
      interest_amount: calculation.totalInterest, // Tổng lãi phải trả
      total_repayment: calculation.totalPayment, // Tổng gốc + lãi
      monthly_repayment: calculation.monthlyPayment,
      date_time: new Date().toISOString(),
    };

    console.log("🔥 Loan register success:", loanData);
    CleverTap.recordEvent("app_loan_register_success", loanData);
    var profile = {
      'Principal Amount': calculation.principal,
    };
    
    CleverTap.profileSet(profile);
    navigation.goBack();
  };

  return (
    <ScrollView style={tw`flex-1 bg-white p-5`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-6`}>
        {loan.title}
      </Text>

      {/* Ô nhập số tiền vay */}
      <View style={tw`mb-5`}>
        <Text style={tw`text-gray-600 mb-2 font-medium`}>Số tiền bạn muốn vay (VNĐ)</Text>
        <TextInput
          value={amountInput}
          onChangeText={setAmountInput}
          keyboardType="numeric"
          placeholder="Ví dụ: 10,000,000"
          style={tw`p-4 border border-blue-500 rounded-xl text-xl font-bold text-blue-600`}
        />
        <Text style={tw`text-xs text-gray-400 mt-1`}>
          Hạn mức tối đa: {loan.info?.maxAmount}
        </Text>
      </View>

      {/* Bảng tính toán tự động */}
      <View style={tw`bg-gray-50 p-5 rounded-2xl mb-6 border border-gray-100`}>
        <View style={tw`flex-row justify-between mb-3`}>
          <Text style={tw`text-gray-500`}>Trả góp hàng tháng:</Text>
          <Text style={tw`text-lg font-bold text-red-500`}>
            {calculation.monthlyPayment.toLocaleString()} đ
          </Text>
        </View>
        
        <View style={tw`h-px bg-gray-200 my-2`} />

        <View style={tw`flex-row justify-between mt-2`}>
          <Text style={tw`text-gray-500`}>Tổng tiền lãi:</Text>
          <Text style={tw`font-semibold text-gray-700`}>
            {calculation.totalInterest.toLocaleString()} đ
          </Text>
        </View>

        <View style={tw`flex-row justify-between mt-2`}>
          <Text style={tw`text-gray-500`}>Tổng gốc + lãi:</Text>
          <Text style={tw`font-semibold text-gray-700`}>
            {calculation.totalPayment.toLocaleString()} đ
          </Text>
        </View>
      </View>

      <Text style={tw`text-gray-600 mb-2 font-medium`}>Số tài khoản nhận tiền</Text>
      <TextInput
        value={accountNo}
        onChangeText={setAccountNo}
        placeholder="Nhập số tài khoản ngân hàng"
        style={tw`p-4 border border-gray-300 rounded-xl mb-6`}
      />

      <TouchableOpacity
        style={tw`bg-green-600 p-4 rounded-xl shadow-lg`}
        onPress={handleRegister}
      >
        <Text style={tw`text-center text-white text-lg font-bold`}>
          Xác nhận đăng ký
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}