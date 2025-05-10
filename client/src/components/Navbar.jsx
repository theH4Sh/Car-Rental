import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../authSlice";
import { ChevronDown, LogOut, Menu, Settings, User, X } from "lucide-react";
import NavLink from "./NavLink";

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
            <div className="shadow-sm md:shadow-none flex justify-between items-center md:justify-evenly p-5 md:p-0 md:py-10">
                <div>
                    <h1 className="font-extrabold italic text-2xl text-[#e93c3d]">TOPCAR</h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex">
                    <div className="flex justify-center items-center">
                        {navItems.map(item => (
                            <NavLink item={item} currentPath={currentPath}/>
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
                    <details className="relative group hidden md:flex items-center space-x-3 px-4 py-1 rounded-full transition duration-150 hover:bg-gray-200">
                        <summary className="flex items-center space-x-2 cursor-pointer">
                            <div 
                            className="text-white font-semibold rounded-full bg-[#e93c3d] w-10 h-10 flex justify-center place-items-center">H</div>
                            <span className="font-semibold">{auth.user}</span>
                            <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
                        </summary>

                        <div className="absolute right-0 mt-2 w-40 rounded shadow-lg py-2 text-sm text-gray-600 opacity-0 pointer-events-none transition-all duration-300 ease-out group-open:opacity-100 group-open:scale-100 group-open:pointer-events-auto">
                            <div className="border-b-1 border-gray-300">
                                <Link className="flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100"><span><User className="w-4 h-4" /></span> Profile</Link>
                                <Link className="flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100"><span><Settings className="w-4 h-4" /></span> Settings</Link>
                            </div>
                            <button onClick={handleLogout}
                            className="w-full flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100">
                                <span><LogOut className="w-4 h-4" /></span>Logout</button>
                        </div>
                    </details>
                    )
                }
                {/* Hamburger for Mobile */}
                <div className="md:hidden">
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