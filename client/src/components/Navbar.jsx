import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../authSlice";
import { ChevronDown, LogOut, Menu, Settings, User, X } from "lucide-react";
import NavLink from "./NavLink";
import UserDropdown from "./UserDropdown";

const Navbar = () => {

    const auth = useSelector(state => state.user)
    const dispatch = useDispatch()

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const location = useLocation()
    const currentPath = location.pathname

    const navItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Rent Car", href: "/rent" },
        { name: "Contact", href: "/contact" },
    ]

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem("auth")
    }

    return ( 
        <nav>
            <div className="shadow-sm md:shadow-none flex justify-between lg:justify-evenly items-center p-5 md:p-0 md:py-10 md:px-5 lg:px-0 lg:space-x-5">
                <div>
                    <h1 className="font-extrabold italic text-2xl text-[#e93c3d]">TOPCAR</h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex">
                    <div className="flex justify-center items-center">
                        {navItems.map((item, id) => (
                            <NavLink key={id} item={item} currentPath={currentPath}/>
                        ))}
                    </div>
                </div>

                {!auth.isAuthenticated ? (
                    <Link to='/login'>
                        <button
                        className="hidden md:block cursor-pointer bg-[#e93c3d] hover:bg-red-700 h-10 w-24 transition duration-200 text-white font-semibold rounded-xl">
                            Sign In
                        </button>
                    </Link>
                    ) : (
                        <UserDropdown auth={ auth }/>
                    )
                }
                {/* Hamburger for Mobile */}
                <div className="md:hidden flex items-center">
                    {auth.isAuthenticated ? (
                        <UserDropdown auth={auth} mobile={true} /> ) : (<></>)
                    }    
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="hover:bg-gray-200 transition duration-200 h-12 w-12 flex justify-center items-center rounded-xl">
                        <div className={`transition-all duration-300 ease-in-out 
                            ${isMenuOpen ? 'rotate-90 opacity-100 scale-100' : 'rotate-0 opacity-100 scale-100'}`}>
                                
                            {isMenuOpen ? (
                                <X className="w-8 h-8 text-gray-700" />
                            ) : (
                                <Menu className="w-8 h-8 text-gray-700" />
                            )}
                            
                        </div>
                    </button>
                </div>
            </div>
            
            {/* if the menu is open */}
                <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} shadow-xl p-5 space-y-1`}>
                    <div>
                        {navItems.map(item => (
                            <Link 
                            key={item.name}
                            to={item.href}
                            onClick={() => {
                                setIsMenuOpen(false)
                            }}
                            className={`block py-2 px-3 ${
                                currentPath == item.href 
                                ? 
                                "border-l-4 bg-red-200 font-semibold text-red-700 rounded-r-lg" 
                                : 
                                "text-gray-500"
                            }`}
                            > 
                            {item.name}
                            </ Link>
                        ))}
                    </div>
                    {!auth.isAuthenticated ?
                        (<Link to='/login'>
                            <button onClick={() => setIsMenuOpen(false)}
                            className="cursor-pointer rounded bg-[#e93c3d] hover:bg-red-700 py-3 w-full transition duration-200 text-white font-semibold">
                                Sign In
                            </button>
                        </Link>)    :
                        (   <button onClick={handleLogout}
                            className="cursor-pointer rounded bg-[#e93c3d] hover:bg-red-700 py-3 w-full transition duration-200 text-white font-semibold">
                                Logout
                            </button>
                        )
                    }
                </div>
        </nav>
     );
}
 
export default Navbar;