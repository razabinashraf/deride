import { TransactionContext } from "../context/TransactionContext";
import React, { useContext } from "react";
import { ethers } from 'ethers';

function Riderpage() {

  const { rideRequest,cancelRideRequest, source_lat,setSourceLat,source_long,setSourceLong,
    destination_lat,setDestinationLat,destination_long,setDestinationLong,currentAccount,getDistance,
    updateLocationInfo,fetchLocationInfo} = useContext(TransactionContext);
 
  const handlecancelRideRequest =  async() =>{
    let response = await fetchLocationInfo(currentAccount)*100;
    let x1 = Number(response.source_lat);
    let y1 = Number(response.source_long);
    let x2 = Number(response.destination_lat);
    let y2 = Number(response.destination_long);
    let cost = getDistance(x1,y1,x2,y2);
    cost = cost.toString();
    cost = ethers.utils.parseUnits(cost,"ether")
    console.log(cost);
    cancelRideRequest(cost);
  }

  const handleChangeSourceLat = (e) => {
    setSourceLat(e.target.value);
  }

  const handleChangeSourceLong = (e) => {
    setSourceLong(e.target.value);
  }

  const handleChangeDestinationLat = (e) => {
    setDestinationLat(e.target.value);
  }

  const handleChangeDestinationLong = (e) => {
    setDestinationLong(e.target.value);
  }

  const handleRideRequest = async() => {
    //updateLocationInfo();
    rideRequest();
  }


  return (
    <div className="">
      <div className="flex py-24 flex-col flex-wrap justify-content items-center">               
                    <input className="appearance-none border-b-2 w-[500px] text-gray-600 mr-3 py-1 px-2 m-2 bg-white focus:outline-none" type="text" placeholder="Source Latitude" name="source_lat" onChange={handleChangeSourceLat}/>
                    <input className="appearance-none border-b-2 w-[500px] text-gray-600 mr-3 py-1 px-2 m-2 bg-white focus:outline-none" type="text" placeholder="Source Logitude" name="source_long" onChange={handleChangeSourceLong}/><br></br><br></br>
                    <input className="appearance-none border-b-2 w-[500px] text-gray-600 mr-3 py-1 px-2 m-2 bg-white focus:outline-none" type="text" placeholder="Destination Latitude" name="destination_lat" onChange={handleChangeDestinationLat}/>
                    <input className="appearance-none border-b-2 w-[500px] text-gray-600 mr-3 py-1 px-2 m-2 bg-white focus:outline-none" type="text" placeholder="Destination Logitude" name="destination_long" onChange={handleChangeDestinationLong}/><br></br><br></br>
      </div>
      <div className="flex flex-row justify-around">
      <button
        className="flex flex-row items-center bg-honey-gold p-1 pr-4 pl-4 text-white rounded-xl cursor-pointer hover:bg-opacity-80 transition duration-100"
        onClick={handleRideRequest}
      >
        Ride Request
      </button>
      <button
        className="flex flex-row items-center bg-honey-gold p-1 pr-4 pl-4 text-white rounded-xl cursor-pointer hover:bg-opacity-80 transition duration-100"
        onClick={handlecancelRideRequest}
      >
        Cancel Request
      </button>
      </div>
    </div>
  );
}

export default Riderpage;
