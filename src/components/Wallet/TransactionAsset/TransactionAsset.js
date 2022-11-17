import React from "react";
import { BodyText, TransactionTokenMain } from "./TransactionAsset.styles";
import { FormStyle } from "../../Form.style";
import { TransactionButton } from "../../Button.styles";
import { TOKEN, ALGOD_SERVER, PORT } from "../../../constants.js";

const algosdk = require("algosdk");
let algodClient = new algosdk.Algodv2(TOKEN, ALGOD_SERVER, PORT)
const assetID = 122334064

const TransactionAsset = ()  =>{

    let transferAmount;
    let receiverAddress;
    let receiverMnemonic;

    const OptAsset = async (receiverMnemonic) => {


        let recoveredAccount3 = algosdk.mnemonicToSecretKey(receiverMnemonic);
        console.log(recoveredAccount3 + "is the reciever");

        let params = await algodClient.getTransactionParams().do();
        console.log(params)

        let sender = recoveredAccount3.addr;
        console.log(sender + "is the sender")
        let recipient = sender;
        let revocationTarget = undefined;
        let closeRemainderTo = undefined;
        let amount = 0;

        const enc = new TextEncoder();
        const note = enc.encode("Hello World");
        // signing and sending "txn" allows sender to begin accepting asset specified by creator and index
        let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            sender, 
            recipient, 
            closeRemainderTo, 
            revocationTarget,
            amount, 
            note, 
            assetID, 
            params);

        // Must be signed by the account wishing to opt in to the asset    
        let rawSignedTxn = opttxn.signTxn(recoveredAccount3.sk);
        let opttx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
        // Wait for confirmation
        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, opttx.txId, 4);
        //Get the completed Transaction
        console.log("Transaction " + opttx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

        }

    const transferFund = async () =>{

        let mnemonic = document.querySelector(".accountmne").textContent;
        let account = algosdk.mnemonicToSecretKey(mnemonic);
        console.log(account.addr.length)

        let reciever_info = (await algodClient.accountInformation(receiverAddress).do());
        try {
            document.querySelector(".recMneu").style.display = "none";
            let amount = reciever_info.assets[0].amount
            console.log("worked")

        }catch(err){
            document.querySelector(".recMneu").style.display = "block";
            console.log(err)
            try{
                let amount = reciever_info.assets[0].amount
            }catch(err){
                OptAsset(receiverMnemonic)
                console.log("agaiiiiin");
                console.log(err)
            }
        }

        let params = await algodClient.getTransactionParams().do();
        console.log(params)
    
        // receiver defined as TestNet faucet address 
        const enc = new TextEncoder();
        const note = enc.encode("Hello World");

        // comment out the next two lines to use suggested fee
        // params.fee = 1;
        // params.flatFee = true;
        console.log(account.addr)
        console.log(receiverAddress)
        // signing and sending "txn" will send "amount" assets from "sender" to "recipient"
        let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from : account.addr.toString(), 
            to: receiverAddress.toString(), 
            amount: parseInt(transferAmount),  
            note: note, 
            assetIndex: assetID, 
            suggestedParams: params,
        });
        
        // Must be signed by the account sending the asset  
        let rawSignedTxn = txn.signTxn(account.sk)
        let txId = txn.txID().toString();
        console.log("Signed transaction with txID: %s", txId);
        document.querySelector(".loggerToken").textContent += "Signed transaction with txID: "+ txId + ". \n"

        await algodClient.sendRawTransaction(rawSignedTxn).do();

        // Wait for confirmation
        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
        //Get the completed Transaction
        document.querySelector(".loggerToken").textContent += "Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"] + ". \n"
        console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
        document.querySelector(".loggerToken").textContent += "Transaction Amount: " + confirmedTxn.txn.txn.amt + " microAlgos. \n";        

    }
    return(
        <TransactionTokenMain>
            <div className="classBox">
                <br />
                <BodyText>Transfer Token Fund</BodyText>
                <FormStyle onChange={(e) => receiverAddress = e.target.value} placeholder="Receiver address" /><br />
                <FormStyle onChange={(e) => receiverMnemonic = e.target.value} placeholder="Receiver mnemonic" className="recMneu"/><br />
                <FormStyle onChange={(e) => transferAmount = e.target.value} placeholder="Amount" /><br />
                <div className="loggerToken"></div>
                <TransactionButton onClick={transferFund}>{"Transfer Token"}</TransactionButton>
            </div>

        </TransactionTokenMain>
    )
};


export default TransactionAsset