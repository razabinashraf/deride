import { TransactionContext } from "../context/TransactionContext";
import React , { useContext } from "react";

const Connect= ()=>{
    
    const{ connectWallet, currentAccount } = useContext(TransactionContext);

    return(
                <div className="w-full justify-between flex bg-gray-200 rounded-xl mb-10 p-5 pr-8">
                    {!currentAccount&&(
                    <div>
                        <h1 className=" text-xl font-semibold text-gray-600">Wallet:</h1><p> 0x00000...</p>
                    </div>)}
                    {currentAccount&&(
                    <div>
                        <h1 className=" text-xl font-semibold text-gray-600">Wallet:</h1> 
                        <p className="text-gray-400">{currentAccount}</p>
                    </div>)}

                    <div className=" text-white">
                        
                        {!currentAccount&&(<button type="button" onClick={connectWallet} className="flex flex-row items-center bg-red-400 p-1 pr-4 pl-4 rounded-xl cursor-pointer hover:bg-opacity-80 transition duration-100">Connect</button>)}

                        {currentAccount&&(<button type="button" onClick={connectWallet} className="flex flex-row items-center bg-green-400 p-1 pr-4 pl-4 rounded-xl cursor-pointer hover:bg-opacity-80 transition duration-100">Connected</button>)}

                    </div>
                </div>
    )
}
export default Connect;