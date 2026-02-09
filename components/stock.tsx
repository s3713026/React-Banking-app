import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import CleverTap from 'clevertap-react-native';

const { width } = Dimensions.get('window');

/* =======================
   TYPES
======================= */

type ChartPoint = {
  date: string;
  price: number;
  time: string;
};

type Stock = {
  id: number;
  ticker: string;
  name: string;
  price: number;
  change: number;
  changeAmount: number;
  volume: string;
  chart: ChartPoint[];
};

type OrderType = 'buy' | 'sell';
type OrderKind = 'limit' | 'market' | 'stop';

type OrderData = {
  ticker: string;
  quantity: number;
  price: number;
  orderType: OrderType;
  orderKind: OrderKind;
  timestamp: string;
};

type Screen = 'chart' | 'placeOrder' | 'success' | 'margin';

type LoanRecord = {
  id: number;
  amount: number;
  rate: number;
  monthlyInterest: number;
  dueDate: string;
  status: 'active' | 'inactive';
};

/* =======================
   MOCK DATA GENERATOR
======================= */

const generateChartData = (days = 30, basePrice = 45000): ChartPoint[] => {
  const data: ChartPoint[] = [];
  let price = basePrice;

  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 2000;
    price = Math.max(price + change, basePrice * 0.8);
    data.push({
      date: `${i + 1}`,
      price: Math.round(price),
      time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, '0')}`,
    });
  }
  return data;
};

// Dữ liệu giả lập các cổ phiếu
const mockStocks: Stock[] = [
  {
    id: 1,
    ticker: 'VNM',
    name: 'Vinamilk',
    price: 82500,
    change: 2.5,
    changeAmount: 2000,
    volume: '2.5M',
    chart: generateChartData(30, 82500),
  },
  {
    id: 2,
    ticker: 'ACB',
    name: 'ACB Bank',
    price: 28700,
    change: -1.2,
    changeAmount: -350,
    volume: '5.2M',
    chart: generateChartData(30, 28700),
  },
  {
    id: 3,
    ticker: 'VCB',
    name: 'Vietcombank',
    price: 95200,
    change: 3.8,
    changeAmount: 3500,
    volume: '1.8M',
    chart: generateChartData(30, 95200),
  },
  {
    id: 4,
    ticker: 'HPG',
    name: 'Hòa Phát',
    price: 35800,
    change: 1.5,
    changeAmount: 530,
    volume: '8.1M',
    chart: generateChartData(30, 35800),
  },
  {
    id: 5,
    ticker: 'FPT',
    name: 'FPT Software',
    price: 105400,
    change: -0.8,
    changeAmount: -850,
    volume: '1.2M',
    chart: generateChartData(30, 105400),
  },
];

/* =======================
   CHART COMPONENT
======================= */

type StockChartProps = {
  data: ChartPoint[];
  timeRange: string;
};

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.noDataText}>Không có dữ liệu biểu đồ</Text>
      </View>
    );
  }

  const chartHeight = 250;
  const chartWidth = width - 40;
  const padding = 20;
  const innerHeight = chartHeight - padding * 2;
  const innerWidth = chartWidth - padding * 2;

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const isPositive = data[data.length - 1].price >= data[0].price;
  const lineColor = isPositive ? '#27ae60' : '#e74c3c';

  const miniChartBars = data.slice(-10).map((point) => {
    const normalizedPrice = (point.price - minPrice) / priceRange;
    return {
      height: Math.max(normalizedPrice * 100, 5),
    };
  });

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartView}>
        <View style={styles.gridContainer}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={`grid-${i}`}
              style={[styles.gridLine, { top: `${(i * 100) / 4}%` }]}
            />
          ))}
        </View>

        <View style={styles.chartPlaceholder}>
          <Text style={{ color: lineColor, fontWeight: 'bold', marginBottom: 10 }}>
            {isPositive ? '📈' : '📉'} Biểu đồ giá 10 ngày gần nhất
          </Text>
          <View style={styles.miniChart}>
            {miniChartBars.map((bar, idx) => (
              <View
                key={`bar-${idx}`}
                style={[
                  styles.chartBar,
                  {
                    height: `${bar.height}%`,
                    backgroundColor: lineColor,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.yAxisLabels}>
          {[100, 75, 50, 25, 0].map((percent) => {
            const price = minPrice + ((100 - percent) / 100) * priceRange;
            return (
              <Text key={`y-${percent}`} style={styles.yAxisLabel}>
                {Math.round(price).toLocaleString()}
              </Text>
            );
          })}
        </View>
      </View>

      <View style={styles.xAxisLabels}>
        <Text style={styles.xAxisLabel}>{data[0]?.date}</Text>
        <Text style={styles.xAxisLabel}>
          {data[Math.floor(data.length / 2)]?.date}
        </Text>
        <Text style={styles.xAxisLabel}>{data[data.length - 1]?.date}</Text>
      </View>
    </View>
  );
};

/* =======================
   SCREENS
======================= */

type StockChartScreenProps = {
  selectedStock: Stock;
  onSelectStock: (s: Stock) => void;
  onNavigate: (screen: Screen) => void;
  allStocks: Stock[];
};

const StockChartScreen: React.FC<StockChartScreenProps> = ({
  selectedStock,
  onSelectStock,
  onNavigate,
  allStocks,
}) => {
  const [timeRange, setTimeRange] = useState<string>('1D');
  const [searchTicker, setSearchTicker] = useState<string>('');

  const isPositive = selectedStock.change >= 0;

  // Track khi vào Stock Chart Screen
  useEffect(() => {
    CleverTap.recordEvent("stock_screen_opened", {
      screen_name: 'Stock Chart',
      selected_ticker: selectedStock.ticker,
      stock_price: selectedStock.price,
      stock_change_percent: selectedStock.change,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleSearch = () => {
    if (!searchTicker.trim()) return;

    const found = allStocks.find(
      (s) => s.ticker.toUpperCase() === searchTicker.toUpperCase()
    );

    if (found) {
      // Track stock search success
      CleverTap.recordEvent("stock_search_success", {
        searched_ticker: searchTicker.toUpperCase(),
        found: true,
        stock_price: found.price,
        stock_change: found.change,
        timestamp: new Date().toISOString(),
      });

      onSelectStock(found);
      setSearchTicker('');
    } else {
      // Track stock search failed
      CleverTap.recordEvent("stock_search_failed", {
        searched_ticker: searchTicker.toUpperCase(),
        found: false,
        timestamp: new Date().toISOString(),
      });

      Alert.alert('Lỗi', `Không tìm thấy mã ${searchTicker}`);
    }
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    
    // Track time range change
    CleverTap.recordEvent("stock_timerange_changed", {
      ticker: selectedStock.ticker,
      time_range: range,
      stock_price: selectedStock.price,
      timestamp: new Date().toISOString(),
    });
  };

  const timeRanges = ['1H', '1D', '1W', '1M', '3M', '1Y'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.chartHeaderContainer}>
          <View>
            <Text style={styles.chartStockName}>{selectedStock.ticker}</Text>
            <Text style={styles.chartStockFullName}>{selectedStock.name}</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.currentPrice}>
            {selectedStock.price.toLocaleString('vi-VN')}
          </Text>
          <View
            style={[
              styles.priceChange,
              { backgroundColor: isPositive ? '#e8f8f5' : '#fadbd8' },
            ]}
          >
            <Text
              style={[
                styles.priceChangeText,
                { color: isPositive ? '#27ae60' : '#e74c3c' },
              ]}
            >
              {isPositive ? '▲' : '▼'} {Math.abs(selectedStock.change).toFixed(2)}%
              ({isPositive ? '+' : ''}
              {selectedStock.changeAmount.toLocaleString('vi-VN')})
            </Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm mã cổ phiếu (VNM, ACB, ...)"
              placeholderTextColor="#999"
              value={searchTicker}
              onChangeText={setSearchTicker}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chartCard}>
          <StockChart data={selectedStock.chart} timeRange={timeRange} />
        </View>

        <View style={styles.timeRangeContainer}>
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() => handleTimeRangeChange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Khối lượng</Text>
            <Text style={styles.detailValue}>{selectedStock.volume}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Cao nhất</Text>
            <Text style={styles.detailValue}>
              {Math.max(...selectedStock.chart.map(d => d.price)).toLocaleString(
                'vi-VN'
              )}
            </Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Thấp nhất</Text>
            <Text style={styles.detailValue}>
              {Math.min(...selectedStock.chart.map(d => d.price)).toLocaleString(
                'vi-VN'
              )}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.buyButton]}
            onPress={() => {
              // Track buy button click
              CleverTap.recordEvent("stock_buy_clicked", {
                ticker: selectedStock.ticker,
                stock_name: selectedStock.name,
                stock_price: selectedStock.price,
                action_type: 'buy',
                timestamp: new Date().toISOString(),
              });
              onNavigate('placeOrder');
            }}
          >
            <Text style={styles.actionButtonText}>Mua</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.sellButton]}
            onPress={() => {
              // Track sell button click
              CleverTap.recordEvent("stock_sell_clicked", {
                ticker: selectedStock.ticker,
                stock_name: selectedStock.name,
                stock_price: selectedStock.price,
                action_type: 'sell',
                timestamp: new Date().toISOString(),
              });
              onNavigate('placeOrder');
            }}
          >
            <Text style={styles.actionButtonText}>Bán</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.otherStocksTitle}>Cổ Phiếu Khác</Text>
        {allStocks
          .filter((s) => s.id !== selectedStock.id)
          .map((stock) => (
            <TouchableOpacity
              key={stock.id}
              style={styles.stockListItem}
              onPress={() => {
                // Track stock selection from list
                CleverTap.recordEvent("stock_selected_from_list", {
                  previous_ticker: selectedStock.ticker,
                  new_ticker: stock.ticker,
                  new_stock_name: stock.name,
                  new_stock_price: stock.price,
                  new_stock_change: stock.change,
                  timestamp: new Date().toISOString(),
                });

                onSelectStock(stock);
                setSearchTicker('');
              }}
            >
              <View>
                <Text style={styles.stockListTicker}>{stock.ticker}</Text>
                <Text style={styles.stockListName}>{stock.name}</Text>
              </View>
              <View style={styles.stockListPrice}>
                <Text style={styles.stockListPriceValue}>
                  {stock.price.toLocaleString('vi-VN')}
                </Text>
                <Text
                  style={[
                    styles.stockListChange,
                    {
                      color: stock.change >= 0 ? '#27ae60' : '#e74c3c',
                    },
                  ]}
                >
                  {stock.change >= 0 ? '▲' : '▼'}{' '}
                  {Math.abs(stock.change).toFixed(2)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

type PlaceOrderProps = {
  selectedStock: Stock;
  onSuccess: (data: OrderData) => void;
};

const PlaceOrderScreen: React.FC<PlaceOrderProps> = ({
  selectedStock,
  onSuccess,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('buy');
  const [ticker, setTicker] = useState<string>(selectedStock.ticker);
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>(selectedStock.price.toString());
  const [orderKind, setOrderKind] = useState<OrderKind>('limit');

  const handlePlaceOrder = () => {
    if (!ticker || !quantity || !price) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const totalValue = parseInt(quantity) * parseFloat(price);
    const fee = Math.round(totalValue * 0.0001 * 100) / 100;

    const orderData: OrderData = {
      ticker,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      orderType,
      orderKind,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
    };

    // Track order placement
    CleverTap.recordEvent("stock_order_placed", {
      ticker: ticker,
      order_type: orderType,
      order_kind: orderKind,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      total_value: totalValue,
      fee: fee,
      timestamp: new Date().toISOString(),
    });

    onSuccess(orderData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Đặt Lệnh</Text>
          <Text style={styles.headerSubtitle}>Giao dịch chứng chỉ</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loại Lệnh</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                orderType === 'buy' && styles.typeButtonActive,
              ]}
              onPress={() => setOrderType('buy')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  orderType === 'buy' && styles.typeButtonTextActive,
                ]}
              >
                Mua
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                orderType === 'sell' && styles.typeButtonActive,
              ]}
              onPress={() => setOrderType('sell')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  orderType === 'sell' && styles.typeButtonTextActive,
                ]}
              >
                Bán
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Mã Chứng Chỉ</Text>
          <TextInput
            style={styles.input}
            placeholder="VNM, ACB, VCB..."
            placeholderTextColor="#999"
            value={ticker}
            onChangeText={setTicker}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Khối Lượng (cổ phiếu)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số lượng"
            placeholderTextColor="#999"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Giá (VNĐ)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập giá"
            placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loại Đơn Hàng</Text>
          <View style={styles.orderKindButtons}>
            {(['limit', 'market', 'stop'] as OrderKind[]).map((kind) => (
              <TouchableOpacity
                key={kind}
                style={[
                  styles.orderKindButton,
                  orderKind === kind && styles.orderKindButtonActive,
                ]}
                onPress={() => setOrderKind(kind)}
              >
                <Text
                  style={[
                    styles.orderKindText,
                    orderKind === kind && styles.orderKindTextActive,
                  ]}
                >
                  {kind === 'limit'
                    ? 'Giới Hạn'
                    : kind === 'market'
                    ? 'Thị Trường'
                    : 'Dừng Lỗ'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tóm Tắt Lệnh</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng giá trị:</Text>
            <Text style={styles.summaryValue}>
              {quantity && price
                ? (parseInt(quantity) * parseFloat(price)).toLocaleString('vi-VN')
                : '0'}{' '}
              VNĐ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Lệ phí giao dịch:</Text>
            <Text style={styles.summaryValue}>
              {quantity && price
                ? Math.round((parseInt(quantity) * parseFloat(price) * 0.0001) * 100) /
                  100
                : '0'}{' '}
              VNĐ
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handlePlaceOrder}>
          <Text style={styles.submitButtonText}>Đặt Lệnh Ngay</Text>
        </TouchableOpacity>

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

type SuccessProps = {
  orderData: OrderData;
  onNewOrder: () => void;
};

const OrderSuccessScreen: React.FC<SuccessProps> = ({ orderData, onNewOrder }) => {
  const totalValue = orderData.quantity * orderData.price;
  const fee = Math.round(totalValue * 0.0001 * 100) / 100;

  // Track order success
  useEffect(() => {
    CleverTap.recordEvent("stock_order_success", {
      ticker: orderData.ticker,
      order_type: orderData.orderType,
      order_kind: orderData.orderKind,
      quantity: orderData.quantity,
      price: orderData.price,
      total_value: totalValue,
      fee: fee,
      timestamp: new Date().toISOString(),
      order_id: "ORD" + Date.now(),
    });

    // Update user properties
    CleverTap.profileSet({
      'Last_Trading_Date': new Date().toISOString(),
      'Trading_Activity': 'Active',
      'Stock_Trading_Enabled': true,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>

          <Text style={styles.successTitle}>Đặt Lệnh Thành Công!</Text>
          <Text style={styles.successSubtitle}>
            Lệnh của bạn đã được gửi đến sàn giao dịch
          </Text>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mã Chứng Chỉ</Text>
              <Text style={styles.detailValue}>{orderData.ticker}</Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Loại Lệnh</Text>
              <Text
                style={[
                  styles.detailValue,
                  {
                    color: orderData.orderType === 'buy' ? '#27ae60' : '#e74c3c',
                  },
                ]}
              >
                {orderData.orderType === 'buy' ? '🔼 Mua' : '🔽 Bán'}
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Khối Lượng</Text>
              <Text style={styles.detailValue}>
                {orderData.quantity.toLocaleString('vi-VN')} cổ phiếu
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Giá</Text>
              <Text style={styles.detailValue}>
                {orderData.price.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Loại Đơn Hàng</Text>
              <Text style={styles.detailValue}>
                {orderData.orderKind === 'limit'
                  ? 'Giới Hạn'
                  : orderData.orderKind === 'market'
                  ? 'Thị Trường'
                  : 'Dừng Lỗ'}
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tổng Giá Trị</Text>
              <Text style={[styles.detailValue, styles.totalValue]}>
                {totalValue.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Lệ Phí</Text>
              <Text style={styles.detailValue}>
                {fee.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Thời Gian</Text>
              <Text style={styles.detailValue}>{orderData.timestamp}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.newOrderButton} onPress={onNewOrder}>
            <Text style={styles.newOrderButtonText}>Quay Lại Biểu Đồ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.viewOrderButton}>
            <Text style={styles.viewOrderButtonText}>Xem Chi Tiết Lệnh</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type MarginScreenProps = {
  onNavigate: (screen: Screen) => void;
};

const MarginLendingScreen: React.FC<MarginScreenProps> = () => {
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [selectedRate, setSelectedRate] = useState<number>(6.5);
  const [newLoans, setNewLoans] = useState<LoanRecord[]>([]);

  const interestRates = [
    { rate: 6.5, description: 'Lãi suất tiêu chuẩn' },
    { rate: 7.0, description: 'Lãi suất bình thường' },
    { rate: 7.5, description: 'Lãi suất cao' },
  ];

  const handleVayNgay = () => {
    if (!loanAmount.trim() || parseFloat(loanAmount) <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ');
      return;
    }

    const amount = parseFloat(loanAmount);
    const monthlyInterest = Math.round((amount * selectedRate) / 100 / 12);
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1);

    const newLoan: LoanRecord = {
      id: Date.now(),
      amount,
      rate: selectedRate,
      monthlyInterest,
      dueDate: dueDate.toLocaleDateString('vi-VN'),
      status: 'active',
    };

    // Track margin loan creation
    CleverTap.recordEvent("stock_loan_created", {
      loan_id: newLoan.id,
      loan_amount: amount,
      interest_rate: selectedRate,
      monthly_interest: monthlyInterest,
      due_date: dueDate.toISOString(),
      status: 'active',
      timestamp: new Date().toISOString(),
    });

    // Update user properties
    CleverTap.profileSet({
      'Margin_Account_Active': true,
      'Total_Margin_Loan': amount,
      'Last_Loan_Date': new Date().toISOString(),
    });

    setNewLoans([newLoan, ...newLoans]);
    setLoanAmount('');
    Alert.alert(
      'Thành công',
      `Bạn đã vay ${amount.toLocaleString('vi-VN')} VNĐ với lãi suất ${selectedRate}%`
    );
  };

  const handlePayLoan = (loanId: number) => {
    Alert.alert(
      'Xác nhận thanh toán',
      'Bạn có chắc chắn muốn thanh toán khoản vay này?',
      [
        {
          text: 'Hủy',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Thanh toán',
          onPress: () => {
            const loan = newLoans.find(l => l.id === loanId);
            
            // Track loan payment
            CleverTap.recordEvent("stock_loan_paid", {
              loan_id: loanId,
              loan_amount: loan?.amount,
              interest_rate: loan?.rate,
              total_interest_paid: loan?.monthlyInterest,
              payment_date: new Date().toISOString(),
            });

            setNewLoans(newLoans.filter((loan) => loan.id !== loanId));
            Alert.alert(
              '✓ Thanh Toán Thành Công',
              'Khoản vay đã được thanh toán và xoá khỏi danh sách'
            );
          },
          style: 'default',
        },
      ]
    );
  };

  const handlePayOldLoan = (accountId: number) => {
    Alert.alert(
      'Xác nhận thanh toán',
      'Bạn có chắc chắn muốn thanh toán khoản nợ này?',
      [
        {
          text: 'Hủy',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Thanh toán',
          onPress: () => {
            // Track old loan payment
            CleverTap.recordEvent("stock_old_loan_paid", {
              account_id: accountId,
              payment_date: new Date().toISOString(),
            });

            Alert.alert(
              '✓ Thanh Toán Thành Công',
              'Khoản nợ đã được thanh toán'
            );
          },
          style: 'default',
        },
      ]
    );
  };

  const marginAccounts = [
    {
      id: 1,
      accountName: 'Tài Khoản Ký Quỹ 1',
      balance: 500000000,
      borrowed: 200000000,
      rate: 6.5,
      dueDate: '2024-03-15',
      status: 'active' as const,
    },
    {
      id: 2,
      accountName: 'Tài Khoản Ký Quỹ 2',
      balance: 300000000,
      borrowed: 100000000,
      rate: 7.0,
      dueDate: '2024-04-20',
      status: 'active' as const,
    },
    {
      id: 3,
      accountName: 'Tài Khoản Ký Quỹ 3',
      balance: 200000000,
      borrowed: 0,
      rate: 0,
      dueDate: '-',
      status: 'inactive' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Khoảng Vay Ký Quỹ</Text>
          <Text style={styles.headerSubtitle}>Quản lý tài khoản vay ký quỹ</Text>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryBoxLabel}>Tổng Dư Nợ</Text>
            <Text style={styles.summaryBoxValue}>
              {(marginAccounts.reduce((sum, acc) => sum + acc.borrowed, 0) +
                newLoans.reduce((sum, loan) => sum + loan.amount, 0))
                .toLocaleString('vi-VN')}{' '}
              VNĐ
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryBoxLabel}>Tổng Dư Có</Text>
            <Text style={styles.summaryBoxValue}>
              {marginAccounts
                .reduce((sum, acc) => sum + acc.balance, 0)
                .toLocaleString('vi-VN')}{' '}
              VNĐ
            </Text>
          </View>
        </View>

        <View style={styles.loanSection}>
          <Text style={styles.sectionTitle}>Vay Tiền Mới</Text>

          <Text style={styles.label}>Số Tiền Cần Vay (VNĐ)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số tiền muốn vay"
            placeholderTextColor="#999"
            value={loanAmount}
            onChangeText={setLoanAmount}
            keyboardType="numeric"
          />

          <Text style={[styles.label, { marginTop: 15 }]}>Chọn Lãi Suất</Text>
          <View style={styles.rateSelectContainer}>
            {interestRates.map((item) => (
              <TouchableOpacity
                key={item.rate}
                style={[
                  styles.rateSelectButton,
                  selectedRate === item.rate && styles.rateSelectButtonActive,
                ]}
                onPress={() => setSelectedRate(item.rate)}
              >
                <Text
                  style={[
                    styles.rateSelectButtonText,
                    selectedRate === item.rate && styles.rateSelectButtonTextActive,
                  ]}
                >
                  {item.rate}%
                </Text>
                <Text
                  style={[
                    styles.rateSelectDescription,
                    selectedRate === item.rate && styles.rateSelectDescriptionActive,
                  ]}
                >
                  {item.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {loanAmount && (
            <View style={styles.loanInfoCard}>
              <View style={styles.loanInfoRow}>
                <Text style={styles.loanInfoLabel}>Số tiền vay:</Text>
                <Text style={styles.loanInfoValue}>
                  {parseFloat(loanAmount).toLocaleString('vi-VN')} VNĐ
                </Text>
              </View>
              <View style={styles.loanInfoRow}>
                <Text style={styles.loanInfoLabel}>Lãi suất năm:</Text>
                <Text style={styles.loanInfoValue}>{selectedRate}%</Text>
              </View>
              <View style={styles.loanInfoDivider} />
              <View style={styles.loanInfoRow}>
                <Text style={styles.loanInfoLabel}>Lãi hàng tháng:</Text>
                <Text style={[styles.loanInfoValue, styles.loanInterestHighlight]}>
                  {Math.round(
                    (parseFloat(loanAmount) * selectedRate) / 100 / 12
                  ).toLocaleString('vi-VN')}{' '}
                  VNĐ
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.loanButton}
            onPress={handleVayNgay}
            disabled={!loanAmount.trim()}
          >
            <Text style={styles.loanButtonText}>Vay Ngay</Text>
          </TouchableOpacity>
        </View>

        {newLoans.length > 0 && (
          <>
            <Text style={styles.accountsTitle}>Vay Gần Đây</Text>
            {newLoans.map((loan) => (
              <View key={loan.id} style={styles.newLoanCard}>
                <View style={styles.newLoanHeader}>
                  <View>
                    <Text style={styles.newLoanAmount}>
                      {loan.amount.toLocaleString('vi-VN')} VNĐ
                    </Text>
                    <Text style={styles.newLoanSubtitle}>
                      🟢 Lãi suất {loan.rate}% / năm
                    </Text>
                  </View>
                  <View style={styles.newLoanBadge}>
                    <Text style={styles.newLoanBadgeText}>Đang vay</Text>
                  </View>
                </View>

                <View style={styles.newLoanDetails}>
                  <View style={styles.newLoanDetailItem}>
                    <Text style={styles.newLoanDetailLabel}>Lãi hàng tháng</Text>
                    <Text style={styles.newLoanDetailValue}>
                      {loan.monthlyInterest.toLocaleString('vi-VN')} VNĐ
                    </Text>
                  </View>
                  <View style={styles.newLoanDetailItem}>
                    <Text style={styles.newLoanDetailLabel}>Đến hạn</Text>
                    <Text style={styles.newLoanDetailValue}>{loan.dueDate}</Text>
                  </View>
                </View>

                <View style={styles.newLoanActions}>
                  <TouchableOpacity
                    style={styles.payNewLoanButton}
                    onPress={() => handlePayLoan(loan.id)}
                  >
                    <Text style={styles.payNewLoanButtonText}>Thanh Toán</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.extendNewLoanButton}>
                    <Text style={styles.extendNewLoanButtonText}>Gia Hạn</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        <Text style={styles.accountsTitle}>Tài Khoản Ký Quỹ</Text>
        {marginAccounts.map((account) => (
          <View key={account.id} style={styles.accountCard}>
            <View style={styles.accountHeader}>
              <View>
                <Text style={styles.accountName}>{account.accountName}</Text>
                <Text style={styles.accountStatus}>
                  {account.status === 'active' ? '🟢 Hoạt động' : '⚪ Không hoạt động'}
                </Text>
              </View>
              <View style={styles.accountBadge}>
                <Text style={styles.accountBadgeText}>{account.rate}% / năm</Text>
              </View>
            </View>

            <View style={styles.accountDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailItemLabel}>Dư Có</Text>
                <Text style={styles.detailItemValue}>
                  {account.balance.toLocaleString('vi-VN')} VNĐ
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailItemLabel}>Dư Nợ</Text>
                <Text
                  style={[
                    styles.detailItemValue,
                    account.borrowed > 0 && { color: '#e74c3c' },
                  ]}
                >
                  {account.borrowed.toLocaleString('vi-VN')} VNĐ
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailItemLabel}>Ngày Đến Hạn</Text>
                <Text style={styles.detailItemValue}>{account.dueDate}</Text>
              </View>
            </View>

            {account.borrowed > 0 && (
              <View style={styles.accountActions}>
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => handlePayOldLoan(account.id)}
                >
                  <Text style={styles.payButtonText}>Thanh Toán</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.extendButton}>
                  <Text style={styles.extendButtonText}>Gia Hạn</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Lưu Ý Quan Trọng</Text>
          <Text style={styles.warningText}>
            • Lãi suất vay thay đổi theo thị trường và điều kiện tài khoản
          </Text>
          <Text style={styles.warningText}>
            • Nếu tài khoản âm tiếp tục, có thể bị cần cấp vốn bổ sung
          </Text>
          <Text style={styles.warningText}>
            • Bạn chịu trách nhiệm pháp lý về các khoản vay
          </Text>
          <Text style={styles.warningText}>
            • Liên hệ hỗ trợ nếu có thắc mắc hoặc khó khăn thanh toán
          </Text>
        </View>

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

/* =======================
   MAIN APP
======================= */

export default function StockTradingApp(): JSX.Element {
  const [screen, setScreen] = useState<Screen>('chart');
  const [selectedStock, setSelectedStock] = useState<Stock>(mockStocks[0]);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const handleNavigate = (newScreen: Screen) => {
    setScreen(newScreen);
  };

  const handleOrderSuccess = (data: OrderData) => {
    setOrderData(data);
    setScreen('success');
  };

  const handleNewOrder = () => {
    setScreen('chart');
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            screen === 'chart' && styles.navButtonActive,
          ]}
          onPress={() => handleNavigate('chart')}
        >
          <Text
            style={[
              styles.navButtonText,
              screen === 'chart' && styles.navButtonTextActive,
            ]}
          >
            📈 Biểu Đồ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            screen === 'placeOrder' && styles.navButtonActive,
          ]}
          onPress={() => handleNavigate('placeOrder')}
        >
          <Text
            style={[
              styles.navButtonText,
              screen === 'placeOrder' && styles.navButtonTextActive,
            ]}
          >
            🔔 Đặt Lệnh
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            screen === 'margin' && styles.navButtonActive,
          ]}
          onPress={() => handleNavigate('margin')}
        >
          <Text
            style={[
              styles.navButtonText,
              screen === 'margin' && styles.navButtonTextActive,
            ]}
          >
            💰 Ký Quỹ
          </Text>
        </TouchableOpacity>
      </View>

      {screen === 'chart' && (
        <StockChartScreen
          selectedStock={selectedStock}
          onSelectStock={setSelectedStock}
          onNavigate={handleNavigate}
          allStocks={mockStocks}
        />
      )}

      {screen === 'placeOrder' && (
        <PlaceOrderScreen
          selectedStock={selectedStock}
          onSuccess={handleOrderSuccess}
        />
      )}

      {screen === 'success' && orderData && (
        <OrderSuccessScreen
          orderData={orderData}
          onNewOrder={handleNewOrder}
        />
      )}

      {screen === 'margin' && (
        <MarginLendingScreen onNavigate={handleNavigate} />
      )}
    </View>
  );
}

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },

  navigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  navButtonActive: {
    borderBottomColor: '#3498db',
  },
  navButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  navButtonTextActive: {
    color: '#3498db',
  },

  chartHeaderContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  chartStockName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  chartStockFullName: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 3,
  },

  priceSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  priceChange: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  priceChangeText: {
    fontSize: 14,
    fontWeight: '600',
  },

  searchSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2c3e50',
  },
  searchButton: {
    width: 44,
    height: 44,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 18,
  },

  chartCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 15,
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  chartView: {
    position: 'relative',
    height: 250,
    marginBottom: 20,
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  chartPlaceholder: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
    borderRadius: 8,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    gap: 2,
    paddingHorizontal: 10,
  },
  chartBar: {
    flex: 1,
    borderRadius: 2,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginRight: 5,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
    width: 50,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#999',
  },
  noDataText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },

  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    gap: 6,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#f5f6fa',
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: '#3498db',
  },
  timeRangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  timeRangeTextActive: {
    color: '#fff',
  },

  detailsSection: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#27ae60',
  },
  sellButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  otherStocksTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 8,
  },
  stockListItem: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 6,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#f0f0f0',
  },
  stockListTicker: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  stockListName: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 3,
  },
  stockListPrice: {
    alignItems: 'flex-end',
  },
  stockListPriceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  stockListChange: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },

  spacing: {
    height: 20,
  },

  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },

  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#2c3e50',
    backgroundColor: '#fafafa',
  },

  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#27ae60',
    backgroundColor: '#e8f8f5',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#27ae60',
  },

  orderKindButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  orderKindButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
  },
  orderKindButtonActive: {
    borderColor: '#3498db',
    backgroundColor: '#ebf5fb',
  },
  orderKindText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  orderKindTextActive: {
    color: '#3498db',
  },

  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
  },

  submitButton: {
    backgroundColor: '#3498db',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  successContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 5,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },

  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  totalValue: {
    fontSize: 16,
    color: '#27ae60',
  },

  newOrderButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  newOrderButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  viewOrderButton: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewOrderButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3498db',
  },

  summarySection: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  summaryBoxLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  summaryBoxValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  loanSection: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
  },
  rateSelectContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  rateSelectButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  rateSelectButtonActive: {
    borderColor: '#27ae60',
    backgroundColor: '#e8f8f5',
  },
  rateSelectButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
  },
  rateSelectButtonTextActive: {
    color: '#27ae60',
  },
  rateSelectDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  rateSelectDescriptionActive: {
    color: '#27ae60',
  },
  loanInfoCard: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  loanInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  loanInfoLabel: {
    fontSize: 13,
    color: '#2c3e50',
    fontWeight: '500',
  },
  loanInfoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
  },
  loanInfoDivider: {
    height: 1,
    backgroundColor: '#3498db',
    marginVertical: 10,
    opacity: 0.3,
  },
  loanInterestHighlight: {
    color: '#e74c3c',
    fontSize: 14,
  },
  loanButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  loanButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  newLoanCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  newLoanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  newLoanAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e74c3c',
  },
  newLoanSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  newLoanBadge: {
    backgroundColor: '#e8f8f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  newLoanBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27ae60',
  },
  newLoanDetails: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  newLoanDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  newLoanDetailLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  newLoanDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
  },
  newLoanActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  payNewLoanButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  payNewLoanButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  extendNewLoanButton: {
    flex: 1,
    backgroundColor: '#f39c12',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  extendNewLoanButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  accountsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  accountCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  accountName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
  },
  accountStatus: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  accountBadge: {
    backgroundColor: '#e8f4f8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  accountBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3498db',
  },

  accountDetails: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItemLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  detailItemValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
  },

  accountActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  payButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  extendButton: {
    flex: 1,
    backgroundColor: '#f39c12',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  extendButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  warningCard: {
    backgroundColor: '#fff3cd',
    marginHorizontal: 15,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 6,
    lineHeight: 18,
  },
});