import axios from "axios";

export const fetchStorage = async () => {
  const res = await axios.get(
    "https://api.ghostnet.tzkt.io/v1/contracts/KT1G5xYQnCpN2pnwgR17CDMJUQk4v9xfaFUT/storage/"
  );
  return res.data;
};
