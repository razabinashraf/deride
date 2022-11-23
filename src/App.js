import './App.css';
import {ethers} from 'ethers'
import abi from './Deride.json'
const { ethereum }= window;

function App() {

  const getEthereumContract= ()=>{
    const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138'
    const provider= new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract= new ethers.Contract(contractAddress,abi,signer);

    return contract;
}
  return (
    <div className="App">
      <button onClick={async() =>{
        if(window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          const sign = await signer.signMessage("Welcome to deride");
          console.log(sign,signer.getAddress())
        }
      }
      }>Connect Wallet</button>

      <button onClick={async() =>{
        if(window.ethereum) {
          const contract = getEthereumContract();
          const transact = await contract.driveRequest(); 
        }
      }
      }>Request drive</button>

    </div>
  );
}

export default App;
