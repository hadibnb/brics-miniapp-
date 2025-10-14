import React from "react";
import bricsLogo from "../../public/bricslogo.png"; // مطمئن شو لوگو در public است

export default function Header() {
  return (
    <header className="header">
      <img src={bricsLogo} alt="BRICS Logo" className="logo" />
      <h1>Buy BRICS Token</h1>
    </header>
  );
}
