//  import { Children } from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="relative border-solid border-r-[1px] w-[320px] p-5 h-screen">
      <div className="w-fullborder-solid border-b-[1px] p-3">
        <Link
          to="/"
          className="text-2xl width-full font-semibold"
        >
          DERIDE
        </Link>
      </div>
      <div>
        <div className="items-center">
          <div className="text-lg pt-[110px]">
            <Link
              to="/ "
              className=" hover:bg-white hover:ring-2 rounded-lg transition duration-100 
              bg-gray-200 p-4 block text-gray-600"
            >
              Home
            </Link>
          </div>
          <div className="text-lg pt-4">
            <Link
              to="/rider"
              className="hover:bg-white hover:ring-2 rounded-lg transition duration-100 
              bg-gray-200 p-4 block text-gray-600"
            >
              Rider
            </Link>
          </div>
          <div className="text-lg pt-4">
            <Link
              to="/driver"
              className=" hover:bg-white hover:ring-2 rounded-lg transition duration-100 
              bg-gray-200 p-4 block text-gray-600"
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
