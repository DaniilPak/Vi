import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ConversionScreen from './src/screens/conversion/conversion-screen';
import CurrencySelectScreen from './src/screens/conversion/currency-select-screen';
import { screenNames } from './src/constants/screen-names';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={screenNames.conversionScreenName}>
        <Stack.Screen name={screenNames.conversionScreenName} component={ConversionScreen} options={{ header: () => null }}/>
        <Stack.Screen name={screenNames.currencySelectName} component={CurrencySelectScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
