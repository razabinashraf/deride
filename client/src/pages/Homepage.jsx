import { TransactionContext } from "../context/TransactionContext";
import React, { useContext } from "react";
import axios from "axios";
import Connect from "./Connect";

function Homepage() {
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

  return (
    <div className="App">
      <div className="flex flex-row justify-around">
        <button
          className="flex flex-row items-center bg-honey-gold p-1 pr-4 pl-4 text-white rounded-xl cursor-pointer hover:bg-opacity-80 transition duration-100"
          onClick={Send_post_Request}
        >
          POSt data
        </button>
      </div>
    </div>
  );
}

export default Homepage;
