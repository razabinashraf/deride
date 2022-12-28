import { TransactionContext } from "../context/TransactionContext";
import React, { useContext } from "react";

function Riderpage() {

  const { rideRequest,cancelRideRequest,setSourceLat,setSourceLong,
    setDestinationLat,setDestinationLong} = useContext(TransactionContext);

  const handlecancelRideRequest = () =>{
    cancelRideRequest(30);
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

  return(
  <div>
    <div className="flex flex-row justify-center items-center h-full m-10 mb-5 text-2xl bg-honey-brown text-honey-gold font-semibold rounded-xl">
                <div className="flex py-[133px] flex-col flex-wrap justify-content items-center">                    
                    <input className="appearance-none bg-opacity-5 border-b-honey-gold border-b-2 w-[500px] text-white mr-3 py-1 px-2 text-xl leading-tight m-2 bg-white focus:outline-none rounded-lg" type="text" placeholder="Source Latitude" name="source_lat" onChange={handleChangeSourceLat}/>
                    <input className="appearance-none bg-opacity-5 border-b-honey-gold border-b-2 w-[500px] text-white mr-3 py-1 px-2 text-xl leading-tight m-2 bg-white focus:outline-none rounded-lg" type="text" placeholder="Source Logitude" name="source_long" onChange={handleChangeSourceLong}/><br></br><br></br>
                    <input className="appearance-none bg-opacity-5 border-b-honey-gold border-b-2 w-[500px] text-white mr-3 py-1 px-2 text-xl leading-tight m-2 bg-white focus:outline-none rounded-lg" type="text" placeholder="Destination Latitude" name="destination_lat" onChange={handleChangeDestinationLat}/>
                    <input className="appearance-none bg-opacity-5 border-b-honey-gold border-b-2 w-[500px] text-white mr-3 py-1 px-2 text-xl leading-tight m-2 bg-white focus:outline-none rounded-lg" type="text" placeholder="Destination Logitude" name="destination_long" onChange={handleChangeDestinationLong}/><br></br><br></br>
                </div>
            </div>
    <button onClick={rideRequest}>Ride Request</button>
    <button onClick={handlecancelRideRequest}>Cancel Request</button>
  </div>);
}

export default Riderpage;
