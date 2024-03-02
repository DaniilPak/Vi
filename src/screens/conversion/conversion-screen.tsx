import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { screenNames } from '../../constants/screen-names';
import { deviceMetrics } from '../../constants/device-metrics';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont();

import currenciesData from '../../assets/data/currencies.json';
import { getExchangeRate } from '../../api/exchange/exchangeApi';
import { getData, saveData } from '../../services/local-storage-service';
import { Currency } from '../../interfaces/currency-interface';

interface ConversionScreenProps {
  navigation: any;
}

const ConversionScreen: React.FC<ConversionScreenProps> = ({ navigation }) => {
  const exchangeButtonIcon = <FontAwesome name="exchange" size={25} color="#111" />;

  const [amount, setAmount] = useState('');
  const [exchangeAmount, setexchangeAmount] = useState('');

  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('CAD');
  const [fromCurrencyObject, setFromCurrencyObject] = useState<Currency | undefined>(undefined);
  const [toCurrencyObject, setToCurrencyObject] = useState<Currency | undefined>(undefined);

  useEffect(() => {
    updateCurrencyObjects();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    updateRate();
  }, [amount]);

  const updateCurrencyObjects = () => {
    const fromCurrencyObject = currenciesData.find((currency: Currency) => currency.code === fromCurrency);
    const toCurrencyObject = currenciesData.find((currency: Currency) => currency.code === toCurrency);
    setFromCurrencyObject(fromCurrencyObject);
    setToCurrencyObject(toCurrencyObject);
  };

  const onAmountChange = (value: string) => {
    setAmount(value);
  };

  const clearAmounts = () => {
    setAmount('');
    setexchangeAmount('');
  };

  const switchCurrencies = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
  };

  async function updateRate() {
    let rate: number | null = null;
    const key = `${fromCurrency}_${toCurrency}`;

    try {
      rate = await getExchangeRate(fromCurrency, toCurrency);

      if (rate == null) {
        throw new Error('Exchange rate is null');
      } else {
        await saveData(key, rate);
      }
    } catch (error) {
      rate = await getData(key);
      if (rate == null) {
        Alert.alert('Error: Exchange rate not found.');
        return;
      }
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      return;
    }

    const exchangeResult = parsedAmount * rate;
    setexchangeAmount(exchangeResult.toFixed(2));
  }

  return (
    <View style={styles.container}>
      <View style={styles.currencyRow}>
        <View style={styles.currencyColumn}>
          <Text>From: </Text>
          <TouchableOpacity
            onPress={() => {
              clearAmounts();
              navigation.navigate(screenNames.currencySelectName, {
                selectedCode: fromCurrency,
                currencySetter: setFromCurrency,
              });
            }}
            style={styles.changeCurrencyButton}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              {fromCurrencyObject && <Image style={styles.image} source={{ uri: fromCurrencyObject.flagSrc }} />}
              <Text style={{ color: 'black', marginHorizontal: 5, fontSize: 16 }}>{fromCurrency}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.centerColumn}>
          <TouchableOpacity onPress={switchCurrencies}>{exchangeButtonIcon}</TouchableOpacity>
        </View>
        <View style={styles.currencyColumn}>
          <Text>To: </Text>
          <TouchableOpacity
            onPress={() => {
              clearAmounts();
              navigation.navigate(screenNames.currencySelectName, {
                selectedCode: toCurrency,
                currencySetter: setToCurrency,
              });
            }}
            style={styles.changeCurrencyButton}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              {toCurrencyObject && <Image style={styles.image} source={{ uri: toCurrencyObject.flagSrc }} />}
              <Text style={{ color: 'black', marginHorizontal: 5, fontSize: 16 }}>{toCurrency}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.label}>Amount: </Text>
      <TextInput style={styles.input} placeholder="Amount" value={amount} onChangeText={onAmountChange} />
      <Text style={styles.resultText}>{`${amount} ${fromCurrency} =`}</Text>
      <Text style={styles.resultAmount}>{`${exchangeAmount} ${toCurrency}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  currencyRow: {
    flexDirection: 'row',
    marginVertical: 30,
  },
  currencyColumn: {
    flex: 1,
  },
  centerColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 43,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  changeCurrencyButton: {
    width: 140,
    height: 44,
    backgroundColor: '#DEDEDE',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 30,
    height: 20,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
  },
  label: {
    color: 'black',
    marginVertical: 10,
  },
  resultText: {
    color: 'black',
    fontSize: 16,
  },
  resultAmount: {
    color: 'black',
    fontSize: 42,
  },
});

export default ConversionScreen;
