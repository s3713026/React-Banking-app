import LoginScreen from '../App.tsx';
import SignupScreen from '../App.tsx';
import BillPaymentsScreen from '../App.tsx';
import HistoriesScreen from '../App.tsx';
import DepositScreen from '../App.tsx';
import CardApplyScreen from '../App.tsx';
import LoanDetailScreen from './LoanDetailScreen';
import LoanRegisterScreen from './LoanRegisterScreen';
import TabNavigator from '../App.tsx';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Auth flow */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />

      {/* Main app */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Other screens */}
      <Stack.Screen name="BillPaymentsScreen" component={BillPaymentsScreen} />
      <Stack.Screen name="HistoriesScreen" component={HistoriesScreen} />
      <Stack.Screen name="DepositScreen" component={DepositScreen} />
      <Stack.Screen name="CardApplyScreen" component={CardApplyScreen} />

      <Stack.Screen
        name="LoanDetail"
        component={LoanDetailScreen}
        options={{
          title: "Loan Details",
          headerShown: true,
          headerTitleStyle: { fontSize: 18, fontWeight: "600" },
        }}
      />

      <Stack.Screen
        name="LoanRegister"
        component={LoanRegisterScreen}
        options={{
          title: "Đăng ký khoản vay",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
