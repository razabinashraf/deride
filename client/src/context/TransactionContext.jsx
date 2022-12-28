import React, {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import DerideContractABI from '../abi/Deride.json';
import TokenContractABI from '../abi/DerideToken.json'

export const TransactionContext= React.createContext('');

const DerideContractAddress = '0xdA5641db4F9a32ff0aE1DD3a275401CeE617dBef';
const TokenContractAddress = '0xE00A35b05A6ffc322dd69f8a2FDeeE56DAF4bA91';
const { ethereum }= window;


const getDerideContract= ()=>{
    const provider= new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const TransactionContract= new ethers.Contract(DerideContractAddress,DerideContractABI,signer);

    return TransactionContract;
}

const getTokenContract =() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const TokenContract = new ethers.Contract(TokenContractAddress, TokenContractABI,signer)

    return TokenContract;
}

export const TransactionProvider =({ children })=>{
    
    const [currentAccount, setCurrentAccount] = useState();
    
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

    const rideRequest= async (cost)=>{

        try {
            if(!ethereum) return alert("Please install Metamask");

            cost = cost*10**18;
            cost = cost.toString();
            const tokenContract = getTokenContract();
            const transact = await tokenContract.approve(DerideContractAddress,cost);
            const receipt = await transact.wait()

        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }

        try {
            if(!ethereum) return alert("Please install Metamask");

            const derideContract = getDerideContract();
            const derideTransact= await derideContract.rideRequest(cost);
            await derideTransact.wait();
            console.log("Completed");
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    }

    const showAllRequests = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            const contract = getDerideContract();

            const transact= await contract.showAllRequests();
            const reciept = await transact.wait();
            contract.on("RiderDetails", (RiderDetails,event) => {
                console.log(event);
                console.log('hii');
                console.log(event.args.WaitingRiders);
            });
            // currentAccount, to, value, event

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    const acceptRequest = async (riderNumber) => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            const contract = getDerideContract();
            const transact= await contract.acceptRequest(riderNumber);
            const reciept = await transact.wait();

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    const markRideCompleted = async (riderNumber,cost) => {
        try {
            if(!ethereum) return alert("Please install Metamask");

            cost = cost*10**18;
            cost = cost.toString();
            const contract = getDerideContract();
            const transact= await contract.markRideCompleted(riderNumber,cost);
            const reciept = await transact.wait();

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    const cancelRideRequest = async(cost) => {
        try {
            if(!ethereum) return alert("Please install Metamask");

            cost = cost*10**18;
            cost = cost.toString();
            const contract = getDerideContract();
            const transact= await contract.cancelRideRequest(cost);
            const reciept = await transact.wait();

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    const checkIfWalletIsConnected = async ()=> {
        try {
            if(!ethereum) return alert("Please install Metamask");

            const accounts= await ethereum.request({method: 'eth_accounts'});
            
            if(accounts.length){
                setCurrentAccount(accounts[0]);
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

    

    useEffect(()=>{
        checkIfWalletIsConnected();
        listenAccount();
    },[]);

    return(
            <TransactionContext.Provider value={{ connectWallet, currentAccount,driveRequest,rideRequest,showAllRequests,
                acceptRequest,markRideCompleted,cancelRideRequest}}>
                {children}
            </TransactionContext.Provider>
        )
}