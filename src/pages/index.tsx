import Head from "next/head";
import { adminLockScript } from "../contracts/adminLock";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { Transaction, PlutusScript, NativeScript, serializeNativeScript, Data, BrowserWallet, serializePlutusScript, } from "@meshsdk/core";
import { useState, useEffect } from "react";
import { BlockfrostProvider } from '@meshsdk/core';
import { Cardano } from '@cardano-sdk/core'; 
import { blake2b } from 'blakejs';

const blockfrostProvider = new BlockfrostProvider('previewT07MdOONxN1GZFlTTOR82iFvPuOA0UXx');
const POLICY_ID = "b2e20610e339ec3e6260feda072e8ea47ee622aa398c2a794e0ea90b";
const MINT_SCRIPT: PlutusScript = {
  code: "5846010000322232533300900800486010895cd65d401000200200646666646004266006466666263157337300e375c2f335d744ce2f",
  version: "V2",
};
const STATE_SCRIPT: PlutusScript = {
  code: "4e4d010000332223200114d33abba30013001375c2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f335d744ce2f",
  version: "V2",
};
try {
  const testAddress = serializePlutusScript(STATE_SCRIPT, undefined, 0).address;
  console.log("STATE_SCRIPT is valid. Test address:", testAddress);
} catch (error: any) {
  console.error("STATE_SCRIPT is invalid:", error.message);
}
const FEE_WALLET = "addr_test1qqwjhk7afcccp79tx2v6y4nxgz5adg4p9sn542hkp3uepvcv4q99clyy9mkerr024hrl6xxhz2t9nfmhkehj8z8r4wwsqvexyh"
const ADMIN_PKH = "de2715c512c4f08ea3f845d7157519b0935e5596f2275ce6f423a13e";

