import { TransactionContext } from "../context/TransactionContext";
import React, { useContext } from "react";

function Driverpage() {

  const { driveRequest, showAllRequests,markRideCompleted,acceptRequest} =useContext(TransactionContext);

  const handleMarkRideCompleted = () => {
    markRideCompleted(1,30);
  }

  const handleAcceptRequest = () => {
    acceptRequest(1);
  }
  return (
    <div>
      <button onClick={driveRequest}>Drive Request</button>
      <button onClick={showAllRequests}>Show ALL Requests</button>
      <button onClick={handleMarkRideCompleted}>Mark Ride Completed</button>
      <button onClick={handleAcceptRequest}>Accept request</button> 
    </div>
  )
}

export default Driverpage