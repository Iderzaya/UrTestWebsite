import React from "react";
import { BodyText, TransactionMain } from "./TransactionTok.styles.js";
import { FormStyle } from "../../Form.style";
import { TransactionButton } from "../../Button.styles";
import { TOKEN, ALGOD_SERVER, PORT } from "../../../constants.js";


const algosdk = require("algosdk");
let algodClient = new algosdk.Algodv2(TOKEN, ALGOD_SERVER, PORT)

const TransactionTok = ()  =>{

    let transferAmount;
    let receiverAddress;

    const transferFund = async () =>{

        const mnemonic = document.querySelector(".accountmne").textContent;
        const account = algosdk.mnemonicToSecretKey(mnemonic);

        console.log("transfer fund is working. accNum is "+ account.addr );


        // Construct the transaction
        let params = await algodClient.getTransactionParams().do();

        // comment out the next two lines to use suggested fee
        params.fee = algosdk.ALGORAND_MIN_TX_FEE;
        params.flatFee = true;

        // receiver defined as TestNet faucet address 
        const enc = new TextEncoder();
        const note = enc.encode("Hello World");
        let sender = account.addr;

        let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender, 
            to: receiverAddress, 
            amount: parseInt(transferAmount), 
            note: note, 
            suggestedParams: params
        });


        // Sign the transaction
        let signedTxn = txn.signTxn(account.sk);
        let txId = txn.txID().toString();
        console.log("Signed transaction with txID: %s", txId);
        document.querySelector(".logger").textContent += "Signed transaction with txID: "+ txId + ". \n"

        // Submit the transaction
        await algodClient.sendRawTransaction(signedTxn).do();

        // Wait for confirmation
        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
        
        //Get the completed Transaction
        document.querySelector(".logger").textContent += "Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"] + ". \n"
        console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);

        let string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
        document.querySelector(".logger").textContent += "Note field: "+ string + ".\n";
        console.log("Note field: ", string);

        let accountInfo = await algodClient.accountInformation(account.addr).do();

        document.querySelector(".logger").textContent += "Transaction Amount: " + confirmedTxn.txn.txn.amt + " microAlgos. \n";        
        document.querySelector(".logger").textContent += "Transaction Fee: " + confirmedTxn.txn.txn.fee + " microAlgos. \n";        
        document.querySelector(".logger").textContent += "Account balance: " + accountInfo.amount + " microAlgos. \n";        

        console.log("Transaction Amount: %d microAlgos", confirmedTxn.txn.txn.amt);        
        console.log("Transaction Fee: %d microAlgos", confirmedTxn.txn.txn.fee);
        console.log("Account balance: %d microAlgos", accountInfo.amount);

    }
    return(
        <TransactionMain>
            <div className="classBox">
                <br />
                <BodyText>Transfer Algo Fund</BodyText>
                <FormStyle onChange={(e) => receiverAddress = e.target.value} placeholder="Receiver address" /><br />
                <FormStyle onChange={(e) => transferAmount = e.target.value} placeholder="Amount" /><br />
                <div className="logger"></div>
                <TransactionButton onClick={transferFund}>{"Transfer Fund"}</TransactionButton>
            </div>

        </TransactionMain>
    )
};


export default TransactionTok