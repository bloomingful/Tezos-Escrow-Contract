import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";

import { addBalanceOwner, addBalanceCounterparty, withdrawOwner, claimOwner, claimCounterparty, withdrawCounterparty, undoWithdrawOwner, undoWithdrawCounterparty, authAdmin } from "./utils/operation";
import { fetchStorage } from "./utils/tzkt";

const App = () => {
  const [balanceOwner, setBalanceOwner] = useState(0);
  const [balanceCounterparty, setBalanceCounterparty] = useState(0);

  const [withdrewOwner, setWithdrewOwner] = useState(false);
  const [withdrewCounterparty, setWithdrewCounterparty] = useState(false);

  const [addBalanceOwnerLoading, setAddBalanceOwnerLoading] = useState(false);
  const [addBalanceCounterpartyLoading, setAddBalanceCounterpartyLoading] = useState(false);

  const [withdrawOwnerLoading, setWithdrawOwnerLoading] = useState(false);
  const [withdrawCounterpartyLoading, setWithdrawCounterpartyLoading] = useState(false);

  const [undoWithdrawOwnerLoading, setUndoWithdrawOwnerLoading] = useState(false);
  const [undoWithdrawCounterpartyLoading, setUndoWithdrawCounterpartyLoading] = useState(false);

  const [claimOwnerLoading, setClaimOwnerLoading] = useState(false);
  const [claimCounterpartyLoading, setClaimCounterpartyLoading] = useState(false);

  const [authAdminLoading, setAuthAdminLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const storage = await fetchStorage();
      setBalanceOwner(parseInt(Object.values(storage.balanceOwner), 10) * 10);
      setBalanceCounterparty(parseInt(Object.values(storage.balanceCounterparty)));
      setWithdrewOwner(Object.values(storage.withdrewOwner));
      setWithdrewCounterparty(Object.values(storage.withdrewCounterparty));
    })();
  }, []);

  const onAddBalanceOwner = async () => {
    try {
      setAddBalanceOwnerLoading(true);
      await addBalanceOwner();
      alert("Transaction successful!");
    } catch (err) {
      alert(err.message);
    }
    setAddBalanceOwnerLoading(false);
  };

  const onAddBalanceCounterparty = async () => {
    try {
      setAddBalanceCounterpartyLoading(true);
      await addBalanceCounterparty();
      alert("Transaction successful!");
    } catch (err) {
      alert(err.message);
    }
    setAddBalanceCounterpartyLoading(false);
  };

  const onWithdrawOwner = async () => {
    try {
      setWithdrawOwnerLoading(true);
      await withdrawOwner();
      alert("Transaction successful!");
    } catch (err) {
      alert(err.message);
    }
    setWithdrawOwnerLoading(false);
  };

  const onWithdrawCounterparty = async () => {
    try {
      setWithdrawCounterpartyLoading(true);
      await withdrawCounterparty();
      alert("Transaction successful!");
    } catch (err) {
      alert(err.message);
    }
    setWithdrawCounterpartyLoading(false);
  };

  const onUndoWithdrawOwner = async () => {
    try {
      setUndoWithdrawOwnerLoading(true);
      await undoWithdrawOwner();
      alert("Transaction successful!");
    } catch (err) {
      alert(err.message);
    }
    setUndoWithdrawOwnerLoading(false);
  };

  const onUndoWithdrawCounterparty = async () => {
    try {
      setUndoWithdrawCounterpartyLoading(true);
      await undoWithdrawCounterparty();
      alert("Transaction successful!");
    } catch (err) {
      alert(err.message);
    }
    setUndoWithdrawCounterpartyLoading(false);
  };

  const onClaimOwner = async () => {
    try {
      setClaimOwnerLoading(true);
      await claimOwner();
      alert("Transaction successful!");
    } catch (err) {
      alert(err.message);
    }
    setClaimOwnerLoading(false);
  };

  const onClaimCounterparty = async () => {
    try {
      setClaimCounterpartyLoading(true);
      await claimCounterparty();
      alert("Transaction successful!");
    } catch (err) {
      alert(err.message);
    }
    setClaimCounterpartyLoading(false);
  };

  const onAuthAdmin = async () => {
    try {
      setAuthAdminLoading(true);
      await authAdmin();
      alert("Transaction successful!");
    } catch (err) {
      alert(err.message);
    }
    setAuthAdminLoading(false);
  };

  return (
    <div className="h-100">
      <Navbar />
      <div className="d-flex flex-column justify-content-center align-items-center h-100">

        <hr></hr>

        <div class="card bg-info text-black w-75">
          <div class="card-body">
            <h3 class="card-title d-flex justify-content-center">ESCROW CONTRACT TERMS</h3>
            <p class="card-text text-center">
              Amount to be deposited by the owner is <strong>50 TEZ.</strong>
              <br></br>
              Amount to be deposited by the counterparty is <strong>4 TEZ.</strong>
              <br></br>
              One party can only claim the total funds after both parties have deposited to the contract and providing that neither has withdrawn.
            </p>
          </div>
        </div>

        <hr></hr>

        <div class="card text-black">
          <div class="card-body">
            <h5 class="card-title d-flex justify-content-center">Current Escrow Balance</h5>
            <p class="card-text text-center">
              Owner balance: {balanceOwner} TEZ
              <br></br>
              Counterparty balance: {balanceCounterparty} TEZ
            </p>
          </div>
        </div>

        <hr></hr>

        {/* Action Buttons */}
        <div class="row justify-content-center align-items-center">
          <div class="col-12 col-md-6">
            {balanceOwner === 0 ? (
              <button onClick={onAddBalanceOwner} className="btn btn-primary btn-lg">
                {addBalanceOwnerLoading ? "Loading..." : "Owner: Add 50 TEZ to Balance"}
              </button>
            ) : (
              <button onClick={onClaimOwner} className="btn btn-success btn-lg">
                {claimOwnerLoading ? "Loading..." : "Owner: Claim Funds"}
              </button>
            )}
          </div>

          <div class="col-12 col-md-6">
            {withdrewOwner == false ? (
              <button onClick={onWithdrawOwner} className="btn btn-danger btn-lg">
                  {withdrawOwnerLoading ? "Loading..." : "Owner: Withdraw from Contract"}
              </button>
            ) : (
              <button onClick={onUndoWithdrawOwner} className="btn btn-danger btn-lg">
                  {undoWithdrawOwnerLoading ? "Loading..." : "Owner: Undo Withdraw from Contract"}
              </button>
            )}
          </div>
        </div>

        <hr></hr>

        <div class="row justify-content-center align-items-center">
          <div class="col-12 col-md-6">
            {balanceCounterparty === 0 ? (
              <button onClick={onAddBalanceCounterparty} className="btn btn-primary btn-lg">
                {addBalanceCounterpartyLoading ? "Loading..." : "Counterparty: Add 4 TEZ to Balance"}
              </button>
            ) : (
              <button onClick={onClaimCounterparty} className="btn btn-success btn-lg">
                {claimCounterpartyLoading ? "Loading..." : "Counterparty: Claim Funds"}
              </button>
            )}
          </div>

          <div class="col-12 col-md-6">
            {withdrewCounterparty == false ? (
              <button onClick={onWithdrawCounterparty} className="btn btn-danger btn-lg">
                  {withdrawCounterpartyLoading ? "Loading..." : "Counterparty: Withdraw from Contract"}
              </button>
            ) : (
              <button onClick={onUndoWithdrawCounterparty} className="btn btn-danger btn-lg">
                  {undoWithdrawCounterpartyLoading ? "Loading..." : "Counterparty: Undo Withdraw from Contract"}
              </button>
            )}
          </div>
        </div>

        <hr></hr>

        <div class="row justify-content-center align-items-center">
          <button onClick={onAuthAdmin} className="btn btn-warning btn-lg">
                {authAdminLoading ? "Loading..." : "ADMIN ONLY: Authorize Withdrawal"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default App;