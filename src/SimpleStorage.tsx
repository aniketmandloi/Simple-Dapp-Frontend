import { useState, useEffect } from "react";
import Web3 from "web3";

const SimpleStorage = () => {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<any>(null);
  const [data, setData] = useState<number | null>(null); // Updated to allow null
  const [newData, setNewData] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Added error state

  const contractAddress = "0xd11E039d8f11E2BcB72106f261D49B8f533f9c8B"; // Replace with your deployed contract address
  const contractABI = [
    {
      inputs: [],
      name: "data",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_data",
          type: "uint256",
        },
      ],
      name: "updateData",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "readData",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
  ];

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const storageContract = new web3.eth.Contract(
            contractABI,
            contractAddress
          );
          setContract(storageContract as any);

          const storedData = await storageContract.methods.readData().call();
          setData(Number(storedData)); // Ensure data is in number format
        } catch (error) {
          console.error("Error loading blockchain data:", error);
          setError("Failed to load data from blockchain.");
        }
      } else {
        console.error("Ethereum object not found, install MetaMask.");
        setError("MetaMask is not installed. Please install MetaMask.");
      }
    };

    loadBlockchainData();
  }, []);

  const handleUpdateData = async () => {
    if (contract) {
      try {
        await contract.methods
          .updateData(Number(newData))
          .send({ from: account });
        const updatedData = await contract.methods.readData().call();
        setData(Number(updatedData));
      } catch (error) {
        console.error("Error updating data:", error);
        setError("Failed to update data on the blockchain.");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Simple Storage</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message */}
      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        Current Data: {data !== null ? data : "Loading..."}
      </p>
      <input
        type="number"
        value={newData}
        onChange={(e) => setNewData(e.target.value)}
        style={{
          marginBottom: "10px",
          padding: "10px",
          width: "200px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleUpdateData}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Update Data
      </button>
    </div>
  );
};

export default SimpleStorage;
