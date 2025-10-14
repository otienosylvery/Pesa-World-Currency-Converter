import React, { useState, useEffect } from "react";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);
  const [currencies, setCurrencies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);

  // Fetch currency symbols from Frankfurter API
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://api.frankfurter.app/currencies");
        const data = await response.json();
        setCurrencies(data || {});
      } catch (error) {
        console.error("Error fetching currencies:", error);
        setCurrencies({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Automatic conversion whenever amount or currencies change
  useEffect(() => {
    const convert = async () => {
      if (!amount || amount <= 0 || fromCurrency === toCurrency) {
        setResult(amount ? amount.toFixed(2) : "");
        return;
      }

      setIsConverting(true); // start loading indicator
      try {
        const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`;
        const response = await fetch(url);
        const data = await response.json();
        setResult(data.rates[toCurrency].toFixed(2));
      } catch (error) {
        console.error("Error converting currency:", error);
        setResult("Error");
      } finally {
        setIsConverting(false); // stop loading indicator
      }
    };

    convert();
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (isLoading) return <p>Loading currencies...</p>;

  const sortedCurrencyCodes = Object.keys(currencies).sort();

  return (
    <div className="converter">
      <h2>Pesa World Currency Converter</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
        {sortedCurrencyCodes.map((code) => (
          <option key={code} value={code}>
            {code} - {currencies[code]}
          </option>
        ))}
      </select>

      <span>
        <button type="button" onClick={handleSwap}>
          ⇅ Swap
        </button>
      </span>

      <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
        {sortedCurrencyCodes.map((code) => (
          <option key={code} value={code}>
            {code} - {currencies[code]}
          </option>
        ))}
      </select>

      {isConverting ? <p>Converting...</p> : result && <h3>Result: {result}</h3>}
    </div>
  );
};

export default CurrencyConverter;
