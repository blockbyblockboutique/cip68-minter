import Head from "next/head";
import { adminLockScript } from "../contracts/adminLock";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { Transaction, PlutusScript } from "@meshsdk/core";
import { useState } from "react";
import { BlockfrostProvider } from '@meshsdk/core';

const blockfrostProvider = new BlockfrostProvider('previewT07MdOONxN1GZFlTTOR82iFvPuOA0UXx');
const POLICY_ID = "b2e20610e339ec3e6260feda072e8ea47ee622aa398c2a794e0ea90b";
const MINT_SCRIPT: PlutusScript = {
  code: "5901c001000032222533300a0086010895cd25e5d48010020a400149b2b9b2a",
  version: "V2",
};
const STATE_SCRIPT: PlutusScript = {
  code: "581c01000033222220051200120011",
  version: "V2",
};
const scriptAddress = "addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8";

export default function Home() {
  const { wallet, connected } = useWallet();
  const [metadata, setMetadata] = useState({
    name: "",
    image: "",
    mediaType: "image/png",
    description: "",
    files: [] as string[],
    version: "1.0",
    attributes: {},
    tags: [] as string[],
  });
  const [playerCount, setPlayerCount] = useState(3);

  async function initializeStateUtxos() {
    if (!connected || !wallet) {
      alert("Connect wallet first!");
      return;
    }
    try {
      const tx = new Transaction({ initiator: wallet });
      for (let i = 65; i <= 90; i++) { // A-Z
        const shard = String.fromCharCode(i);
        tx.sendAssets(
          {
            address: scriptAddress,
            datum: { value: JSON.stringify({ shard, names: [] }) },
          },
          [{ unit: "lovelace", quantity: "2000000" }]
        );
      }
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log("State UTxOs initialized! Tx Hash:", txHash);
      alert(`State UTxOs initialized! Tx Hash: ${txHash}`);
    } catch (error) {
      console.error("Initialization failed:", error);
      alert("Initialization failed.");
    }
  }

  async function fetchDatumFromHash(dataHash: string) {
    const response = await fetch(
      `https://cardano-preview.blockfrost.io/api/v0/scripts/datum/${dataHash}`,
      { headers: { project_id: 'previewT07MdOONxN1GZFlTTOR82iFvPuOA0UXx' } }
    );
    const data = await response.json();
    return data.json_value;
  }

  async function mintCIP68NFT() {
    if (!connected || !wallet) {
      alert("Connect wallet first!");
      return;
    }
    try {
      const walletAddress = await wallet.getChangeAddress();
      const playerId = `Player${String(playerCount).padStart(4, '0')}`;
      const refAssetName = "000643b0" + playerId;
      const userAssetName = "000de140" + playerId;
      const stateUtxoAddress = scriptAddress;
  
      const shard = metadata.name.charAt(0).toUpperCase();
      const utxos = await blockfrostProvider.fetchUTxOs(stateUtxoAddress);
      let selectedUtxo = null;
      let currentDatum: string | null = null;
  
      for (const utxo of utxos) {
        if (utxo.output.dataHash) {
          const datum = await fetchDatumFromHash(utxo.output.dataHash);
          if (datum && datum.shard === shard) {
            if (JSON.stringify(datum.names || []).includes(metadata.name)) {
              alert("Name already minted!");
              return;
            }
            selectedUtxo = utxo;
            currentDatum = JSON.stringify(datum);
            break;
          }
        }
      }
  
      if (!selectedUtxo || !currentDatum) {
        alert("State UTxO for shard not found! Initialize first.");
        return;
      }
  
      const parsedDatum = JSON.parse(currentDatum);
      const updatedNames = [...(parsedDatum.names || []), metadata.name];
      const updatedDatum = JSON.stringify({ shard, names: updatedNames });
  
      const cip68Metadata = {
        "721": {
          [POLICY_ID]: {
            [userAssetName]: {
              name: metadata.name,
              image: metadata.image,
              mediaType: metadata.mediaType,
              description: metadata.description,
              files: metadata.files,
              version: metadata.version,
              attributes: metadata.attributes,
              tags: metadata.tags,
            },
          },
        },
      };
  
      const tx = new Transaction({ initiator: wallet })
        .redeemValue({
          value: selectedUtxo,
          script: STATE_SCRIPT,
          datum: currentDatum, // TypeScript knows it’s a string here
          redeemer: { data: "" },
        })
        .sendAssets(
          {
            address: stateUtxoAddress,
            datum: { value: updatedDatum },
          },
          [{ unit: "lovelace", quantity: "2000000" }]
        )
        .mintAsset(
          MINT_SCRIPT,
          {
            assetName: refAssetName,
            assetQuantity: "1",
            label: "100",
            recipient: walletAddress,
          },
          { data: "" }
        )
        .mintAsset(
          MINT_SCRIPT,
          {
            assetName: userAssetName,
            assetQuantity: "1",
            label: "222",
            recipient: walletAddress,
          },
          { data: "" }
        )
        .setMetadata(721, cip68Metadata["721"]);
  
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
  
      console.log("Minting successful! Tx Hash:", txHash);
      alert(`NFT minted! Tx Hash: ${txHash}`);
      setPlayerCount(playerCount + 1);
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed.");
    }
  }

  async function lockReferenceToken() {
    if (!connected || !wallet) {
      alert("Connect wallet first!");
      return;
    }
    try {
      const walletAddress = await wallet.getChangeAddress();
      const playerId = `Player${String(playerCount - 1).padStart(4, '0')}`;
      const refAssetName = "000643b0" + playerId;
      const unit = POLICY_ID + Buffer.from(refAssetName).toString('hex');

      const tx = new Transaction({ initiator: wallet })
        .sendAssets(
          {
            address: adminLockScript.address,
            datum: { value: JSON.stringify({ status: "active" }) },
          },
          [{ unit: unit, quantity: "1" }]
        )
        .setRequiredSigners([walletAddress]);

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      console.log("Locked! Tx Hash:", txHash);
      alert(`Token locked! Tx Hash: ${txHash}`);
    } catch (error: any) {
      console.error("Locking failed:", error);
      alert("Locking failed: " + error.message);
    }
  }

  const handleMetadataChange = (e: { target: { name: any; value: any; }; }) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-900 w-full text-white text-center">
      <Head>
        <title>PlayerID CIP-68 Minter</title>
        <meta name="description" content="Mint PlayerID CIP-68 NFTs" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-6xl font-thin mb-20">
          <a href="https://meshjs.dev/" className="text-sky-600">Mesh</a> PlayerID Minter
        </h1>
        <div className="mb-20">
          <CardanoWallet />
        </div>
        <div className="mb-20 w-96">
          <h2 className="text-2xl mb-4">Edit Metadata</h2>
          <div className="flex flex-col gap-4">
            <input type="text" name="name" value={metadata.name} onChange={handleMetadataChange} placeholder="Name" className="p-2 rounded text-black" />
            <input type="text" name="image" value={metadata.image} onChange={handleMetadataChange} placeholder="Image URL" className="p-2 rounded text-black" />
            <input type="text" name="mediaType" value={metadata.mediaType} onChange={handleMetadataChange} placeholder="Media Type (e.g., image/png)" className="p-2 rounded text-black" />
            <input type="text" name="description" value={metadata.description} onChange={handleMetadataChange} placeholder="Description" className="p-2 rounded text-black" />
            <input type="text" name="files" value={metadata.files.join(',')} onChange={(e) => setMetadata({ ...metadata, files: e.target.value.split(',') })} placeholder="Files (comma-separated)" className="p-2 rounded text-black" />
            <input type="text" name="version" value={metadata.version} onChange={handleMetadataChange} placeholder="Version (e.g., 1.0)" className="p-2 rounded text-black" />
            <input type="text" name="attributes" value={JSON.stringify(metadata.attributes)} onChange={(e) => setMetadata({ ...metadata, attributes: JSON.parse(e.target.value) })} placeholder="Attributes (JSON)" className="p-2 rounded text-black" />
            <input type="text" name="tags" value={metadata.tags.join(',')} onChange={(e) => setMetadata({ ...metadata, tags: e.target.value.split(',') })} placeholder="Tags (comma-separated)" className="p-2 rounded text-black" />
          </div>
        </div>
        <div className="mb-20">
          <button
            onClick={initializeStateUtxos}
            disabled={!connected}
            className={`px-6 py-3 rounded-xl text-lg font-bold transition ${connected ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"}`}
          >
            Initialize State UTxOs
          </button>
        </div>
        <div className="mb-20">
          <button
            onClick={mintCIP68NFT}
            disabled={!connected}
            className={`px-6 py-3 rounded-xl text-lg font-bold transition ${connected ? "bg-sky-600 hover:bg-sky-700" : "bg-gray-600 cursor-not-allowed"}`}
          >
            Mint PlayerID NFT
          </button>
        </div>
        <div className="mb-20">
          <button
            onClick={lockReferenceToken}
            disabled={!connected}
            className={`px-6 py-3 rounded-xl text-lg font-bold transition ${connected ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 cursor-not-allowed"}`}
          >
            Lock Reference Token
          </button>
        </div>
      </main>
    </div>
  );
}