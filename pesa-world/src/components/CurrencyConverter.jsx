import React from 'react'
import { useState } from 'react'

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const[fromCurrency, setFromCurrency] = useState("KES");
    const [toCurrency, setToCurrency] = useState("USD");
    const[result, setResult]= useState(null);

    const handleConvert = () =>{
        //conversion logic goes here
        console.log("Convert:", amount,fromCurrency, "To:", toCurrency);
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
        <option value="KES">KES</option>
        <option value="USD">USD</option>
        //add more currencies later

        </select>
        <span>to</span>

        <select
        value={toCurrency} onChange={(e)=> setToCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="KES">KES</option>
        //add more currencies later

        </select>

        <button onClick={handleConvert}>Convert</button>

        {result && <h3>Result: {result}</h3>}
      
    </div>
  );
};

export default CurrencyConverter
