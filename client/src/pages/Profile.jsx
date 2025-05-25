import { Calendar, Locate, Mail, MapPin, User } from "lucide-react";

const Profile = () => {
    return ( 
        <div className="md:p-5">
            <div className="border border-gray-500">
                <div className="flex items-center space-x-3 bg-gray-300 p-5 border-b border-gray-400">
                    <div className="text-white font-semibold rounded-full bg-[#e93c3d] w-16 h-16 flex justify-center place-items-center">
                        N
                    </div>
                    <div>
                        <h1 className="font-bold text-2xl">Username</h1>
                        <p className="text-gray-500">Personal details and account information</p>
                    </div>
                </div>

                <div className="p-3 space-y-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <User className="w-4" />
                        <h3>Full name</h3>
                    </div>
                    <p>Username123</p>
                </div>

                <div className="p-3 space-y-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4" />
                        <h3>Email</h3>
                    </div>
                    <p>email@gmail.com</p>
                </div>

                <div className="p-3 space-y-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4" />
                        <h3>Address</h3>
                    </div>
                    <p>123 Main Street, Apt 4B
New York, NY 10001
United States</p>
                </div>

                <div className="p-3 space-y-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4" />
                        <h3>Member since</h3>
                    </div>
                    <p>Jan 15, 2025</p>
                </div>
            </div>
        </div>
     );
}
 
export default Profile;