import { tezos } from "./tezos";

export const addBalanceOwner = async () => {
  try {
    const contractInstance = await tezos.wallet.at("KT1G5xYQnCpN2pnwgR17CDMJUQk4v9xfaFUT");
    const op = await contractInstance.methods.addBalanceOwner().send({
      amount: 50,
      mutez: false,
    });
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};

export const addBalanceCounterparty = async () => {
  try {
    const contractInstance = await tezos.wallet.at("KT1G5xYQnCpN2pnwgR17CDMJUQk4v9xfaFUT");
    const op = await contractInstance.methods.addBalanceCounterparty().send({
      amount: 4,
      mutez: false,
    });
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};

export const claimOwner = async () => {
  try {
    const contractInstance = await tezos.wallet.at("KT1G5xYQnCpN2pnwgR17CDMJUQk4v9xfaFUT");
    const op = await contractInstance.methods.claimOwner().send();
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};

export const claimCounterparty = async () => {
  try {
    const contractInstance = await tezos.wallet.at("KT1G5xYQnCpN2pnwgR17CDMJUQk4v9xfaFUT");
    const op = await contractInstance.methods.claimCounterparty("01223344").send();
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};

export const withdrawOwner = async () => {
  try {
    const contractInstance = await tezos.wallet.at("KT1G5xYQnCpN2pnwgR17CDMJUQk4v9xfaFUT");
    const op = await contractInstance.methods.withdrawOwner().send();
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};

export const withdrawCounterparty = async () => {
  try {
    const contractInstance = await tezos.wallet.at("KT1G5xYQnCpN2pnwgR17CDMJUQk4v9xfaFUT");
    const op = await contractInstance.methods.withdrawCounterparty().send();
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};

export const undoWithdrawOwner = async () => {
  try {
    const contractInstance = await tezos.wallet.at("KT1G5xYQnCpN2pnwgR17CDMJUQk4v9xfaFUT");
    const op = await contractInstance.methods.undoWithdrawOwner().send();
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};

export const undoWithdrawCounterparty = async () => {
  try {
    const contractInstance = await tezos.wallet.at("KT1G5xYQnCpN2pnwgR17CDMJUQk4v9xfaFUT");
    const op = await contractInstance.methods.undoWithdrawCounterparty().send();
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};

export const authAdmin = async () => {
  try {
    const contractInstance = await tezos.wallet.at("KT1G5xYQnCpN2pnwgR17CDMJUQk4v9xfaFUT");
    const op = await contractInstance.methods.authAdmin().send();
    await op.confirmation(1);
  } catch (err) {
    throw err;
  }
};