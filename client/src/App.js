import { TransactionContext } from './context/TransactionContext';
import React,{ useContext } from 'react';
import axios from 'axios';
import Connect from './components/Connect';
const App = () => {
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
  const {driveRequest,rideRequest,showAllRequests} = useContext(TransactionContext);
  const handlerideRequest = () => {
    rideRequest(30);
  }

  
  return (
    <div className="App">
      <Connect/>
      <button onClick={driveRequest}>Drive Request</button>
      <button onClick={Send_post_Request}>POSt data</button>
      <button onClick={handlerideRequest}>Ride Request</button>
      <button onClick={showAllRequests}>Show ALL Requests</button>
    </div>
  );
}

export default App;
