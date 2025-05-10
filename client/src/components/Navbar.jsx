import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {

    const auth = useSelector(state => state.user)

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const location = useLocation()
    const currentPath = location.pathname

    const navItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Rent Car", href: "/rent" },
        { name: "Contact", href: "/contact" },
      ]

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
                    <div className="flex place-content-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        {auth.user}
                    </div>
                    )
                }
                {/* Hamburger for Mobile */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover:bg-gray-200 transition duration-200 text-3xl h-12 w-12 flex justify-center items-center rounded-xl">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50">
                            <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
                        </svg> */}
                        {isMenuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>
            
            {/* if the menu is open */}
            {isMenuOpen && (
                <div className="md:hidden transition duration-500 shadow-xl p-5 space-y-1">
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
                    <Link to='/login'>
                        <button onClick={() => setIsMenuOpen(false)}
                        className="cursor-pointer rounded bg-[#e93c3d] hover:bg-red-700 py-3 w-full transition duration-200 text-white font-semibold">
                            Sign In
                        </button>
                    </Link>
                </div>
            )}
        </nav>
     );
}
 
export default Navbar;