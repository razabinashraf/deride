import React, {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import contractABI from '../abi/Deride.json';

export const TransactionContext= React.createContext('');

const DerideContractAddress = '0x44dE8F032D6224DD8871e18e54381a2B9AD5f40c';
const TokenContractAddress = '0x249e6b8456e242fdA3134fF37863784fBF9d5a79';
const { ethereum }= window;


const getDerideContract= ()=>{
    const provider= new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const TransactionContract= new ethers.Contract(DerideContractAddress,contractABI,signer);

    return TransactionContract;
}

const getTokenContract =() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const TokenContract = new ethers.Contract(TokenContractAddress, contractABI,signer)

    return TokenContract;
}

export const TransactionProvider =({ children })=>{
    
    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletIsConnected = async ()=> {
        try {
            if(!ethereum) return alert("Please install Metamask");

            const accounts= await ethereum.request({method: 'eth_accounts'});
            
            if(accounts.length){
                setCurrentAccount(accounts[0]);

                //getAllTransactions();
            }
            else{
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");  
        }
    }

    async function listenAccount() {
        window.ethereum.on("accountsChanged", async function() {
          const accounts= await ethereum.request({method: 'eth_requestAccounts'});
          setCurrentAccount(accounts[0]);
        });
    }
    const connectWallet= async ()=>{
        try {
            if(!ethereum) return alert("Please install Metamask");
            
            const accounts= await ethereum.request({method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    const driveRequest= async ()=>{
        try {
            if(!ethereum) return alert("Please install Metamask");
            const contract = getDerideContract();

            const transact= await contract.driveRequest();

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    

    useEffect(()=>{
        checkIfWalletIsConnected();
        listenAccount();
    },[]);

    return(
            <TransactionContext.Provider value={{ connectWallet, currentAccount,driveRequest}}>
                {children}
            </TransactionContext.Provider>
        )
}