export default function Home() {
  const { wallet, connected } = useWallet();
  const [metadata, setMetadata] = useState({
    name: "",
    avatar: "",
    title: "",
    level: "",
    discordId: "",
    gamerTag: "",
    bio: "",
    socialLink: "",
  });
  const [playerCount, setPlayerCount] = useState(3);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stateScriptAddress, setStateScriptAddress] = useState<string | null>(null);
  const [adminPKH, setAdminPKH] = useState<string | null>(null);

  useEffect(() => {
    const setAddress = async () => {
      if (!connected || !wallet) return;
      try {
        const addrs = await wallet.getUsedAddresses();
        if (!addrs.length) throw new Error("No used addresses found");
        const address = addrs[0];
        const addrObj = Cardano.Address.fromBech32(address);
        const baseAddr = Cardano.BaseAddress.fromAddress(addrObj);
        if (!baseAddr) throw new Error("Not a base address");
        const pkh = baseAddr.getPaymentCredential().hash; // 56-byte key
        console.log("Raw pkh:", Buffer.from(pkh).toString('hex'));
        console.log("Raw pkh length:", pkh.length); // 56
        const pkhHash = blake2b(pkh, undefined, 28); // 28-byte Blake2b-224
        const pkhHex = Buffer.from(pkhHash).toString('hex'); // 56 chars
        console.log("Hashed PKH:", pkhHex);
        console.log("Hashed PKH length:", Buffer.from(pkhHex, 'hex').length); // 28
        // Use Mesh SDK to serialize Plutus script
        const stateScriptAddress = serializePlutusScript(STATE_SCRIPT, undefined, 0).address;
        setStateScriptAddress(stateScriptAddress);
        console.log("Created stateScriptAddress:", stateScriptAddress);
        setAdminPKH(pkhHex);
        console.log("New adminPKH length:", Buffer.from(pkhHex, 'hex').length); // 28
        console.log("adminPKH set in useEffect:", pkhHex);
        setIsAdmin(pkhHex === ADMIN_PKH);
      } catch (error) {
        console.error("Failed to set addresses:", error);
      }
    };
    setAddress();
  }, [connected, wallet]);
  
  async function initializeStateUtxos() {
    if (!connected || !wallet || !adminPKH) {
      alert("Connect wallet first or admin PKH not set!");
      return;
    }
    if (!stateScriptAddress) {
      alert("State script address not ready!");
      return;
    }
    console.log("stateScriptAddress:", stateScriptAddress);
    const walletPKH = await wallet.getChangeAddress().then(addr => {
      console.log("Raw address:", addr);
      const addrObj = Cardano.Address.fromBech32(addr);
      console.log("Address object:", addrObj);
      const baseAddr = addrObj.asBase();
      console.log("Base address:", baseAddr);
      const hash = baseAddr?.getPaymentCredential().hash;
      console.log("Raw hash:", hash);
      return hash ? Buffer.from(blake2b(Buffer.from(hash.toString()), undefined, 28)).toString('hex') : '';
    });
    console.log("walletPKH in initializeStateUtxos:", walletPKH, "adminPKH:", adminPKH);
    if (walletPKH !== adminPKH) {
      console.log("Admin check failed: walletPKH does not match adminPKH");
      alert("Admin only!");
      return;
    }
    try {
      const tx = new Transaction({ initiator: wallet });
      const shards = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()";
      console.log("Initializing 36 shards:", shards);
      for (const shard of shards) {
        const datum: Data = {
          alternative: 0,
          fields: [
            shard,
            { alternative: 0, fields: [] }
          ]
        };
        
        tx.sendAssets(
          { address: stateScriptAddress, datum: { value: datum, inline: true } },
          [{ unit: "lovelace", quantity: "1000000" }] // Mesh will adjust
        );
      }
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log("State UTxOs initialized! Tx Hash:", txHash);
      alert(`State UTxOs initialized! Tx Hash: ${txHash}`);
    } catch (error) {
      console.error("Initialization failed:", error);
      alert("Failed to initialize state UTxOs!");
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
    if (!connected || !wallet || !adminPKH) {
      alert("Connect wallet first or admin PKH not set!");
      return;
    }
    if (!stateScriptAddress) {
      alert("State script address not ready!");
      return;
    }
    try {
      const walletAddress = await wallet.getChangeAddress();
      const playerId = `Player${String(playerCount).padStart(4, '0')}`;
      const refAssetName = "000643b0" + playerId;
      const userAssetName = "000de140" + playerId;
      const adminScript = adminLockScript(Buffer.from(adminPKH, 'hex').toString('hex'));
      console.log("adminPKH in mintCIP68NFT:", adminPKH);
      const adminLockAddress = serializeNativeScript(adminScript).address;
      const shard = metadata.name.charAt(0).toUpperCase();
  
      console.log("Fetching UTxOs for:", stateScriptAddress);
      const response = await fetch(
        `https://cardano-preview.blockfrost.io/api/v0/addresses/${stateScriptAddress}/utxos`,
        { headers: { project_id: 'previewT07MdOONxN1GZFlTTOR82iFvPuOA0UXx' } }
      );
      if (!response.ok) throw new Error(`Blockfrost error: ${response.status}`);
      const utxos = await response.json();
      console.log("UTxOs found:", utxos.length, utxos);
  
      let selectedUtxo = null;
      let currentDatum = null;
      for (const utxo of utxos) {
        if (utxo.data_hash) {
          console.log("Checking datum hash:", utxo.data_hash);
          const datum = await fetchDatumFromHash(utxo.data_hash);
          console.log("Datum content:", JSON.stringify(datum));
          if (datum && datum.fields && datum.fields[0].bytes === shard.charCodeAt(0).toString(16)) {
            console.log("Shard match found for:", shard);
            if (JSON.stringify(datum.fields[1].fields || []).includes(metadata.name)) {
              alert("Name already minted!");
              return;
            }
            selectedUtxo = utxo;
            currentDatum = datum;
            break;
          }
        }
      }
  
      if (!selectedUtxo || !currentDatum) {
        alert("State UTxO for shard not found! Initialize first.");
        return;
      }

      const formattedUtxo = {
        input: {
          txHash: selectedUtxo.tx_hash,
          outputIndex: selectedUtxo.output_index
        },
        output: {
          address: selectedUtxo.address,
          amount: selectedUtxo.amount,
          datum: { inline: currentDatum } // Optional, but matches your inline setup
        }
      };
  
      const updatedNames = [...(currentDatum.fields[1].fields || []), metadata.name];
      const updatedDatum: Data = {
        alternative: 0,
        fields: [
          shard.charCodeAt(0).toString(16),
          { alternative: 0, fields: updatedNames }
        ]
      };
  
      const cip68Metadata = {
        name: metadata.name,
        avatar: metadata.avatar,
        title: metadata.title,
        level: metadata.level,
        discordId: metadata.discordId,
        gamerTag: metadata.gamerTag,
        bio: metadata.bio,
        socialLink: metadata.socialLink,
      };
  
      const tx = new Transaction({ initiator: wallet })
        .redeemValue({
          value: formattedUtxo,
          script: STATE_SCRIPT,
          datum: currentDatum,
          redeemer: { data: "" },
        })
        .sendAssets(
          {
            address: stateScriptAddress,
            datum: { value: updatedDatum as Data },
          },
          [{ unit: "lovelace", quantity: "200000" }]
        )
        .mintAsset(
          MINT_SCRIPT,
          {
            assetName: refAssetName,
            assetQuantity: "1",
            label: "100",
            recipient: adminLockAddress,
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
        .setMetadata(0, cip68Metadata)
        .sendLovelace(FEE_WALLET, "5000000");
  
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

  async function updateCIP68Metadata() {
    if (!connected || !wallet || !adminPKH) {
      alert("Connect wallet first or admin PKH not set!");
      return;
    }
    if (!stateScriptAddress) {
      alert("State script address not ready!");
      return;
    }
    try {
      const walletAddress = await wallet.getChangeAddress();
      const playerId = `Player${String(playerCount - 1).padStart(4, '0')}`;
      const refAssetName = "000643b0" + playerId;
      const userAssetName = "000de140" + playerId;
      const adminScript = adminLockScript(adminPKH); // Changed to adminPKH
      const adminLockAddress = serializeNativeScript(adminScript).address;
  
      const utxos = await blockfrostProvider.fetchUTxOs(adminLockAddress);
      let refUtxo = null;
      for (const utxo of utxos) {
        if (utxo.output.amount.some((asset: any) => asset.unit === POLICY_ID + Buffer.from(refAssetName).toString('hex'))) {
          refUtxo = utxo;
          break;
        }
      }
  
      if (!refUtxo) {
        alert("Reference token not found!");
        return;
      }
  
      const shard = metadata.name.charAt(0).toUpperCase();
      const stateUtxos = await blockfrostProvider.fetchUTxOs(stateScriptAddress);
      let stateUtxo = null;
      let currentDatum = null;
      for (const utxo of stateUtxos) {
        if (utxo.output.dataHash) {
          const datum = await fetchDatumFromHash(utxo.output.dataHash);
          if (datum && datum.fields && datum.fields[0] === shard) {
            stateUtxo = utxo;
            currentDatum = datum;
            break;
          }
        }
      }
  
      if (!stateUtxo || !currentDatum) {
        alert("State UTxO for shard not found!");
        return;
      }
  
      const oldName = currentDatum.fields[1].fields.find((n: string) => n !== metadata.name) || currentDatum.fields[1].fields[0];
      const updatedNames = currentDatum.fields[1].fields.map((n: string) => n === oldName ? metadata.name : n);
      const updatedDatum: Data = {
        alternative: 0,
        fields: [
          shard,
          { alternative: 0, fields: updatedNames }
        ]
      };
  
      const updatedMetadata = {
        name: metadata.name,
        avatar: metadata.avatar,
        title: metadata.title,
        level: metadata.level,
        discordId: metadata.discordId,
        gamerTag: metadata.gamerTag,
        bio: metadata.bio,
        socialLink: metadata.socialLink,
      };
  
      const statusDatum: Data = {
        alternative: 0,
        fields: ["active"]
      };
      const tx = new Transaction({ initiator: wallet })
        .redeemValue({
          value: refUtxo,
          script: adminScript as any,
          datum: statusDatum as Data,
          redeemer: { data: "" },
        })
        .sendAssets(
          {
            address: adminLockAddress,
            datum: { value: statusDatum as Data },
          },
          [{ unit: POLICY_ID + Buffer.from(refAssetName).toString('hex'), quantity: "1" }]
        )
        .redeemValue({
          value: stateUtxo,
          script: STATE_SCRIPT,
          datum: currentDatum,
          redeemer: { data: "" },
        })
        .sendAssets(
          {
            address: stateScriptAddress,
            datum: { value: updatedDatum as Data },
          },
          [{ unit: "lovelace", quantity: "200000" }]
        )
        .setMetadata(0, updatedMetadata)
        .sendLovelace(FEE_WALLET, "500000");
  
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
  
      console.log("Metadata updated! Tx Hash:", txHash);
      alert(`Metadata updated! Tx Hash: ${txHash}`);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed.");
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
            <input type="text" name="name" value={metadata.name} onChange={handleMetadataChange} placeholder="Name (Tx Required)" className="p-2 rounded text-black" />
            <input type="text" name="avatar" value={metadata.avatar} onChange={handleMetadataChange} placeholder="Avatar URL (Tx Required)" className="p-2 rounded text-black" />
            <input type="text" name="title" value={metadata.title} onChange={handleMetadataChange} placeholder="Title (Tx Required)" className="p-2 rounded text-black" />
            <input type="text" name="level" value={metadata.level} onChange={handleMetadataChange} placeholder="Level (Tx Required)" className="p-2 rounded text-black" />
            <input type="text" name="discordId" value={metadata.discordId} onChange={handleMetadataChange} placeholder="Discord ID (Instant Update)" className="p-2 rounded text-black" />
            <input type="text" name="gamerTag" value={metadata.gamerTag} onChange={handleMetadataChange} placeholder="Gamer Tag (Instant Update)" className="p-2 rounded text-black" />
            <input type="text" name="bio" value={metadata.bio} onChange={handleMetadataChange} placeholder="Bio (Instant Update)" className="p-2 rounded text-black" />
            <input type="text" name="socialLink" value={metadata.socialLink} onChange={handleMetadataChange} placeholder="Social Link (Instant Update)" className="p-2 rounded text-black" />
          </div>
        </div>
        <div className="mb-20">
          <button
            onClick={initializeStateUtxos}
            disabled={!connected}
            className={`px-6 py-3 rounded-xl text-lg font-bold transition ${connected ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"}`}
            style={{ display: isAdmin ? 'block' : 'none' }}
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
            onClick={updateCIP68Metadata}
            disabled={!connected}
            className={`px-6 py-3 rounded-xl text-lg font-bold transition ${connected ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-600 cursor-not-allowed"}`}
          >
            Update Metadata
          </button>
        </div>
      </main>
    </div>
  );
} 
