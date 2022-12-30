//  import { Children } from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="relative border-solid border-r-[1px] w-[320px] border-opacity-80 border-r-honey-gold bg-honey-brown p-5 h-screen text-honey-gold">
      <div className="justify-center text-center">
        <Link
          to="/"
          className="text-5xl font-semibold border-solid border-b-[1px] p-5 border-b-honey-gold  "
        >
          Deride
        </Link>
      </div>
      <div>
        <div className="justify-center text-center items-center">
          <div className="text-xl p-1 pt-[110px]">
            <Link
              to="/ "
              className="p-1 font-semibold px-[100px]  cursor-pointer hover:bg-white hover:bg-opacity-5 rounded-lg transition duration-100"
            >
              Home
            </Link>
          </div>
          <div className="text-xl p- pt-[80px]">
            <Link
              to="/rider"
              className="p-1 px-[94px] w-full font-semibold hover:bg-white hover:bg-opacity-5 rounded-lg transition duration-100"
            >
              Rider
            </Link>
          </div>
          <div className="text-xl p-1 pt-[80px]">
            <Link
              to="/driver"
              className="p-1 px-[94px] w-full font-semibold hover:bg-white hover:bg-opacity-5 rounded-lg transition duration-100"
            >
              Driver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
