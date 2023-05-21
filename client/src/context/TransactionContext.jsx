import React, {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import axios from "axios";
import DerideContractABI from '../abi/Deride.json';
import TokenContractABI from '../abi/DerideToken.json'


// This context is responsible for all the state variables to be used in the react app
export const TransactionContext= React.createContext('');

// Contract address of deride and DRDtoken.
const DerideContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const TokenContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const { ethereum }= window;


// Deride contract is responsible for handling all the transactions
const getDerideContract= ()=>{
    const provider= new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const TransactionContract= new ethers.Contract(DerideContractAddress,DerideContractABI,signer);

    return TransactionContract;
}

// Token contract is a simple ERC20 contract that is used in deride application
const getTokenContract =() => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    provider.pollingInterval =1
    const signer = provider.getSigner();
    const TokenContract = new ethers.Contract(TokenContractAddress, TokenContractABI,signer)

    return TokenContract;
}

export const TransactionProvider =({ children })=>{
    
    const [currentAccount, setCurrentAccount] = useState();
    const [source_lat,setSourceLat] = useState(0);
    const [source_long,setSourceLong] = useState(0);
    const [destination_lat,setDestinationLat] = useState(0);
    const [destination_long,setDestinationLong] = useState(0);
    const [waitingRidersAddress,setWaitingRidersAddress] = useState(['0x7C66Cbc9354130451aCf99aEBbb7399efED94913','0x3FF4f1aDf182f0F959C12A356aBae3680fF36Caf',]);
    const [waitingRidersLocation,setWaitingRidersLocation] = useState([]);
    const driveRequest= async ()=>{
        console.log("drive")
        try {
            console.log('hii')
            if(!ethereum) return alert("Please install Metamask");
            const contract = getDerideContract();
            console.log(contract);
            const transact= await contract.driveRequest();
            console.log(transact);
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    //When a rider requests a new ride
    const rideRequest= async ()=>{

        // The cost of travel is calculated by getting the distance betwwen two locations and multiplying by 100
        // This is a temporary solution and can be replaced with better algorithms in the future
        let cost = getDistance(source_lat,source_long,destination_lat,destination_long)*100;
        cost = cost.toString();
        console.log('Cost:',cost);
        cost = ethers.utils.parseUnits(cost,"ether");

        // Two contract interactions are needed to complete this function(done in two try catch blocks)
        // 1. Get approval from rider to use his DRD tokens by the contract.
        // 2. Transfer DRD tokens from account of rider to the contract
        try {
            if(!ethereum) return alert("Please install Metamask");
            const tokenContract = getTokenContract();
            const transact = await tokenContract.approve(DerideContractAddress,cost);
            console.log(transact);
            const receipt = await transact.wait()
            //console.log(receipt);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }

        try {
            if(!ethereum) return alert("Please install Metamask");
            const derideContract = getDerideContract();
            const derideTransact= await derideContract.rideRequest(cost);
            const transact = await derideTransact.wait();
            console.log(transact);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    }


    //Function that triggers a request in contract which will in turn emit an event with details of 
    //all pending riders waiting for a ride
    const showAllRequests = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            const contract = getDerideContract();

            const transact= await contract.showAllRequests();
            const receipt = await transact.wait();
            //await new Promise(res => setTimeout(res, 8000));
            console.log(receipt);
            contract.on("RiderDetails", (address) => {
                console.log(address);
                console.log('hii');
            });

            // TODO: Move the rest of the code in this block (excluding catch, obviosly) to run when event is recieved.
            let Location = [];
            waitingRidersAddress.forEach(async (item) => Location.push((await fetchLocationInfo(item.toLowerCase()))));
            //FIXME: The below line is set to manually wait for above statement to finish. Will
            // need to find some way to make proper use of async/await
            await new Promise(res => setTimeout(res, 8000));
            console.log(Location);
            setWaitingRidersLocation(Location);

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    //Function to accept a ride request from any particular rider by the driver
    const acceptRequest = async (riderNumber) => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            const contract = getDerideContract();
            const transact= await contract.acceptRequest(riderNumber);
            const receipt = await transact.wait();
            console.log(receipt);

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    // Function to mark a ride as completed by the driver
    // This will automatically transfer 85% of the travel fare to the driver
    const markRideCompleted = async (riderNumber,cost) => {
        try {
            if(!ethereum) return alert("Please install Metamask");

            cost = cost.toString();
            cost = ethers.utils.parseUnits(cost,"ether");
            const contract = getDerideContract();
            const transact= await contract.markRideCompleted(riderNumber,cost);
            const receipt = await transact.wait();
            console.log(receipt);

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    //Function to cancel an already created ride request 
    //It will transfer 95% of the travel fare back to the rider.
    //5% of the cost will be levied as penalty
    const cancelRideRequest = async(cost) => {
        try {
            if(!ethereum) return alert("Please install Metamask");

            cost = cost.toString();
            cost = ethers.utils.parseUnits(cost,"ether");
            const contract = getDerideContract();
            const transact= await contract.cancelRideRequest(cost);
            const receipt = await transact.wait();
            console.log(receipt);
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    //Function to fetch source and destination location of a rider from MongoDB.
    const fetchLocationInfo = async (_address) => {
        let response_data = '';
        const data = {
          collection: "user_details",
          database: "deride",
          dataSource: "Cluster0",
          filter: {
            address: _address,
          },
        };
        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          "api-key":
            "10jdhq5Q6ii3QpeioTLBAk3uSdYBpzkwHiqpuIdF2YeW323dThHOPrTBXdZLRcOu",
        };
    
        await axios
          .post(
            "https://data.mongodb-api.com/app/data-wzgqf/endpoint/data/v1/action/findOne",
            data,
            {
              headers: headers,
            }
          )
          .then(async (response) => {
            response_data = response.data.document;
            console.log(response_data);
          })
          .catch((error) => {
            console.log(error);
          });
          return response_data;
    };

    // Function that creates a record of driver in MongoDB with details of his source and destination locations
    // If it already exists, it will update the data.
    const updateLocationInfo = () => {
    const data = {
        collection: "user_details",
        database: "deride",
        dataSource: "Cluster0",
        filter: { address: currentAccount},
        update: {
        $set: { address: currentAccount, source_lat:source_lat, source_long:source_long,
                destination_lat:destination_lat, destination_long:destination_long}
        },
        upsert: true
    };

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key":
        "10jdhq5Q6ii3QpeioTLBAk3uSdYBpzkwHiqpuIdF2YeW323dThHOPrTBXdZLRcOu",
    };

    axios
        .post(
        "https://data.mongodb-api.com/app/data-wzgqf/endpoint/data/v1/action/updateOne",
        data,
        {
            headers: headers,
        }
        )
        .then((response) => {
        console.log(response);
        })
        .catch((error) => {
        console.log(error);
        });
    };
    
    // Return distance between two points
    function getDistance(x1, y1, x2, y2){
        let y = x2 - x1;
        let x = y2 - y1;
        
        return Math.sqrt(x * x + y * y);
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
                acceptRequest,markRideCompleted,cancelRideRequest,source_lat,setSourceLat,source_long,setSourceLong,
                destination_lat,setDestinationLat,destination_long,setDestinationLong,getDistance,waitingRidersAddress,fetchLocationInfo,
                waitingRidersLocation, updateLocationInfo}}>
                {children}
            </TransactionContext.Provider>
        )
}