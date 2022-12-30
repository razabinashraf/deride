import { TransactionContext } from "../context/TransactionContext";
import React, { useContext } from "react";

function Driverpage() {

  const { driveRequest, showAllRequests, markRideCompleted, acceptRequest,waitingRidersAddress,waitingRidersLocation } =
    useContext(TransactionContext);

  const handleMarkRideCompleted = () => {
    markRideCompleted(1, 30);
  };

  const handleAcceptRequest = () => {
    acceptRequest(1);
  };

  const reload = () => {
    console.log("reload");
  }
  return (
    <div>
      <div className="flex flex-row justify-around">
        <button
          className="flex flex-row items-center bg-honey-gold p-1 pr-4 pl-4 text-white rounded-xl cursor-pointer hover:bg-opacity-80 transition duration-100"
          onClick={driveRequest}
        >
          Drive Request
        </button>
        <button
          className="flex flex-row items-center bg-honey-gold p-1 pr-4 pl-4 text-white rounded-xl cursor-pointer hover:bg-opacity-80 transition duration-100"
          onClick={showAllRequests}
        >
          Show ALL Requests
        </button>
        <button
          className="flex flex-row items-center bg-honey-gold p-1 pr-4 pl-4 text-white rounded-xl cursor-pointer hover:bg-opacity-80 transition duration-100"
          onClick={handleMarkRideCompleted}
        >
          Mark Ride Completed
        </button>
        <button
          className="flex flex-row items-center bg-honey-gold p-1 pr-4 pl-4 text-white rounded-xl cursor-pointer hover:bg-opacity-80 transition duration-100"
          onClick={handleAcceptRequest}
        >
          Accept request
        </button><br></br>
        <button onClick={reload}>Reload</button>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Address of Rider</th>
                <th>Source </th>
                <th>Destination</th>
              </tr>
            </thead>
            <tbody>
              {waitingRidersLocation.map(item => {
                return (
                  <tr >
                    <td>{ item.address}</td>
                    <td>{ item.source_lat}</td>
                    <td>{ item.destination_lat}</td>
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
