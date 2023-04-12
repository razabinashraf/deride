import { TransactionContext } from "./context/TransactionContext";
import React, { useContext } from "react";
import axios from "axios";
import Connect from "./pages/Connect";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Driverpage from "./pages/Driverpage";
import Riderpage from "./pages/Riderpage";
import Navbar from "./components/Navbar";

const App = () => {
  const Send_post_Request = () => {
    const data = {
      collection: "user_details",
      database: "deride",
      dataSource: "Cluster0",
      filter: {
        name: "raza",
      },
    };
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key":
        "10jdhq5Q6ii3QpeioTLBAk3uSdYBpzkwHiqpuIdF2YeW323dThHOPrTBXdZLRcOu",
    };

    axios
      .post(
        "https://cors-anywhere.herokuapp.com/https://data.mongodb-api.com/app/data-wzgqf/endpoint/data/v1/action/findOne",
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
  const { driveRequest, rideRequest, showAllRequests } =
    useContext(TransactionContext);
  const handlerideRequest = () => {
    rideRequest(30);
  };

  return (
    <Router>
      <div className="flex">
        <Navbar />
        <div className="w-full p-10">
          <Connect />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/rider" element={<Riderpage />} />
            <Route path="/driver" element={<Driverpage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
