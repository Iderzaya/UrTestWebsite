/*global wallet*/
import React from "react";
import { BodyText } from "./Wallet.styles";
import { FormStyle } from "../Form.style";
import { WalletMain } from "./Wallet.styles";
import { Button } from "../Button.styles";
import { Box } from "../Box.styles";
import success from "../../assets/images/checked.png"
import fail from "../../assets/images/cancel.png"
import TransactionAsset from "./TransactionAsset/TransactionAsset";
import { TOKEN, ALGOD_SERVER, PORT } from "../../constants.js";
import TransactionTok from "./TransactionTok/TransactionTok";

const algosdk = require("algosdk");
let client = new algosdk.Algodv2(TOKEN, ALGOD_SERVER, PORT)
let userAccount 
let mnemonic 
let account1_info = 0;

const Wallet =  ()  =>{
    const connectWallet = async () =>{
        try{
            userAccount = algosdk.mnemonicToSecretKey(mnemonic);
            userAccount = userAccount.addr;
            document.querySelector(".check").style.display = "block";
            try {
                document.querySelector(".fail").style.display = "none";

                account1_info = (await client.accountInformation(userAccount).do());
                console.log("Balance of account 1: " + JSON.stringify(account1_info.amount));
                document.querySelector(".accountnumber").textContent = userAccount;
                document.querySelector(".amountshown").textContent = JSON.stringify(account1_info.amount);
                try {
                    document.querySelector(".amounttoken").textContent = JSON.stringify(account1_info.assets[0].amount);
                }catch{document.querySelector(".amounttoken").textContent = 0;}
                document.querySelector(".accountmne").textContent = mnemonic;

            }catch(err){
                console.log(err)
            }
        }
        catch{
            document.querySelector(".check").style.display = "none";
            document.querySelector(".fail").style.display = "block";
            document.querySelector(".amountshown").textContent = '';
            document.querySelector(".amounttoken").textContent = '';
            document.querySelector(".accountnumber").textContent = '';
        }
    }

    return( 
        <WalletMain>
            
            <div>
                <BodyText>Make Payment</BodyText>
                {/* <FormStyle onChange = {(e) => userAccount = e.target.value} placeholder="Account number" id="userAcc"/><br/> */}
                <FormStyle onChange = {(e) => mnemonic = e.target.value} placeholder="Account mnemonic" id="userMne"/><br/>
                    <Button onClick ={connectWallet}>Get Amount</Button>
                    <img src = {success} width="50px" className="img check" alt=""/>
                    <img src = {fail} width="50px" className="img fail" alt=""/>
                <Box className="grid-container">
                    <div >Account Number:</div>
                    <div className = "accountnumber "></div>
                    <div >Account Balance (Algo) :</div>
                    <div className = "amountshown "></div>
                    <div >Token Balance (UrTest) :</div>
                    <div className = "amounttoken "></div>
                    <div className = "accountmne "></div>

                </Box>
                <TransactionTok></TransactionTok>
                <TransactionAsset></TransactionAsset>


            </div>
        </WalletMain>

    )
}

export default Wallet
