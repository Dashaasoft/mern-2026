import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <ul className="flex list-none gap-5">
          <li>
            <Link
              to="/"
              className="text-white no-underline hover:text-gray-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-white no-underline hover:text-gray-300"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="text-white no-underline hover:text-gray-300"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
