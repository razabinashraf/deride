import { TransactionContext } from "../context/TransactionContext";
import React, { useContext } from "react";

function Driverpage() {

  const { driveRequest, showAllRequests, markRideCompleted, acceptRequest,waitingRidersAddress,waitingRidersLocation } =
    useContext(TransactionContext);

  const handleMarkRideCompleted = () => {
    markRideCompleted(1, 30);
  };

  const handleAcceptRequest = (id) => {
    acceptRequest(id);
  };

  const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  }
  return (
    <div>
      <div className="flex flex-row justify-around mb-4">
        <button
          className="flex flex-row items-center border-solid border-b-2 p-1 pr-4 pl-4 hover:border-blue-300 text-gray cursor-pointer hover:bg-opacity-80 transition duration-100"
          onClick={driveRequest}
        >
          Drive Request
        </button>
        <button
          className="flex flex-row items-center border-solid border-b-2 p-1 pr-4 pl-4 hover:border-blue-300 text-gray cursor-pointer hover:bg-opacity-80 transition duration-100"
          onClick={showAllRequests}
        >
          Show ALL Requests
        </button>
        <button
          className="flex flex-row items-center border-solid border-b-2 p-1 pr-4 pl-4 hover:border-blue-300 text-gray cursor-pointer hover:bg-opacity-80 transition duration-100"
          onClick={handleMarkRideCompleted}
        >
          Mark Ride Completed
        </button><br></br>
        </div>
        <div>
          <table className="w-full border">
            <thead>
              <tr>
                <th>Address of Rider</th>
                <th>Source </th>
                <th>Destination</th>
                <th>Select Rider</th>
              </tr>
            </thead>
            <tbody>
              {
              waitingRidersLocation.map(item => {
                return (
                  <tr key={item.address}>
                    <td>{ item.address}</td>
                    <td>{ item.source_lat}</td>
                    <td>{ item.destination_lat}</td>
                    <td><button onClick={() => {handleAcceptRequest(1)}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Accept
                      </button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
    </div>
  );
}

export default Driverpage;
