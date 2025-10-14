import React, { useState } from "react";
import Header from "./components/Header";
import BuyForm from "./components/BuyForm";
import Footer from "./components/Footer";

function App() {
  const [wallet, setWallet] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="app-container">
      <Header />
      <BuyForm 
        wallet={wallet} setWallet={setWallet} 
        amount={amount} setAmount={setAmount} 
      />
      <Footer />
    </div>
  );
}

export default App;
