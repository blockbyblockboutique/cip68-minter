import Head from "next/head";
import { adminLockScript } from "../contracts/adminLock";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { Transaction, ForgeScript } from "@meshsdk/core";
import { useState } from "react";
import { BlockfrostProvider } from '@meshsdk/core';

const blockfrostProvider = new BlockfrostProvider('previewT07MdOONxN1GZFlTTOR82iFvPuOA0UXx');

export default function Home() {
  const { wallet, connected } = useWallet();
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    name: "FreshPlayer",
    image: "https://tinyurl.com/player0001",
  });
  const [playerCount, setPlayerCount] = useState(2); // Start after Player0002

  async function generatePolicyId() {
    if (!connected || !wallet) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      const walletAddress = await wallet.getChangeAddress();
      const forgeScript = ForgeScript.withOneSignature(walletAddress);
      const policyId = forgeScript;
      console.log("Generated Policy ID:", policyId);
      alert(`Policy ID: ${policyId}`);
      setPolicyId(policyId);
    } catch (error) {
      console.error("Failed to generate policy ID:", error);
      alert("Failed to generate policy ID.");
    }
  }

  async function mintCIP68NFT() {
    if (!connected || !wallet || !policyId) {
      alert("Please connect wallet and generate Policy ID first!");
      return;
    }

    try {
      const walletAddress = await wallet.getChangeAddress();
      const forgeScript = ForgeScript.withOneSignature(walletAddress);
      const playerId = `Player${String(playerCount).padStart(4, '0')}`; // e.g., Player0003
      console.log("Current playerCount:", playerCount, "playerId:", playerId);
      const refAssetName = "000643b0" + playerId;
      const userAssetName = "000de140" + playerId;

      const cip68Metadata = {
        "721": {
          [policyId]: {
            [userAssetName]: {
              name: metadata.name,
              image: metadata.image,
            },
          },
        },
      };

      const tx = new Transaction({ initiator: wallet })
        .mintAsset(forgeScript, {
          assetName: refAssetName,
          assetQuantity: "1",
          label: "100",
          recipient: walletAddress,
        })
        .mintAsset(forgeScript, {
          assetName: userAssetName,
          assetQuantity: "1",
          label: "222",
          recipient: walletAddress,
        })
        .setMetadata(721, cip68Metadata["721"]);

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      console.log("Minting successful! Tx Hash:", txHash);
      alert(`NFT minted! Tx Hash: ${txHash}`);
      setPlayerCount(playerCount + 1); // Increment for next mint
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed.");
    }
  }

  async function lockReferenceToken() {
    if (!connected || !wallet) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      const walletAddress = await wallet.getChangeAddress();
      const tx = new Transaction({ initiator: wallet })
        .sendAssets(
          {
            address: adminLockScript.address,
            datum: {
              value: JSON.stringify({ status: "active" }),
            },
          },
          [
            {
              unit: "8319ad3f7a10143bf45753b0e5afcd5b1b574ef606e14aa586b268d53030303634336230506c6179657230303032",
              quantity:"1",
            },
          ]
        )
        .setRequiredSigners([walletAddress]);
  
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
  
      console.log("Locked! Tx Hash:", txHash);
      alert(`Token locked! Tx Hash: ${txHash}`);
    } catch (error) {
      console.error("Locking failed:", error);
      alert("Locking failed.");
    }
  }

  const handleMetadataChange = (e: { target: { name: any; value: any; }; }) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  return (
    <><div className="bg-gray-900 w-full text-white text-center">
      <Head>
        <title>CIP-68 Minter on Cardano</title>
        <meta name="description" content="Mint CIP-68 NFTs with Mesh" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-6xl font-thin mb-20">
          <a href="https://meshjs.dev/" className="text-sky-600">Mesh</a> CIP-68 Minter
        </h1>
        <div className="mb-20">
          <CardanoWallet />
        </div>
        <div className="mb-20">
          <button
            onClick={generatePolicyId}
            disabled={!connected}
            className={`px-6 py-3 rounded-xl text-lg font-bold transition ${connected ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"}`}
          >
            Generate Policy ID
          </button>
        </div>
        <div className="mb-20 w-96">
          <h2 className="text-2xl mb-4">Edit Metadata</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={metadata.name}
              onChange={handleMetadataChange}
              placeholder="Name"
              className="p-2 rounded text-black" />
            <input
              type="text"
              name="image"
              value={metadata.image}
              onChange={handleMetadataChange}
              placeholder="Image URL"
              className="p-2 rounded text-black" />
          </div>
        </div>
        <div className="mb-20">
          <button
            onClick={mintCIP68NFT}
            disabled={!connected || !policyId}
            className={`px-6 py-3 rounded-xl text-lg font-bold transition ${connected && policyId ? "bg-sky-600 hover:bg-sky-700" : "bg-gray-600 cursor-not-allowed"}`}
          >
            Mint CIP-68 NFT
          </button>
        </div>
      </main>
    </div><div className="mb-20">
        <button
          onClick={lockReferenceToken}
          disabled={!connected}
          className={`px-6 py-3 rounded-xl text-lg font-bold transition ${connected ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 cursor-not-allowed"}`}
        >
          Lock Reference Token
        </button>
      </div></>
  );
}