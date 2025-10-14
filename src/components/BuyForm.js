import React, { useState } from "react";

export default function BuyForm({ wallet, setWallet, amount, setAmount }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!wallet || !amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage("Enter a valid wallet address and amount.");
      return;
    }

    // این قسمت برای اتصال به MetaMask و قرارداد BRICS است
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const BRICS_ADDRESS = "0xAF2009350F6ECBE22c23A505a590239c7aaA3037";
      const BRICS_ABI = [ /* ABI قرارداد پروکسی */ ];

      const contract = new ethers.Contract(BRICS_ADDRESS, BRICS_ABI, signer);

      // محاسبه مقدار BNB لازم برای مقدار BRICS انتخابی
      const pricePerToken = await contract.getCurrentTokenPriceUsd();
      const bnbPriceUsd = await contract.getBnbPriceUsd();
      const amountBNB = (amount * pricePerToken / bnbPriceUsd).toString();

      // تراکنش
      const tx = await signer.sendTransaction({
        to: BRICS_ADDRESS,
        value: ethers.utils.parseEther(amountBNB)
      });

      await tx.wait();
      setMessage("Transaction successful! BRICS sent to your wallet.");
    } catch (err) {
      console.error(err);
      setMessage("Transaction failed: " + err.message);
    }
  };

  return (
    <form className="buy-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Recipient Wallet" 
        value={wallet} 
        onChange={e => setWallet(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Amount of BRICS" 
        value={amount} 
        onChange={e => setAmount(e.target.value)} 
      />
      <button type="submit">Buy BRICS</button>
      <p>{message}</p>
    </form>
  );
}
