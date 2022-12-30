import React, {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import axios from "axios";
import DerideContractABI from '../abi/Deride.json';
import TokenContractABI from '../abi/DerideToken.json'

export const TransactionContext= React.createContext('');

const DerideContractAddress = '0x2A7D614B0CEB2ea138B1faA0022DDE4D54f69f6a';
const TokenContractAddress = '0xC113cD5B7a5fc29e0aCCF24082DE2064Da4BCE01';
const { ethereum }= window;


const getDerideContract= ()=>{
    const provider= new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const TransactionContract= new ethers.Contract(DerideContractAddress,DerideContractABI,signer);

    return TransactionContract;
}

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
    const [waitingRidersAddress,setWaitingRidersAddress] = useState(['0x7C66Cbc9354130451aCf99aEBbb7399efED94913','0x3FF4f1aDf182f0F959C12A356aBae3680fF36Caf']);
    const [waitingRidersLocation,setWaitingRiderslocation] = useState([]);
    const driveRequest= async ()=>{
        try {
            if(!ethereum) return alert("Please install Metamask");
            const contract = getDerideContract();
            const transact= await contract.driveRequest();
            console.log(transact);
        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

    const rideRequest= async ()=>{
        let cost = getDistance(source_lat,source_long,destination_lat,destination_long)*100;
        cost = cost.toString();
        console.log('Cost:',cost);
        cost = ethers.utils.parseUnits(cost,"ether")
        try {
            if(!ethereum) return alert("Please install Metamask");
            const tokenContract = getTokenContract();
            const transact = await tokenContract.approve(DerideContractAddress,cost);
            //console.log(transact);
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
            //console.log(transact);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    }

    const showAllRequests = async () => {
        try {
            if(!ethereum) return alert("Please install Metamask");
            const contract = getDerideContract();

            // const transact= await contract.showAllRequests();
            // const receipt = await transact.wait();
            // await new Promise(res => setTimeout(res, 8000));
            // console.log(receipt);
            // contract.on("RiderDetails", (RiderDetails,event) => {
            //     console.log(event);
            //     console.log('hii');
            //     console.log(event.args.WaitingRiders);
            //     event.args.WaitingRiders.forEach(item => console.log(item['_hex']));
            //     setWaitingRiders(event.args.WaitingRiders);
            // });
            let Location = [];
            //waitingRidersAddress.forEach(item=> Location.push(fetchLocationInfo(item)));
            waitingRidersAddress.forEach(item=>fetchLocationInfo(item.toLowerCase));
            setWaitingRiderslocation(Location);

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
            const receipt = await transact.wait();
            console.log(receipt);

        } catch (error) {
            console.log(error);

            throw new Error("No Ethereum object");
        }
    }

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

    const fetchLocationInfo = async (_address) => {
        let response_data = '';
        console.log(_address);
        console.log("currrent account", currentAccount);
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
            "https://cors-anywhere.herokuapp.com/https://data.mongodb-api.com/app/data-wzgqf/endpoint/data/v1/action/findOne",
            data,
            {
              headers: headers,
            }
          )
          .then((response) => {
            console.log(response);
            response_data = response.data.document;
          })
          .catch((error) => {
            console.log(error);
          });
          console.log('before returning data from fetch location')
          return response_data;
    };

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
        "https://cors-anywhere.herokuapp.com/https://data.mongodb-api.com/app/data-wzgqf/endpoint/data/v1/action/updateOne",
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