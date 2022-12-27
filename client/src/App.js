import { TransactionContext } from './context/TransactionContext';
import React,{ useContext } from 'react';
import axios from 'axios';
const App = () => {
  const {driveRequest} = useContext(TransactionContext);

  const handledriveRequest = () => {
    console.log(typeof(driveRequest));
    driveRequest();
  }

  const Send_post_Request = () => {

    const data = {
      "collection": "user_details",
    "database": "deride",
    "dataSource": "Cluster0",
    "filter": {
      "name":"raza"
    }
    }
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': '10jdhq5Q6ii3QpeioTLBAk3uSdYBpzkwHiqpuIdF2YeW323dThHOPrTBXdZLRcOu', 
    }
    
    axios.post('https://cors-anywhere.herokuapp.com/https://data.mongodb-api.com/app/data-wzgqf/endpoint/data/v1/action/findOne', data, {
        headers: headers
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
  }
  return (
    <div className="App">
      {/* <button onClick={async() =>{
        if(window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          const sign = await signer.signMessage("Welcome to deride");
          console.log(sign,signer.getAddress())
        }
      }
      }>Connect Wallet</button> */}

      <button onClick={handledriveRequest}>Drive Request</button>
      <button onClick={Send_post_Request}>POSt data</button>
    </div>
  );
}

export default App;
