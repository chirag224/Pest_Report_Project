import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Consider using NavLink for active styling

// Make Navbar accept a 'links' prop which is an array of objects
const Navbar = ({ links = [] }) => { // Provide default empty array
  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-40 shadow-md"> {/* Added sticky/z-index/shadow */}
      <div className="container mx-auto flex justify-center items-center space-x-6 md:space-x-10">
        {/* Map over the links array passed in props */}
        {links.map((link) => (
          // Using NavLink adds an 'active' class automatically for styling the current page link
          <NavLink
            key={link.path} // Use path as key (assuming paths are unique)
            to={link.path}
            // className allows function to conditionally apply classes
            className={({ isActive }) =>
              `text-sm md:text-base px-3 py-2 rounded-md font-medium transition-colors duration-200 ease-in-out ${
                isActive
                  ? 'bg-gray-900 text-white shadow-inner' // Style for active link
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Style for inactive link
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        {/* You could add a Logout button here conditionally later */}
      </div>
    </nav>
  );
};

export default Navbar;