import { useEffect, useState } from "react";
import { connectWallet, getAccount } from "../utils/wallet";

const Navbar = () => {
  const [account, setAccount] = useState("");

  useEffect(() => {
    (async () => {
      const account = await getAccount();
      setAccount(account);
    })();
  }, []);

  const onConnectWallet = async () => {
    await connectWallet();
    const account = await getAccount();
    setAccount(account);
  };

  return (
    <div className="navbar navbar-dark bg-dark fixed-top">
      <div className="container py-2">
        <a href="/" className="navbar-brand">
          ESCROW CONTRACT
        </a>
        <div className="d-flex">
          <button onClick={onConnectWallet} className="btn btn-outline-info">
            {account ? account : "Connect Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
