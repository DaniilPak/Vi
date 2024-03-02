import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { deviceMetrics } from '../../constants/device-metrics';
import { Currency } from '../../interfaces/currency-interface';

import currenciesData from '../../assets/data/currencies.json';

Fontisto.loadFont();

interface CurrencySelectScreenProps {
  navigation: any;
  route: any;
}

const CurrencySelectScreen: React.FC<CurrencySelectScreenProps> = ({ navigation, route }) => {
  const { currencySetter, selectedCode } = route.params;

  const unselectedRadioButton = <Fontisto name="radio-btn-passive" size={15} color="#111" />;
  const selectedRadioButton = <Fontisto name="radio-btn-active" size={15} color="#111" />;

  const [selectedCodeS, setSelectedCode] = useState(selectedCode);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    navigation.setOptions({ title: 'Select Currency' });
    setCurrencies(currenciesData);
    setFilteredCurrencies(currenciesData);
  }, []);

  useEffect(() => {
    const filtered = currencies.filter((currency) => {
      const codeMatch = currency.code.toLowerCase().includes(searchTerm.toLowerCase());
      const nameMatch = currency.name.toLowerCase().includes(searchTerm.toLowerCase());
      return codeMatch || nameMatch;
    });
    setFilteredCurrencies(filtered);
  }, [searchTerm, currencies]);

  const handleSelectCurrency = (code: string) => {
    setSelectedCode(code);
    currencySetter(code);
    navigation.navigate('Conversion');
  };

  const renderCurrencyItem = ({ item }: { item: Currency }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectCurrency(item.code)}>
      <Image style={styles.image} source={{ uri: item.flagSrc }} />
      <Text style={styles.currencyText}>{`${item.code} - ${item.name}`}</Text>
      <View style={styles.radioButtonContainer}>
        {item.code === selectedCodeS ? selectedRadioButton : unselectedRadioButton}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by currency code or name"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredCurrencies}
        renderItem={renderCurrencyItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
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
  item: {
    width: deviceMetrics.DEVICE_WIDTH,
    padding: 20,
    flexDirection: 'row',
  },
  flatList: {
    width: '100%',
    backgroundColor: '#E7E7E7',
    borderRadius: 8,
  },
  image: {
    width: 30,
    height: 20,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
  },
  currencyText: {
    paddingLeft: 10,
  },
  radioButtonContainer: {
    position: 'absolute',
    right: 60,
    top: '90%',
  },
});

export default CurrencySelectScreen;
