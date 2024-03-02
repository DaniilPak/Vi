import axios from 'axios';
import { ExchangeRateResponse } from '../../interfaces/exchange-rate-response-interface';

export async function getExchangeRate(baseCurrency: string, targetCurrency: string, resolution = '1m', amount = 1, places = 6): Promise<number> {
    const apiUrl = `https://api.fxratesapi.com/latest?base=${baseCurrency}&currencies=${targetCurrency}&resolution=${resolution}&amount=${amount}&places=${places}&format=json`;
    
    try {
        const response = await axios.get<ExchangeRateResponse>(apiUrl);
        if (!response || !response.data || !response.data.rates || !response.data.rates[targetCurrency]) {
            throw new Error('Exchange rate not found in the response');
        }
        return response.data.rates[targetCurrency];
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        throw error;
    }
}
