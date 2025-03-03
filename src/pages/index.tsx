import Head from "next/head";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { Transaction, ForgeScript } from "@meshsdk/core";
import { useState } from "react";
import { BlockfrostProvider } from '@meshsdk/core';

const blockfrostProvider = new BlockfrostProvider('previewT07MdOONxN1GZFlTTOR82iFvPuOA0UXx');

export default function Home() {
  const { wallet, connected } = useWallet();
  const [policyId, setPolicyId] = useState<string | null>(null);

  async function generatePolicyId() {
    if (!connected || !wallet) {
      alert("Please connect your wallet first!");
      return;
    }
    try {
      const walletAddress = await wallet.getChangeAddress();
      const forgeScript = ForgeScript.withOneSignature(walletAddress); // This is already the policy ID string
      const policyId = forgeScript; // No getHash() needed
      console.log("Generated Policy ID:", policyId);
      alert(`Policy ID: ${policyId}`);
      setPolicyId(policyId);
    } catch (error) {
      console.error("Failed to generate policy ID:", error);
      alert("Failed to generate policy ID. Check the console for details.");
    }
  }

  async function mintCIP68NFT() {
    if (!connected || !wallet) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!policyId) {
      alert("Please generate a Policy ID first!");
      return;
    }

    try {
      const walletAddress = await wallet.getChangeAddress();
      const forgeScript = ForgeScript.withOneSignature(walletAddress);

      const playerId = "Player0002"; // New NFT
      const refAssetName = "000643b0" + playerId;
      const userAssetName = "000de140" + playerId;

      const metadata = {
        "721": {
          [policyId]: {
            [userAssetName]: {
              image: `https://tinyurl.com/player0001`,
            },
          },
        },
      };

      const tx = new Transaction({ initiator: wallet });

      tx.mintAsset(
        forgeScript,
        {
          assetName: refAssetName,
          assetQuantity: "1",
          label: "100",
          recipient: walletAddress,
        }
      );

      tx.mintAsset(
        forgeScript,
        {
          assetName: userAssetName,
          assetQuantity: "1",
          label: "222",
          recipient: walletAddress,
        }
      );

      tx.setMetadata(721, metadata["721"]);

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      console.log("Minting successful! Transaction Hash:", txHash);
      alert(`NFT minted successfully! Tx Hash: ${txHash}`);
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed. Check the console for details.");
    }
  }

  return (
    <div className="bg-gray-900 w-full text-white text-center">
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
            className={`px-6 py-3 rounded-xl text-lg font-bold transition ${
              connected ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Generate Policy ID
          </button>
        </div>
        <div className="mb-20">
          <button
            onClick={mintCIP68NFT}
            disabled={!connected || !policyId}
            className={`px-6 py-3 rounded-xl text-lg font-bold transition ${
              connected && policyId ? "bg-sky-600 hover:bg-sky-700" : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Mint CIP-68 NFT
          </button>
        </div>
      </main>
    </div>
  );
}