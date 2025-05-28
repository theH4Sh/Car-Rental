import { Calendar, Mail, MapPin, User } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { data, useParams } from "react-router-dom";

const Profile = () => {

    const { username } = useParams()
    console.log("params: " + username )

    const { data: user , isLoading, error } = useFetch(`api/${username}`)

    isLoading ? console.log('loading') : console.log("user: ", user)

    return (
        <div className="md:mx-5 lg:mx-auto min-h-screen lg:max-w-5xl md:py-8 md:px-4">
            {
                isLoading ? ( <div> Loading... </div> ) : (
                 <div className="shadow-sm rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center space-x-4 bg-gray-50 p-6 border-b border-gray-300">
                        <div className="text-white font-semibold rounded-full bg-[#e93c3d] py-5 px-7 md:w-16 md:h-16 flex justify-center items-center text-2xl">
                            N
                        </div>
                        <div>
                            <h1 className="font-bold text-2xl">{user.username}</h1>
                            <p className="text-gray-600">Personal details and account information</p>
                        </div>
                    </div>

                    {/* Detail Rows */}
                    <div className="divide-y divide-gray-200 text-sm text-gray-700">
                        <DetailRow icon={<User className="w-4 h-4" />} label="Full name" value="Username123" />
                        <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value="email@gmail.com" />
                        <DetailRow icon={<MapPin className="w-4 h-4" />} label="Address" value={`123 Main Street, Apt 4B\nNew York, NY 10001\nUnited States`} />
                        <DetailRow icon={<Calendar className="w-4 h-4" />} label="Member since" value="Jan 15, 2025" />
                    </div>
                </div>
                )
            }
        </div>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <div className="even:bg-gray-50 flex flex-col md:flex-row md:items-start md:space-x-10 px-6 py-4">
        <div className="flex items-center space-x-2 w-40 text-gray-600 font-medium">
            {icon}
            <span>{label}</span>
        </div>
        <p className="whitespace-pre-line">{value}</p>
    </div>
);

export default Profile;
