import { Link } from "react-router-dom";

const NavLink = ({ item, currentPath }) => {

    return ( 
        <Link
        key={item.name}
        to={item.href}
        className={`flex items-center px-1 mx-5 text-sm relative h-10 ${
            currentPath === item.href ? "font-bold"
            : "font-medium text-gray-500"
        }`}
        >
            {item.name}
            {/* This is the bottom border that appears for active tab */}
            {currentPath === item.href && (
                <span className="rounded absolute bottom-0 left-1/2 -translate-1/2 w-10 h-0.5 bg-black"></span>
            )}
        </Link>
     );
}
 
export default NavLink;