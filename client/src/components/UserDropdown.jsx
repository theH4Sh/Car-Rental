import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../authSlice";

const UserDropdown = ({ auth, mobile }) => {

    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem("auth")
    }

    return (
        <details className={`relative group ${mobile ? 'flex' : 'hidden md:flex'} items-center space-x-3 px-2 py-2 rounded-full transition duration-150 hover:bg-gray-200`}>
            <summary className="flex items-center space-x-2 cursor-pointer">
                <div 
                className="text-white font-semibold rounded-full bg-[#e93c3d] w-10 h-10 flex justify-center place-items-center">H</div>
                <span className={`font-semibold ${mobile ? 'hidden' : 'block'}`}>{auth.user}</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
            </summary>

            <div className="z-10 bg-white absolute right-0 mt-2 w-40 rounded-lg shadow-lg py-2 border border-gray-200 text-sm text-gray-600 opacity-0 pointer-events-none transition-all duration-300 ease-out group-open:opacity-100 group-open:scale-100 group-open:pointer-events-auto">
                <div className={`${mobile ? '' : 'hidden'} py-2 border-b border-gray-200`}>
                    <span className="flex justify-start items-center px-4 py-1">Signed in as</span>
                    <span className="flex justify-start items-center px-4 py-1 font-bold">{auth.user}</span>
                </div>
                <div className="border-b border-gray-200">
                    <Link className="flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100"><span><User className="w-4 h-4" /></span> Admin</Link>
                    <Link className="flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100"><span><User className="w-4 h-4" /></span> Profile</Link>
                    <Link className="flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100"><span><Settings className="w-4 h-4" /></span> Settings</Link>
                </div>
                <button onClick={handleLogout}
                className="w-full flex justify-start items-center px-4 py-2 gap-2 hover:bg-gray-100">
                    <span><LogOut className="w-4 h-4" /></span>Logout</button>
            </div>
        </details>
    );
}

export default UserDropdown;