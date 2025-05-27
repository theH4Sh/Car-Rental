import { ChevronDown, LogOut, Settings, ShieldCheck, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../authSlice";
import { useEffect, useRef, useState } from "react";

const UserDropdown = ({ auth, mobile }) => {

    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null)

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem("auth")
    }

    //close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, []);

    return (
        <div ref={dropdownRef} 
        className={`relative ${mobile ? 'flex' : 'hidden md:flex'} items-center space-x-3 px-2 py-2 rounded-full transition duration-150 hover:bg-gray-200`}>
            <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <div 
                className="text-white font-semibold rounded-full bg-[#e93c3d] w-10 h-10 flex justify-center place-items-center">
                    {auth.user.charAt(0).toUpperCase()}
                </div>
                <span className={`font-semibold ${mobile ? 'hidden' : 'block'}`}>{auth.user}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${ open ? 'rotate-180' : ''}`} />
            </div>

            <div className={`z-10 bg-white absolute right-0 top-full mt-2 w-40 rounded-lg shadow-lg py-2 border border-gray-200 text-sm text-gray-600 transition-all duration-300 ${ open ? 'ease-out opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}`}>
                {mobile && (
                    <div className={'py-2 border-b border-gray-200'}>
                        <span className="flex justify-start items-center px-4 py-1">Signed in as</span>
                        <span className="flex justify-start items-center px-4 py-1 font-bold">{auth.user}</span>
                    </div>
                ) }
                <div className="border-b border-gray-200">
                    <Link className="flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100" to="admin" ><span><ShieldCheck className="w-4 h-4" /></span> Admin</Link>
                    <Link className="flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100" to={`profile/${auth.user}`} ><span><User className="w-4 h-4" /></span> Profile</Link>
                    <Link className="flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100" to="settings" ><span><Settings className="w-4 h-4" /></span> Settings</Link>
                </div>
                <button onClick={handleLogout}
                className="w-full flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100">
                    <span><LogOut className="w-4 h-4" /></span>Logout
                </button>
            </div>
        </div>
    );
}

export default UserDropdown;