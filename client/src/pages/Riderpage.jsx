import { TransactionContext } from "../context/TransactionContext";
import React, { useContext } from "react";

function Riderpage() {

  const { rideRequest,cancelRideRequest} = useContext(TransactionContext);

  const handlerideRequest = () => {
    rideRequest(30);
  };

  const handlecancelRideRequest = () =>{
    cancelRideRequest(30);
  }
  return(
  <div>
    <button onClick={handlerideRequest}>Ride Request</button>
    <button onClick={handlecancelRideRequest}>Cancel Request</button>
  </div>);
}

export default Riderpage;
