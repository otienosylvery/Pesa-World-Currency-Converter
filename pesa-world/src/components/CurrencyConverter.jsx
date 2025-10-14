import React from 'react'
import { useState } from 'react'

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const[fromCurrency, setFromCurrency] = useState("KES");
    const [toCurrency, setToCurrency] = useState("USD");
    const[result, setResult]= useState(null);

    const handleConvert = async () => {
  // 1. Prevent invalid requests (e.g. empty or negative)
  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  // 2. Build the API URL dynamically
  const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`;

  try {
    // 3. Fetch data from API
    const response = await fetch(url);

    // 4. Convert response to JS object
    const data = await response.json();

    // 5. Extract the converted value
    const converted = data.rates[toCurrency];

    // 6. Save result to state
    setResult(converted.toFixed(2));
  } catch (error) {
    // 7. Handle network or API errors
    alert("Error fetching conversion rate");
    console.error(error);
  }
};

  return (
    <div className='converter'>
        <h2>Pesa World Currency Converter</h2>

        <input
        type='number'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}/>

        <select
        value={fromCurrency} onChange={(e)=> setFromCurrency(e.target.value)}>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
        //add more currencies later

        </select>
        <span>to</span>

        <select
        value={toCurrency} onChange={(e)=> setToCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        //add more currencies later

        </select>

        <button onClick={handleConvert}>Convert</button>

        {result && <h3>Result: {result}</h3>}
      
    </div>
  );
};

export default CurrencyConverter
